/**
 * @float.js/native - Simplest possible wrapper
 */
// @ts-nocheck
import * as RNWeb from 'react-native-web';

const {
    View, Text, Image, ScrollView, FlatList,
    StyleSheet, Platform, Animated, Easing,
    TouchableOpacity, Pressable, ActivityIndicator
} = RNWeb;

// Export named exports for ESM compatibility
export {
    View, Text, Image, ScrollView, FlatList,
    StyleSheet, Platform, Animated, Easing,
    TouchableOpacity, Pressable, ActivityIndicator
};

// Default export
export default RNWeb;
