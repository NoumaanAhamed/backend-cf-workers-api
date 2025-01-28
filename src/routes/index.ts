import { Hono } from 'hono';
import baseRoutes from './base';
import kvRoutes from './kvStore';

const router = new Hono();

router.route('/', baseRoutes);
router.route('/api/object', kvRoutes);

export default router;