FROM node:18-alpine

WORKDIR /app

# Copy Docker-specific package files
COPY package.docker.json ./package.json
COPY src ./src/

# Install dependencies
RUN npm install

# Build and run
EXPOSE 8003
CMD ["npm", "start"]
