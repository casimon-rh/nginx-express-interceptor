FROM alpine:latest
RUN apk update && \
apk add --no-cache nodejs nodejs-npm nginx \
  yarn tree bash python py-pip curl && \
  adduser -D -g 'www' www && npm i -g nodemon && \
  chown -R www:www /var/tmp/nginx && \
  pip install supervisor supervisor-stdout
COPY ./docker/supervisor/supervisord.conf /etc/supervisord.conf
WORKDIR /usr/src/app
COPY --chown=www:www package.json yarn.lock ./
RUN yarn --emoji true && chown -R www:www /var/lib/nginx/html
COPY --chown=www:www . .
EXPOSE 80 3000
ENTRYPOINT ["sh", "docker/entrypoint.sh"]