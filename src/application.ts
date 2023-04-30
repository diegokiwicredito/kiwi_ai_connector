import { Configuration, OpenAIApi } from "openai";
import { Trengo } from "./trengo";

const configuration = new Configuration({
  organization: "org-mkrDVf0TnvPpGtcMg2IaeRMy",
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const init = async ({ message_id, ticket_id, contact_id, message, contact_name, contact_identifier }: any) => {
  try {
    // Utilizar ChatGPT para generar una respuesta
    const prompt = `Hola ${contact_name}, ${message}`;
    const response: any = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: message,
      max_tokens: 7,
      temperature: 0,
    });
    console.log(response)
    const answer = response.choices[0].text;

    // Utilizar Trengo API para enviar la respuesta a través de un chat
    // await Trengo.sendMessage({
    //   ticket_id,
    //   contact_identifier,
    //   message: answer
    // });

    console.log({ message_id, ticket_id, contact_id, message, contact_name, contact_identifier })

    return true
  } catch (error) {
    return false
  }
}