import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PaginatorContainer } from '@nexovision/ui-logic';

const meta = {
    title: 'UI Logic/PaginatorContainer',
    component: PaginatorContainer,
    tags: ['autodocs'],
    args: {
        totalPages: 5,
        onPageChange: (page) => console.log('Page changed to:', page),
    }
} satisfies Meta<typeof PaginatorContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
