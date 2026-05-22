# Use a modern Node image that ships with Ubuntu 24.04 (has GLIBC 2.39+)
FROM node:22-trixie

# Set the working directory
WORKDIR /app

# Core setup for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy your workspace files
COPY . .

# Install dependencies using your existing lockfile layout
RUN pnpm install --frozen-lockfile

# Expose your ports (adjust if you use different ones)
EXPOSE 3000
EXPOSE 8000
EXPOSE 8001

# Run your exact root dev script
CMD ["pnpm", "-r", "dev"]