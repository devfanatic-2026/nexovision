import { readFile } from 'fs/promises';
import { join } from 'path';

export async function POST(req: Request) {
    try {
        const { category, sources, linkingReason, metadata, draftingMode, currentTitle } = await req.json();

        // Safe category defaults to default
        const safeCategory = (category || 'default').toLowerCase();

        // Determine filename
        let filename = 'default.md';
        if (safeCategory.includes('econom')) filename = 'economy.md';
        else if (safeCategory.includes('cultur') || safeCategory.includes('magaz')) filename = 'magazine.md';
        else if (safeCategory.includes('polici')) filename = 'police.md';
        else if (safeCategory.includes('region')) filename = 'region.md';
        else if (safeCategory.includes('deport')) filename = 'sports.md';
        else if (safeCategory.includes('tendenc') || safeCategory.includes('trend')) filename = 'trends.md';
        else if (safeCategory.includes('polit')) filename = 'politics.md';
        else if (safeCategory.includes('mundo') || safeCategory.includes('world')) filename = 'world.md';
        // Note: politics was removed in favor of strict DB mapping, but if it comes in, map to Region or World?
        // Let's assume strict mapping.

        const filePath = join(process.cwd(), 'contracts', filename);
        let markdownContent = '';

        try {
            markdownContent = await readFile(filePath, 'utf-8');
        } catch (e) {
            console.error(`Failed to read contract ${filename}, falling back to default.`);
            const defaultPath = join(process.cwd(), 'contracts', 'default.md');
            markdownContent = await readFile(defaultPath, 'utf-8');
        }

        // Construct formatting for sources
        const sourcesText = sources.map((s: any, i: number) => `
NEWS_SOURCE_${i + 1}:
  TITLE: "${s.title}"
  MEDIA: "${s.source}"
  EXTRACT: "${s.snippet}"
  URL: "${s.url || ''}"
`).join('\n');

        const isJsonMode = draftingMode === 'json';

        const prompt = `
${markdownContent}

---
# ASIGNACIÓN ACTUAL

## INFORMACIÓN PARA REDACCIÓN (Instrucción del Editor)
- **Título Sugerido/Mandatorio**: "${currentTitle || 'No definido'}"
- **Instrucción**: "${linkingReason || 'Sin instrucción específica. Analiza las fuentes y encuentra el hilo conductor.'}"

${metadata ? `
## CONTEXTO E IMPORTANCIA DEL ARTÍCULO
- **Prioridad**: ${metadata.isMainHeadline ? 'TITULAR PRINCIPAL DE PORTADA' : metadata.isCategoryMainHeadline ? 'TITULAR DE CATEGORÍA' : 'Noticia estándar'}.
- **Tags Favoritos**: ${metadata.tags?.length > 0 ? metadata.tags.join(', ') : 'Ninguno'}.
- **Instrucción de Enfoque**: ${metadata.isMainHeadline ? 'Escribe con un tono de impacto nacional, es una noticia de apertura.' : metadata.isCategoryMainHeadline ? 'Escribe como el experto de referencia en esta sección.' : 'Informa de manera equilibrada.'}
` : ''}

## FUENTES DISPONIBLES
El usuario ha seleccionado ${sources.length} fuente(s) para esta pieza:

${sourcesText}

---
# TU TAREA FINAL
Redacta la noticia completa siguiendo tu ROL y las INSTRUCCIONES DE REDACCIÓN, utilizando las FUENTES DISPONIBLES y obedeciendo la INFORMACIÓN PARA REDACCIÓN.

${isJsonMode ? `
### FORMATO DE SALIDA OBLIGATORIO: JSON
Debes responder ÚNICAMENTE con un objeto JSON válido (encerrado en un bloque de código \`\`\`json).
Propiedades requeridas:
- "title": Un titular impactante sin formato markdown.
- "slug": Un slug amigable para URL basado en el título (ej: el-gran-acontecimiento).
- "description": Una meta-descripción o bajada de unos 150 caracteres.
- "tags": Un array de strings con 3-5 etiquetas relevantes.
- "content": El cuerpo de la noticia en formato Markdown (sin incluir el título #, empieza directamente con el texto).
` : `
### REGLAS CRÍTICAS DE SALIDA MARKDOWN:
- **FORMATO**: SALIDA ÚNICAMENTE EN MARKDOWN.
- **ESTRUCTURA**: Empieza directamente con el Titular de la noticia (usando #).
`}

- **LIMPIEZA**: NO incluyas fragmentos de código, etiquetas de UI, ni IMÁGENES.
- **IDOMA**: Escribe siempre en Español.
`;

        return new Response(JSON.stringify({ prompt }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error constructing prompt:', error);
        return new Response(JSON.stringify({ error: 'Failed to construct prompt' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
