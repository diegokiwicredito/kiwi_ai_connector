import { Trengo } from "./trengo";
import { ChatGPT } from "./chatGPT";
import { LoanProServices } from "./loanpro"
import { Kiwi } from "./kiwi";
import { ResponseEndpoint } from './typings'

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
      key: 'customId',
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