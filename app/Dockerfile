from node:19.3.0-slim
WORKDIR /app
COPY . /app

RUN rm -f package-lock.json \
; rm -rf node_modules \
; rm -rf media \
; npm install

CMD ["npm", "run", "core"]