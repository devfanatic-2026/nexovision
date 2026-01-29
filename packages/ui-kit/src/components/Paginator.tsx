import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from '@float.js/lite';
import type { ViewStyle } from '@float.js/lite';

export interface PaginatorProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    style?: ViewStyle;
}

export const Paginator: React.FC<PaginatorProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    style
}) => {
    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity
                style={[styles.button, currentPage <= 1 && styles.disabled]}
                disabled={currentPage <= 1}
                onPress={() => onPageChange(currentPage - 1)}
            >
                <Text style={[styles.text, currentPage <= 1 && styles.disabledText]}>Anterior</Text>
            </TouchableOpacity>

            <View style={styles.info}>
                <Text style={styles.pageInfo}>
                    Página <Text style={styles.bold}>{currentPage}</Text> de <Text style={styles.bold}>{totalPages}</Text>
                </Text>
            </View>

            <TouchableOpacity
                style={[styles.button, currentPage >= totalPages && styles.disabled]}
                disabled={currentPage >= totalPages}
                onPress={() => onPageChange(currentPage + 1)}
            >
                <Text style={[styles.text, currentPage >= totalPages && styles.disabledText]}>Siguiente</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 4,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#f3f4f6',
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    disabledText: {
        color: '#9ca3af',
    },
    info: {
        flex: 1,
        alignItems: 'center',
    },
    pageInfo: {
        fontSize: 14,
        color: '#4b5563',
    },
    bold: {
        fontWeight: 'bold',
        color: '#111827',
    }
});
