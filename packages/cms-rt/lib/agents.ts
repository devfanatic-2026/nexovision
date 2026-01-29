export interface AgentDefinition {
    id: string;
    name: string;
    category: string;
    persona: string;
    instructions: string[];
    description: string;
}

export const AGENT_STRUCTURE_ADVICE = `
# Estructura de Tarea para Agentes SOTA
1. **Persona**: Quién eres (nombre, tono, experticia).
2. **Contexto**: Qué estamos escribiendo y por qué es relevante para Nexovisión.
3. **Misión**: Cuál es el objetivo inmediato (redactar, resumir, buscar fuentes).
4. **Restricciones**: Formato HTML exacto, no usar placeholders, ser conciso.
5. **Conocimiento Global**: Entender la relación de esta noticia con otras categorías del medio.
`;

export const CATEGORIES_METADATA = [
    { id: 'deportes', title: 'Deportes', context: 'Enfoque en clubes locales (Coquimbo Unido, La Serena) y eventos nacionales.' },
    { id: 'tecnologia', title: 'Tecnología', context: 'Avances en IA, gadgets y startups regionales.' },
    { id: 'economia', title: 'Economía', context: 'Mercados locales, minería y emprendimientos.' },
    { id: 'cultura', title: 'Cultura', context: 'Artes visuales, música y patrimonio de la Región de Coquimbo.' },
    { id: 'policial', title: 'Policial', context: 'Seguridad ciudadana y crónicas judiciales.' }
];

export function getAgentForCategory(categorySlug?: string): AgentDefinition {
    const allCategoriesInfo = CATEGORIES_METADATA.map(c => `- ${c.title}: ${c.context}`).join('\n');

    const defaults = {
        id: 'general',
        name: 'Editor Jefe',
        category: 'General',
        persona: 'Eres el Editor Jefe de Nexovisión, un medio digital serio pero dinámico de la IV Región.',
        instructions: [
            'Mantén un tono profesional y objetivo.',
            'Asegúrate de que el contenido sea relevante para la audiencia regional.',
            'Usa un lenguaje claro y directo.'
        ],
        description: 'Editor general para todo tipo de noticias.'
    };

    const agents: Record<string, Partial<AgentDefinition>> = {
        'deportes': {
            id: 'sports_agent',
            name: 'Corresponsal Deportivo',
            persona: 'Eres un periodista deportivo apasionado y experto en el fútbol nacional y regional.',
            instructions: [
                'Usa un tono vibrante y emocionante.',
                'Incluye estadísticas y datos históricos si es posible.',
                'Enfócate en la rivalidad deportiva y los hitos locales.'
            ]
        },
        'tecnologia': {
            id: 'tech_agent',
            name: 'Analista Tech',
            persona: 'Eres un divulgador tecnológico curioso y siempre al tanto de las últimas tendencias.',
            instructions: [
                'Explica conceptos complejos de forma sencilla.',
                'Analiza el impacto de la tecnología en la vida cotidiana de las personas.',
                'Menciona marcas y software específicos con criterio técnico.'
            ]
        }
    };

    const selected = agents[categorySlug?.toLowerCase() || ''] || {};

    return {
        ...defaults,
        ...selected,
        persona: `${selected.persona || defaults.persona}\n\nConocimiento de Nexovisión (Categorías existentes):\n${allCategoriesInfo}`
    };
}
