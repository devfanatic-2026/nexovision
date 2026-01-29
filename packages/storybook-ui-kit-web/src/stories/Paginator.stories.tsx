import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Paginator } from '@nexovision/ui-kit';

export default {
    title: 'Components/Paginator',
    component: Paginator,
    argTypes: {
        onPageChange: { action: 'onPageChange' },
    },
} as ComponentMeta<typeof Paginator>;

const Template: ComponentStory<typeof Paginator> = (args) => <Paginator {...args} />;

export const Default = Template.bind({});
Default.args = {
    currentPage: 1,
    totalPages: 5,
};

export const MiddlePage = Template.bind({});
MiddlePage.args = {
    currentPage: 3,
    totalPages: 5,
};

export const LastPage = Template.bind({});
LastPage.args = {
    currentPage: 5,
    totalPages: 5,
};
