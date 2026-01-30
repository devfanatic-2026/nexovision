import React, { useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { ArticleCard } from '@nexovision/ui-kit';
import { PaginatorContainer } from '@nexovision/ui-logic';
import { useRealtimeArticles, Article } from '../hooks/useRealtimeArticles';

/**
 * RealtimeArticleList Component
 * Connects to the CMS-RT WebSocket server using the WEB_SOCKET_SERVER environment variable.
 */

// Safe environment variable access
const getEnvVar = (name: string) => {
    try {
        // @ts-ignore
        return process.env[name];
    } catch (e) {
        return undefined;
    }
};

const WS_URL = getEnvVar('WEB_SOCKET_SERVER') || '127.0.0.1:3002';

export const RealtimeArticleList = () => {
    const {
        articles,
        loading,
        error,
        page,
        totalPages,
        setPage,
        fetchArticles
    } = useRealtimeArticles({ url: WS_URL });

    // Initial fetch on mount
    useEffect(() => {
        console.log(`🚀 RealtimeArticleList mounted, requesting initial articles from ${WS_URL}...`);
        fetchArticles(1);
    }, [fetchArticles]);

    // Debug logging for articles state
    useEffect(() => {
        console.log('📊 Articles state:', {
            count: articles.length,
            loading,
            error,
            page,
            totalPages,
            firstArticle: articles[0]?.title
        });
    }, [articles, loading, error, page, totalPages]);

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorTitle}>Connection Issue</Text>
                <Text style={styles.errorText}>{error}</Text>
                <Text style={styles.errorSub}>Attempted: {WS_URL}</Text>
            </View>
        );
    }

    if (loading && articles.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Loading articles...</Text>
            </View>
        );
    }

    if (articles.length === 0) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorTitle}>No Articles</Text>
                <Text style={styles.errorText}>No articles available yet</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Live Articles ({articles.length})</Text>
                {loading && <ActivityIndicator size="small" color="#3b82f6" />}
            </View>

            <FlatList
                data={articles}
                keyExtractor={(item: Article) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }: { item: Article }) => (
                    <ArticleCard
                        title={item.title}
                        excerpt={item.description}
                        coverImage={item.cover}
                        publishedAt={item.published_time}
                        onPress={() => console.log('Article pressed:', item.id)}
                        style={styles.card}
                    />
                )}
            />

            <View style={styles.footer}>
                <PaginatorContainer
                    totalPages={totalPages}
                    onPageChange={(newPage: number) => setPage(newPage)}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginVertical: 20,
        gap: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111',
    },
    listContent: {
        paddingBottom: 40,
    },
    card: {
        marginBottom: 16,
        marginHorizontal: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 14,
        color: '#666',
    },
    footer: {
        paddingVertical: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    errorContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ef4444',
        marginBottom: 8,
    },
    errorText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    errorSub: {
        fontSize: 12,
        color: '#999',
        marginTop: 10,
    }
});
