# Despliegue en producción

## Arquitectura

```text
Internet
   |
Nginx + HTTPS (host Linux)
   |
   +-- /      -> 127.0.0.1:3110 -> Angular/Nginx container
   +-- /api/  -> 127.0.0.1:8180 -> Node.js/Express container
                                      |
                                      +-> Oracle XE (red Docker privada)
```

Oracle no publica el puerto 1521 en producción. El frontend y el API solo quedan enlazados a `127.0.0.1`; únicamente Nginx del host publica HTTP/HTTPS.

## 1. Preparar variables

```bash
make prod-setup
nano deploy/docker/.env.prod
```

Cambia obligatoriamente las contraseñas y `JWT_SECRET`.

## 2. Construir y levantar

```bash
make prod-up
make prod-ps
```

Pruebas desde el servidor:

```bash
curl http://127.0.0.1:8180/api/health
curl -I http://127.0.0.1:3110
```

## 3. Nginx del host

```bash
sudo cp deploy/nginx/farmacias.conf.example /etc/nginx/sites-available/farmacias
sudo ln -s /etc/nginx/sites-available/farmacias /etc/nginx/sites-enabled/farmacias
sudo nginx -t
sudo systemctl reload nginx
```

Ajusta `server_name` antes de activar el sitio.

## 4. HTTPS

Con DNS apuntando al servidor:

```bash
sudo certbot --nginx -d farmacias.ejemplo.com
sudo certbot renew --dry-run
```

## 5. Backups

```bash
make backup-prod
```

Los respaldos quedan en `backups/` y están excluidos de Git.
