import React from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from '@float.js/lite';
import { ArticleCard } from '@nexovision/ui-kit';
import { PaginatorContainer } from './PaginatorContainer';
import { useArticles, Article } from '../hooks/useArticles';

export interface ArticleListContainerProps {
    pageSize?: number;
}

export const ArticleListContainer: React.FC<ArticleListContainerProps> = ({
    pageSize = 10,
}) => {
    const {
        articles,
        totalPages,
        loading,
        error,
        loadPage
    } = useArticles({ limit: pageSize });

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {loading && articles.length === 0 ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <FlatList
                    data={articles}
                    keyExtractor={(item: Article) => item.id}
                    renderItem={({ item }: { item: Article }) => (
                        <ArticleCard
                            title={item.title}
                            excerpt={item.description}
                            coverImage={item.cover}
                            publishedAt={new Date(item.published_time).toLocaleDateString()}
                            onPress={() => console.log('Article pressed:', item.id)}
                        />
                    )}
                    ListFooterComponent={
                        <PaginatorContainer
                            totalPages={totalPages}
                            onPageChange={loadPage}
                        />
                    }
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    listContent: {
        padding: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    error: {
        color: 'red',
        fontSize: 16,
    }
});
