import ArticleHeader from '../../../components/articles/ArticleHeader';
import ArticleBody from '../../../components/articles/ArticleBody';
import { articlesHandler } from '../../../lib/handlers/articles';
// import { notFound } from '@float.js/core/router'; 
// Float architecture: standard React component.
// If not found, how to 404? 
// Checking Float docs or examples in previous steps... Float seems to be Next.js-like.
// "import { notFound } from 'next/navigation'"? No, this is Float.
// Let's assume for now we just return a 404 component or similar if not found.
// Actually, I'll check if article exists, if not, I'll return "Not found" text for now.

export default function ArticlePage({ params }: { params: { slug: string } }) {
    const articles = articlesHandler.allArticles();
    const article = articles.find(a => a.id === params.slug);

    if (!article) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-4xl font-bold">404 - Article Not Found</h1>
                <p className="mt-4">The article you are looking for does not exist.</p>
            </div>
        );
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <ArticleHeader article={article} readingTime={article.minutesRead} />
            <ArticleBody content={article.content} />
        </main>
    );
}

// Optional: specific title export or metadata if Float supports it
export function generateMetadata({ params }: { params: { slug: string } }) {
    const articles = articlesHandler.allArticles();
    const article = articles.find(a => a.id === params.slug);
    if (!article) return { title: 'Not Found' };
    return {
        title: article.data.title,
        description: article.data.description,
    };
}
