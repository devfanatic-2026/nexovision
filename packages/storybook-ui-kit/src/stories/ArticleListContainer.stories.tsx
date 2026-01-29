import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ArticleListContainer } from '@nexovision/ui-logic';

const meta = {
    title: 'UI Logic/ArticleListContainer',
    component: ArticleListContainer,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div style={{ padding: '1rem', border: '1px dashed #ccc' }}>
                <p style={{ marginBottom: '1rem', color: '#666' }}>Logic Container Preview</p>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof ArticleListContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
