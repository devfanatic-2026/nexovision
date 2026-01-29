import React from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { ArticleCard } from '@nexovision/ui-kit';
import { PaginatorContainer } from '@nexovision/ui-logic';
import { useRealtimeArticles, Article } from '../hooks/useRealtimeArticles';

export const RealtimeArticleList = () => {
    const {
        articles,
        loading,
        error,
        currentPage,
        totalPages,
        loadPage
    } = useRealtimeArticles({ url: 'http://localhost:3002' });

    if (error) return <Text style={{ color: 'red' }}>Error: {error}</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Live Articles (from cms-rt)</Text>
            {loading && articles.length === 0 ? (
                <ActivityIndicator size="large" />
            ) : (
                <FlatList
                    data={articles}
                    keyExtractor={(item: Article) => item.id}
                    renderItem={({ item }: { item: Article }) => (
                        <ArticleCard
                            title={item.title}
                            excerpt={item.description}
                            coverImage={item.cover}
                            publishedAt={item.published_time}
                            onPress={() => console.log('Article pressed:', item.id)}
                        />
                    )}
                />
            )}

            <PaginatorContainer
                totalPages={totalPages}
                onPageChange={(page) => loadPage(page)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 }
});
