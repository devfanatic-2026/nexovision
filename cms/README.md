# Nexovisión CMS

CMS para la gestión de noticias y contenido de Nexovisión, potenciado por Float.js y Agentes de IA.

## Requisitos

- Node.js v18+
- pnpm

## Instalación

```bash
pnpm install
```

## Base de Datos (SQLite)

El CMS utiliza SQLite. Para inicializar la base de datos con el esquema y datos iniciales, ejecuta:

```bash
pnpm run seed
```

Esto creará/restaurará el archivo `db/cms.sqlite`.

## Desarrollo

Para levantar el servidor de desarrollo:

```bash
pnpm run dev
```

El CMS estará disponible en `http://localhost:3000`.

## Características

- **Gestión de Artículos**: Creación, edición y publicación de noticias.
- **Editor AI (Workbench)**: Herramienta avanzada para la redacción asistida por IA, con capacidad de búsqueda y agrupación de noticias.
- **Agentes**: Integración con DeepSeek y otros modelos para la generación de contenido.
- **Scraper**: Extracción automática de noticias y medios de fuentes externas.
