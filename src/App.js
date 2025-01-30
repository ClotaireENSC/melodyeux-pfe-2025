import React, { useState, useRef, useContext } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { inform } from './utils/speechHandler';
import { SpeechModeProvider, SpeechModeContext } from './utils/SpeechModeContext';
import { ListenMusicProvider, ListenMusicContext } from './utils/ListenMusicContext';
import HomeScreen from './components/HomeScreen';
import ListScreen from './components/ListScreen';
import ButtonScreen from './components/ButtonScreen';
import SoundDetailScreen from './components/SoundDetailScreen';

const Stack = createStackNavigator();

function App() {
  const navigationRef = useRef();
  const { speechMode, setSpeechMode } = useContext(SpeechModeContext);
  const { listenMusic, setListenMusic } = useContext(ListenMusicContext);
  const [longPressFeedback, setLongPressFeedback] = useState(false);

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
    }
  };

  const handleRightClick = () => {
    onSwipeLeft();
  };

  const handleLeftClick = () => {
    onSwipeRight();
  };

  const handleLongPress = () => {
    setSpeechMode(prevMode => (prevMode === 'talkative' ? 'quiet' : 'talkative'));
    setLongPressFeedback(true);
    setTimeout(() => setLongPressFeedback(false), 1000); // Hide feedback after 1 second
    console.log('Speech mode:', speechMode);
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity style={styles.leftClickArea} onPress={handleLeftClick} />
        <TouchableOpacity style={styles.rightClickArea} onPress={handleRightClick} />
        <TouchableWithoutFeedback onLongPress={handleLongPress}>
          <View style={styles.container}>
            {longPressFeedback && <Text style={styles.feedbackText}>Mode changé: {speechMode}</Text>}
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="List" component={ListScreen} />
              <Stack.Screen name="Imports" component={ButtonScreen} />
              <Stack.Screen name="SoundDetail" component={SoundDetailScreen} />
            </Stack.Navigator>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </NavigationContainer>
  );
}

export default function Main() {
  return (
    <SpeechModeProvider>
      <ListenMusicProvider>
        <App />
      </ListenMusicProvider>
    </SpeechModeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  leftClickArea: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: "10%", // Ajustez la largeur selon vos besoins
    zIndex: 1,
  },
  rightClickArea: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: "10%", // Ajustez la largeur selon vos besoins
    zIndex: 1,
  },
  feedbackText: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    padding: 10,
    zIndex: 1,
  },
});
