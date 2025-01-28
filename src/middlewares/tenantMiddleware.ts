import { HTTPException } from 'hono/http-exception';
import { drizzle } from 'drizzle-orm/d1';
import { Context, Next } from 'hono';

export const tenantMiddleware = async (c: Context, next: Next) => {
    try {
        const tenant_id = c.req.header('x-tenant-id');

        if (!tenant_id) {
            throw new HTTPException(400, { message: 'Missing x-tenant-id header' });
        }

        c.set('tenant-id', tenant_id);

        await next();
    } catch (error) {
        if (error instanceof HTTPException) {
            throw error;
        }
        console.error('Middleware error:', error);
        throw new HTTPException(500, { message: 'Server error in middleware', cause: error });
    }
};
