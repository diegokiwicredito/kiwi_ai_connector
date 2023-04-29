import express from "express";
import { init } from "./application";

const router = express.Router();

router.get('/trengo/webhook', async (req: any, res: any) => {

    const { message_id, ticket_id, contact_id, message, contact_name, contact_identifier } = req;

    const payload = await init({
        message_id, ticket_id, contact_id, message, contact_name, contact_identifier
    })
    res.send(payload);
});

export default router;