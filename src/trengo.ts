import axios from "axios";

export class Trengo {
    // Método para enviar mensajes
    public static async sendMessage ({ ticket_id, message }: any) {
        const apiUrl = `https://app.trengo.com/api/v2/tickets/${ticket_id}/messages`;
        const apiKey = process.env.TRENGO_API_KEY;
        console.log(process.env.TRENGO_API_KEY)
    
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

    public static async getMessage ({ ticket_id }: any) {
        const apiUrl = `https://app.trengo.com/api/v2/tickets/${ticket_id}/messages`;
        const apiKey = process.env.TRENGO_API_KEY;
    
        try {
            const response = await axios({
                method: "GET",
                url: apiUrl,
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
            });
    
            return response.data;
        } catch (error) {
            console.error(`Error al leer mensaje del ticket ${ticket_id}:`, error);
            throw error;
        }
    }
}
