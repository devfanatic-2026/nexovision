import articlesData from '../data/articles.json';

export interface Article {
    id: string;
    data: {
        title: string;
        description: string;
        category: { id: string };
        cover: string;
        covert_alt?: string;
        publishedTime: string;
        isDraft?: boolean;
        isMainHeadline?: boolean;
        isSubHeadline?: boolean;
        isCategoryMainHeadline?: boolean;
        isCategorySubHeadline?: boolean;
        authors: string[] | { id: string }[];
    };
    content: string;
    minutesRead: string;
    lastModified: string;
}

const articles: Article[] = articlesData as Article[];

export const articlesHandler = {
    allArticles: () => articles.filter(a => !a.data.isDraft && new Date(a.data.publishedTime) < new Date()),

    mainHeadline: (categoryId?: string) => {
        const all = articlesHandler.allArticles();

        // Filter by category or home
        const filtered = categoryId
            ? all.filter(a => a.data.category.id === categoryId && a.data.isCategoryMainHeadline)
            : all.filter(a => a.data.isMainHeadline);

        // Sort by date descending
        const sorted = filtered.sort((a, b) =>
            new Date(b.data.publishedTime).getTime() - new Date(a.data.publishedTime).getTime()
        );

        if (sorted.length > 0) return sorted[0];

        // Fallback to just the latest article if no highlighted one exists
        const categoryAll = categoryId
            ? all.filter(a => a.data.category.id === categoryId)
            : all;

        const fallbackSorted = categoryAll.sort((a, b) =>
            new Date(b.data.publishedTime).getTime() - new Date(a.data.publishedTime).getTime()
        );

        return fallbackSorted[0];
    },

    subHeadlines: (categoryId?: string) => {
        const mainHeadline = articlesHandler.mainHeadline(categoryId);
        const all = articlesHandler.allArticles();

        const filtered = categoryId
            ? all.filter(a => a.data.category.id === categoryId && a.data.isCategorySubHeadline && a.id !== mainHeadline?.id)
            : all.filter(a => a.data.isSubHeadline && a.id !== mainHeadline?.id);

        return filtered
            .sort((a, b) =>
                new Date(b.data.publishedTime).getTime() - new Date(a.data.publishedTime).getTime()
            )
            .slice(0, 4);
    }
};
