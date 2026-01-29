import React from 'react';
import { View } from 'react-native';
import { ArticleListContainer } from '@nexovision/ui-logic';

export default {
    title: 'Containers/ArticleListContainer',
    component: ArticleListContainer,
};

export const Mocked = () => (
    <View style={{ flex: 1 }}>
        <ArticleListContainer
            pageSize={10}
        />
    </View>
);
