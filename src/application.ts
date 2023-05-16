import { Trengo } from "./trengo";
import { ChatGPT } from "./chatGPT";
import { LoanProServices } from "./loanpro"
import { Kiwi } from "./kiwi";
import { ResponseEndpoint } from './typings'

export const inbound = async ({ ticket_id, message }: any) => {
  try {
    const ticket = await Trengo.getTicket({ ticket_id });

    const is_allow = Kiwi.settings(ticket);

    if (!is_allow) {
      return false;
    }

    const contactPhone = ticket?.contact?.custom_field_data?.['Contact phone'] || null

    const response = await ChatGPT.generateResponse({
      message,
      contactPhone
    })

    console.log('RESPONSE: ', response)
    // await Trengo.sendMessage({
    //   ticket_id,
    //   message: response
    // })

    return true;
  } catch (error) {
    return false
  }
}


export const outboundModel = async ({ ticket }: any) => {
  try {
    console.log('ticket', ticket)
    const conversation = await Trengo.getMessage({ ticket_id: ticket })
    const lastMessage = conversation.data
      .filter((item: any) => item.type == 'INBOUND')

    return ({
      code: 200,
      success: true,
      message: lastMessage.length ? lastMessage[0] : null
    }) as ResponseEndpoint;
  } catch (error) {
    console.log("Error outboundModel: ", error);
    return ({
      code: 500,
      success: false,
      message: error,
    } as ResponseEndpoint)
  }
}

export const getLoanproUser = async ({ userId, question }: any) => {
  try {
    const customer = await LoanProServices.getLoanproCustomer({
      key: 'primaryPhone',
      value: userId
    })

    const { id: customerId } = customer

    if (!customerId) {
      return ({
        success: false,
        data: [],
        code: 403,
        messages: "User not found in lonapro",
      } as ResponseEndpoint)
    }

    const loan = await LoanProServices.getLoan(customerId)
    const gptResponse = await ChatGPT.modelLoanpro({ loan, question })

    return ({
      code: 200,
      success: true,
      data: {
        gptResponse,
        loan,
        customer
      }
    }) as ResponseEndpoint;
  } catch (error) {
    console.log("Error getLoanproUser: ", error);
    return ({
      code: 500,
      success: false,
      message: error,
    } as ResponseEndpoint)
  }
}