import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ArticleCard } from '@nexovision/ui-kit';

const meta = {
    title: 'UI Kit/ArticleCard',
    component: ArticleCard,
    tags: ['autodocs'],
    argTypes: {
        title: {
            control: 'text',
            description: 'Article title',
        },
        excerpt: {
            control: 'text',
            description: 'Article excerpt or summary',
        },
        coverImage: {
            control: 'text',
            description: 'URL of the cover image',
        },
        publishedAt: {
            control: 'text',
            description: 'Publication date (ISO string or timestamp)',
        },
        onPress: {
            action: 'pressed',
            description: 'Callback when card is pressed',
        },
        style: {
            control: 'object',
            description: 'Custom styles for the card container',
        },
    },
} satisfies Meta<typeof ArticleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        title: 'Exploring the Future of React Native',
        excerpt: 'React Native continues to evolve with new features and improvements that make cross-platform development easier and more powerful.',
        coverImage: 'https://picsum.photos/seed/react/600/400',
        publishedAt: new Date().toISOString(),
    },
};

export const WithoutImage: Story = {
    args: {
        title: 'Article Without Cover Image',
        excerpt: 'This article demonstrates how the component handles missing images with a placeholder.',
        publishedAt: new Date().toISOString(),
    },
};

export const WithoutExcerpt: Story = {
    args: {
        title: 'Title Only Article',
        coverImage: 'https://picsum.photos/seed/minimal/600/400',
        publishedAt: new Date().toISOString(),
    },
};

export const LongTitle: Story = {
    args: {
        title: 'This is a Very Long Article Title That Will Demonstrate How the Component Handles Text Overflow and Line Clamping',
        excerpt: 'The title will be truncated to two lines maximum, maintaining a clean card layout.',
        coverImage: 'https://picsum.photos/seed/long/600/400',
        publishedAt: new Date().toISOString(),
    },
};

export const LongExcerpt: Story = {
    args: {
        title: 'Article with Extended Content',
        excerpt: 'This is a much longer excerpt that demonstrates how the component handles lengthy text content. It will be clamped to three lines to maintain consistent card height and visual rhythm across multiple cards in a list.',
        coverImage: 'https://picsum.photos/seed/excerpt/600/400',
        publishedAt: new Date().toISOString(),
    },
};

export const OldArticle: Story = {
    args: {
        title: 'Historical Article',
        excerpt: 'This article was published years ago to demonstrate date formatting.',
        coverImage: 'https://picsum.photos/seed/old/600/400',
        publishedAt: '2020-01-15',
    },
};

export const Interactive: Story = {
    args: {
        title: 'Click Me!',
        excerpt: 'This card demonstrates the interaction behavior. Click to see the action in the Actions panel.',
        coverImage: 'https://picsum.photos/seed/interactive/600/400',
        publishedAt: new Date().toISOString(),
    },
};

// List/Array Examples
const sampleArticles = [
    {
        title: 'Getting Started with React Native',
        excerpt: 'Learn the basics of React Native development and build your first mobile app.',
        coverImage: 'https://picsum.photos/seed/rn1/600/400',
        publishedAt: '2024-01-15',
    },
    {
        title: 'Advanced State Management Patterns',
        excerpt: 'Explore modern patterns for managing complex state in React applications.',
        coverImage: 'https://picsum.photos/seed/state/600/400',
        publishedAt: '2024-01-20',
    },
    {
        title: 'Building Accessible Components',
        excerpt: 'Best practices for creating inclusive and accessible UI components.',
        publishedAt: '2024-01-25',
    },
];

export const ArticleList: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
            {sampleArticles.map((article, index) => (
                <ArticleCard
                    key={index}
                    title={article.title}
                    excerpt={article.excerpt}
                    coverImage={article.coverImage}
                    publishedAt={article.publishedAt}
                    onPress={() => console.log(`Clicked: ${article.title}`)}
                />
            ))}
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Example of rendering multiple ArticleCard components in a list layout.',
            },
        },
    },
};

export const GridLayout: Story = {
    render: () => (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
            padding: '16px'
        }}>
            {sampleArticles.map((article, index) => (
                <ArticleCard
                    key={index}
                    title={article.title}
                    excerpt={article.excerpt}
                    coverImage={article.coverImage}
                    publishedAt={article.publishedAt}
                    onPress={() => console.log(`Clicked: ${article.title}`)}
                />
            ))}
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Example of rendering ArticleCard components in a responsive grid layout.',
            },
        },
    },
};

