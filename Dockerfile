# Build Stage：用 Node.js 打包前端
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production Stage：用 nginx serve 靜態網站
FROM nginx:alpine

# 刪掉預設 index.html（可選）
RUN rm -rf /usr/share/nginx/html/*

# 如果你的 build 輸出在 dist/my-app，就改成下面這行
COPY --from=build /app/dist/new-project/browser /usr/share/nginx/html