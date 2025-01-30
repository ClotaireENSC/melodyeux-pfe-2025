import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { getBatchesInfo } from '../utils/tracksManager';
import { batchesToChords } from '../utils/batch_to_chord';
import { sing, inform, stopTalking } from '../utils/speechHandler';

export default function SoundDetailScreen({ route, navigation }) {
    const { item } = route.params;
    const [currentChord, setCurrentChord] = useState(null);
    const [nextChord, setNextChord] = useState(null);
    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        inform('SoundDetail', 'talkative');
    }, []);

    const playChords = (chords) => {
        const bpm = Math.floor(item.content.header.tempos[0].bpm);
        const beatsPerChord = chords.beatsPerChord;
        const beatTime = 60 / bpm;
        const chordTime = beatTime * beatsPerChord;
        stopTalking();

        chords.chords.forEach((chord, index) => {
            setTimeout(() => {
                setCurrentChord(chord.chord);
                setNextChord(chords.chords[index + 1]?.chord || null);
                sing(chord.chord, 1);
                Animated.timing(progress, {
                    toValue: 1,
                    duration: chordTime * 1000,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }).start(() => {
                    progress.setValue(0);
                });
            }, chordTime * 1000 * index);
        });

        setTimeout(() => {
            setCurrentChord(null);
            setNextChord(null);
        }, chordTime * 1000 * chords.chords.length);
    };

    const renderTrack = function ({ item, index }) {
        return null;
    };

    const batches = getBatchesInfo(item);
    const chords = batchesToChords(batches.beats, batches.timeSignature[0].timeSignature);

    const progressBarWidth = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.playButton} onPress={() => playChords(chords)}>
                <Text style={styles.playButtonText}>Play {item.name}</Text>
            </TouchableOpacity>
            <View style={styles.trackListContainer}>
                <FlatList
                    data={item.content.tracks}
                    renderItem={renderTrack}
                    keyExtractor={(track, index) => index.toString()}
                    contentContainerStyle={styles.trackList}
                />
            </View>
            {currentChord && (
                <View style={styles.karaokeContainer}>
                    <View style={styles.chordsContainer}>
                        <Text style={styles.karaokeText}>{currentChord}</Text>
                        {nextChord && (
                            <Text style={styles.nextKaraokeText}>{nextChord}</Text>
                        )}
                    </View>
                    <View style={styles.progressBarContainer}>
                        <Animated.View style={[styles.progressBar, { width: progressBarWidth }]} />
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
    },
    playButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#007BFF',
        borderRadius: 8,
        margin: 10,
    },
    playButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    trackListContainer: {
        flex: 1,
    },
    trackList: {
        flexGrow: 1,
    },
    karaokeContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 20,
    },
    chordsContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
    },
    karaokeText: {
        fontSize: 90,
        fontWeight: 'bold',
        color: '#007BFF',
        marginBottom: '25%',
    },
    nextKaraokeText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#007BFF',
        opacity: 0.5,
        position: 'absolute',
        right: '20%',
        bottom: 0,
    },
    progressBarContainer: {
        width: '75%',
        height: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        marginTop: 10,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#007BFF',
        borderRadius: 5,
    },
});
