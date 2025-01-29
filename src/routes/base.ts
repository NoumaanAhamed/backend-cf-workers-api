import { Hono } from 'hono';
import { Variables } from '../types/variables';
import { HTTPException } from 'hono/http-exception';

const baseRoutes = new Hono<{ Variables: Variables, }>();

baseRoutes.get('/', (c) => c.text('Hello Hono!😊'));

baseRoutes.get('/id', (c) => {
    try {
        const tenant_id = c.get('tenant-id');
        if (!tenant_id) {
            throw new HTTPException(500, { message: 'Tenant ID is not set' });
        }
        return c.json({ tenant_id });
    } catch (error) {
        if (error instanceof HTTPException) {
            throw error;
        }
        console.error('Error in /id route:', error);
        throw new HTTPException(500, { message: 'Failed to fetch tenant ID', cause: error });
    }
});

baseRoutes.get('/health', (c) => c.json({ status: 'ok' }));

export default baseRoutes;
