# Dockerfile

# Giai đoạn build
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app

# Copy source code và file cấu hình Maven
COPY . .

# Build ứng dụng
RUN mvn clean package -DskipTests

# Giai đoạn runtime
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy file .jar từ giai đoạn build
COPY --from=build /app/target/*.jar app.jar

# Expose cổng
EXPOSE 4445

# Lệnh chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
