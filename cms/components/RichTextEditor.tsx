'use client';

import { useEffect, useState } from 'react';
import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import { clsx } from 'clsx';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { ai } from '@float.js/core/ai';
import { useAIStore } from '../lib/ai-store';
import { useEditorStore } from '../lib/editor-store';
import { getAgentForCategory } from '../lib/agents';
import { useNewsWorkbench, type NewsGroup, type NewsItem } from '../lib/news-store';
import MarkdownIt from 'markdown-it';
import toast from 'react-hot-toast';

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
});

import { validators } from '@float.js/core';

// Category Image Mapping (Spanish -> English Filenames)
const CATEGORY_IMAGE_MAP: Record<string, string> = {
    'deportes': 'sports',
    'mundo': 'world',
    'economía': 'economy',
    'economia': 'economy',
    'policial': 'police',
    'región': 'region',
    'region': 'region',
    'tendencias': 'trends',
    'magazine': 'magazine',
    'general': 'default'
};

const getFallbackImage = (cat?: string) => {
    const key = (cat || 'default').toLowerCase().trim();
    const mapped = CATEGORY_IMAGE_MAP[key] || 'default';
    return `/assets/default_${mapped}_news_image.svg`;
};

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    onTitleChange?: (title: string) => void;
    onDescriptionChange?: (description: string) => void;
    onDateChange?: (date: string) => void;
    category?: string;
    tags?: string[];
    cover?: string;
    onCoverChange?: (url: string) => void;
    isMainHeadline?: boolean;
    isCategoryMainHeadline?: boolean;
}

// Simple Modal Component
const Modal = ({ isOpen, onClose, title, children, footer }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6">{children}</div>
                {footer && <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">{footer}</div>}
            </div>
        </div>
    );
};

// Custom Youtube Component
const YoutubeComponent = ({ node, getPos, deleteNode }: any) => {
    return (
        <NodeViewWrapper className="node-youtube relative group">
            <div data-youtube-video className="w-full aspect-video rounded-lg overflow-hidden bg-gray-100 relative">
                <iframe
                    src={node.attrs.src}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
            </div>
            <button
                type="button"
                className="delete-btn absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={() => deleteNode()}
                title="Eliminar video"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </NodeViewWrapper>
    );
};


// Custom Image Component with Delete Button
const ImageComponent = ({ node, deleteNode }: any) => {
    return (
        <NodeViewWrapper className="node-image relative group inline-block max-w-full my-4">
            <img
                src={node.attrs.src}
                alt={node.attrs.alt}
                title={node.attrs.title}
                className="rounded-lg shadow-md max-w-full block h-auto"
            />
            <button
                type="button"
                className="delete-btn absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={() => deleteNode()}
                title="Eliminar imagen"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </NodeViewWrapper>
    );
};


function ListBulletIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
    );
}

function CodeBracketIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
        </svg>
    );
}

function ChatBubbleLeftIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
    );
}

function BoldIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 4.5h10.5a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H9.75v9h6.75a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75v-15a.75.75 0 01.75-.75z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 12h-3" />
        </svg>
    );
}

function ItalicIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 19.5h6m-3-15h6m-6 3l3 12" />
        </svg>
    );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
    );
}

function Cog6ToothIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M10.501 20.112l.4-1.44m5.198-13.344l.4-1.44M15 19.387l-.964-1.15m-5.39-11.49l-.964-1.15M19.387 15l-1.15-.964m-11.49-9.642l-1.15-.964M20.112 10.501l-1.44.4m-13.344 5.198l-1.44.4" />
        </svg>
    );
}

function ArrowUturnLeftIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
        </svg>
    );
}

function ArrowUturnRightIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
        </svg>
    );
}

function MagnifyingGlassIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
    );
}

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        </svg>
    );
}

function ArrowTopRightOnSquareIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
    );
}

// Redundant interface removed.

export function RichTextEditor({
    content,
    onChange,
    onTitleChange,
    onDescriptionChange,
    onDateChange,
    category,
    tags,
    cover,
    onCoverChange,
    isMainHeadline,
    isCategoryMainHeadline
}: RichTextEditorProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [youtubeModalOpen, setYoutubeModalOpen] = useState(false);
    const [youtubeUrl, setYoutubeUrl] = useState('');

    const SITE_URL = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SITE_URL) || 'http://localhost:3000';

    // AI State
    const [aiModalOpen, setAiModalOpen] = useState(false);
    const [aiSettingsOpen, setAiSettingsOpen] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiDropdownOpen, setAiDropdownOpen] = useState(false);

    // News Workbench State
    const [newsModalOpen, setNewsModalOpen] = useState(false);
    const [isSearchingNews, setIsSearchingNews] = useState(false);
    const [linkingModalOpen, setLinkingModalOpen] = useState(false);
    const [linkingReason, setLinkingReason] = useState('');
    const [activeStackId, setActiveStackId] = useState<string | null>(null);
    const [tempLinkedItems, setTempLinkedItems] = useState<NewsItem[]>([]);
    const [tempDraftingInfo, setTempDraftingInfo] = useState("");
    const [isEditingTitle, setIsEditingTitle] = useState<string | null>(null);
    const [tempPreferredImage, setTempPreferredImage] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<'all' | 'manual' | 'auto' | 'detached' | 'bookmarked'>('all');
    const [aiError, setAIError] = useState<string | null>(null);

    // Batch Linking State
    const [batchSelection, setBatchSelection] = useState<string[]>([]);
    const isBatchMode = batchSelection.length > 0;

    // Decision Modals
    const [leavingSiteModal, setLeavingSiteModal] = useState<{ open: boolean, href: string } | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [importUrlModal, setImportUrlModal] = useState(false);
    const [importingUrl, setImportingUrl] = useState(false);

    const aiConfig = useAIStore();
    const editorState = useEditorStore();
    const workbench = useNewsWorkbench();
    const currentCategoryNews = workbench.newsByCategories[category || 'general'] || [];

    const displayedNews = [...currentCategoryNews]
        .filter(g => {
            if (activeFilter === 'all') return true;
            if (activeFilter === 'manual') return g.news.length > 1;
            if (activeFilter === 'auto') return g.news.length === 1 && g.type !== 'detached';
            if (activeFilter === 'detached') return g.type === 'detached';
            if (activeFilter === 'bookmarked') return g.isBookmarked;
            return true;
        })
        .sort((a, b) => {
            if (a.isBookmarked && !b.isBookmarked) return -1;
            if (!a.isBookmarked && b.isBookmarked) return 1;
            return 0;
        });

    const hasManual = currentCategoryNews.some(g => g.news.length > 1);
    const hasAuto = currentCategoryNews.some(g => g.news.length === 1 && g.type !== 'detached');
    const hasDetached = currentCategoryNews.some(g => g.type === 'detached');
    const hasBookmarked = currentCategoryNews.some(g => g.isBookmarked);

    useEffect(() => {
        setIsMounted(true);
        // Expose handleSourceClick to window for footer buttons
        (window as any).handleSourceClick = (url: string) => {
            const isInternal = url.includes(SITE_URL) || url.startsWith('/') || !url.startsWith('http');
            if (isInternal) {
                window.open(url, '_self');
            } else {
                setLeavingSiteModal({ open: true, href: url });
            }
        };
    }, [SITE_URL]);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // Ensure nodes are not dropped
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
            }),
            Image.extend({
                addNodeView() {
                    return ReactNodeViewRenderer(ImageComponent)
                },
            }),
            Youtube.configure({
                controls: true,
                allowFullscreen: true,
                nocookie: true,
                inline: false, // Ensure block rendering behavior
            }).extend({
                addNodeView() {
                    return ReactNodeViewRenderer(YoutubeComponent)
                },
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
            // Sync with global store for undo/redo
            useEditorStore.setState({ content: html });
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-4',
            },
            handleClick: (view, pos, event) => {
                const target = event.target as HTMLElement;
                const link = target.closest('a');
                if (link) {
                    const url = link.getAttribute('href');
                    if (url) {
                        event.preventDefault();
                        (window as any).handleSourceClick(url);
                        return true;
                    }
                }
                return false;
            },
            handleDrop: (view, event, slice, moved) => {
                // Simple drop handling could be added here later for stacking cards
                return false;
            }
        },
    });

    // Handle Undo/Redo from store
    useEffect(() => {
        if (!editor) return;
        const unsubscribe = useEditorStore.subscribe(() => {
            const state = useEditorStore.getState();
            if (state.content !== editor.getHTML()) {
                editor.commands.setContent(state.content, false);
            }
        });
        return unsubscribe;
    }, [editor]);

    // Helper to auto-convert Youtube links in content on initial load
    useEffect(() => {
        if (editor && content) {
            // Find plain text youtube links and replace them with Youtube Embed Nodes
            // We use a regex to scan the current content of the editor

            editor.commands.command(({ tr, state, dispatch }) => {
                let modified = false;
                state.doc.descendants((node, pos) => {
                    if (node.isText && node.text) {
                        // Regex handles both [label](url) and plain url
                        const combinedRegex = /(?:\[([^\]]*)\]\()?((?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]{11})(?:&.*)?)\)?/g;

                        let match;
                        const localReplacements: { from: number, to: number, videoId: string }[] = [];

                        while ((match = combinedRegex.exec(node.text)) !== null) {
                            localReplacements.push({
                                from: pos + match.index,
                                to: pos + match.index + match[0].length,
                                videoId: match[3]
                            });
                        }

                        if (localReplacements.length > 0 && dispatch) {
                            // Sort in reverse to not mess up positions during replacement
                            for (let i = localReplacements.length - 1; i >= 0; i--) {
                                const { from, to, videoId } = localReplacements[i];
                                const src = `https://www.youtube.com/embed/${videoId}`;
                                tr.replaceWith(from, to, state.schema.nodes.youtube.create({ src }));
                            }
                            modified = true;
                        }
                    }
                });
                return modified;
            });
        }
    }, [editor, content]);


    // Handle Youtube Modal Submit
    const addYoutubeVideoFromModal = () => {
        if (youtubeUrl && editor) {
            editor.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run();
            setYoutubeModalOpen(false);
            setYoutubeUrl('');
        }
    };

    // AI Generation Logic (Free Chat)
    const handleAIGenerate = async () => {
        if (!aiPrompt || !editor) return;

        setIsGenerating(true);
        setAiModalOpen(false);

        try {
            const agent = getAgentForCategory(category);

            const systemPrompt = `
            ${agent.persona}
            ---
            TAREAS:
            ${agent.instructions.map(i => `- ${i}`).join('\n')}
            ---
            REGLAS:
            - Formato HTML compatible con Tiptap.
            - Tono: ${agent.name}`;

            editor.chain().focus().insertContent('<p class="ai-generating text-gray-400 italic">Generando respuesta con mi agente editorial...</p>').run();

            let fullContent = '';

            // ALWAYS USE PROXY (Server-side key management)
            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: aiPrompt }],
                    system: systemPrompt,
                    provider: aiConfig.provider
                })
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            fullContent = data.content || '';

            const html = editor.getHTML();
            // Convert to HTML if MD, or just use as is (renderer handles plain string too)
            const renderedOutput = md.render(fullContent);
            const newHtml = html.replace('<p class="ai-generating text-gray-400 italic">Generando respuesta con mi agente editorial...</p>', renderedOutput);
            editor.commands.setContent(newHtml);
            setAiPrompt('');
        } catch (error) {
            console.error('AI Error:', error);
            alert('Error al generar contenido con IA.');
        } finally {
            setIsGenerating(false);
        }
    };

    // News Workbench Logic
    const handleFetchWeeklyNews = async (more = false) => {
        setIsSearchingNews(true);
        try {
            // Enhanced query including tags and priority
            const tagContext = (tags && tags.length > 0) ? ` sobre ${tags.join(', ')}` : '';
            const priorityContext = isMainHeadline ? ' principal' : '';
            const query = category ? `${category}${priorityContext}${tagContext}` : 'Noticias recientes';

            // Get existing URLs to exclude
            const currentGroups = useNewsWorkbench.getState().newsByCategories[category || 'general'] || [];
            const excludeUrls = currentGroups.flatMap(g => (g.news || []).flatMap(n => (n.sources || []).map(s => s.url)));

            const res = await fetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, category, excludeUrls })
            });
            const data = await res.json();

            if (!data.results || data.results.length === 0) {
                console.warn('No results found or API error', data);
                toast.error('No se encontraron noticias recientes relevantes en este momento.');
                setIsSearchingNews(false);
                return;
            }

            const newGroups: NewsGroup[] = data.results.map((item: NewsItem) => ({
                id: crypto.randomUUID(),
                news: [item],
                selectedIndex: 0,
                selected: false,
                type: 'auto'
            }));

            useNewsWorkbench.setState((prev: any) => {
                const cat = category || 'general';
                const existing = more ? (prev.newsByCategories[cat] || []) : [];
                return {
                    newsByCategories: {
                        ...prev.newsByCategories,
                        [cat]: [...existing, ...newGroups]
                    }
                };
            });
        } catch (error) {
            console.error('Fetch news error:', error);
        } finally {
            setIsSearchingNews(false);
        }
    };

    const handleBatchLink = () => {
        if (batchSelection.length < 2) return;

        useNewsWorkbench.setState((prev: any) => {
            const cat = category || 'general';
            const groups = [...(prev.newsByCategories[cat] || [])];

            // Find all selected groups
            const selectedGroups = groups.filter(g => batchSelection.includes(g.id));
            if (selectedGroups.length < 2) return prev;

            // Target is the first one in the selection
            const targetId = batchSelection[0];
            const targetIndex = groups.findIndex(g => g.id === targetId);

            const targetGroup = { ...groups[targetIndex] };
            const otherGroups = selectedGroups.filter(g => g.id !== targetId);

            // Merge all news into target
            targetGroup.news = [...(targetGroup.news || []), ...otherGroups.flatMap(g => g.news || [])];
            targetGroup.type = 'manual';

            // Remove others and update target
            const newGroups = groups.filter(g => !batchSelection.includes(g.id) || g.id === targetId);
            const finalIndex = newGroups.findIndex(g => g.id === targetId);
            newGroups[finalIndex] = targetGroup;

            return {
                newsByCategories: {
                    ...prev.newsByCategories,
                    [cat]: newGroups
                }
            };
        });

        setBatchSelection([]);
        toast.success("Noticias vinculadas exitosamente");
    };

    const handleToggleBatchSelection = (id: string) => {
        setBatchSelection(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleToggleSource = (groupId: string, newsIdx: number, sourceIdx: number) => {
        useNewsWorkbench.setState((prev: any) => {
            const cat = category || 'general';
            const groups = [...(prev.newsByCategories[cat] || [])];
            const gIdx = groups.findIndex(g => g.id === groupId);
            if (gIdx === -1) return prev;

            const group = { ...groups[gIdx] };
            const news = [...(group.news || [])];
            if (!news[newsIdx]) return prev;

            const newsItem = { ...news[newsIdx] };
            const sources = [...(newsItem.sources || [])];
            if (!sources[sourceIdx]) return prev;

            sources[sourceIdx] = { ...sources[sourceIdx], disabled: !sources[sourceIdx].disabled };
            newsItem.sources = sources;
            news[newsIdx] = newsItem;
            group.news = news;
            groups[gIdx] = group;

            return { newsByCategories: { ...prev.newsByCategories, [cat]: groups } };
        });
    };

    const handleDetachSource = (groupId: string, newsIdx: number, sourceIdx: number) => {
        useNewsWorkbench.setState((prev: any) => {
            const cat = category || 'general';
            const groups = [...(prev.newsByCategories[cat] || [])];
            const gIdx = groups.findIndex(g => g.id === groupId);
            if (gIdx === -1) return prev;

            const group = { ...groups[gIdx] };
            const news = [...(group.news || [])];
            if (!news[newsIdx]) return prev;

            const newsItem = { ...news[newsIdx] };
            const sources = [...(newsItem.sources || [])];

            // Cannot detach if only one source (Point 7)
            if (sources.length <= 1) return prev;
            if (!sources[sourceIdx]) return prev;

            const [removedSource] = sources.splice(sourceIdx, 1);
            newsItem.sources = sources;
            news[newsIdx] = newsItem;
            group.news = news;
            groups[gIdx] = group;

            // Create new group with this single source (Point 6)
            if (removedSource) {
                groups.push({
                    id: crypto.randomUUID(),
                    news: [{
                        id: crypto.randomUUID(),
                        title: removedSource.title,
                        snippet: removedSource.snippet,
                        sources: [{ ...removedSource, disabled: false }],
                        date: new Date().toISOString().split('T')[0]
                    }],
                    selected: false,
                    selectedIndex: 0,
                    type: 'detached'
                });
            }

            return { newsByCategories: { ...prev.newsByCategories, [cat]: groups } };
        });
    };
    const handleToggleBookmark = (groupId: string) => {
        useNewsWorkbench.setState((prev: any) => {
            const cat = category || 'general';
            const groups = [...(prev.newsByCategories[cat] || [])];
            const gIdx = groups.findIndex(g => g.id === groupId);
            if (gIdx === -1) return prev;

            groups[gIdx] = { ...groups[gIdx], isBookmarked: !groups[gIdx].isBookmarked };
            return { newsByCategories: { ...prev.newsByCategories, [cat]: groups } };
        });
    };

    const localizeImage = async (url: string) => {
        try {
            const res = await fetch(url);
            const blob = await res.blob();
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
        } catch (e) {
            return url;
        }
    };




    // --- Helper: Insert Scraped/Hunted Content ---
    const insertScrapedContent = (data: any, sourceUrl: string, toastId?: string) => {
        let importedContent = `
# ${data.article.title}
*Fuente: [${data.article.siteName || new URL(sourceUrl).hostname}](${sourceUrl})*

${data.article.excerpt ? `> ${data.article.excerpt}\n\n` : ''}

${data.article.textContent}
        `;

        // If analysis exists, append it
        if (data.analysis) {
            importedContent += `\n\n---
## 🧠 Análisis de Entidades (DeepSeek)
**Resumen**: ${data.analysis.summary}

**Personas**: ${data.analysis.people.join(', ')}
**Organizaciones**: ${data.analysis.organizations.join(', ')}
**Medios**: ${data.analysis.media.join(', ')}
`;
        }

        editor?.commands.setContent(md.render(importedContent));
        if (toastId) toast.success('Contenido importado exitosamente', { id: toastId });
    };

    // --- Hunt Handler (Smart Agent) ---
    const handleHunt = async () => {
        if (!editor) return;

        setIsGenerating(true);

        try {
            // Use configured key if available (DeepSeek)
            const key = aiConfig.provider === 'deepseek' ? aiConfig.apiKey : undefined;

            const res = await fetch('/api/agents/hunt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category: category || 'default',
                    instruction: linkingReason,
                    deepseek_key: key
                })
            });

            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();


            insertScrapedContent(data, data.journey?.selected_url || '', undefined);
            toast.success(`Noticia encontrada tras analizar ${data.journey?.headlines_found} titulares.`);

        } catch (error: any) {
            console.error('Hunt Failed:', error);
            editor.commands.insertContent(`<p style="color: red;"><strong>Error del Agente:</strong> ${error.message}</p>`);
        } finally {
            setIsGenerating(false);
            setNewsModalOpen(false); // Close the prompt modal if it was open
        }
    };

    const handleAIGenerateFromWorkbench = async (group: NewsGroup) => {
        // Enforce Configuration Modal if not yet configured
        if (!group.isConfigured) {
            setActiveStackId(group.id);
            setTempLinkedItems((group.news || []) as any);
            setTempDraftingInfo(group.linkingReason || "");
            setTempPreferredImage(group.preferredImage || null);
            setLinkingModalOpen(true);
            toast.error("Por favor revisa la configuración antes de redactar");
            return;
        }

        if (!editor || isGenerating) return;

        setIsGenerating(true);
        setAIError(null);
        setNewsModalOpen(false);

        // Branching Logic:
        // 1. If we have news (group.news), we REWRITE/SYNTHESIZE -> handleAI Rewrite Mode
        // 2. If we have NO sources, we HUNT -> handleHunt Mode
        if (!group.news || (group.news || []).length === 0) {
            handleHunt();
            return;
        }

        try {
            // Collect all active sources from all news in this group
            const activeSources = (group.news || []).flatMap(n => (n.sources || []).filter(s => !s.disabled));

            if (activeSources.length === 0) {
                alert('No hay fuentes activas para redactar.');
                setIsGenerating(false);
                return;
            }

            const promptRes = await fetch('/api/agents/prompt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category: category || 'default',
                    sources: activeSources,
                    linkingReason: group.linkingReason || "",
                    preferredImage: group.preferredImage,
                    currentTitle: (group.news && group.news[0]) ? group.news[0].title : "",
                    draftingMode: 'json', // Signal to prompt route to return JSON instructions
                    metadata: {
                        tags: tags || [],
                        isMainHeadline: !!isMainHeadline,
                        isCategoryMainHeadline: !!isCategoryMainHeadline
                    }
                })
            });

            if (!promptRes.ok) throw new Error('Failed to generate agent prompt');
            const { prompt } = await promptRes.json();

            // AI Config
            ai.use(aiConfig.provider);
            if (aiConfig.provider !== 'gemini') {
                ai.setKey(aiConfig.provider, aiConfig.apiKey);
            }


            let fullContent = '';
            for await (const chunk of ai.streamChat({
                messages: [{ role: 'system', content: prompt }],
                model: 'deepseek-reasoner',
                temperature: 0.7
            })) {
                fullContent += chunk;
            }

            // Try to parse JSON if possible, otherwise treat as markdown
            let finalContent = fullContent;
            let aiData: any = {};
            try {
                // If the AI returned a JSON block, extract it
                const jsonMatch = fullContent.match(/```json\n([\s\S]+?)\n```/) || fullContent.match(/{[\s\S]+}/);
                if (jsonMatch) {
                    aiData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
                    finalContent = aiData.content || fullContent;
                } else {
                    // Fallback to extraction from Markdown
                    const titleMatch = fullContent.match(/^#\s+(.+)$/m);
                    if (titleMatch) aiData.title = titleMatch[1];

                    const paragraphs = fullContent.replace(/^#\s+.+$/m, '').trim().split('\n\n');
                    if (paragraphs[0]) {
                        aiData.description = paragraphs[0].replace(/[*>_]/g, '').substring(0, 160) + (paragraphs[0].length > 160 ? '...' : '');
                    }
                }
            } catch (e) {
                console.warn("AI response was not valid JSON, falling back to markdown extraction");
            }

            // Convert Markdown to HTML
            const htmlContent = md.render(finalContent);

            // Append Sources at the end
            const sourcesHtml = `
                <div class="mt-8 pt-6 border-t border-gray-100 italic text-sm text-gray-400" id="article-sources">
                    <p class="mb-2 font-bold not-italic text-gray-500">Fuentes consultadas:</p>
                    <div class="flex flex-wrap gap-2">
                        ${activeSources.map((i: any) => `
                            <a
                                href="${i.url}"
                                class="bg-gray-50 px-2 py-1 rounded border border-gray-200 text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer no-underline"
                            >
                                ${i.source}
                            </a>
                        `).join('')}
                    </div>
                </div>
            `;

            // ATOMIC UPDATE (Single step for Undo)
            const manualTitle = (group.news && group.news[0]?.title);
            const preferredTitle = manualTitle || aiData.title || "";
            const today = new Date().toISOString();

            // Set final content first
            editor.commands.setContent(htmlContent + sourcesHtml, false);

            // Update store atomically merging with previous values
            useEditorStore.setState((prev: any) => ({
                ...prev,
                title: preferredTitle,
                content: htmlContent + sourcesHtml,
                description: aiData.description || "",
                slug: aiData.slug || preferredTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
                tags: aiData.tags || [],
                cover: group.preferredImage || prev.cover || "",
                published_time: today
            }));

        } catch (error) {
            console.error('AI Generation Failed:', error);
            setAIError('Error al contactar al agente. Intente nuevamente.');
        } finally {
            setIsGenerating(false);
            setLinkingModalOpen(false);
            setLinkingReason("");
        }
    };

    // --- Import URL Handler ---
    const handleImportUrl = async (url: string, deepseekKey?: string) => {
        setImportingUrl(true);
        try {
            const toastId = toast.loading('Analizando sitio con IA...');

            const res = await fetch('/api/scraper/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url,
                    instruction: linkingReason, // Use current linking instruction as context
                    deepseek_key: deepseekKey
                })
            });

            if (!res.ok) throw new Error(await res.text());

            const data = await res.json();

            insertScrapedContent(data, url, toastId);
            setImportUrlModal(false);

        } catch (error: any) {
            console.error(error);
            toast.error('Error importando URL: ' + error.message);
        } finally {
            setImportingUrl(false);
        }
    };

    // SSR fallback: show textarea until client-side hydration
    if (!isMounted || !editor) {
        return (
            <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-300 p-2">
                    <div className="text-sm text-gray-500">Cargando editor...</div>
                </div>
                <textarea
                    className="w-full p-4 min-h-[400px] focus:outline-none"
                    value={content}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Escribe tu contenido aquí..."
                />
            </div>
        );
    }

    const MenuButton = ({ onClick, active, children }: any) => (
        <button
            onClick={onClick}
            className={clsx(
                'p-2 rounded hover:bg-gray-100 transition-colors duration-150',
                active ? 'bg-gray-200 text-primary-600' : 'text-gray-700'
            )}
            type="button"
        >
            {children}
        </button>
    );

    const addLink = () => {
        if (!editor) return;
        const url = window.prompt('URL:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const addImage = () => {
        if (!editor) return;
        const url = window.prompt('Image URL:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden relative">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-300 p-2 flex gap-1 flex-wrap">
                <MenuButton
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    active={editor?.isActive('bold')}
                >
                    <BoldIcon className="h-5 w-5" />
                </MenuButton>

                <MenuButton
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    active={editor?.isActive('italic')}
                >
                    <ItalicIcon className="h-5 w-5" />
                </MenuButton>

                <div className="w-px bg-gray-300 mx-1" />

                <MenuButton
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                    active={editor?.isActive('heading', { level: 1 })}
                >
                    <span className="text-sm font-bold">H1</span>
                </MenuButton>

                <MenuButton
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                    active={editor?.isActive('heading', { level: 2 })}
                >
                    <span className="text-sm font-bold">H2</span>
                </MenuButton>

                <MenuButton
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                    active={editor?.isActive('heading', { level: 3 })}
                >
                    <span className="text-sm font-bold">H3</span>
                </MenuButton>

                <div className="w-px bg-gray-300 mx-1" />

                <MenuButton
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    active={editor?.isActive('bulletList')}
                >
                    <ListBulletIcon className="h-5 w-5" />
                </MenuButton>

                <div className="w-px bg-gray-300 mx-1" />

                <MenuButton onClick={addLink} active={editor?.isActive('link')}>
                    <span className="text-sm font-bold">Link</span>
                </MenuButton>

                <MenuButton onClick={addImage}>
                    <span className="text-sm font-bold">Img</span>
                </MenuButton>

                <div className="w-px bg-gray-300 mx-1" />

                <MenuButton
                    onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                    active={editor?.isActive('codeBlock')}
                >
                    <CodeBracketIcon className="h-5 w-5" />
                </MenuButton>

                <MenuButton
                    onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                    active={editor?.isActive('blockquote')}
                >
                    <ChatBubbleLeftIcon className="h-5 w-5" />
                </MenuButton>
                <div className="w-px bg-gray-300 mx-1" />

                <MenuButton
                    onClick={() => setYoutubeModalOpen(true)}
                    active={editor?.isActive('youtube')}
                >
                    <span className="text-sm font-bold text-red-600">YT</span>
                </MenuButton>

                <div className="w-px bg-gray-300 mx-1" />

                <MenuButton
                    onClick={() => (useEditorStore as any).undo?.()}
                    title="Deshacer"
                >
                    <ArrowUturnLeftIcon className="h-5 w-5" />
                </MenuButton>

                <MenuButton
                    onClick={() => (useEditorStore as any).redo?.()}
                    title="Rehacer"
                >
                    <ArrowUturnRightIcon className="h-5 w-5" />
                </MenuButton>

                <div className="flex-1" />

                <div className="relative inline-block text-left">
                    <button
                        onClick={() => setAiDropdownOpen(!aiDropdownOpen)}
                        className='flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md active:scale-95 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg'
                        type="button"
                    >
                        <SparklesIcon className="h-4 w-4" />
                        {isGenerating ? 'Generando...' : 'AI Assistant'}
                        <svg className={clsx("w-4 h-4 ml-1 transition-transform", aiDropdownOpen && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>

                    {aiDropdownOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setAiDropdownOpen(false)}
                            />
                            <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            setAiDropdownOpen(false);
                                            setNewsModalOpen(true);
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-700 transition-colors border-b border-gray-100"
                                    >
                                        <div className="p-1.5 bg-purple-100 rounded-lg text-purple-600">
                                            <MagnifyingGlassIcon className="h-4 w-4" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold">Crear Noticias</p>
                                            <p className="text-[11px] opacity-60">Workbench de fuentes web</p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setAiDropdownOpen(false);
                                            setAiModalOpen(true);
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-700 transition-colors border-b border-gray-100"
                                    >
                                        <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
                                            <SparklesIcon className="h-4 w-4" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold">Chat Libre</p>
                                            <p className="text-[11px] opacity-60">Instrucciones directas</p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setAiDropdownOpen(false);
                                            setAiSettingsOpen(true);
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                                    >
                                        <Cog6ToothIcon className="h-4 w-4" />
                                        <span>Configuración IA</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Editor Content with AI Blur Overlay */}
            <div className="bg-white p-4 min-h-[400px] relative">
                <div className={clsx(
                    "transition-all duration-700",
                    isGenerating && "blur-md grayscale opacity-40 pointer-events-none scale-[0.98]"
                )}>
                    <EditorContent editor={editor} />
                </div>
                {isGenerating && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="bg-white/90 backdrop-blur-xl px-10 py-8 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-white flex flex-col items-center gap-6 animate-in zoom-in-95 duration-500">
                            <div className="relative">
                                <div className="w-16 h-16 border-[6px] border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
                                <SparklesIcon className="absolute inset-0 m-auto h-7 w-7 text-purple-600 animate-pulse" />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">Redactando Noticia</p>
                                <p className="text-[12px] font-medium text-purple-600/60 font-mono">DeepSeek Agent en línea...</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* AI Prompt Modal */}
            {
                aiModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200">
                            <div className="flex items-center gap-2 mb-2">
                                <SparklesIcon className="h-6 w-6 text-purple-600" />
                                <h3 className="text-lg font-bold">Asistente: {getAgentForCategory(category).name}</h3>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">{getAgentForCategory(category).description}</p>

                            <div className="space-y-4">
                                <Textarea
                                    placeholder="Ej: Escribe un resumen de este artículo, o genera 3 ideas para el título..."
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    rows={4}
                                    autoFocus
                                />
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setAiModalOpen(false);
                                        }}
                                    >
                                        Cerrar
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={handleAIGenerate}
                                        disabled={!aiPrompt || isGenerating}
                                        className="bg-gradient-to-r from-purple-600 to-blue-600 border-none"
                                    >
                                        Generar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* News Workbench Modal (Crear Noticias) */}
            {
                newsModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
                            {/* Header */}
                            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-xl text-purple-600">
                                        <MagnifyingGlassIcon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Workbench de Noticias</h3>
                                        <p className="text-sm text-gray-500">Cura fuentes para {category || 'General'} de la última semana</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex bg-gray-100 p-1 rounded-lg mr-4">
                                        <button
                                            onClick={() => (useNewsWorkbench as any).undo?.()}
                                            disabled={!(useNewsWorkbench as any).canUndo?.()}
                                            className={clsx(
                                                "p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600",
                                                !(useNewsWorkbench as any).canUndo?.() && "opacity-30 cursor-not-allowed"
                                            )}
                                            title="Deshacer en Workbench"
                                        >
                                            <ArrowUturnLeftIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => (useNewsWorkbench as any).redo?.()}
                                            disabled={!(useNewsWorkbench as any).canRedo?.()}
                                            className={clsx(
                                                "p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600",
                                                !(useNewsWorkbench as any).canRedo?.() && "opacity-30 cursor-not-allowed"
                                            )}
                                            title="Rehacer en Workbench"
                                        >
                                            <ArrowUturnRightIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleFetchWeeklyNews(true)}
                                        loading={isSearchingNews}
                                        className="text-purple-600 hover:bg-purple-50"
                                    >
                                        <span className="mr-1">+</span> Más Noticias
                                    </Button>
                                    <button onClick={() => setNewsModalOpen(false)} className="text-gray-400 hover:text-gray-600 ml-2">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                            </div>

                            <div className="flex-none bg-gray-50 border-b border-gray-100 px-6 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Filtrar por:</p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                if (isBatchMode) setBatchSelection([]);
                                                setActiveFilter('all');
                                            }}
                                            className={clsx(
                                                "px-3 py-1 rounded-full text-[10px] font-bold transition-all border",
                                                activeFilter === 'all' ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                                            )}
                                        >
                                            TODAS ({currentCategoryNews.length})
                                        </button>
                                        {hasBookmarked && (
                                            <button
                                                onClick={() => {
                                                    if (isBatchMode) setBatchSelection([]);
                                                    setActiveFilter('bookmarked');
                                                }}
                                                className={clsx(
                                                    "px-3 py-1 rounded-full text-[10px] font-bold transition-all border flex items-center gap-1",
                                                    activeFilter === 'bookmarked' ? "bg-amber-500 text-white border-amber-500" : "bg-white text-amber-500 border-amber-200 hover:border-amber-300"
                                                )}
                                            >
                                                <StarIcon className="w-3 h-3 fill-current" /> FAVORITAS
                                            </button>
                                        )}
                                        {hasManual && (
                                            <button
                                                onClick={() => {
                                                    if (isBatchMode) setBatchSelection([]);
                                                    setActiveFilter('manual');
                                                }}
                                                className={clsx(
                                                    "px-3 py-1 rounded-full text-[10px] font-bold transition-all border flex items-center gap-1",
                                                    activeFilter === 'manual' ? "bg-blue-600 text-white border-blue-600" : "bg-white text-blue-600 border-blue-200 hover:border-blue-300"
                                                )}
                                            >
                                                <div className="w-2 h-2 rounded-full bg-current" /> VINCULADAS
                                            </button>
                                        )}
                                        {hasAuto && (
                                            <button
                                                onClick={() => {
                                                    if (isBatchMode) setBatchSelection([]);
                                                    setActiveFilter('auto');
                                                }}
                                                className={clsx(
                                                    "px-3 py-1 rounded-full text-[10px] font-bold transition-all border flex items-center gap-1",
                                                    activeFilter === 'auto' ? "bg-red-500 text-white border-red-500" : "bg-white text-red-500 border-red-200 hover:border-red-300"
                                                )}
                                            >
                                                <div className="w-2 h-2 rounded-full bg-current" /> COMUNES
                                            </button>
                                        )}
                                        {hasDetached && (
                                            <button
                                                onClick={() => {
                                                    if (isBatchMode) setBatchSelection([]);
                                                    setActiveFilter('detached');
                                                }}
                                                className={clsx(
                                                    "px-3 py-1 rounded-full text-[10px] font-bold transition-all border flex items-center gap-1",
                                                    activeFilter === 'detached' ? "bg-amber-400 text-white border-amber-400" : "bg-white text-amber-400 border-amber-200 hover:border-amber-300"
                                                )}
                                            >
                                                <div className="w-2 h-2 rounded-full bg-current" /> DESVINCULADAS
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase">
                                    {displayedNews.length} resultados
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
                                {displayedNews.length === 0 && !isSearchingNews && (
                                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
                                        <p className="italic mb-4">No hay noticias que coincidan con el filtro.</p>
                                        {activeFilter !== 'all' && (
                                            <Button variant="ghost" onClick={() => setActiveFilter('all')}>Ver todas</Button>
                                        )}
                                    </div>
                                )}

                                {displayedNews.map((group: NewsGroup) => {
                                    return (
                                        <div
                                            key={group.id}
                                            className={clsx(
                                                "group/card relative flex flex-col bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden",
                                                batchSelection.includes(group.id)
                                                    ? "border-blue-600 ring-4 ring-blue-100 scale-[1.02] shadow-xl z-10"
                                                    : group.selected
                                                        ? "border-purple-600 shadow-xl scale-[1.02] z-10"
                                                        : group.isBookmarked
                                                            ? "border-amber-400 shadow-md shadow-amber-50"
                                                            : (group.news || []).length > 1
                                                                ? "border-blue-500 shadow-sm"
                                                                : group.type === 'detached'
                                                                    ? "border-amber-400 shadow-sm"
                                                                    : "border-red-500 shadow-sm",
                                                isBatchMode && !batchSelection.includes(group.id) && "opacity-60 grayscale-[0.5]"
                                            )}
                                            onClick={() => {
                                                if (isBatchMode) {
                                                    handleToggleBatchSelection(group.id);
                                                    return;
                                                }
                                                if ((group.news || []).length > 0) {
                                                    useNewsWorkbench.setState((prev: any) => {
                                                        const cat = category || 'general';
                                                        const groups = (prev.newsByCategories[cat] || []).map((g: NewsGroup) => ({
                                                            ...g,
                                                            selected: g.id === group.id
                                                        }));
                                                        return { newsByCategories: { ...prev.newsByCategories, [cat]: groups } };
                                                    });
                                                }
                                            }}
                                        >
                                            {/* Selection Overlay for Batch Mode */}
                                            {isBatchMode && (
                                                <div className="absolute top-3 left-3 z-30">
                                                    <div className={clsx(
                                                        "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all",
                                                        batchSelection.includes(group.id) ? "bg-blue-600 border-blue-600 text-white shadow-lg" : "bg-white/80 border-gray-300"
                                                    )}>
                                                        {batchSelection.includes(group.id) && (
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path d="M5 13l4 4L19 7" /></svg>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Stack Badge */}
                                            {(group.news || []).length > 1 && (
                                                <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                                    {(group.news || []).length} TEMAS
                                                </div>
                                            )}

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (isBatchMode) return;
                                                    handleToggleBookmark(group.id);
                                                }}
                                                className={clsx(
                                                    "absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md transition-all",
                                                    group.isBookmarked ? "bg-amber-500 text-white scale-110 shadow-lg" : "bg-black/20 text-white hover:bg-black/40",
                                                    isBatchMode && "cursor-not-allowed opacity-50"
                                                )}
                                            >
                                                <StarIcon className={clsx("w-4 h-4", group.isBookmarked && "fill-current")} />
                                            </button>

                                            <div className="h-40 relative bg-gray-100">
                                                {(() => {
                                                    const fallbackUrl = getFallbackImage(category);
                                                    if (group.isConfigured && group.preferredImage) {
                                                        return <img src={group.preferredImage} className="w-full h-full object-cover" alt="" />;
                                                    }
                                                    const activeNews = (group.news || [])[group.selectedIndex || 0] || (group.news || [])[0] || {};
                                                    const imgSrc = activeNews.image && !activeNews.image.includes('placeholder') ? activeNews.image : fallbackUrl;
                                                    return <img src={imgSrc} className="w-full h-full object-cover" alt="" />;
                                                })()}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            </div>

                                            <div className="p-4 flex-1 flex flex-col">
                                                <h4 className="font-bold text-sm text-gray-900 line-clamp-2 leading-snug mb-2">
                                                    {group.news?.[group.selectedIndex || 0]?.title || 'Noticia sin título'}
                                                </h4>
                                                <p className="text-xs text-gray-500 line-clamp-3 mb-4 leading-relaxed">
                                                    {group.news?.[group.selectedIndex || 0]?.snippet || 'Sin descripción disponible'}
                                                </p>
                                            </div>

                                            {/* Card Footer Actions */}
                                            <div className="p-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                                                {!isBatchMode ? (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleToggleBatchSelection(group.id);
                                                        }}
                                                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group/btn"
                                                    >
                                                        <div className="w-4 h-4 border-2 border-current rounded group-hover/btn:bg-blue-50" />
                                                        VINCULAR A OTRO
                                                    </button>
                                                ) : (
                                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                                                        {batchSelection.includes(group.id) ? 'SELECCIONADO' : 'SELECCIONAR'}
                                                    </span>
                                                )}

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (isBatchMode) return;
                                                        setActiveStackId(group.id);
                                                        setTempLinkedItems((group.news || []) as any);
                                                        setTempDraftingInfo(group.linkingReason || "");
                                                        setTempPreferredImage(group.preferredImage || (group.isConfigured ? null : cover) || null);
                                                        setLinkingModalOpen(true);
                                                    }}
                                                    disabled={isBatchMode}
                                                    className={clsx(
                                                        "text-[10px] font-bold px-3 py-1.5 rounded-lg border-2 transition-all flex items-center gap-1",
                                                        isBatchMode ? "opacity-30 cursor-not-allowed border-gray-200 text-gray-400" : (
                                                            group.isConfigured
                                                                ? "text-green-600 border-green-500 bg-green-50 hover:bg-green-100"
                                                                : "text-red-600 border-red-500 bg-red-50 hover:bg-red-100"
                                                        )
                                                    )}
                                                >
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    EDITAR
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Footer */}
                            <div className="bg-white border-t border-gray-200 p-6">
                                {isBatchMode ? (
                                    <div className="flex items-center justify-between animate-in slide-in-from-bottom-4 duration-300">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg animate-pulse">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-blue-600 uppercase tracking-[0.2em]">Modo Vinculación Activo</p>
                                                <p className="text-xs text-gray-500">Has seleccionado <strong>{batchSelection.length}</strong> temas para agrupar.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button variant="ghost" onClick={() => setBatchSelection([])}>Cancelar Selección</Button>
                                            <Button
                                                variant="primary"
                                                disabled={batchSelection.length < 2}
                                                className="bg-blue-600 hover:bg-blue-700 shadow-xl px-10 py-3 font-bold"
                                                onClick={handleBatchLink}
                                            >
                                                Vincular {batchSelection.length} Temas
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                                                {(() => {
                                                    const selected = currentCategoryNews.find((g: NewsGroup) => g.selected);
                                                    if (selected) {
                                                        const allSources = (selected.news || []).flatMap(n => n.sources || []);
                                                        const activeCount = allSources.filter(s => !s.disabled).length;
                                                        const totalCount = allSources.length;
                                                        const newsCount = (selected.news || []).length;
                                                        return `Noticia vinculada (${newsCount} temas) con ${activeCount} fuentes de ${totalCount} disponibles`;
                                                    }
                                                    return "Selecciona una noticia para redactar";
                                                })()}
                                            </span>
                                        </div>
                                        <div className="flex gap-3">
                                            {currentCategoryNews.length > 0 && (
                                                <Button
                                                    variant="ghost"
                                                    disabled={isBatchMode}
                                                    onClick={() => {
                                                        if (confirm('¿Vaciar todas las noticias de esta categoría?')) {
                                                            useNewsWorkbench.setState((prev: any) => ({
                                                                newsByCategories: { ...prev.newsByCategories, [category || 'general']: [] }
                                                            }));
                                                            (useNewsWorkbench as any).clearHistory?.();
                                                        }
                                                    }}
                                                    className="text-red-500 hover:bg-red-50 hover:text-red-700"
                                                >
                                                    Vaciar
                                                </Button>
                                            )}
                                            <Button variant="ghost" onClick={() => setNewsModalOpen(false)}>Cancelar</Button>
                                            <Button
                                                variant="primary"
                                                disabled={!currentCategoryNews.some((g: NewsGroup) => g.selected) || isGenerating || isBatchMode}
                                                className="bg-purple-600 hover:bg-purple-700 shadow-lg px-8 py-2.5 font-bold"
                                                onClick={() => {
                                                    const selected = currentCategoryNews.find((g: NewsGroup) => g.selected);
                                                    if (selected) handleAIGenerateFromWorkbench(selected);
                                                }}
                                            >
                                                Operar con Agente Editorial
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Leaving Site Modal */}
            <Modal
                isOpen={!!leavingSiteModal?.open}
                onClose={() => setLeavingSiteModal(null)}
                title="Saliendo de Nexovisión"
                footer={(
                    <>
                        <Button variant="ghost" onClick={() => setLeavingSiteModal(null)}>Cancelar</Button>
                        <Button variant="primary" onClick={() => {
                            if (leavingSiteModal?.href) window.open(leavingSiteModal.href, '_blank');
                            setLeavingSiteModal(null);
                        }}>Continuar</Button>
                    </>
                )}
            >
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Estás a punto de visitar una fuente externa.</p>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 break-all text-xs font-mono text-gray-500">
                        {leavingSiteModal?.href}
                    </div>
                </div>
            </Modal>

            {/* Linking / Sources Modal */}
            {
                linkingModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                                    </div>
                                    <h3
                                        className="text-lg font-bold line-clamp-1 cursor-pointer hover:text-blue-600 transition-colors"
                                        onDoubleClick={() => setIsEditingTitle((tempLinkedItems[0] as any)?.title || 'Sin título')}
                                    >
                                        {isEditingTitle !== null ? (
                                            <input
                                                autoFocus
                                                className="border-b-2 border-blue-500 outline-none w-full bg-white text-gray-900 px-1 py-0.5"
                                                value={isEditingTitle}
                                                onChange={(e) => setIsEditingTitle(e.target.value)}
                                                onBlur={() => {
                                                    const newNews = [...(tempLinkedItems || []) as any as NewsItem[]];
                                                    if (newNews[0]) newNews[0].title = isEditingTitle;
                                                    setTempLinkedItems(newNews as any);
                                                    setIsEditingTitle(null);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') e.currentTarget.blur();
                                                }}
                                            />
                                        ) : (
                                            (tempLinkedItems || []).length > 0 ? (tempLinkedItems[0] as any).title : 'Configuración de Noticia'
                                        )}
                                    </h3>
                                </div>
                                {((tempLinkedItems || []).length > 1) && currentCategoryNews.find(g => g.id === activeStackId)?.type === 'manual' && (
                                    <button
                                        onClick={() => {
                                            // UNLINK LOGIC (DESVINCULAR TODO) - Break Group into NewsItems (Point 3)
                                            const originalGroup = currentCategoryNews.find((g: NewsGroup) => g.id === activeStackId);
                                            if (originalGroup) {
                                                useNewsWorkbench.setState((prev: any) => {
                                                    const cat = category || 'general';
                                                    const groups = [...(prev.newsByCategories[cat] || [])];
                                                    const gIdx = groups.findIndex(g => g.id === activeStackId);

                                                    // Remove original group
                                                    groups.splice(gIdx, 1);

                                                    // Point 2: grouping of news -> 1 or more news. Restore each as its own group.
                                                    originalGroup.news.forEach((item: NewsItem) => {
                                                        groups.push({
                                                            id: crypto.randomUUID(),
                                                            news: [item],
                                                            selected: false,
                                                            selectedIndex: 0,
                                                            type: 'auto'
                                                        });
                                                    });

                                                    return { newsByCategories: { ...prev.newsByCategories, [cat]: groups } };
                                                });
                                                setLinkingModalOpen(false);
                                            }
                                        }}
                                        className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 transition-colors"
                                    >
                                        DESVINCULAR TODO
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-6 max-h-[60vh] overflow-y-auto bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    {(tempLinkedItems as any as NewsItem[]).map((newsItem, newsIdx) => (
                                        <div key={newsItem.id} className="space-y-2">
                                            <div className="flex items-center gap-2 px-1">
                                                <div className="w-1 h-4 bg-blue-500 rounded-full" />
                                                <h4 className="text-xs font-black text-gray-700 uppercase tracking-wider line-clamp-1">
                                                    {newsItem.title}
                                                </h4>
                                            </div>
                                            <div className="space-y-1.5 pl-2">
                                                {newsItem.sources.map((source, sourceIdx) => {
                                                    const activeInNews = newsItem.sources.filter(s => !s.disabled).length;
                                                    const isLastActive = !source.disabled && activeInNews === 1;
                                                    const canDetach = newsItem.sources.length > 1; // Point 7

                                                    return (
                                                        <div key={source.url} className={clsx(
                                                            "flex items-center justify-between gap-3 p-2.5 bg-white rounded-lg border transition-all shadow-sm",
                                                            source.disabled ? "bg-gray-50 border-gray-100 opacity-60" : "border-blue-100"
                                                        )}>
                                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={!source.disabled}
                                                                    disabled={isLastActive}
                                                                    title={isLastActive ? "Debe haber al menos una fuente activa por noticia" : ""}
                                                                    onChange={() => {
                                                                        const newNews = [...(tempLinkedItems || []) as any as NewsItem[]].map(ni => ({
                                                                            ...ni,
                                                                            sources: [...ni.sources]
                                                                        }));
                                                                        newNews[newsIdx].sources[sourceIdx] = {
                                                                            ...newNews[newsIdx].sources[sourceIdx],
                                                                            disabled: !newNews[newsIdx].sources[sourceIdx].disabled
                                                                        };
                                                                        setTempLinkedItems(newNews as any);
                                                                        handleToggleSource(activeStackId!, newsIdx, sourceIdx);
                                                                    }}
                                                                    className={clsx(
                                                                        "w-4 h-4 text-blue-600 rounded focus:ring-blue-500",
                                                                        isLastActive && "opacity-50 cursor-not-allowed"
                                                                    )}
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className={clsx(
                                                                        "text-[11px] font-bold line-clamp-1",
                                                                        source.disabled ? "text-gray-400 italic" : "text-gray-900"
                                                                    )}>{source.title}</p>
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-bold uppercase">{source.source}</span>
                                                                        {isLastActive && <span className="text-[9px] text-amber-600 font-medium text-[8px]">MÍNIMO 1 FUENTE</span>}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    onClick={() => setLeavingSiteModal({ open: true, href: source.url })}
                                                                    className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                                                                    title="Ver fuente original"
                                                                >
                                                                    <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                                                                </button>
                                                                {canDetach && (
                                                                    <button
                                                                        onClick={() => {
                                                                            handleDetachSource(activeStackId!, newsIdx, sourceIdx);
                                                                            const newNews = [...(tempLinkedItems || []) as any as NewsItem[]].map(ni => ({
                                                                                ...ni,
                                                                                sources: [...ni.sources]
                                                                            }));
                                                                            newNews[newsIdx].sources.splice(sourceIdx, 1);
                                                                            setTempLinkedItems(newNews as any);
                                                                            toast.success("Fuente desvinculada como noticia propia");
                                                                        }}
                                                                        className="p-1.5 text-gray-300 hover:text-orange-500 hover:bg-orange-50 rounded-md transition-colors"
                                                                        title="Desvincular: crear noticia independiente a partir de esta fuente"
                                                                    >
                                                                        <svg className="w-4 h-4 rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Image Selection (Thumbnails) */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Portada de Noticia:</label>
                                    <div className="flex gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 overflow-x-auto no-scrollbar">
                                        {/* Current / Category Fallback */}
                                        <button
                                            onClick={() => setTempPreferredImage(null)}
                                            className={clsx(
                                                "relative flex-none w-20 h-14 rounded-lg overflow-hidden border-2 transition-all",
                                                tempPreferredImage === null ? "border-blue-500 scale-105 shadow-md" : "border-transparent opacity-60 grayscale-[0.3]"
                                            )}
                                        >
                                            <img src={getFallbackImage(category)} className="w-full h-full object-cover" alt="Defecto" title="Imagen por defecto" />
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-[8px] text-white font-bold uppercase">Categoría</div>
                                        </button>

                                        {/* Current Article Image (Prop) */}
                                        {cover && (
                                            <button
                                                onClick={() => setTempPreferredImage(cover)}
                                                className={clsx(
                                                    "relative flex-none w-20 h-14 rounded-lg overflow-hidden border-2 transition-all",
                                                    tempPreferredImage === cover ? "border-blue-500 scale-105 shadow-md" : "border-transparent opacity-60 grayscale-[0.3]"
                                                )}
                                            >
                                                <img src={cover} className="w-full h-full object-cover" alt="Actualen Editor" />
                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-[8px] text-white font-bold uppercase">En Editor</div>
                                            </button>
                                        )}

                                        {/* Original News Image if exists */}
                                        {(tempLinkedItems[0] as any)?.image && (
                                            <button
                                                onClick={() => setTempPreferredImage((tempLinkedItems[0] as any).image)}
                                                className={clsx(
                                                    "relative flex-none w-20 h-14 rounded-lg overflow-hidden border-2 transition-all",
                                                    tempPreferredImage === (tempLinkedItems[0] as any).image ? "border-blue-500 scale-105 shadow-md" : "border-transparent opacity-60 grayscale-[0.3]"
                                                )}
                                            >
                                                <img src={(tempLinkedItems[0] as any).image} className="w-full h-full object-cover" alt="Original" />
                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-[8px] text-white font-bold">ACTUAL</div>
                                            </button>
                                        )}

                                        {/* Sources Images (Point: use scraped item image if exists) */}
                                        {(tempLinkedItems as any as NewsItem[]).flatMap(n => n.sources).filter(s => s.url).slice(0, 5).map((s: any, i) => {
                                            const thumb = s.image || `https://www.google.com/s2/favicons?domain=${new URL(s.url).hostname}&sz=128`;
                                            return (
                                                <div key={i} className="relative group/thumb">
                                                    <button
                                                        onClick={() => setTempPreferredImage(thumb)}
                                                        className={clsx(
                                                            "relative flex-none w-20 h-14 rounded-lg overflow-hidden border-2 transition-all block",
                                                            tempPreferredImage === thumb ? "border-blue-500 scale-105 shadow-md" : "border-transparent opacity-60 grayscale-[0.3]"
                                                        )}
                                                    >
                                                        <img src={thumb} className="w-full h-full object-cover" alt="Source" />
                                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-[8px] text-white font-bold">INFO {i + 1}</div>
                                                    </button>
                                                    {/* Preview Eye Icon */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPreviewImage(thumb);
                                                        }}
                                                        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow border border-gray-100 opacity-0 group-hover/thumb:opacity-100 transition-opacity z-10 hover:bg-blue-50"
                                                        title="Ver imagen completa"
                                                    >
                                                        <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-tight">Información para redacción (Opcional):</label>
                                    <Textarea
                                        placeholder="Instrucciones adicionales para la IA o motivo de vinculación..."
                                        value={tempDraftingInfo}
                                        onChange={(e) => setTempDraftingInfo(e.target.value)}
                                        rows={3}
                                        className="text-sm bg-blue-50/30 focus:bg-white border-blue-100"
                                    />
                                    <p className="text-[10px] mt-1.5 font-medium text-gray-400">
                                        Describe el ángulo de la noticia o detalles que quieres resaltar.
                                    </p>
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                                        {(() => {
                                            const items = (tempLinkedItems || []) as any as NewsItem[];
                                            const totalSources = items.flatMap(n => n?.sources || []).length;
                                            const activeSources = items.flatMap(n => (n?.sources || []).filter(s => !s.disabled)).length;
                                            return `${items.length} noticias vinculadas | ${activeSources}/${totalSources} fuentes activas`;
                                        })()}
                                    </span>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" onClick={() => setLinkingModalOpen(false)}>Cerrar</Button>
                                        <Button
                                            variant="primary"
                                            disabled={((tempLinkedItems || []) as any as NewsItem[]).flatMap(n => (n?.sources || []).filter(s => !s.disabled)).length === 0}
                                            onClick={() => {
                                                useNewsWorkbench.setState((prev: any) => {
                                                    const cat = category || 'general';
                                                    const groups = [...(prev.newsByCategories[cat] || [])];
                                                    const gIdx = groups.findIndex(g => g.id === activeStackId);
                                                    if (gIdx !== -1) {
                                                        const group = { ...groups[gIdx] };
                                                        group.news = tempLinkedItems as any;
                                                        group.linkingReason = tempDraftingInfo;
                                                        group.preferredImage = tempPreferredImage || undefined;
                                                        group.isConfigured = true;
                                                        groups[gIdx] = group;
                                                    }
                                                    return { newsByCategories: { ...prev.newsByCategories, [cat]: groups } };
                                                });
                                                setLinkingModalOpen(false);
                                                toast.success("Configuración guardada");
                                            }}
                                            className="bg-blue-600 hover:bg-blue-700 font-bold"
                                        >
                                            Confirmar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* AI Settings Modal */}
            <Modal
                isOpen={aiSettingsOpen}
                onClose={() => setAiSettingsOpen(false)}
                title="Configuración de IA"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                        <select
                            className="select select-bordered w-full"
                            value={aiConfig.provider}
                            onChange={(e) => useAIStore.setState({ provider: e.target.value as any })}
                        >
                            <option value="gemini">Google Gemini (Recomendado)</option>
                            <option value="deepseek">DeepSeek</option>
                        </select>
                    </div>
                    {/* Only show API Key input if not Gemini or DeepSeek (legacy support for others if added) */}
                    {aiConfig.provider !== 'gemini' && aiConfig.provider !== 'deepseek' && (
                        <Input
                            label="API Key"
                            type="password"
                            placeholder="sk-..."
                            value={aiConfig.apiKey}
                            onChange={(e) => useAIStore.setState({ apiKey: e.target.value })}
                            helperText="Guardada solo en tu navegador (localStorage)"
                        />
                    )}
                    {(aiConfig.provider === 'gemini' || aiConfig.provider === 'deepseek') && (
                        <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-lg border border-blue-100">
                            <strong>{aiConfig.provider === 'gemini' ? 'Google Gemini' : 'DeepSeek'}</strong> está configurado por el sistema. No necesitas ingresar una clave.
                        </div>
                    )}
                    <div className="flex justify-end pt-2">
                        <Button
                            variant="primary"
                            onClick={() => setAiSettingsOpen(false)}
                        >
                            Listo
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Import URL Modal */}
            <Modal
                isOpen={importUrlModal}
                onClose={() => setImportUrlModal(false)}
                title="Importar Noticia con IA"
            >
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    handleImportUrl(fd.get('url') as string, fd.get('key') as string);
                }} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL de la Noticia</label>
                        <Input name="url" placeholder="https://..." required autoFocus />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">DeepSeek Key (Opcional)</label>
                        <Input name="key" type="password" placeholder="sk-..." />
                        <p className="text-xs text-gray-500 mt-1">Para análisis avanzado de entidades.</p>
                    </div>
                    <div className="flex justify-end pt-2">
                        <Button type="submit" variant="primary" loading={importingUrl}>
                            Analizar e Importar
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Youtube Modal - DaisyUI */}
            {
                youtubeModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                            <h3 className="text-lg font-bold mb-4">Insertar Video de YouTube</h3>
                            <div className="space-y-4">
                                <Input
                                    label="URL del video"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    value={youtubeUrl}
                                    onChange={(e) => setYoutubeUrl(e.target.value)}
                                    autoFocus
                                />
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setYoutubeModalOpen(false);
                                            setYoutubeUrl('');
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={addYoutubeVideoFromModal}
                                        disabled={!youtubeUrl}
                                    >
                                        Insertar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* External Link Warning Modal */}
            <Modal
                isOpen={!!leavingSiteModal?.open}
                onClose={() => setLeavingSiteModal(null)}
                title="Saliendo de Nexovisión"
                footer={(
                    <>
                        <Button variant="secondary" onClick={() => setLeavingSiteModal(null)}>Cancelar</Button>
                        <Button variant="primary" onClick={() => {
                            window.open(leavingSiteModal!.href, '_blank');
                            setLeavingSiteModal(null);
                        }}>Continuar Externamente</Button>
                    </>
                )}
            >
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 rounded-full">
                        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="space-y-2">
                        <p className="text-gray-700">Está a punto de salir del sitio de <strong>Nexovisión</strong> para visitar un enlace externo:</p>
                        <p className="text-sm font-mono text-gray-500 break-all bg-gray-50 p-2 rounded border border-gray-100">{leavingSiteModal?.href}</p>
                        <p className="text-xs text-gray-400">Nexovisión no se hace responsable del contenido de sitios externos.</p>
                    </div>
                </div>
            </Modal>
        </div >
    );
}
