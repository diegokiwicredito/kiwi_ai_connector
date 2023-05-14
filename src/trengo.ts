import axios from "axios";
export class Trengo {

    // Method to get ticket
    public static async getTicket ({ ticket_id }: any) {
        try {
            const API_KEY = process.env.TRENGO_API_KEY;

            const response = await axios({
                method: "GET",
                url: `https://app.trengo.com/api/v2/tickets/${ticket_id}`,
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                },
            });

            return response.data;
        } catch (error) {
            console.log(`Error al obtener el ticket ${ticket_id}:`, error);
        }
    }

    // Method to get contact
    public static async getContact ({ contact_id }: any) {
        try {
            const API_KEY = process.env.TRENGO_API_KEY;

            const response = await axios({
                method: "GET",
                url: `https://app.trengo.com/api/v2/contacts/${contact_id}`,
                data: {
                    contact_id,
                },
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                },
            });

            return response.data;
        } catch (error: any) {
            console.log(`Error al obtener el contacto ${contact_id}:`, error.response.data);
        }
    }

    // Método para enviar mensajes
    public static async sendMessage ({ ticket_id, message }: any) {
        try {
            const API_KEY = process.env.TRENGO_API_KEY;

            const response = await axios({
                method: "POST",
                url: `https://app.trengo.com/api/v2/tickets/${ticket_id}/messages`,
                data: {
                    message,
                    ticket_id: ticket_id,
                },
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                },
            });
    
            return response.data;
        } catch (error: any) {
            console.error(`Error al enviar mensaje al ticket ${ticket_id}:`, error.response.data);
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
