# Use an official Node.js image as a base
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy server.js, db.js, and the routes directory to the working directory
COPY . .

# Build the application (if needed)
# RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application
CMD ["node", "server.js"]
