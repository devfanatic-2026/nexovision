import type { Preview } from "@storybook/react";
import React from 'react';

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: "^on[A-Z].*" },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        backgrounds: {
            default: 'light',
            values: [
                { name: 'light', value: '#F3F4F6' },
                { name: 'dark', value: '#374151' },
            ],
        },
    },
    decorators: [
        (Story) => (
            <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
                <Story />
            </div>
        ),
    ],
};

export default preview;
