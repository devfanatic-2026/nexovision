'use client';

import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
    BoldIcon,
    ItalicIcon,
    ListBulletIcon,
    CodeBracketIcon,
    ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
            }),
            Image,
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose max-w-none focus:outline-none',
            },
        },
    });

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
        <div className="border border-gray-300 rounded-lg overflow-hidden">
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
            </div>

            {/* Editor Content */}
            <div className="bg-white p-4 min-h-[400px]">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
