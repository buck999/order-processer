# Async Order Processor

Async Order Processor is a simple Node.js(Typescript) application designed to handle asynchronous order processing using a microservices architecture. It integrates with PostgreSQL, MongoDB, and RabbitMQ to manage orders and logs efficiently. Currently this project is only for use as a study/curriculum, simulating the 'process' of reversing a string, with a 5 second delay and a 10% chance of failure.

## Features

- **Order Management**: Create, retrieve, and paginate orders.
- **Asynchronous Processing**: Process orders asynchronously using RabbitMQ.
- **Database Integration**: 
  - PostgreSQL for order storage.
  - MongoDB for logging operations.
- **Error Handling**: Centralized error handling with custom error classes.
- **Environment Configuration**: Uses `.env` for environment variables.

## Project Structure

```
.env
docker-compose.yml
src/
  app.ts
  server.ts
  config/
    database.mongo.ts
    database.postgres.ts
    env.ts
  db/
    setup.mongo.ts
    setup.postgres.ts
  errors/
    bad-request.error.ts
    forbidden.error.ts
    http.error.ts
    not-found.ts
    unauthorized.error.ts
  interfaces/
    api.interface.ts
    controller.interface.ts
  middleware/
    error.middleware.ts
  orders/
    orders.controller.ts
    orders.service.ts
    orders.model.ts
  worker/
    rabbitmq.queue.ts
    rabbitmq.worker.ts
    log.model.ts
```

## Prerequisites

- Node.js (v16+)
- Docker and Docker Compose
- PostgreSQL, MongoDB, and RabbitMQ

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/async-order-processor.git
   cd async-order-processor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env` and configure it as needed.

4. Start services using Docker Compose:
   ```bash
   docker-compose up
   ```

5. Build the project:
   ```bash
   npm run build
   ```

## Usage

### Start the Server
Run the server to handle API requests:
```bash
npm start
```

### Start the Worker
Run the worker to process orders asynchronously:
```bash
npm run start:worker
```

### Development Mode
For live reloading during development:
```bash
npm run dev
npm run dev:worker
```

## API Endpoints

### Orders
- **GET** `/api/v1/orders`: Retrieve paginated orders.
- **GET** `/api/v1/orders/:id`: Retrieve a specific order by ID.
- **POST** `/api/v1/orders`: Create a new order.

### Example Request
```bash
curl -X POST http://localhost:3000/api/v1/orders \
-H "Content-Type: application/json" \
-d '{"task": "Reverse this string"}'
```

## Environment Variables

| Variable                  | Description                  | Default Value |
|---------------------------|------------------------------|---------------|
| `POSTGRES_DB`             | PostgreSQL database name     | `orders_db`   |
| `POSTGRES_HOST`           | PostgreSQL host              | `localhost`   |
| `POSTGRES_PORT`           | PostgreSQL port              | `5432`        |
| `POSTGRES_USER`           | PostgreSQL username          | `postgres`    |
| `POSTGRES_PASSWORD`       | PostgreSQL password          | `postgres`    |
| `MONGO_INITDB_DATABASE`   | MongoDB database name        | `orders`      |
| `MONGO_HOST`              | MongoDB host                 | `localhost`   |
| `MONGO_PORT`              | MongoDB port                 | `27017`       |
| `MONGO_INITDB_ROOT_USERNAME` | MongoDB root username     | `mongodb`     |
| `MONGO_INITDB_ROOT_PASSWORD` | MongoDB root password     | `mongodb`     |
| `RABBITMQ_HOST`           | RabbitMQ host                | `localhost`   |
| `RABBITMQ_PORT`           | RabbitMQ port                | `5672`        |
| `RABBITMQ_DEFAULT_USER`   | RabbitMQ username            | `rabbitmq`    |
| `RABBITMQ_DEFAULT_PASS`   | RabbitMQ password            | `rabbitmq`    |
| `FRONTEND_URL`            | Frontend URL                 | `http://localhost:4200` |
| `PORT`                    | Application port             | `3000`        |

## Testing

Currently, no tests are implemented. You can add tests using your preferred testing framework.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the GNU General Public License v3.0.

