import { createFloatStore, floatMiddleware } from '@float.js/core';

interface EditorState {
    title: string;
    content: string;
    description: string;
    slug: string;
    tags: string[];
    cover: string;
    published_time: string;
    category_id: string | null;
    is_draft: number;
    is_main_headline: number;
    is_sub_headline: number;
    is_category_main_headline: number;
    is_category_sub_headline: number;
}

export const useEditorStore = createFloatStore<EditorState>(
    {
        title: '',
        content: '',
        description: '',
        slug: '',
        tags: [],
        cover: '',
        published_time: '',
        category_id: null,
        is_draft: 1,
        is_main_headline: 0,
        is_sub_headline: 0,
        is_category_main_headline: 0,
        is_category_sub_headline: 0,
    },
    {
        middleware: floatMiddleware.undoable(20), // 20 steps of history
    }
);
