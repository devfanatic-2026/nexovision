import { config, collection, fields } from '@keystatic/core';

export default config({
    storage: {
        kind: 'local',
    },
    collections: {
        articles: collection({
            label: 'Artículos',
            slugField: 'title',
            path: '../sitio/content/articles/*/',
            format: { contentField: 'content' },
            schema: {
                title: fields.slug({ name: { label: 'Título' } }),
                description: fields.text({ label: 'Descripción', multiline: true }),
                cover: fields.text({ label: 'Imagen de Portada (Ruta)' }),
                category: fields.text({ label: 'Categoría (Slug)' }), // Ideally a relationship, but mapping to local files
                publishedTime: fields.datetime({ label: 'Fecha de Publicación' }),
                isDraft: fields.checkbox({ label: 'Borrador' }),
                isMainHeadline: fields.checkbox({ label: 'Es Titular Principal' }),
                isSubHeadline: fields.checkbox({ label: 'Es Sub-Titular' }),
                isCategoryMainHeadline: fields.checkbox({ label: 'Es Titular de Categoría' }),
                isCategorySubHeadline: fields.checkbox({ label: 'Es Sub-Titular de Categoría' }),
                authors: fields.array(fields.text({ label: 'Autor (Slug)' }), {
                    label: 'Autores',
                    itemLabel: props => props.value
                }),
                content: fields.markdoc({
                    label: 'Contenido',
                }),
            },
        }),
        authors: collection({
            label: 'Autores',
            slugField: 'name',
            path: '../sitio/content/authors/*/',
            schema: {
                name: fields.slug({ name: { label: 'Nombre' } }),
                job: fields.text({ label: 'Puesto/Cargo' }),
                avatar: fields.text({ label: 'Avatar (Ruta)' }),
                bio: fields.text({ label: 'Biografía', multiline: true }),
                social: fields.array(
                    fields.object({
                        name: fields.text({ label: 'Red Social' }),
                        url: fields.text({ label: 'URL' }),
                        icon: fields.text({ label: 'Icono' }),
                    }),
                    {
                        label: 'Redes Sociales',
                        itemLabel: props => props.fields.name.value
                    }
                ),
            },
        }),
        categories: collection({
            label: 'Categorías',
            slugField: 'title',
            path: '../sitio/content/categories/*/',
            format: { data: 'json' },
            schema: {
                title: fields.slug({ name: { label: 'Título' } }),
                path: fields.text({ label: 'Path/Slug' }),
                inspire: fields.text({ label: 'Frase Inspiradora' }),
            },
        }),
    },
});
