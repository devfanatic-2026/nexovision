import React from 'react';
import { View, Text, StyleSheet } from '@float.js/native';

interface WebSocketConfigErrorProps {
    envVarName?: string;
    requiredUrl?: string;
}

export const WebSocketConfigError: React.FC<WebSocketConfigErrorProps> = ({
    envVarName = 'WEB_SOCKET_SERVER',
    requiredUrl = 'localhost:3002'
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.icon}>⚠️</Text>
                <Text style={styles.title}>WebSocket Server Not Configured</Text>

                <Text style={styles.description}>
                    The WebSocket server address is missing or incorrectly configured.
                </Text>

                <View style={styles.instructions}>
                    <Text style={styles.stepTitle}>Setup Instructions:</Text>

                    <Text style={styles.step}>
                        1. Create a <Text style={styles.code}>.env</Text> file in your project root
                    </Text>

                    <Text style={styles.step}>
                        2. Add the following line:
                    </Text>

                    <View style={styles.codeBlock}>
                        <Text style={styles.codeText}>
                            {envVarName}={requiredUrl}
                        </Text>
                    </View>

                    <Text style={styles.step}>
                        3. Restart your development server
                    </Text>
                </View>

                <View style={styles.note}>
                    <Text style={styles.noteText}>
                        💡 The CMS-RT WebSocket bridge should be listening on port 3002.
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        maxWidth: 500,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    icon: {
        fontSize: 48,
        textAlign: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#d97706',
        textAlign: 'center',
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    instructions: {
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    stepTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
    },
    step: {
        fontSize: 13,
        color: '#4b5563',
        marginBottom: 8,
        lineHeight: 18,
    },
    code: {
        fontFamily: 'monospace',
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 3,
        fontSize: 12,
    },
    codeBlock: {
        backgroundColor: '#1f2937',
        borderRadius: 6,
        padding: 12,
        marginVertical: 8,
    },
    codeText: {
        fontFamily: 'monospace',
        color: '#10b981',
        fontSize: 12,
    },
    note: {
        backgroundColor: '#eff6ff',
        borderLeftWidth: 3,
        borderLeftColor: '#3b82f6',
        padding: 12,
        borderRadius: 4,
    },
    noteText: {
        fontSize: 12,
        color: '#1e40af',
        lineHeight: 16,
    },
});
