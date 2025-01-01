import 'react-native-gesture-handler';
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import * as Speech from 'expo-speech';
import HomeScreen from './components/HomeScreen';
import ListScreen from './components/ListScreen';
import ButtonScreen from './components/ButtonScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = React.useState('Home');

  React.useEffect(() => {
    Speech.speak(`${currentScreen}`);
  }, [currentScreen]);

  const onSwipeLeft = () => {
    if (currentScreen === 'Home') {
      setCurrentScreen('List');
    } else if (currentScreen === 'Imports') {
      setCurrentScreen('Home');
    }
  };

  const onSwipeRight = () => {
    if (currentScreen === 'Home') {
      setCurrentScreen('Imports');
    } else if (currentScreen === 'List') {
      setCurrentScreen('Home');
    }
  };

  let ScreenComponent;
  if (currentScreen === 'Home') {
    ScreenComponent = HomeScreen;
  } else if (currentScreen === 'List') {
    ScreenComponent = ListScreen;
  } else if (currentScreen === 'Imports') {
    ScreenComponent = ButtonScreen;
  }

  return (
    <GestureRecognizer
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      style={styles.container}
    >
      <ScreenComponent />
    </GestureRecognizer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});