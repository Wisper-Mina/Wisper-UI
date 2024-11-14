### Getting Started

## RabbitMQ Setup with Docker Compose

# Prerequisites

- **Docker**: Make sure Docker is installed. [Download Docker here](https://www.docker.com/products/docker-desktop).
- **Docker Compose**: Ensure Docker Compose is installed (usually comes with Docker Desktop).

# Running RabbitMQ

To start RabbitMQ with Docker Compose, use the following command in the terminal within your project root:

```bash
docker-compose up -d
```

- The `-d` flag runs the container in detached mode.
- This command will download the RabbitMQ image (if not already available) and start the RabbitMQ container.

# Stop RabbitMQ

```bash
docker-compose down
```

# Troubleshooting

If the container fails to start, check the logs by running:

```
docker-compose logs rabbitmq
```

## Run Project
First, install all dependencies.

```bash
    npm i
    # or
    yarn
```

Then start the project with

```bash
npm run dev
# or
yarn dev
```
