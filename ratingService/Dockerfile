# Giai đoạn build
FROM gradle:8.5-jdk17 AS build
WORKDIR /app

# Copy source code vào container
COPY . .

# Build ứng dụng bằng Gradle (bỏ qua test)
RUN gradle build -x test

# Giai đoạn runtime
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy file .jar từ giai đoạn build
COPY --from=build /app/build/libs/*.jar app.jar

# Expose cổng
EXPOSE 5555

# Lệnh chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
