import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FloatDate } from '@nexovision/ui-kit';

const meta = {
    title: 'UI Kit/FloatDate',
    component: FloatDate,
    args: {
        date: new Date(),
    },
    tags: ['autodocs'],
    argTypes: {
        date: {
            control: 'date',
            description: 'Date to display (Date object, timestamp, or ISO string)',
        },
        locale: {
            control: 'select',
            options: ['es-ES', 'en-US', 'en-GB', 'fr-FR', 'de-DE', 'pt-BR', 'it-IT', 'ja-JP', 'zh-CN'],
            description: 'Locale for date formatting',
        },
        format: {
            control: 'select',
            options: ['short', 'medium', 'long', 'full', 'relative'],
            description: 'Predefined date format',
        },
        options: {
            control: 'object',
            description: 'Custom Intl.DateTimeFormatOptions',
        },
        style: {
            control: 'object',
            description: 'Custom text styles',
        },
        className: {
            control: 'text',
            description: 'CSS class name (web only)',
        },
    },
} satisfies Meta<typeof FloatDate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        format: 'medium',
    },
};

export const Short: Story = {
    args: {
        format: 'short',
    },
};

export const Long: Story = {
    args: {
        format: 'long',
    },
};

export const Full: Story = {
    args: {
        format: 'full',
    },
};

export const CustomLocale: Story = {
    args: {
        format: 'full',
        locale: 'en-US',
    },
};

export const FromTimestamp: Story = {
    args: {
        date: 1706428800000, // Example timestamp
        format: 'medium',
    },
};

export const FromStringTimestamp: Story = {
    args: {
        date: "1706428800000",
        format: 'medium',
    },
};
