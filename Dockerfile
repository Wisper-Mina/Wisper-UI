# Base image
FROM node:18-alpine AS base

# Install necessary packages
FROM base AS deps
RUN apk add --no-cache libc6-compat

# Set the working directory for `ui`
WORKDIR /usr/src/app

# Copy only the package.json and package-lock.json from `ui` to install dependencies
COPY ui/package*.json ./
RUN npm install

# Copy the `ui` and `mina` directories
COPY ui/ .
COPY mina ./mina

# Build the Next.js application in the `ui` folder
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the Next.js application in production mode
CMD ["npm", "start"]
