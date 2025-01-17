# Dockerfile cho Inventory Service
FROM node:20.18.1

WORKDIR /index

# Copy package.json và cài đặt các dependencies
COPY package.json ./
RUN npm install --force

# Copy toàn bộ mã nguồn vào container
COPY . .

EXPOSE 1111

# Chạy ứng dụng khi container bắt đầu
CMD ["npm", "start"]
