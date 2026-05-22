# Use the working trixie tag with modern GLIBC
FROM node:22-trixie

# Set the working directory
WORKDIR /app

# Core setup for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace blueprints
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./

# Install all dependencies
RUN pnpm install

# Copy the rest of your game source files
COPY . .

# --- FIX FOR THE GIT REVISION ERROR ---
# Initialize a dummy git repository and create a fake commit info block
# This satisfies 'git rev-parse HEAD' without touching any game files.
RUN git init && \
    git config user.email "deploy@render.com" && \
    git config user.name "Render Deploy" && \
    git add package.json && \
    git commit -m "production container build"
# --------------------------------------

# Tell Render exactly what port the container wants to communicate on
ENV PORT=3000
EXPOSE 3000
EXPOSE 8000
EXPOSE 8001

# Run the dev command but force host binding out to the container network
CMD ["pnpm", "-r", "dev", "--", "--host", "0.0.0.0"]