import { Platform, StyleSheet, ScrollView } from 'react-native';
import { RealtimeArticleList } from '@nexovision/widgets-catalog';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <RealtimeArticleList />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
});
