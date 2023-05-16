import { Configuration, OpenAIApi } from "openai";
import { DataSource } from "typeorm";
import { OpenAI } from "langchain/llms/openai";
import { SqlDatabase } from "langchain/sql_db";
import { SqlDatabaseChain } from "langchain/chains";
import { LoanProServices } from "./loanpro";
import { PromptTemplate } from "langchain/prompts";

const datasource = new DataSource({
    type: "postgres",
    host: "kiwi-sandbox.calllygog8pr.us-east-1.rds.amazonaws.com",
    port: 5432,
    username: "kiwi_master",
    password: "gdh0ghy!cav0HRT7eub",
    database: "kiwi_faq",
});
export class ChatGPT {
    // Método para enviar mensajes
    public static async categorize({ message }: any) {

        const configuration = new Configuration({
            organization: "org-mkrDVf0TnvPpGtcMg2IaeRMy",
            apiKey: process.env.OPENAI_API_KEY,
        });

        const openai = new OpenAIApi(configuration);

        try {
            // Utilizar ChatGPT para generar una respuesta
            const prompt = `
                para la siguiente frase  "${message}" por favor categorizar y construye una estructurarla en formato JSON.

                El JSON debe tener las siguientes propiedades: issue, category and sentiment.
                
                issue is the user message,
                
                the category could be any of 3 options:
                
                1. Consulta
                2. Modificación
                3. Problema
                4. Informativa
                
                Tambien vas hacer un analisis de sentimiento y lo vas agregar como sentiment, las opciones serán positivo, neutro, negativo
                
                Muestra unicamente la respuesta en formato JSON
            `;
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: prompt,
                max_tokens: 1080,
                temperature: 0,
            });
            console.log(response.data)
            const answer = response?.data?.choices[0]?.text || "{}";

            return JSON.parse(answer);
        } catch (error) {
            console.log("categorize", error);
            throw error;
        }
    }

    public static async generateResponse({
        message,
        contactPhone
    }: any) {
        try {

            const db = await SqlDatabase.fromDataSourceParams({
                appDataSource: datasource,
            });

            const chain = new SqlDatabaseChain({
                llm: new OpenAI({ temperature: 0 }),
                database: db
            });

            const response = await chain.run(message);

            const answer = await this.createCompletion(`
            Si en esta frase "${response}" considera que no encontro resultados para la pregunta: "${message}", retornar: false, 
            de lo contrario retornar: "${response}"`);

            console.log("answer", answer)
            if (!answer.includes("false")) {
                return answer;
            }
            
            const validateLoan = await this.createCompletion(`
            Si en esta frase "${message}" están solicitando información respecto al préstamo del usuario, retorna: true,
            o si el usuario está agradeciendo, responder con: "Esperamos haber resuelto su solicitud",
            de lo contrario retorna una respuesta adecuada y amable como si fueras un agente de servicio al cliente`);

            if(!validateLoan.includes("True") && !validateLoan.includes("true")) {
                return validateLoan;
            }

            const customer = await LoanProServices.getLoanproCustomer({
                key: 'primaryPhone',
                value: contactPhone
            })

            const { id: customerId } = customer || {}

            if (!customerId) return "User not found in lonapro"

            const loan = await LoanProServices.getLoan(customerId)
            if (!loan) return "Loan not found in lonapro"

            const gptResponse = await this.modelLoanpro({
                loan,
                question: message
            })

            return gptResponse;
        } catch (error) {
            console.log("generateResponse", error);
        }
    }

    public static async modelLoanpro({ loan, question }: any) {
        try {
            // Utilizar ChatGPT para generar una respuesta
            const response = await this.createCompletion(`
                A partir del siguiente JSON de datos:
                ${JSON.stringify(loan)}
                Responde la siguiente pregunta: ${question} y omitir la fuente de los datos en la respuesta
            `);

            return response;
        } catch (error) {
            console.log("modelLoanpro", error);
            throw error;
        }
    }

    public static createCompletion = async (prompt: string) => {
        try {
            const configuration = new Configuration({
                organization: "org-mkrDVf0TnvPpGtcMg2IaeRMy",
                apiKey: process.env.OPENAI_API_KEY,
            });
            const openai = new OpenAIApi(configuration);

            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: prompt,
                max_tokens: 1080,
                temperature: 0,
            });
            return response?.data?.choices[0]?.text || "false";
        } catch (error) {
            return "false";
        }
    }
}
