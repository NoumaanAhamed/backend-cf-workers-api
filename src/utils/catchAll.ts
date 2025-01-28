import { Context } from "hono";

export const catchAll = (c: Context) => {
    return c.json({ message: 'Route not found' }, 404);
}
