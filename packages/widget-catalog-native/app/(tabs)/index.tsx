import { View, Text, StyleSheet, Platform } from 'react-native';
import { RealtimeArticleList } from '@nexovision/widgets-catalog';

export default function Index() {
  return (
    <View style={styles.container}>
      <RealtimeArticleList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
});
