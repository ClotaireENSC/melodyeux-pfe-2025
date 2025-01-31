import React, { useEffect, useState, useRef, useContext } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { Audio } from 'expo-av';
import { getBatchesInfo } from '../utils/tracksManager';
import { batchesToChords } from '../utils/batch_to_chord';
import { sing, say, stopTalking } from '../utils/speechHandler';
import { SpeechModeContext } from '../utils/SpeechModeContext';
import { ListenMusicContext } from '../utils/ListenMusicContext';

export default function SoundDetailScreen({ route, navigation }) {
    const { item } = route.params;
    const [currentChord, setCurrentChord] = useState(null);
    const [nextChord, setNextChord] = useState(null);
    const progress = useRef(new Animated.Value(0)).current;
    const { speechMode } = useContext(SpeechModeContext);
    const { listenMusic, setListenMusic } = useContext(ListenMusicContext);
    const timeouts = useRef([]);
    const metronomeSound = useRef(new Audio.Sound());

    useEffect(() => {
        (async () => {
            try {
                await metronomeSound.current.loadAsync(require('../utils/metronome.mp3'));
            } catch (error) {
                console.error("Erreur chargement métronome:", error);
            }
        })();

        //item name without .mid at the end
        const item_name = item.name.slice(0, -4);
        say(item_name + ". Appuyez sur le haut de l'écran pour lancer la transcription audio");

        return () => {
            timeouts.current.forEach(timeout => clearTimeout(timeout));
            setCurrentChord(null);
            setNextChord(null);
            progress.stopAnimation();
            setListenMusic(true);
            metronomeSound.current.unloadAsync();
        };
    }, [speechMode, listenMusic]);

    const playChords = (chords) => {
        const bpm = Math.floor(item.content.header.tempos[0].bpm);
        const beatsPerChord = chords.beatsPerChord;
        const beatTime = 60 / bpm;
        const chordTime = beatTime * beatsPerChord;
        const topSignature = item.content.header.timeSignatures[0].timeSignature[0];
        stopTalking();

        chords.chords.forEach((chord, index) => {
            for (let i = 0; i < beatsPerChord; i++) {
                const metronomeTimeout = setTimeout(async () => {
                    try {
                        await metronomeSound.current.replayAsync();
                    } catch (error) {
                        console.error("Erreur métronome:", error);
                    }
                }, (beatTime * 1000 * i) + (chordTime * 1000 * index));
                timeouts.current.push(metronomeTimeout);
            }

            const chordTimeout = setTimeout(() => {
                setCurrentChord(chord.chord);
                setNextChord(chords.chords[index + 1]?.chord || null);
                sing(chord, chordTime);

                Animated.timing(progress, {
                    toValue: 1,
                    duration: chordTime * 1000,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }).start(() => {
                    progress.setValue(0);
                });
            }, chordTime * 1000 * index);
            timeouts.current.push(chordTimeout);
        });

        const finalTimeout = setTimeout(() => {
            setCurrentChord(null);
            setNextChord(null);
        }, chordTime * 1000 * chords.chords.length);
        timeouts.current.push(finalTimeout);
    };

    const renderTrack = () => null;

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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    playButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#007BFF',
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
