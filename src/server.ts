import express from 'express';
import { newAgent } from './agent';

export const createServer = (sessions: Map<string, any>) => {
    const app = express();
    app.use(express.json());

    app.get('/', (req, res) => {
        res.json({ message: 'OK' });
    });

    app.post("/session", (req, res) => {
        const id = crypto.randomUUID();
        sessions.set(id, newAgent());
        res.json({ id });
    });

    return app;
};
