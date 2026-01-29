import React from 'react';
import { ArticleListContainer } from '@nexovision/ui-logic';
import { View, StyleSheet } from 'react-native';

export default {
    title: 'UI Logic/ArticleListContainer',
    component: ArticleListContainer,
    argTypes: {
        pageSize: { control: { type: 'number', min: 1, max: 20 } },
    },
};

const Template = (args: any) => (
    <View style={styles.container}>
        <ArticleListContainer {...args} />
    </View>
);

export const DefaultSorted = Template.bind({});
(DefaultSorted as any).args = {
    pageSize: 5,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
