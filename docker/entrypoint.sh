STOP_PROC=0;
trap "docker_stop" SIGINT SIGTERM

function docker_stop {
  export STOP_PROC=1;
}
rm /etc/nginx/conf.d/default.conf
cat docker/nginx/baseServer.conf >> /etc/nginx/conf.d/main.conf
cat docker/nginx/nginx.conf > /etc/nginx/nginx.conf

if  [ ! -z "${DEFAULT}" ] ; then
  cat docker/nginx/baseRedirect.conf | \
  sed -r -e "s~(.*)\/\*;~\1$DEFAULT;~" \
  >> /etc/nginx/conf.d/main.conf
fi

if  [ ! -z "${ENDPOINTS}" ] ; then
  LIST=$(echo ${ENDPOINTS} | tr ";" "\n")
  for ENDPOINT in ${LIST}
  do
    LOCATION="$(echo ${ENDPOINT} | awk -F '=' '{print $1}')"
    PASS="$(echo ${ENDPOINT} | awk -F '=' '{print $2}')"
    cat docker/nginx/baseLocation.conf | \
    sed -r \
    -e "s~^( *location).*~\1 ${LOCATION} \{~" \
    -e "s~^( *proxy_pass).*~\1 ${PASS};~" \
    >> /etc/nginx/conf.d/main.conf
  done
fi

echo "}" >> /etc/nginx/conf.d/main.conf
nginx -T
/usr/bin/supervisord -n -c /etc/supervisord.conf
EXIT_DAEMON=0

while [ ${EXIT_DAEMON} -eq 0 ]; do
  if [ ${STOP_PROC} != 0 ]
  then
    break;
  fi
  sleep 5
done
