import 'react-native-gesture-handler';
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GestureRecognizer from 'react-native-swipe-gestures';
import speak from './utils/speechHandler';
import HomeScreen from './components/HomeScreen';
import ListScreen from './components/ListScreen';
import ButtonScreen from './components/ButtonScreen';
import SoundDetailScreen from './components/SoundDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  const navigationRef = React.useRef();

  const onSwipeLeft = () => {
    const currentRoute = navigationRef.current.getCurrentRoute().name;
    if (currentRoute === 'Home') {
      speak('List');
      navigationRef.current.navigate('List');
    } else if (currentRoute === 'Imports') {
      speak('Home');
      navigationRef.current.navigate('Home');
    }
  };

  const onSwipeRight = () => {
    const currentRoute = navigationRef.current.getCurrentRoute().name;
    if (currentRoute === 'Home') {
      speak('Imports');
      navigationRef.current.navigate('Imports');
    } else if (currentRoute === 'List') {
      speak('Home');
      navigationRef.current.navigate('Home');
    } else if (currentRoute === 'SoundDetail') {
      speak('List');
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