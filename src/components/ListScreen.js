import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

export default function ListScreen() {
    const [files, setFiles] = useState([]);
    const [sound, setSound] = useState(null);

    useEffect(() => {
        const loadFiles = async () => {
            try {
                let storedFiles = await AsyncStorage.getItem('midiFiles');
                storedFiles = storedFiles ? JSON.parse(storedFiles) : [];
                setFiles(storedFiles);
            } catch (error) {
                console.error('Error loading files', error);
            }
        };

        loadFiles();

        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    const playSound = async (uri) => {
        if (sound) {
            await sound.unloadAsync();
        }

        const { sound: newSound } = await Audio.Sound.createAsync({ uri });
        setSound(newSound);
        await newSound.playAsync();
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => playSound(item.uri)}>
            <View style={styles.item}>
                <Text>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={files}
                keyExtractor={(item) => item.uri}
                renderItem={renderItem}
                ListEmptyComponent={<Text>No files selected</Text>}
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
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center',
    },
});