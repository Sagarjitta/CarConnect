# ==========================================
# Stage 1: Build Frontend (React + Vite)
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ==========================================
# Stage 2: Build Backend (Spring Boot)
# ==========================================
FROM maven:3.9-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /app/backend

COPY backend/pom.xml ./
RUN mvn dependency:go-offline -B

COPY backend/src ./src

# Copy built frontend static files into backend resources
COPY --from=frontend-builder /app/backend/src/main/resources/static ./src/main/resources/static

RUN mvn clean package -DskipTests -B

# ==========================================
# Stage 3: Production Runtime
# ==========================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Add non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=backend-builder /app/backend/target/*.jar app.jar

ENV SERVER_PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
