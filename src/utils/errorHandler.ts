import { Context } from "hono";
import { HTTPException } from "hono/http-exception";

export const errorHandler = (err: Error, c: Context) => {
    if (err instanceof HTTPException) {
        return err.getResponse();
    }
    console.error('Unhandled error:', err);
    return c.json({ error: 'Internal Server Error' }, 500);
};
