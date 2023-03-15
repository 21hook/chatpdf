# Build from node:18-alpine
FROM node:18-alpine
# Set working directory
WORKDIR /usr/src/app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy source code
COPY . .
# Build app
RUN npm run build
# Expose port 3000
EXPOSE 3000
# Run app
CMD [ "npm", "start" ]