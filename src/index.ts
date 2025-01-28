import { Hono } from 'hono';
import { tenantMiddleware } from './middlewares/tenantMiddleware';
import { errorHandler } from './utils/errorHandler';
import routes from './routes';
import { catchAll } from './utils/catchAll';

const app = new Hono();

// Use tenant middleware
app.use('*', tenantMiddleware);

// Register routes
app.route('/', routes);

// Error handling middleware
app.onError(errorHandler);

// Catch all route
app.all('*', catchAll);


export default app;
