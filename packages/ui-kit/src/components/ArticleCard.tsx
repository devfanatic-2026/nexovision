import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { FloatDate } from './FloatDate';


export interface ArticleCardProps {
    title: string;
    excerpt?: string;
    coverImage?: string;
    publishedAt?: string;
    onPress?: () => void;
    style?: ViewStyle;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
    title,
    excerpt,
    coverImage,
    publishedAt,
    onPress,
    style
}) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.card, style]}>
            {coverImage ? (
                <Image source={{ uri: coverImage }} style={styles.image} resizeMode="cover" />
            ) : (
                <View style={[styles.image, styles.placeholder]} />
            )}
            <View style={styles.content}>
                <FloatDate
                    date={publishedAt}
                    style={styles.date}
                    format="medium"
                />
                <Text style={styles.title} numberOfLines={2} selectable={true}>{title}</Text>
                {excerpt && <Text style={styles.excerpt} numberOfLines={3} selectable={true}>{excerpt}</Text>}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0'
    },
    image: {
        width: '100%',
        height: 200,
        backgroundColor: '#e5e7eb',
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 16,
    },
    date: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 4,
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
        lineHeight: 24,
    },
    excerpt: {
        fontSize: 14,
        color: '#4b5563',
        lineHeight: 20,
    }
});
