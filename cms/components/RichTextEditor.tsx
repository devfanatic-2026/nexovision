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


interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [youtubeModalOpen, setYoutubeModalOpen] = useState(false);
    const [youtubeUrl, setYoutubeUrl] = useState('');

    useEffect(() => {
        setIsMounted(true);
    }, []);

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
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose max-w-none focus:outline-none',
            },
        },
    });

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
        const url = window.prompt('URL:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const addImage = () => {
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
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive('bold')}
                >
                    <BoldIcon className="h-5 w-5" />
                </MenuButton>

                <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive('italic')}
                >
                    <ItalicIcon className="h-5 w-5" />
                </MenuButton>

                <div className="w-px bg-gray-300 mx-1" />

                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    active={editor.isActive('heading', { level: 1 })}
                >
                    <span className="text-sm font-bold">H1</span>
                </MenuButton>

                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    active={editor.isActive('heading', { level: 2 })}
                >
                    <span className="text-sm font-bold">H2</span>
                </MenuButton>

                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    active={editor.isActive('heading', { level: 3 })}
                >
                    <span className="text-sm font-bold">H3</span>
                </MenuButton>

                <div className="w-px bg-gray-300 mx-1" />

                <MenuButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}
                >
                    <ListBulletIcon className="h-5 w-5" />
                </MenuButton>

                <div className="w-px bg-gray-300 mx-1" />

                <MenuButton onClick={addLink} active={editor.isActive('link')}>
                    <span className="text-sm font-bold">Link</span>
                </MenuButton>

                <MenuButton onClick={addImage}>
                    <span className="text-sm font-bold">Img</span>
                </MenuButton>

                <div className="w-px bg-gray-300 mx-1" />

                <MenuButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    active={editor.isActive('codeBlock')}
                >
                    <CodeBracketIcon className="h-5 w-5" />
                </MenuButton>

                <MenuButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    active={editor.isActive('blockquote')}
                >
                    <ChatBubbleLeftIcon className="h-5 w-5" />
                </MenuButton>
                <div className="w-px bg-gray-300 mx-1" />

                <MenuButton
                    onClick={() => setYoutubeModalOpen(true)}
                    active={editor.isActive('youtube')}
                >
                    <span className="text-sm font-bold text-red-600">YT</span>
                </MenuButton>
            </div>

            {/* Editor Content */}
            <div className="bg-white p-4 min-h-[400px]">
                <EditorContent editor={editor} />
            </div>

            {/* Youtube Modal - DaisyUI */}
            {youtubeModalOpen && (
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
            )}
        </div>
    );
}
