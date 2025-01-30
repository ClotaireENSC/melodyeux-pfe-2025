import 'react-native-gesture-handler';
import * as React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GestureRecognizer from 'react-native-swipe-gestures';
import { inform } from './utils/speechHandler';
import HomeScreen from './components/HomeScreen';
import ListScreen from './components/ListScreen';
import ButtonScreen from './components/ButtonScreen';
import SoundDetailScreen from './components/SoundDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  const navigationRef = React.useRef();
  const [speechMode, setSpeechMode] = React.useState('talkative');

  const onSwipeLeft = () => {
    const currentRoute = navigationRef.current.getCurrentRoute().name;
    if (currentRoute === 'Home') {
      navigationRef.current.navigate('List');
      inform('List', speechMode);
    } else if (currentRoute === 'Imports') {
      navigationRef.current.navigate('Home');
      inform('Home', speechMode);
    }
  };

  const onSwipeRight = () => {
    const currentRoute = navigationRef.current.getCurrentRoute().name;
    if (currentRoute === 'Home') {
      navigationRef.current.navigate('Imports');
      inform('Imports', speechMode);
    } else if (currentRoute === 'List') {
      navigationRef.current.navigate('Home');
      inform('Home', speechMode);
    } else if (currentRoute === 'SoundDetail') {
      navigationRef.current.navigate('List');
      inform('List', speechMode);
    }
  };

  const gestureConfig = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  const handleLongPress = () => {
    setSpeechMode(prevMode => (prevMode === 'talkative' ? 'quiet' : 'talkative'));
    console.log('Speech mode:', speechMode);
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <TouchableWithoutFeedback onLongPress={handleLongPress}>
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
          </Stack.Navigator>
        </GestureRecognizer>
      </TouchableWithoutFeedback>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
