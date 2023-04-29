import axios from "axios";

export class Trengo {
    // Método para enviar mensajes
    public static async sendMessage ({ ticket_id, contact_identifier, message }: any) {
        const apiUrl = `https://app.trengo.com/api/v2/tickets/${ticket_id}/messages`;
        const apiKey = process.env.TRENGO_API_KEY;
    
        try {
            const response = await axios({
                method: "POST",
                url: apiUrl,
                data: {
                    message,
                    ticket_id: ticket_id,
                },
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
            });
    
            console.log(`Mensaje enviado al ticket ${ticket_id}: ${message}`);
            return response.data;
        } catch (error) {
            console.error(`Error al enviar mensaje al ticket ${ticket_id}:`, error);
            throw error;
        }
    }
}
