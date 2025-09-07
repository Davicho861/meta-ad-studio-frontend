# Use an official Node.js runtime as a parent image
FROM node:20-slim

# Install openssl
RUN apt-get update && apt-get install -y openssl

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy prisma schema
COPY prisma ./prisma/

# Install any needed packages
RUN npm install

# Copy the rest of the application's code
COPY . .

# Build the TypeScript code
RUN npm run build

# Make port 3001 available to the world outside this container
EXPOSE 3001

# Run the app when the container launches
CMD [ "npm", "start" ]
