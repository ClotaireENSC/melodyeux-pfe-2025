import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';

export default function ListScreen() {
    const navigation = useNavigation();
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const loadFiles = async () => {
            try {
                const storedFiles = await AsyncStorage.getItem('midiFiles');
                if (storedFiles) {
                    const parsedFiles = JSON.parse(storedFiles);
                    setFiles(parsedFiles);
                    // logMidiFiles(parsedFiles);
                }
            } catch (error) {
                console.error('Error loading files', error);
            }
        };

        loadFiles();
    }, []);

    // Fonction pour vider le AsyncStorage
    // const clearAsyncStorage = async () => {
    //     try {
    //         await AsyncStorage.clear();
    //         console.log('AsyncStorage vidé avec succès');
    //     } catch (error) {
    //         console.error('Erreur lors du vidage de AsyncStorage', error);
    //     }
    // };
    // clearAsyncStorage();

    const logMidiFiles = (files) => {
        console.log('MIDI Files JSON:', JSON.stringify(files, null, 2));
    };
    // logMidiFiles(files);
    const playMidi = async (midiJson) => {
        // Convert MIDI JSON to audio file (this step requires a server-side conversion or a different approach)
        // For simplicity, let's assume you have a URL to an audio file
        const audioUri = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

        const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
        await sound.playAsync();
    };

    const renderItem = ({ item }) => (
        // <TouchableOpacity style={styles.item} onPress={() => playMidi(item.content)}>
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('SoundDetail')}>
            <Text>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={files}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    list: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center',
    },
});