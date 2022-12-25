git pull
docker build -t wechat4u .
docker kill wechat4u
docker rm wechat4u
docker run -itd -e DB_HOST=172.17.0.1 -e DB_NAME=wechat -e DB_PORT=1433 -e DB_USERNAME=sa -e DB_PASSWORD=Liaoningdalian1  -v /docker/data/wechat4u/media:/app/media wechat4u
