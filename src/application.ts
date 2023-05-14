import { Trengo } from "./trengo";
import { ChatGPT } from "./chatGPT";
import { Kiwi } from "./kiwi";

export const inbound = async ({ ticket_id, message, contact_identifier }: any) => {
  try {
    // Utilizar Trengo API para enviar la respuesta a través de un chat
    if (ticket_id != '668234704') {
      return false;
    }

    const response = await ChatGPT.generateResponse({
      message
    })

    await Trengo.sendMessage({ 
      ticket_id: "668234704", 
      message: response
    })

    return true;
  } catch (error) {
    console.log("init", error);
    return false
  }
}

export const inbound2 = async ({ ticket_id, message, contact_identifier }: any) => {
  try {
    // Utilizar Trengo API para enviar la respuesta a través de un chat

    const summary = await ChatGPT.categorize({
      message
    })

    const conversation = await Kiwi.upsertConversation({
      id: ticket_id,
      channel: contact_identifier
    })

    if (!conversation) {
      return {}
    }

    const messageRecord = await Kiwi.createMessage({
      conversation_id: ticket_id,
      category: summary.category,
      content: message,
      sentiment: summary.sentiment,
      type: "inbound"
    })

    // WHAT SHOULD I DO

    // WHEN IS MODIFICATION DO NOTHING

    // WHEN IS INFORMATIVE DO NOTHING

    // WHEN IS A PROBLEM DO NOTHING

    // WHEN IS A LOAN QUESTION THEN BUILD A ESPECIAL JSON WITH MAIN INFORMATION (LOANPRO / POSTGRESQL)

    // if (summary.category == "consulta") {
    //   await Kiwi.getPayloadAndFormat({

    //   });
    // }

    return messageRecord;
  } catch (error) {
    console.log("init", error);
    return false
  }
}

export const outbound = async ({ ticket_id, message, contact_identifier }: any) => {
  try {
    // Utilizar Trengo API para enviar la respuesta a través de un chat

    const summary = await ChatGPT.categorize({
      message
    })

    const conversation = await Kiwi.upsertConversation({
      id: ticket_id,
      channel: contact_identifier
    })

    if (!conversation) {
      return {}
    }

    const messageRecord = await Kiwi.createMessage({
      conversation_id: ticket_id,
      category: summary.category,
      content: message,
      sentiment: summary.sentiment,
      type: "outbound"
    })

    // WHAT SHOULD I DO

    // WHEN IS MODIFICATION DO NOTHING

    // WHEN IS INFORMATIVE DO NOTHING

    // WHEN IS A PROBLEM DO NOTHING

    // WHEN IS A LOAN QUESTION THEN BUILD A ESPECIAL JSON WITH MAIN INFORMATION (LOANPRO / POSTGRESQL)

    // if (summary.category == "consulta") {
    //   await Kiwi.getPayloadAndFormat({

    //   });
    // }

    return messageRecord;
  } catch (error) {
    console.log("init", error);
    return false
  }
}