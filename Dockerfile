# Stage 1: Build the React application
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy package configurations
COPY package*.json ./

# Install packages
RUN npm ci

# Copy React project files (except those ignored)
COPY . .

# Build the React production bundle (generates dist folder)
RUN npm run build

# Stage 2: Serve files using Nginx
FROM nginx:1.25-alpine

# Copy static assets from build stage to Nginx content root
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Nginx container port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
