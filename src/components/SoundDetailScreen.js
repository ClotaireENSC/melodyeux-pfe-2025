import React, { useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function SoundDetailScreen(item) {
    const playMidi = async (midiJson) => {
        // Convert MIDI JSON to audio file (this step requires a server-side conversion or a different approach)
        // For simplicity, let's assume you have a URL to an audio file
        const audioUri = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

        const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
        await sound.playAsync();
    };
    console.log(item);
    return (
        <View style={styles.container}>
            <Text>{item.name}</Text>
            <TouchableOpacity style={styles.item} onPress={() => playMidi(item.content)}>
                <Text>Play</Text>
            </TouchableOpacity>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
});