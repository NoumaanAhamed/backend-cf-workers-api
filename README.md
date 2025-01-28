# Hono + Cloudflare Workers KV Store API

A scalable key-value store API built with Hono.js and Cloudflare Workers, using D1 as the database deployed on a custom domain https://api.maincharacters.tech/

## Features

- 🚀 Built with Hono.js for optimal performance
- 📦 D1 Database integration with Drizzle ORM
- ⚡ Deployed on Cloudflare Workers
- 🔄 Full CRUD operations for key-value pairs
- 🛡️ Error handling and middleware implementation

## API Endpoints

### Base Routes

- `GET /` - Welcome message
- `GET /id` - Get current tenant ID
- `GET /health` - Health check endpoint

### KV Store Routes

- `GET /api/object` - Get all key-value pairs
- `GET /api/object/:key` - Get value by key
- `POST /api/object` - Create new key-value pair
- `PUT /api/object/:key` - Update value by key
- `DELETE /api/object/:key` - Delete key-value pair

## Getting Started

### Prerequisites

- Bun 1.0+
- Cloudflare account
- Wrangler CLI

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:

```bash
bun install
```

3. Configure environment variables:
   Create a `.env` file with:

```env
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_DATABASE_ID=your_database_id
CLOUDFLARE_D1_TOKEN=your_d1_token
```

### Development

1. Start the development server:

```bash
bun run dev
```

2. Run database migrations:

```bash
bun run drizzle:generate
bun run drizzle:migrate
```

### Deployment

Deploy to Cloudflare Workers:

```bash
bun run deploy
```

## Usage

All requests require a `x-tenant-id` header for multi-tenant isolation.

### Example Requests

1. Create a new key-value pair:

```bash
curl -X POST https://api.maincharacters.tech/api/object \
  -H "x-tenant-id: tenant1" \
  -H "Content-Type: application/json" \
  -d '{"key": "mykey", "data": {"value": "test"}, "ttl": 3600}'
```

2. Get a value:

```bash
curl https://api.maincharacters.tech/api/object/mykey \
  -H "x-tenant-id: tenant1"
```

## Project Structure

```
├── src/
│   ├── db/
│   │   └── schema.ts         # Database schema
│   ├── middlewares/
│   │   └── tenantMiddleware.ts
│   ├── routes/
│   │   ├── base.ts
│   │   ├── kvStore.ts
│   │   └── index.ts
│   ├── types/
│   │   └── variables.d.ts
│   ├── utils/
│   │   ├── catchAll.ts
│   │   └── errorHandler.ts
│   └── index.ts             # Main application entry
├── drizzle/                 # Database migrations
└── wrangler.toml           # Cloudflare configuration
```

## Error Handling

The API implements comprehensive error handling:

- Input validation errors (400)
- Authentication errors (401)
- Not found errors (404)
- Server errors (500)

## Security

- Request size limiting to prevent abuse
- Tenant isolation through middleware
- Error messages don't expose internal details

## Roadmap

- [ ] Add authentication and authorization
- [ ] Implement rate limiting
- [ ] Add caching for improved performance
- [ ] Add logging and monitoring
- [ ] Implement CI/CD pipeline
- [ ] Add tests
- [ ] Add OpenAPI documentation
- [ ] Add AI capabilities

## License

MIT License - feel free to use this project for your own purposes.
