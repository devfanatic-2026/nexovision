import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Paginator } from '@nexovision/ui-kit';

const meta = {
    title: 'UI Kit/Paginator',
    component: Paginator,
    tags: ['autodocs'],
    argTypes: {
        currentPage: {
            control: { type: 'number', min: 1, max: 10 },
            description: 'Current active page number',
        },
        totalPages: {
            control: { type: 'number', min: 1, max: 100 },
            description: 'Total number of pages',
        },
        onPageChange: {
            action: 'page changed',
            description: 'Callback when page changes',
        },
        style: {
            control: 'object',
            description: 'Custom styles for the paginator container',
        },
    },
} satisfies Meta<typeof Paginator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        currentPage: 1,
        totalPages: 5,
    },
};

export const MiddlePage: Story = {
    args: {
        currentPage: 3,
        totalPages: 5,
    },
};

export const LastPage: Story = {
    args: {
        currentPage: 5,
        totalPages: 5,
    },
};

export const SinglePage: Story = {
    args: {
        currentPage: 1,
        totalPages: 1,
    },
};

export const ManyPages: Story = {
    args: {
        currentPage: 15,
        totalPages: 50,
    },
};

export const FirstPageDisabled: Story = {
    args: {
        currentPage: 1,
        totalPages: 10,
    },
    parameters: {
        docs: {
            description: {
                story: 'When on the first page, the "Anterior" button is disabled.',
            },
        },
    },
};

export const LastPageDisabled: Story = {
    args: {
        currentPage: 10,
        totalPages: 10,
    },
    parameters: {
        docs: {
            description: {
                story: 'When on the last page, the "Siguiente" button is disabled.',
            },
        },
    },
};

// Advanced Controls Example
export const WithPageNumbers: Story = {
    argTypes: {
        visiblePages: {
            control: { type: 'array' },
            description: 'Array of page numbers to display (example of array control)',
        },
    },
    args: {
        currentPage: 3,
        totalPages: 10,
        // This is just to demonstrate array control - not used by component
        visiblePages: [1, 2, 3, 4, 5],
    },
    parameters: {
        docs: {
            description: {
                story: 'Example showing how to use array controls in Storybook. The `visiblePages` control is for demonstration purposes.',
            },
        },
    },
};

// Demo with controlled state
export const InteractiveDemo: Story = {
    render: (args) => {
        const [currentPage, setCurrentPage] = React.useState(args.currentPage);

        return (
            <div>
                <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                    <p style={{ margin: 0, fontSize: '14px', color: '#4b5563' }}>
                        Current Page: <strong>{currentPage}</strong>
                    </p>
                </div>
                <Paginator
                    currentPage={currentPage}
                    totalPages={args.totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        );
    },
    args: {
        currentPage: 1,
        totalPages: 10,
    },
    parameters: {
        docs: {
            description: {
                story: 'Fully interactive paginator with state management. Try clicking the buttons!',
            },
        },
    },
};
