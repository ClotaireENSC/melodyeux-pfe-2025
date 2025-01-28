import React, { useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getBatchedNotes } from '../utils/tracksManager';
import { batchesToChords } from '../utils/batch_to_chord';

export default function SoundDetailScreen({ route }) {
    const { item } = route.params.item;

    const playMidi = async (midiJson) => {
        // Convert MIDI JSON to audio file (this step requires a server-side conversion or a different approach)
        // For simplicity, let's assume you have a URL to an audio file
        const audioUri = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

        const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
        await sound.playAsync();
    };

    const renderTrack = function ({ item, index }) {
        const notes = item?.notes?.map(note => {
            return {
                name: note?.name,
                time: note?.time,
            };
        });
        // console.log(notes);

        return (
            <View style={styles.trackRow}>
                {/* <Text style={styles.trackText}>Track {index + 1}: {Object.keys(item.notes?.[0]).map(i => (i + ";"))}</Text> */}
                {/* <Text style={styles.trackText}>Track {index + 1}: {item.notes.map(note => (note?.name + ";"))}</Text> */}
                {/* <Text style={styles.trackText}>Track {index + 1}: {item.notes.length} notes</Text> */}
            </View>
        );
    };

    const batches = getBatchedNotes(item);
    // console.log(batches);
    const chords = batchesToChords(batches);
    console.log(chords);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{item.name}</Text>
            <FlatList
                data={item.content.tracks}
                renderItem={renderTrack}
                keyExtractor={(track, index) => index.toString()}
                contentContainerStyle={styles.trackList}
            />
            <Text style={styles.trackText}>Tempo (bpm): {item.content.header.tempos[0].bpm} à {item.content.header.tempos[0].ticks} ticks</Text>
            {/* <Text style={styles.trackText}>Tempo (bpm): {item.content.header.tempos[1].bpm} à {item.content.header.tempos[1].ticks} ticks</Text>
            <Text style={styles.trackText}>Tempo (bpm): {item.content.header.tempos[2].bpm} à {item.content.header.tempos[2].ticks} ticks</Text> */}
            <Text style={styles.trackText}>PPQ : {item.content.header.ppq}</Text>
            <Text style={styles.trackText}>EoTT : {item.content.tracks[0].endOfTrackTicks}</Text>
            <Text style={styles.trackText}>EoTT : {item.content.tracks[1].endOfTrackTicks}</Text>
            {/* <Text style={styles.trackText}>PPQ : {Object.keys(item.content.tracks[0].endOfTrackTicks).map(i => (i + ";"))}</Text> */}
            <TouchableOpacity style={styles.playButton} onPress={() => playMidi(item.content)}>
                <Text style={styles.playButtonText}>Play</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    trackList: {
        flexGrow: 1,
    },
    trackRow: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    trackText: {
        fontSize: 16,
    },
    playButton: {
        padding: 16,
        backgroundColor: '#007BFF',
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    playButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});