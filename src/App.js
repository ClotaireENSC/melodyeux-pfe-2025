import 'react-native-gesture-handler';
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GestureRecognizer from 'react-native-swipe-gestures';
import * as Speech from 'expo-speech';
import HomeScreen from './components/HomeScreen';
import ListScreen from './components/ListScreen';
import ButtonScreen from './components/ButtonScreen';
import SoundDetailScreen from './components/SoundDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  const navigationRef = React.useRef();
  const [currentScreen, setCurrentScreen] = React.useState('Home');

  const onSwipeLeft = () => {
    const currentRoute = navigationRef.current.getCurrentRoute().name;
    if (currentRoute === 'Home') {
      navigationRef.current.navigate('List');
    } else if (currentRoute === 'Imports') {
      navigationRef.current.navigate('Home');
    }
  };

  const onSwipeRight = () => {
    const currentRoute = navigationRef.current.getCurrentRoute().name;
    if (currentRoute === 'Home') {
      navigationRef.current.navigate('Imports');
    } else if (currentRoute === 'List') {
      navigationRef.current.navigate('Home');
    } else if (currentRoute === 'SoundDetail') {
      navigationRef.current.navigate('List');
    }
  };

  const gestureConfig = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <GestureRecognizer
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
        config={gestureConfig}
        style={styles.container}
      >
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="List" component={ListScreen} />
          <Stack.Screen name="Imports" component={ButtonScreen} />
          <Stack.Screen name="SoundDetail" component={SoundDetailScreen} />
          <Stack.Screen name="TrackScreen" component={SoundDetailScreen} />
        </Stack.Navigator>
      </GestureRecognizer>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});