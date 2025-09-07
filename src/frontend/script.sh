#!/bin/bash
echo '--- PASO 0: Deteniendo contenedores existentes para un despliegue limpio... ---' && \
docker compose -f docker-compose.yml down --remove-orphans && \
docker compose -f docker-compose.observability.yml down --remove-orphans && \
echo '--- PASO 1: Buscando el directorio existente de Metaverse/Multiverse Visualizer en el proyecto... ---' && \
MV_DIR=$(find . -type d \( -iname "*meta*verse*visualizer*" -o -iname "*multiverse*gallery*" \) -print -quit) && \
if [ -z "$MV_DIR" ]; then \
  echo "Error: No se encontró el directorio de Metaverse/Multiverse Visualizer. Asegúrate de que exista (e.g., src/components, packages/metaverse-visualizer, o similar). Intenta manualmente: MV_DIR=./src (o el path correcto) y continua." && exit 1; \
else \
  echo "Encontrado: $MV_DIR. Usándolo como UI principal de Meta Ad Studio (sin crear nada nuevo)." && \
  if grep -q "volumes:" docker-compose.yml; then \
    sed -i "s|- .*:/usr/share/nginx/html|- $MV_DIR/dist:/usr/share/nginx/html|g" docker-compose.yml && \
    if grep -q "$MV_DIR/dist:/usr/share/nginx/html" docker-compose.yml; then \
      echo "docker-compose.yml actualizado exitosamente con el nuevo volumen."; \
    else \
      echo "Sed no pudo reemplazar el volumen (quizá no existe uno existente para /usr/share/nginx/html). Agrega manualmente bajo el servicio 'frontend:' en docker-compose.yml: volumes: - $MV_DIR/dist:/usr/share/nginx/html" && read -p "Presiona Enter después de editar manualmente..."; \
    fi || echo "Error en sed; ajusta manualmente en docker-compose.yml (busca 'frontend:' y actualiza/add volumes: - $MV_DIR/dist:/usr/share/nginx/html)."; \
  else \
    echo "No se encontró 'volumes:' en docker-compose.yml. Agrega manualmente bajo el servicio 'frontend:': volumes: - $MV_DIR/dist:/usr/share/nginx/html" && read -p "Presiona Enter después de editar manualmente..."; \
  fi; \
fi && \
echo '--- PASO 2: Desplegando el sistema principal (backend, DB, frontend con Metaverse/Multiverse Visualizer existente como UI)... ---' && \
docker compose -f docker-compose.yml up -d --build && \
echo '--- PASO 3: Desplegando la pila de observabilidad (Prometheus, Grafana, Loki, Node Exporter)... ---' && \
docker compose -f docker-compose.observability.yml up -d --build && \
echo '--- PASO 4: Provisionando dashboards en Grafana automáticamente... ---' && \
sleep 30 && \
curl -u admin:admin -X POST -H "Content-Type: application/json" --data '{"dashboard":{"title":"System Metrics","uid":"system-metrics","panels":[{"type":"graph","title":"CPU Usage","targets":[{"expr":"rate(container_cpu_usage_seconds_total{container=\"backend\"}[5m])"}]},{"type":"graph","title":"Memory Usage","targets":[{"expr":"container_memory_usage_bytes{container=\"backend\"}"}]}]},"overwrite":true}' http://localhost:3000/api/dashboards/db && \
curl -u admin:admin -X POST -H "Content-Type: application/json" --data '{"dashboard":{"title":"API Performance","uid":"api-performance","panels":[{"type":"graph","title":"Request Latency","targets":[{"expr":"histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))"}]},{"type":"graph","title":"Error Rate","targets":[{"expr":"sum(rate(http_requests_total{status=~\"5..\"}[5m])) / sum(rate(http_requests_total[5m]))"}]}]},"overwrite":true}' http://localhost:3000/api/dashboards/db && \
curl -u admin:admin -X POST -H "Content-Type: application/json" --data '{"dashboard":{"title":"Logs Dashboard","uid":"logs-dashboard","panels":[{"type":"logs","title":"Backend Logs","datasource":{"type":"loki","uid":"loki"},"targets":[{"expr":"{job=\"backend\"}"}]},{"type":"logs","title":"Frontend Logs","datasource":{"type":"loki","uid":"loki"},"targets":[{"expr":"{job=\"frontend\"}"}]}]},"overwrite":true}' http://localhost:3000/api/dashboards/db && \
echo '--- PASO 5: Validando funcionalidad al 100%... ---' && \
sleep 10 && \
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health | grep -q 200 && echo "Backend healthy (200 OK)" || (echo "Backend error! Revisa logs con 'docker compose logs backend'." && exit 1) && \
curl -s http://localhost:80 | grep -iq "multiverse\|metaverse\|gallery\|visualizer" && echo "Frontend Metaverse/Multiverse Visualizer healthy y con contenido correcto (existente, detectado por keywords en HTML)" || (echo "Frontend error! (Revisa si el volumen está montado: docker inspect frontend | grep Mounts, o logs. Posible default nginx; asegúrate de que $MV_DIR/dist tenga index.html con contenido.)" && exit 1) && \
(curl -u admin:admin -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/dashboards/uid/system-metrics | grep -q 200 && \
 curl -u admin:admin -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/dashboards/uid/api-performance | grep -q 200) && echo "Grafana dashboards OK" || (echo "Grafana error! Revisa si está up: curl http://localhost:3000 (debe redirigir). Logs: docker compose -f docker-compose.observability.yml logs grafana." && exit 1)
echo '--- PASO 6: Creando acceso directo de escritorio en Debian 12... ---' && \
mkdir -p ~/.local/share/applications && \
tee ~/.local/share/applications/metaverse-visualizer.desktop > /dev/null <<'EOF'
[Desktop Entry]
Name=Meta Ad Studio - Metaverse Visualizer
Exec=bash -c 'cd ~/Documentos/Meta\\ Studio\\ Ad\\ Studio\\ App\\ SPA && docker compose -f docker-compose.yml up -d --build && docker compose -f docker-compose.observability.yml up -d --build && sleep 10 && xdg-open http://localhost:80'
Type=Application
Icon=internet-web-browser
Terminal=false
Categories=Internet;
EOF
&& \
chmod +x ~/.local/share/applications/metaverse-visualizer.desktop && \
echo '--- DESPLIEGUE Y ACCESO DIRECTO COMPLETOS! ---' && \
echo 'El sistema está al 100% con Metaverse/Multiverse Visualizer (existente) como UI principal de Meta Ad Studio. Usa el acceso directo en tu menú (puede requerir logout/login para refrescar).' && \
echo 'Accede manualmente: UI en http://localhost:80, Grafana en http://localhost:3000 (admin/admin).' && \
echo '¡Listo para uso o migración a nube!'
