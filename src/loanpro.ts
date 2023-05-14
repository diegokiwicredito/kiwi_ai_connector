import axios, { AxiosRequestConfig, AxiosResponse } from "axios"

const LOANPRO_API_TOKEN = 'f74908c79efe49a21e173508cd240d4e65cb9582';
const LOANPRO_API_HEADER = {
    'Autopal-Instance-Id': '5202376',
    'content-type': 'application/json',
    Authorization: `Bearer ${LOANPRO_API_TOKEN}`,
};
const getDateInSecond = (dateStr: any) => dateStr && parseInt(dateStr.replace('/Date(', '').replace(')/', ''))

export class LoanProServices {
    public static async getLoanproCustomer({ key, value } : any) {
        let options: AxiosRequestConfig = {
            url: "https://loanpro.simnang.com/api/public/api/1/Customers/Autopal.Search()",
            method: 'POST',
            // params: { $top: '25', $start: '0', $orderby: 'id asc' },
            headers: LOANPRO_API_HEADER,
            data: JSON.stringify({
                "query": {
                    "bool": {
                        "must": [
                            {
                                "bool": {
                                    "should": [
                                        {
                                            "query_string": {
                                                "query": value,
                                                "default_operator": "AND",
                                                "fields": [
                                                    key
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                "sort": {
                    "id": "desc"
                }
            })
        }

        const response: AxiosResponse = await axios(options)
        return response.data.d.results[0] || {};
    }

    public static async getLoanproLoanEntities(customerId: any) {
        let options: AxiosRequestConfig = {
            url: `https://loanpro.simnang.com/api/public/api/1/odata.svc/Customers(${customerId})?$expand=\
            Loans,\
            Loans/LoanSetup,\
            Loans/Payments,\
            Loans/Portfolios,\
            PaymentAccounts,\
            PaymentAccounts/CheckingAccount,\
            Loans/StatusArchive&nopaging=true`,
            method: 'GET',
            // params: { $top: '25', $start: '0', $orderby: 'id asc' },
            // qs: { $top: '25', $start: '0', $orderby: 'id asc' },
            headers: LOANPRO_API_HEADER,
        }

        const response: AxiosResponse = await axios(options)
        const { Loans: loans, PaymentAccounts: paymentAccounts } = response.data.d;

        const activeLoan = loans.find((loan: any) =>
            loan.active &&
            (loan.LoanSetup || {}).active &&
            !loan.archived &&
            this.getActiveStatusArchiveFromLoan(loan)
        );

        const primaryPaymentAccount = paymentAccounts.find((paymentAccount: any) => (
            paymentAccount.isPrimary && paymentAccount.active && paymentAccount.visible
        ))
        
        if (!activeLoan) {
            return { primaryPaymentAccount };
        }


        return {
            activeLoan,
            statusArchive: this.getActiveStatusArchiveFromLoan(activeLoan),
            primaryPaymentAccount,
        };
    }

    public static getActiveStatusArchiveFromLoan(loan: any) {
        const { StatusArchive: statusArchives } = loan;
        const statusArchive = statusArchives.find((archive: any) => archive.loanStatusText === 'Open');
        return statusArchive;
    }

    public static async getLoan(customerId: any) {
        try {
            const loanEntities = await this.getLoanproLoanEntities(customerId)
            const { activeLoan, statusArchive } = loanEntities;

            if (!activeLoan) return null;

            const { LoanSetup: loanSetup, Payments: payments, Portfolios: portfolios } = activeLoan;
            if (!loanSetup) return null;

            const { loanAmount, contractDate, loanRate, payment, paymentFrequency, loanTerm, tilTotalOfPayments, apr, firstPaymentDate } = loanSetup;
            const { payoff, nextPaymentDate, nextPaymentAmount, lastPaymentDate, lastPaymentAmount, amountDue, id } = statusArchive;

            const portfolioId = portfolios?.length && portfolios[0].id;
            const loanType = portfolioId === 12 ? "credit_builder" : "normal"

            return {
                id,
                loanpro_user_id: customerId,
                loanType,
                amountDue,
                apr: parseFloat(apr),
                balance: parseFloat(payoff),
                date: new Date(getDateInSecond(contractDate) * 1000),
                interestRate: parseFloat(loanRate),
                monthlyPayment: parseFloat(payment),
                paymentFrequency: paymentFrequency.replace('loan.frequency.', ''),
                term: parseFloat(loanTerm),
                totalAmountIncludingFee: parseFloat(tilTotalOfPayments),
                totalLoanAmount: parseFloat(loanAmount),
                firstPaymentDate: firstPaymentDate ? new Date(getDateInSecond(firstPaymentDate) * 1000) : null,
                nextPaymentDate: new Date(getDateInSecond(nextPaymentDate) * 1000),
                nextPaymentAmount: Math.max(parseFloat(amountDue), parseFloat(nextPaymentAmount)),
                lastPaymentDate: lastPaymentDate ? new Date(getDateInSecond(lastPaymentDate) * 1000) : null,
                lastPaymentAmount: parseFloat(lastPaymentAmount),
                payments: payments.map((payment: any) => ({
                    amount: payment.amount,
                    date: new Date(getDateInSecond(payment.date) * 1000),
                    status: payment.reverseDate ? 'Reversed' : 'Active',
                }))
            }
        } catch (error) {
            console.log('Error Loan: ', error)
            return null
        }
    }
}