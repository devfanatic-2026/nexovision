import authorsData from '../data/authors.json';

export interface Author {
    id: string;
    data: {
        name: string;
        role: string;
        avatar: string;
        job?: string;
    };
}

const authors: Author[] = authorsData as Author[];

export const authorsHandler = {
    allAuthors: () => authors,
    limitAuthors: (limit: number) => authors.slice(0, limit),
    getAuthors: (ids: string | string[] | { id: string }[]) => {
        if (!ids) return [];
        const idList = Array.isArray(ids) ? ids : [ids];
        const normalizedIds = idList.map((id: any) => (typeof id === 'string' ? id : id.id));
        return authors.filter(author => normalizedIds.includes(author.id));
    },
    findAuthor: (id: string) => authors.find(author => author.id === id)
};
