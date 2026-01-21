'use client';

import React from 'react';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { Toggle } from './ui/Toggle';
import { RichTextEditor } from './RichTextEditor';

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
                alert('Error al guardar artículo');
            }
        } catch (error) {
            alert('Error al guardar artículo');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            <div className="bg-white border-b border-gray-200 px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <a href="/">
                            <Button variant="ghost" size="sm">
                                <ArrowLeftIcon className="h-5 w-5" />
                                Volver
                            </Button>
                        </a>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isNew ? 'Nuevo Artículo' : 'Editar Artículo'}
                        </h1>
                    </div>

                    <div className="flex gap-2">
                        <a href="/">
                            <Button variant="secondary">
                                Cancelar
                            </Button>
                        </a>
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
                                                        setSaving(true);
                                                        try {
                                                            const res = await fetch('/api/upload', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({ image: base64, filename: file.name })
                                                            });
                                                            const data = await res.json();
                                                            if (data.url) {
                                                                setArticle(prev => ({ ...prev, cover: data.url }));
                                                            }
                                                        } catch (err) {
                                                            alert('Error uploading image');
                                                        } finally {
                                                            setSaving(false);
                                                        }
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
                                                            setSaving(true);
                                                            try {
                                                                const res = await fetch('/api/upload', {
                                                                    method: 'POST',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({ image: base64, filename: file.name })
                                                                });
                                                                const data = await res.json();
                                                                if (data.url) {
                                                                    setArticle(prev => ({ ...prev, cover: data.url }));
                                                                }
                                                            } catch (err) {
                                                                alert('Error uploading image');
                                                            } finally {
                                                                setSaving(false);
                                                            }
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
                                        onClick={() => {
                                            const mdx = `---
title: ${article.title}
slug: ${article.slug}
date: ${article.published_time}
description: "${article.description || ''}"
cover: ${article.cover || ''}
---

${article.content || ''}`;
                                            const blob = new Blob([mdx], { type: 'text/markdown' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `${article.slug || 'article'}.mdx`;
                                            document.body.appendChild(a);
                                            a.click();
                                            document.body.removeChild(a);
                                        }}
                                        className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12L12 16.5m0 0L16.5 12M12 16.5V3" />
                                        </svg>
                                        Descargar MDX
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
                                    value={article.published_time?.split('T')[0] || ''}
                                    onChange={(e) => setArticle({ ...article, published_time: e.target.value })}
                                />
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
