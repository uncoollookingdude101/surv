# Use a modern Node image that ships with Debian 13 Trixie (has GLIBC 2.40+)
FROM node:22-trixie

# Set the working directory inside the container
WORKDIR /app

# Core setup to make sure pnpm is available and ready
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy your workspace blueprint configurations first (for caching efficiency)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./

# Install all dependencies across the entire workspace structure
RUN pnpm install --frozen-lockfile

# Copy the rest of your game source files into the container
COPY . .

# Fix for the Git revision error: Initialize a dummy git repository 
# so 'git rev-parse HEAD' passes during the Vite asset build phase
RUN git init && \
    git config user.email "deploy@render.com" && \
    git config user.name "Render Deploy" && \
    git add package.json && \
    git commit -m "production container build"

# Build the production assets (compiles TypeScript and bundles your client/Vite files)
RUN pnpm run build

# Tell Render what port the container wants to communicate on
ENV PORT=3000
EXPOSE 3000
EXPOSE 8000
EXPOSE 8001

# Run the project using production start binaries instead of development hot-reloaders
CMD ["pnpm", "start"]