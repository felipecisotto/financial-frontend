# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:1-slim

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lock ./

# Install only production dependencies
RUN bun install --frozen-lockfile --production

# Expose the port your app runs on
EXPOSE 3000

# Start the application using a static file server
CMD ["bun", "run", "preview", "--host", "0.0.0.0", "--port", "3000"]