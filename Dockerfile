# Production Dockerfile for Namsor Accounting System
# Works with Railway, Render, and Docker

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install SQLite3 build dependencies (needed for sqlite3 npm module)
RUN apk add --no-cache python3 make g++

# Copy package files
COPY backend/package*.json ./backend/
COPY frontend/package.json ./frontend/ 2>/dev/null || true

# Install backend dependencies
WORKDIR /app/backend
RUN npm ci --production

# Copy backend source
COPY backend/src ./src
COPY backend/.env.example ./.env || true

# Copy frontend static files
COPY frontend/*.html ../frontend/
COPY frontend/js ../frontend/js
COPY frontend/css ../frontend/css 2>/dev/null || true

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Create uploads directory
RUN mkdir -p /app/backend/uploads

# Create database directory
RUN mkdir -p /app/backend/database

# Run database migrations and start server
CMD ["npm", "run", "start"]
