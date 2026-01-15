import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ArticleBodyProps {
    content: string;
}

export default function ArticleBody({ content }: ArticleBodyProps) {
    return (
        <article
            className="prose md:prose-lg py-12 container font-serif prose-headings:font-serif prose-headings:tracking-tight prose-p:text-editorial-800 dark:prose-p:text-editorial-200 prose-img:border prose-img:mx-auto prose-img:border-editorial-100 dark:prose-img:border-editorial-900 prose-img:rounded-sm prose-p:break-words prose-a:text-secondary prose-a:no-underline hover:prose-a:underline prose-pre:break-words prose-pre:cursor-text prose-code:break-words prose-code:whitespace-pre-wrap max-w-4xl mx-auto dark:prose-invert"
            data-pagefind-body
        >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </article>
    );
}
