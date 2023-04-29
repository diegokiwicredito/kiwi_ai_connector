import express from "express";
import { init } from "./application";

const router = express.Router();

router.get('/', async (req: any, res: any) => {

    res.json({
        message: "v1"
    });
});

router.post('/trengo/webhook', async (req: any, res: any) => {

    const { message_id, ticket_id, contact_id, message, contact_name, contact_identifier } = req;

    const payload = await init({
        message_id, ticket_id, contact_id, message, contact_name, contact_identifier
    })
    res.json(payload);
});

export default router;