import { Hono } from 'hono';
import { kvStore } from '../db/schema';
import { and, eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { drizzle } from 'drizzle-orm/d1';
import { Variables } from '../types/variables';
import { Context } from 'hono';
import { bodyLimit } from 'hono/body-limit';

const kvRoutes = new Hono<{ Variables: Variables, Bindings: CloudflareBindings }>();

kvRoutes.get('/', async (c) => {
    try {
        const db = drizzle(c.env.DB);
        const result = await db.select().from(kvStore);
        return c.json(result);
    } catch (error) {
        if (error instanceof HTTPException) {
            throw error;
        }
        console.error('Error in /all route:', error);
        throw new HTTPException(500, { message: 'Failed to fetch all key-value pairs', cause: error });
    }
});

kvRoutes.get('/:key', async (c) => {
    try {
        const tenant_id = c.get('tenant-id');
        const db = drizzle(c.env.DB);
        const key = c.req.param('key');

        console.log('Key:', key);

        if (!key) {
            throw new HTTPException(400, { message: 'Missing key parameter' });
        }

        const result = await db
            .select({ key: kvStore.key, value: kvStore.value })
            .from(kvStore)
            .where(and(eq(kvStore.key, key), eq(kvStore.tenant_id, tenant_id)));

        if (!result || result.length === 0) {
            throw new HTTPException(404, { message: 'Key not found' });
        }

        return c.json(result);
    } catch (error) {
        if (error instanceof HTTPException) {
            throw error;
        }
        console.error('Error in /api/object/:key route:', error);
        throw new HTTPException(500, { message: 'Failed to fetch object', cause: error });
    }
});


kvRoutes.post('/', bodyLimit({
    maxSize: 16 * 1024, // 16kb
    onError: (c: Context) => {
        return c.text('overflow :(', 413)
    },
}), async (c) => {
    try {
        const tenant_id = c.get('tenant-id');
        const db = drizzle(c.env.DB);
        const { key, data, ttl } = await c.req.json();


        if (!key || typeof key !== 'string' || !data) {
            throw new HTTPException(400, { message: 'Invalid or missing required fields: key, data' });
        }

        const existing_key = await db.selectDistinct().from(kvStore).where(and(eq(kvStore.key, key), eq(kvStore.tenant_id, tenant_id)));

        if (existing_key[0]) {
            console.log('Key already exists:', existing_key[0]);
            throw new HTTPException(400, { message: 'Key already exists' });
        }

        const res = await db.insert(kvStore).values({
            key,
            value: data,
            ttl,
            tenant_id,
        });

        return c.json({ success: true, res }, 201);
    } catch (error) {
        if (error instanceof HTTPException) {
            throw error;
        }
        console.error('Error in /api/object POST route:', error);
        throw new HTTPException(400, { message: 'Failed to insert object. Some error occurred', cause: error });
    }
});

kvRoutes.delete('/:key', async (c) => {
    try {
        const tenant_id = c.get('tenant-id');
        const db = drizzle(c.env.DB);
        const key = c.req.param('key');

        if (!key) {
            throw new HTTPException(400, { message: 'Missing key parameter' });
        }

        const existing_key = await db.selectDistinct().from(kvStore).where(and(eq(kvStore.key, key), eq(kvStore.tenant_id, tenant_id)));

        // console.log('Existing key:', existing_key[0]);

        if (!existing_key[0]) {
            console.log("Key doesn't exists", existing_key[0]);
            throw new HTTPException(400, { message: "Key doesn't exist" });
        }

        const result = await db.delete(kvStore).where(and(eq(kvStore.key, key), eq(kvStore.tenant_id, tenant_id)));

        if (!result.success) {
            throw new HTTPException(404, { message: 'Key not found' });
        }

        return c.json({ success: true, result });
    } catch (error) {
        if (error instanceof HTTPException) {
            throw error;
        }
        console.error('Error in /api/object/:key DELETE route:', error);
        throw new HTTPException(500, { message: 'Failed to delete object', cause: error });
    }
});

kvRoutes.put('/:key', async (c) => {
    try {
        const tenant_id = c.get('tenant-id');
        const db = drizzle(c.env.DB);
        const key = c.req.param('key');
        const { data } = await c.req.json();

        if (!key || !data) {
            throw new HTTPException(400, { message: 'Missing required fields: key, data' });
        }

        const existing_key = await db.selectDistinct().from(kvStore).where(and(eq(kvStore.key, key), eq(kvStore.tenant_id, tenant_id)));

        // console.log('Existing key:', existing_key[0]);

        if (!existing_key[0]) {
            console.log("Key doesn't exists", existing_key[0]);
            throw new HTTPException(400, { message: "Key doesn't exist" });
        }

        const result = await db
            .update(kvStore)
            .set({ value: data })
            .where(and(eq(kvStore.key, key), eq(kvStore.tenant_id, tenant_id)));

        if (!result.success) {
            throw new HTTPException(404, { message: 'Key not found' });
        }

        return c.json({ success: true, result });
    } catch (error) {
        if (error instanceof HTTPException) {
            throw error;
        }
        console.error('Error in /api/object/:key PUT route:', error);
        throw new HTTPException(500, { message: 'Failed to update object', cause: error });
    }
});

export default kvRoutes;
