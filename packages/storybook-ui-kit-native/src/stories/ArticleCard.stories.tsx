import React from 'react';
import { View } from 'react-native';
import { ArticleCard } from '@nexovision/ui-kit';

export default {
    title: 'Components/ArticleCard',
    component: ArticleCard,
};

export const Default = () => (
    <View style={{ padding: 20 }}>
        <ArticleCard
            title="Article Title Example"
            excerpt="This is a short summary of the article content."
            publishedAt="12 OCT 2023"
            onPress={() => console.log('Pressed')}
        />
    </View>
);

export const WithImage = () => (
    <View style={{ padding: 20 }}>
        <ArticleCard
            title="Visual Article"
            excerpt="An article with a cover image."
            coverImage="https://picsum.photos/400/200"
            publishedAt="Today"
            onPress={() => console.log('Pressed')}
        />
    </View>
);
