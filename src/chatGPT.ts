import { Configuration, OpenAIApi } from "openai";
import { DataSource } from "typeorm";
import { OpenAI } from "langchain/llms/openai";
import { SqlDatabase } from "langchain/sql_db";
import { SqlDatabaseChain } from "langchain/chains";

export class ChatGPT {
    // Método para enviar mensajes
    public static async categorize({ message }: any) {

        const configuration = new Configuration({
            organization: "org-mkrDVf0TnvPpGtcMg2IaeRMy",
            apiKey: process.env.OPENAI_API_KEY,
        });
        console.log("OPENAI_API_KEY", process.env.OPENAI_API_KEY);
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

    public static async generateResponse({ message }: { message: string }) {
        try {
            //postgresql://kiwi_master:gdh0ghy!cav0HRT7eub@kiwi-sandbox.calllygog8pr.us-east-1.rds.amazonaws.com/kiwi_faq
            const datasource = new DataSource({
                type: "postgres",
                host: "kiwi-sandbox.calllygog8pr.us-east-1.rds.amazonaws.com",
                port: 5432,
                username: "kiwi_master",
                password: "gdh0ghy!cav0HRT7eub",
                database: "kiwi_faq",
            });

            const db = await SqlDatabase.fromDataSourceParams({
                appDataSource: datasource,
            });

            const chain = new SqlDatabaseChain({
                llm: new OpenAI({ openAIApiKey: "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", temperature: 0 }),
                database: db,
            });

            const response = await chain.run(message);
            return response;
        } catch (error) {

        }
    }
}
