# backend/Dockerfile
FROM node:22.18.0-alpine

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy rest of source code
COPY . .

# Switch to non-root user
USER node

EXPOSE 5000

CMD ["node", "index.js"]
