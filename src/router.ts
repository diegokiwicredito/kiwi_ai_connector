import express from "express";
import { inbound, outbound, outboundModel } from "./application";

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
    
    res.status(200).json(payload);
});

router.post('/trengo/webhook/outbound', async (req: any, res: any) => {
    console.log("body", req.body);
    const { message_id, ticket_id, contact_id, message, contact_name, contact_identifier } = req.body;

    const payload = await outbound({
        message_id, ticket_id, contact_id, message, contact_name, contact_identifier
    })
    res.json(payload);
});

router.get('/message/:ticket', async (req: any, res: any) => {
    const { ticket } = req.params;
    const payload = await outboundModel({ ticket })

    res
        .status(payload?.code)
        .json(payload);
});

export default router;