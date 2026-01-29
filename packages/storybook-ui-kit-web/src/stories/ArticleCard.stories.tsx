import React from 'react';
import { ArticleCard } from '@nexovision/ui-kit';
import { View, StyleSheet } from 'react-native';

export default {
    title: 'UI Kit/ArticleCard',
    component: ArticleCard,
    argTypes: {
        onPress: { action: 'pressed' },
        coverImage: { control: 'text' },
        title: { control: 'text' },
        excerpt: { control: 'text' },
        publishedAt: { control: 'text' },
    },
};

const Template = (args: any) => (
    <View style={styles.container}>
        <ArticleCard {...args} />
    </View>
);

export const Default = Template.bind({});
(Default as any).args = {
    title: "Sample Article Title",
    excerpt: "This is a sample excerpt for the article. It provides a brief summary of the content.",
    coverImage: "https://picsum.photos/id/1/800/600",
    publishedAt: "2026-01-28",
};

export const LongContent = Template.bind({});
(LongContent as any).args = {
    title: "A Very Long Article Title that Should Definitely Wrap to Multiple Lines in the UI to Test Robustness",
    excerpt: "This excerpt is also quite long. It contains multiple sentences to see how the text layout handles larger amounts of content. We want to ensure that the card remains readable and doesn't break when the user provides more text than expected in a typical use case.",
    coverImage: "https://picsum.photos/id/10/800/600",
    publishedAt: "2026-01-28",
};

export const WithoutImage = Template.bind({});
(WithoutImage as any).args = {
    title: "Article Without Image",
    excerpt: "This article demonstrates how the card looks when no cover image is provided. The layout should adjust accordingly.",
    publishedAt: "2026-01-27",
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f0f0f0',
        flex: 1,
    },
});
