import { Hono } from 'hono';
import { tenantMiddleware } from './middlewares/tenantMiddleware';
import { errorHandler } from './utils/errorHandler';
import { catchAll } from './utils/catchAll';
import baseRoutes from './routes/base';
import kvRoutes from './routes/kvStore';

const app = new Hono();

app.route('/', baseRoutes);
// Use tenant middleware
app.use('*', tenantMiddleware);

// Register routes
app.route('/api/object', kvRoutes);

// Error handling middleware
app.onError(errorHandler);

// Catch all route
app.all('*', catchAll);


export default app;
