# 🚀 Cómo desplegar Flowly en Vercel

## Prerequisitos
Necesitas una base de datos PostgreSQL externa. Opciones gratuitas:
- **Neon** (recomendado): https://neon.tech - PostgreSQL serverless gratuito
- **Supabase**: https://supabase.com
- **Railway**: https://railway.app

---

## Paso 1 — Crear la base de datos (Neon, recomendado)

1. Ve a https://neon.tech y crea una cuenta gratis
2. Crea un nuevo proyecto
3. Copia el **Connection String** (algo como `postgresql://user:pass@host/db`)

---

## Paso 2 — Subir el código a GitHub

Si no lo tienes en GitHub todavía:
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/TU_USUARIO/flowly.git
git push -u origin main
```

---

## Paso 3 — Conectar con Vercel

1. Ve a https://vercel.com y crea una cuenta
2. Haz clic en **Add New Project**
3. Importa tu repositorio de GitHub
4. En la configuración del proyecto:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

---

## Paso 4 — Agregar variables de entorno en Vercel

En la configuración del proyecto en Vercel, ve a **Settings → Environment Variables** y agrega:

| Variable | Valor |
|----------|-------|
| `DATABASE_URL` | Tu connection string de Neon/Supabase |
| `SESSION_SECRET` | Una cadena aleatoria larga (ej: `mi-secreto-super-seguro-123abc`) |

---

## Paso 5 — Crear las tablas en la base de datos

Después de agregar las variables, en tu terminal local:
```bash
npm install
npx drizzle-kit push
```

Esto crea todas las tablas necesarias en tu base de datos.

---

## Paso 6 — Deploy

Vercel desplegará automáticamente cada vez que hagas push a tu rama `main`.

Para el primer deploy, haz clic en **Deploy** en el dashboard de Vercel.

---

## ¿Problemas?

- Verifica que `DATABASE_URL` y `SESSION_SECRET` estén bien escritos en Vercel
- Revisa los logs en Vercel → tu proyecto → **Functions** tab
