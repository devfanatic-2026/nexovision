import React from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { ArticleCard } from '@nexovision/ui-kit';
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
                            publishedAt={new Date(item.published_time).toLocaleDateString()}
                            onPress={() => console.log('Article pressed:', item.id)}
                        />
                    )}
                />
            )}

            <View style={styles.pagination}>
                {Array.from({ length: totalPages }, (_, i) => (
                    <Text
                        key={i}
                        style={[styles.pageLink, currentPage === i + 1 && styles.activePage]}
                        onPress={() => loadPage(i + 1)}
                    >
                        {i + 1}
                    </Text>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
    pagination: { flexDirection: 'row', marginTop: 16, justifyContent: 'center' },
    pageLink: { padding: 8, margin: 4, borderWidth: 1, borderColor: '#ccc' },
    activePage: { backgroundColor: '#ddd', fontWeight: 'bold' }
});
