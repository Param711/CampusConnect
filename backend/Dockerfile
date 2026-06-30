# Use Node.js LTS slim base image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package configurations first to leverage layer caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy application files
COPY . .

# Expose standard REST API port
EXPOSE 3000

# Set environment defaults
ENV PORT=3000
ENV NODE_ENV=production

# Execute start command
CMD ["node", "app.js"]
