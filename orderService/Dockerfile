# Sử dụng image Node.js
FROM node:18

# Tạo thư mục làm việc
WORKDIR /index

# Copy package.json và package-lock.json
COPY package.json ./

# Cài đặt dependencies
RUN npm install --force

# Copy toàn bộ mã nguồn vào container
COPY . .

# Mở port cho service
EXPOSE 3333

# Chạy ứng dụng
CMD ["npm", "start"]
