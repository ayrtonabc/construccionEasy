# Implementación del Esquema SQL para Ofertas de Trabajo

## Descripción

Este directorio contiene los archivos SQL necesarios para implementar la funcionalidad de ofertas de trabajo en la base de datos Supabase.

## Archivo `job_offers_schema.sql`

Este archivo contiene todas las sentencias SQL necesarias para:

1. Añadir la columna `interested_in_jobs` a la tabla `clients` para guardar la preferencia del cliente sobre recibir ofertas de trabajo.
2. Crear la tabla `job_offers` para almacenar las ofertas de trabajo con campos para título, sueldo por hora, beneficios, ciudad, URL de imagen y enlace de WhatsApp.
3. Crear una tabla de relación `client_job_interests` (opcional) para un futuro sistema de intereses específicos.
4. Configurar triggers para actualizar automáticamente los timestamps.
5. Crear índices para mejorar el rendimiento de las consultas.
6. Añadir datos de ejemplo para ofertas de trabajo.

## Cómo implementar

1. Accede al panel de administración de Supabase.
2. Ve a la sección "SQL Editor".
3. Crea una nueva consulta.
4. Copia y pega el contenido del archivo `job_offers_schema.sql`.
5. Ejecuta la consulta.

## Verificación

Después de ejecutar el script, verifica que:

1. La tabla `clients` tenga la nueva columna `interested_in_jobs`.
2. La tabla `job_offers` se haya creado correctamente.
3. Los datos de ejemplo se hayan insertado correctamente.

## Notas adicionales

- El script está diseñado para ser idempotente (puede ejecutarse varias veces sin causar errores).
- Las sentencias utilizan `IF NOT EXISTS` para evitar errores si las estructuras ya existen.
- Los datos de ejemplo se insertan con `ON CONFLICT DO NOTHING` para evitar duplicados.
