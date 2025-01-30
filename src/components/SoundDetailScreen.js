import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getBatchesInfo } from '../utils/tracksManager';
import { batchesToChords } from '../utils/batch_to_chord';
import { sing, inform, stopTalking } from '../utils/speechHandler';

export default function SoundDetailScreen({ route, navigation }) {
    const { item } = route.params;

    inform('SoundDetail', 'talkative');

    const playChords = (chords) => {
        const bpm = Math.floor(item.content.header.tempos[0].bpm);
        const beatsPerChord = chords.beatsPerChord;
        const beatTime = 60 / bpm;
        const chordTime = beatTime * beatsPerChord;
        // play each chord
        stopTalking();
        chords.chords.map(chord => {
            sing(chord.chord, 1);
            setTimeout(() => { }, chordTime * 1000);
        });
    };

    const renderTrack = function ({ item, index }) {
        const notes = item?.notes?.map(note => {
            return {
                name: note?.name,
                time: note?.time,
            };
        });

        return (
            <View style={styles.trackRow}>
                <Text style={styles.trackText}>Track {index + 1}: {item.notes.map(note => (note?.name + ";"))}</Text>
            </View>
        );
    };

    const batches = getBatchesInfo(item);
    console.log(batches.timeSignature);
    const chords = batchesToChords(batches.beats, batches.timeSignature[0].timeSignature);
    console.log(chords.chords.map(chord => chord.chord));
    console.log(chords.chords.length);

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
            <Text style={styles.trackText}>PPQ : {item.content.header.ppq}</Text>
            <Text style={styles.trackText}>EoTT : {item.content.tracks[0].endOfTrackTicks}</Text>
            <TouchableOpacity style={styles.playButton} onPress={() => playChords(chords)}>
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
