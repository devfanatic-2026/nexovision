'use client';

import React from 'react';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { Toggle } from './ui/Toggle';
import { RichTextEditor } from './RichTextEditor';
import { Link } from './ui/Link';


function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
    );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
    );
}

interface Article {
    id: string;
    slug: string;
    title: string;
    description: string;
    cover: string;
    category_id: string | null;
    published_time: string;
    is_draft: number;
    is_main_headline: number;
    is_sub_headline: number;
    is_category_main_headline: number;
    is_category_sub_headline: number;
    content: string;
    tags?: string[];
}

interface Category {
    id: string;
    slug: string;
    title: string;
}

interface ArticleEditorProps {
    initialArticle?: Partial<Article>;
    categories: Category[];
    isNew: boolean;
}

export function ArticleEditor({ initialArticle, categories, isNew }: ArticleEditorProps) {
    const [article, setArticle] = React.useState<Partial<Article>>(initialArticle || {
        slug: '',
        title: '',
        description: '',
        cover: '',
        category_id: null,
        published_time: new Date().toISOString().split('T')[0],
        is_draft: 1,
        is_main_headline: 0,
        is_sub_headline: 0,
        is_category_main_headline: 0,
        is_category_sub_headline: 0,
        content: '',
        tags: []
    });

    // If initialArticle is provided, we merge it with defaults to ensure controlled inputs
    React.useEffect(() => {
        if (initialArticle) {
            setArticle(prev => ({ ...prev, ...initialArticle }));
        }
    }, [initialArticle]);

    const [saving, setSaving] = React.useState(false);

    const handleSave = async () => {
        if (!article.title || !article.content) {
            alert('Título y contenido son requeridos');
            return;
        }

        setSaving(true);

        try {
            const response = await fetch('/api/articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...article,
                    slug: article.slug || article.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
                }),
            });

            if (response.ok) {
                alert('Artículo guardado exitosamente');
                window.location.href = '/';
            } else {
                const data = await response.json().catch(() => ({}));
                alert(data.error || 'Error al guardar artículo');
            }
        } catch (error) {
            alert('Error al guardar artículo');
        } finally {
            setSaving(false);
        }
    };

    const handleDownloadMdx = async () => {
        const JSZipModule = await import('jszip');
        const JSZip = JSZipModule.default || JSZipModule;
        const zip = new JSZip();

        // We will store images in an 'images' folder
        const folder = zip.folder("images");

        let content = article.content || '';
        let coverPath = article.cover || '';

        // --- 1. Handle Cover Image ---
        if (article.cover && article.cover.startsWith('data:image')) {
            // It's base64, extract extension and data
            const parts = article.cover.split(';');
            const mime = parts[0].split(':')[1];
            const extension = mime.split('/')[1];
            // base64 data follows comma
            const base64Data = article.cover.split(',')[1];

            const filename = `cover.${extension}`;

            if (folder) folder.file(filename, base64Data, { base64: true });
            coverPath = `images/${filename}`;
        }

        // --- 2. Handle Content Images ---
        // Regex to find ![alt](data:image/...)
        const imageRegex = /!\[(.*?)\]\((data:image\/(\w+);base64,([^\)]+))\)/g;
        let match;
        let imageCounter = 1;

        const replacements: { match: string, replacement: string }[] = [];

        // Loop through matches
        while ((match = imageRegex.exec(content)) !== null) {
            const fullMatch = match[0];
            const alt = match[1];
            const extension = match[3];
            const base64Data = match[4];
            const filename = `article_image_${imageCounter}.${extension}`;

            if (folder) folder.file(filename, base64Data, { base64: true });
            const replacement = `![${alt}](images/${filename})`;
            replacements.push({ match: fullMatch, replacement });
            imageCounter++;
        }

        // Apply replacements
        replacements.forEach(r => {
            content = content.replace(r.match, r.replacement);
        });

        const mdx = `---
title: ${article.title}
slug: ${article.slug}
date: ${article.published_time}
description: "${article.description || ''}"
cover: ${coverPath}
---
    
${content}`;

        zip.file(`${article.slug || 'article'}.mdx`, mdx);

        const blob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${article.slug || 'article'}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            <div className="bg-white border-b border-gray-200 px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <div className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500 px-3 py-1.5 text-sm cursor-pointer">
                                <ArrowLeftIcon className="h-5 w-5" />
                                Volver
                            </div>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isNew ? 'Nuevo Artículo' : 'Editar Artículo'}
                        </h1>
                    </div>

                    <div className="flex gap-2">
                        <Link href="/">
                            <div className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500 px-4 py-2 text-base cursor-pointer">
                                Cancelar
                            </div>
                        </Link>
                        <Button variant="primary" onClick={handleSave} loading={saving}>
                            <CheckIcon className="h-5 w-5" />
                            Guardar
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <Input
                                label="Título"
                                value={article.title || ''}
                                onChange={(e) => setArticle({ ...article, title: e.target.value })}
                                required
                                placeholder="Título del artículo..."
                                className="text-2xl font-bold"
                            />

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contenido <span className="text-red-500">*</span>
                                </label>
                                <RichTextEditor
                                    content={article.content || ''}
                                    onChange={(content) => setArticle({ ...article, content })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold mb-4">Propiedades</h2>

                            <div className="space-y-4">
                                <Input
                                    label="Slug"
                                    value={article.slug || ''}
                                    onChange={(e) => setArticle({ ...article, slug: e.target.value })}
                                    placeholder="url-del-articulo"
                                    helperText="Se generará automáticamente si se deja vacío"
                                />

                                <Textarea
                                    label="Descripción"
                                    value={article.description || ''}
                                    onChange={(e) => setArticle({ ...article, description: e.target.value })}
                                    placeholder="Breve descripción..."
                                    rows={3}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Imagen de portada
                                    </label>

                                    <div className="space-y-3">
                                        {/* Preview */}
                                        {article.cover && (
                                            <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200 group">
                                                <img
                                                    src={article.cover}
                                                    alt="Cover preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                                    <button
                                                        onClick={() => setArticle({ ...article, cover: '' })}
                                                        className="text-white opacity-0 group-hover:opacity-100 font-medium bg-black/50 px-3 py-1 rounded"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Upload / Input */}
                                        <div
                                            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={async (e) => {
                                                e.preventDefault();
                                                const file = e.dataTransfer.files[0];
                                                if (file && file.type.startsWith('image/')) {
                                                    const reader = new FileReader();
                                                    reader.onload = async () => {
                                                        const base64 = reader.result as string;
                                                        // Use Base64 directly for cover image
                                                        setArticle(prev => ({ ...prev, cover: base64 }));
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            onClick={() => {
                                                const input = document.createElement('input');
                                                input.type = 'file';
                                                input.accept = 'image/*';
                                                input.onchange = async (e: any) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = async () => {
                                                            const base64 = reader.result as string;
                                                            // Use Base64 directly for cover image
                                                            setArticle(prev => ({ ...prev, cover: base64 }));
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                };
                                                input.click();
                                            }}
                                        >
                                            <div className="text-sm text-gray-500">
                                                <p className="font-medium text-primary-600 mb-1">Arrastra una imagen aquí</p>
                                                <p>o haz clic para subir</p>
                                            </div>
                                        </div>

                                        <Input
                                            value={article.cover || ''}
                                            onChange={(e) => setArticle({ ...article, cover: e.target.value })}
                                            placeholder="https://..."
                                            type="url"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={handleDownloadMdx}
                                        className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12L12 16.5m0 0L16.5 12M12 16.5V3" />
                                        </svg>
                                        Descargar ZIP (MDX + Imágenes)
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Categoría
                                    </label>
                                    <select
                                        value={article.category_id || ''}
                                        onChange={(e) => setArticle({ ...article, category_id: e.target.value || null })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="">Sin categoría</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <Input
                                    label="Fecha de publicación"
                                    type="date"
                                    value={(() => {
                                        if (!article.published_time) return '';
                                        // Handle timestamp strings like "1768348800000.0"
                                        const timestamp = Number(article.published_time);
                                        if (!isNaN(timestamp)) {
                                            return new Date(timestamp).toISOString().split('T')[0];
                                        }
                                        return article.published_time.split('T')[0];
                                    })()}
                                    onChange={(e) => setArticle({ ...article, published_time: e.target.value })}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Etiquetas (Tags)
                                    </label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {article.tags?.map((tag, index) => (
                                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newTags = [...(article.tags || [])];
                                                        newTags.splice(index, 1);
                                                        setArticle({ ...article, tags: newTags });
                                                    }}
                                                    className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                                                >
                                                    &times;
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <Input
                                        placeholder="Escribe y presiona Enter..."
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const val = e.currentTarget.value.trim();
                                                if (val && !article.tags?.includes(val)) {
                                                    setArticle({ ...article, tags: [...(article.tags || []), val] });
                                                    e.currentTarget.value = '';
                                                }
                                            }
                                        }}
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Presiona Enter para agregar</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold mb-4">Configuración</h2>

                            <div className="space-y-4">
                                <Toggle
                                    enabled={article.is_draft === 0}
                                    onChange={(enabled) => setArticle({ ...article, is_draft: enabled ? 0 : 1 })}
                                    label="Publicado"
                                    description="El artículo será visible en el sitio"
                                />

                                <Toggle
                                    enabled={article.is_main_headline === 1}
                                    onChange={(enabled) => setArticle({ ...article, is_main_headline: enabled ? 1 : 0 })}
                                    label="Titular Principal"
                                    description="Aparece como titular principal"
                                />

                                <Toggle
                                    enabled={article.is_sub_headline === 1}
                                    onChange={(enabled) => setArticle({ ...article, is_sub_headline: enabled ? 1 : 0 })}
                                    label="Sub-titular"
                                    description="Aparece como sub-titular"
                                />

                                <Toggle
                                    enabled={article.is_category_main_headline === 1}
                                    onChange={(enabled) => setArticle({ ...article, is_category_main_headline: enabled ? 1 : 0 })}
                                    label="Titular de Categoría"
                                    description="Titular principal en su categoría"
                                />

                                <Toggle
                                    enabled={article.is_category_sub_headline === 1}
                                    onChange={(enabled) => setArticle({ ...article, is_category_sub_headline: enabled ? 1 : 0 })}
                                    label="Sub-titular de Categoría"
                                    description="Sub-titular en su categoría"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
