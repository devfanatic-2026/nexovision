import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ArticleBodyProps {
    content: string;
}

export default function ArticleBody({ content }: ArticleBodyProps) {
    const renderers = {
        a: ({ href, children }: any) => {
            if (href && (href.includes('youtube.com') || href.includes('youtu.be'))) {
                let videoId = '';
                if (href.includes('watch?v=')) {
                    videoId = href.split('watch?v=')[1]?.split('&')[0];
                } else if (href.includes('youtu.be/')) {
                    videoId = href.split('youtu.be/')[1]?.split('?')[0];
                } else if (href.includes('youtube.com/shorts/')) {
                    videoId = href.split('youtube.com/shorts/')[1]?.split('?')[0];
                }

                if (videoId) {
                    return (
                        <div className="aspect-video w-full my-8">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="rounded-md shadow-lg"
                            ></iframe>
                        </div>
                    );
                }
            }
            return <a href={href}>{children}</a>;
        }
    };

    return (
        <article
            className="prose md:prose-lg py-12 container font-serif prose-headings:font-serif prose-headings:tracking-tight prose-headings:text-neutral prose-p:text-neutral prose-img:border prose-img:mx-auto prose-img:border-editorial-100 dark:prose-img:border-editorial-900 prose-img:rounded-sm prose-p:break-words prose-a:text-secondary prose-a:no-underline hover:prose-a:underline prose-pre:break-words prose-pre:cursor-text prose-code:break-words prose-code:whitespace-pre-wrap max-w-4xl mx-auto dark:prose-invert"
            data-pagefind-body
        >
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={renderers}>
                {content}
            </ReactMarkdown>
        </article>
    );
}
