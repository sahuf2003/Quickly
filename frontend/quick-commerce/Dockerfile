# Stage 1: Build the app
FROM node:20-alpine AS builder
WORKDIR /app

# Accept build args
ARG NEXT_PUBLIC_API_URL

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Set env for Next.js build
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build Next.js app (SSR)
RUN npm run build

# Stage 2: Run the app
FROM node:20-alpine
WORKDIR /app

# Accept build args again for runtime
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Copy necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

# Start Next.js server
CMD ["npm", "start"]
