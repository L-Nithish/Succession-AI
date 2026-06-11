# Stage 1: Build the application
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies first (for layer caching)
COPY package*.json ./
RUN npm install

# Copy source files and compile
COPY . .
RUN npm run build

# Stage 2: Create the runner container
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built resources and modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose Next.js port
EXPOSE 3000

# Start server
CMD ["npm", "run", "start"]
