import categoriesData from '../data/categories.json';
import { articlesHandler } from './articles';

export interface Category {
    id: string;
    data: {
        title: string;
        path: string;
        description?: string;
        inspire?: string;
    };
    count?: number;
    latestArticles?: any[];
}

const rawCategories = categoriesData as any[];
const categories: Category[] = rawCategories.map(cat => ({
    id: cat.id,
    data: {
        title: cat.data.title,
        path: cat.data.path,
        description: cat.data.description,
        inspire: cat.data.inspire
    }
}));

export const categoriesHandler = {
    allCategories: () => categories.sort((a, b) => a.data.title.localeCompare(b.data.title)),

    oneCategory: (categoryId: string) => {
        const category = categories.find((c) => c.id === categoryId);
        if (!category) {
            // Fallback or throw? Astro code threw error.
            // Let's return undefined or throw to match behavior if critical.
            // But the original code was throwing. Let's throw.
            throw new Error(`Category with id ${categoryId} not found`);
        }
        return category;
    },

    allCategoriesWithLatestArticles: () => {
        return categories.map((category) => {
            const articles = articlesHandler.allArticles()
                .filter((article) => article.data.category.id === category.id);

            return {
                ...category,
                data: {
                    ...category.data,
                },
                count: articles.length,
                latestArticles: articles.slice(0, 3)
            };
        });
    }
};
