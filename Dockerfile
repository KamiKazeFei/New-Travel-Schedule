# Step 1: 用 Node.js 官方映像來 build 前端
FROM node:18-alpine AS build

WORKDIR /app

# 複製 package.json 及 lock 檔
COPY package*.json ./

# 安裝依賴（npm ci 比較推薦）
RUN npm ci

# 複製整個專案
COPY . .

# 執行打包指令（假設用 Angular 或 React 的 build 指令）
RUN npm run build

# Step 2: 建立最終輕量映像，只放打包好的靜態檔案
FROM scratch AS export

# 把 build 出來的靜態檔案複製出來，假設是 build 出在 /app/dist
COPY --from=build app/dist/new-project/browser app/dist
