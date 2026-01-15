import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ArticleBodyProps {
    content: string;
}

export default function ArticleBody({ content }: ArticleBodyProps) {
    return (
        <article
            className="prose md:prose-lg py-8 container prose-img:border prose-img:mx-auto prose-img:border-base-200 prose-img:rounded-lg prose-p:break-words prose-a:break-all prose-pre:break-words prose-pre:cursor-text prose-code:break-words prose-code:whitespace-pre-wrap max-w-5xl mx-auto dark:prose-invert"
            data-pagefind-body
        >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </article>
    );
}
