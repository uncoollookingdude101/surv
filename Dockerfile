# Use a modern Node version built on a newer Linux base (Debian Bookworm)
FROM node:22-bookworm-slim

# Install pnpm globally inside the container
RUN npm install -g pnpm

WORKDIR /app

# Copy dependency manifests
COPY package.json pnpm-lock.yaml* ./

# Install production dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Adjust this command if your repository starts the server differently
CMD ["pnpm", "start"]