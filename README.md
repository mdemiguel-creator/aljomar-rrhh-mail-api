# API envío correos RRHH (SMTP Office 365)

Recibe el POST del formulario RRHH de la tienda Shopify y envía el correo desde **pedidos@aljomar.es** (Office 365) a **marketing@aljomar.es** y **rrhh@aljomar.es**.

## Despliegue en Vercel

1. Instalar Vercel CLI: `npm i -g vercel`
2. En esta carpeta: `cd rrhh-mail-api && npm install`
3. Crear archivo `.env` con las variables (copiar de `.env.example` y poner la contraseña real). **No subir `.env` al repo.**
4. Desplegar: `vercel` (o conectar el repo en vercel.com y configurar las variables de entorno en el dashboard).
5. En Vercel → Project → Settings → Environment Variables, añadir:
   - `PS_MAIL_USER` = pedidos@aljomar.es
   - `PS_MAIL_PASSWD` = contraseña de esa cuenta
   - Opcional: `PS_MAIL_SERVER`, `PS_MAIL_SMTP_PORT`, `ALLOWED_ORIGIN`

La URL resultante será algo como: `https://rrhh-mail-api-xxx.vercel.app/api/send`

## Cambiar la URL en la tienda

En el tema Shopify, en `sections/rhh-form.liquid`, sustituir `SCRIPT_URL` por la URL de esta API:

```javascript
var SCRIPT_URL = 'https://tu-proyecto.vercel.app/api/send';
```

## Seguridad

- **Nunca** subas el archivo `.env` ni la contraseña al repositorio.
- Si la contraseña SMTP ha quedado expuesta (chat, commit, etc.), el cliente debe **cambiarla en la cuenta de Office 365** (pedidos@aljomar.es) y actualizar la variable `PS_MAIL_PASSWD` en Vercel.
# aljomar-rrhh-mail-api
