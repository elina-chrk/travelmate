# 1. Используем официальный образ Node.js
FROM node:20-alpine

# 2. Устанавливаем рабочую директорию
WORKDIR /app

# 3. Копируем package.json и lock-файл
COPY package*.json ./

# 4. Устанавливаем зависимости
RUN npm install

# 5. Копируем весь проект
COPY . .

# 6. Собираем production-версию
RUN npm run build

# 7. Устанавливаем nginx и копируем билд
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

# 8. Копируем конфиг nginx (если есть) или используем дефолтный
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
