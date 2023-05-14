import { Trengo } from "./trengo";
import { ChatGPT } from "./chatGPT";
import { Kiwi } from "./kiwi";
import { ResponseEndpoint } from './typings'

export const inbound = async ({ ticket_id, message }: any) => {
  try {
    const ticket = await Trengo.getTicket({ ticket_id });

    const is_allow = Kiwi.settings(ticket);

    if (!is_allow) {
      return false;
    }

    const response = await ChatGPT.generateResponse({
      message
    })

    await Trengo.sendMessage({ 
      ticket_id, 
      message: response
    })

    return true;
  } catch (error) {
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

export const outboundModel = async ({ ticket }: any) => {
  try {
    console.log('ticket', ticket)
    const conversation = await Trengo.getMessage({ ticket_id: ticket  })
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