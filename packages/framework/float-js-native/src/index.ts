/**
 * @float.js/native - Simplest possible wrapper
 */
// @ts-nocheck
let RN: any;

try {
    // Try to require react-native (native environment)
    RN = require('react-native');
} catch (e) {
    try {
        // Fallback to react-native-web (web environment)
        RN = require('react-native-web');
    } catch (e2) {
        // Mock for SSR/Node if neither is available
        RN = {
            View: () => null,
            Text: () => null,
            Image: () => null,
            ScrollView: () => null,
            FlatList: () => null,
            StyleSheet: { create: (s: any) => s },
            Platform: { OS: 'web', select: (o: any) => o.web },
            Animated: {},
            Easing: {},
            TouchableOpacity: () => null,
            Pressable: () => null,
            ActivityIndicator: () => null
        };
    }
}

const {
    View, Text, Image, ScrollView, FlatList,
    StyleSheet, Platform, Animated, Easing,
    TouchableOpacity, Pressable, ActivityIndicator
} = RN;

export {
    View, Text, Image, ScrollView, FlatList,
    StyleSheet, Platform, Animated, Easing,
    TouchableOpacity, Pressable, ActivityIndicator
};

export default RN;
