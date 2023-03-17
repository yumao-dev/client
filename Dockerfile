#客户端
FROM node:14-alpine as client

WORKDIR /app
COPY ./package.json .
# 安装所需的包
RUN npm install
COPY . .
# #编译
# RUN npm run build
RUN npx ng build --configuration production


# 合并
FROM nginx:alpine
LABEL MAINTAINER "yumao"

ENV TZ=Asia/Shanghai
EXPOSE 80

COPY --from=client /app/dist/client /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# CMD [ "node", "app.js"]
