import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface CreateMessage {
    conversation_id: string
    content: string
    category: string
    sentiment: string
    type: string
}

export class Kiwi {
    public static async getPayloadAndFormat() {

    }

    public static async upsertConversation({ id, channel }: any) {
        try {
            const conversation = await prisma.conversation.upsert({
                where: {
                    id
                },
                create: {
                    id,
                    duration: "",
                    channel: ""
                },
                update: {
                    duration: "",
                    channel: ""
                }
            })

            return conversation;
        } catch (error) {
            console.log("upsertConversation", error);
        }
    }

    public static async createMessage({ conversation_id, content, category, sentiment, type }: CreateMessage) {
        try {
            const message = await prisma.message.create({
                data: {
                    conversation_id,
                    content,
                    category,
                    sentiment,
                    type
                }
            })
            return message;
        } catch (error) {
            console.log("createMessage", error);
        }
    }
}