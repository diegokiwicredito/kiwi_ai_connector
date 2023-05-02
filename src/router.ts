import express from "express";
import { inbound, outbound } from "./application";

const router = express.Router();

router.get('/', async (req: any, res: any) => {
    res.json({
        message: "v1"
    });
});

router.post('/trengo/webhook/inbound', async (req: any, res: any) => {
    console.log("body", req.body);
    const { message_id, ticket_id, contact_id, message, contact_name, contact_identifier } = req.body;

    const payload = await inbound({
        message_id, ticket_id, contact_id, message, contact_name, contact_identifier
    })
    res.json(payload);
});

router.post('/trengo/webhook/outbound', async (req: any, res: any) => {
    console.log("body", req.body);
    const { message_id, ticket_id, contact_id, message, contact_name, contact_identifier } = req.body;

    const payload = await outbound({
        message_id, ticket_id, contact_id, message, contact_name, contact_identifier
    })
    res.json(payload);
});

export default router;