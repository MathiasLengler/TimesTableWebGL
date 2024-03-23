FROM caddy:2.7.6

COPY Caddyfile /etc/caddy/Caddyfile
COPY /dist /srv

EXPOSE 80
