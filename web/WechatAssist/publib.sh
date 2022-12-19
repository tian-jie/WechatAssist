git pull
docker build -t wechatassist .
docker kill wechatassist
docker rm wechatassist
docker run -itd -v /docker/data/wechat4u/media:/app/media -p 8081:80 wechatassist
