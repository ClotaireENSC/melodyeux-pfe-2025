import React from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Midi } from '@tonejs/midi';

export default function ButtonScreen() {
    const pickDocument = async () => {
        try {
            let result = await DocumentPicker.getDocumentAsync({ type: 'audio/midi' });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                // Read the file content
                const fileUri = result.assets[0].uri;
                const response = await fetch(fileUri);
                const fileContent = await response.arrayBuffer();

                // Parse the MIDI file content to JSON
                let parsedContent;
                try {
                    const midi = new Midi(fileContent);
                    parsedContent = midi.toJSON();
                } catch (error) {
                    console.error('Error parsing MIDI file content to JSON', error);
                    alert('Error parsing MIDI file content to JSON');
                    return;
                }

                // Save the parsed JSON to AsyncStorage
                try {
                    let files = await AsyncStorage.getItem('midiFiles');
                    files = files ? JSON.parse(files) : [];
                    files.push({ name: result.assets[0].name, content: parsedContent });
                    await AsyncStorage.setItem('midiFiles', JSON.stringify(files));
                    alert(`File selected: ${result.assets[0].name}`);
                } catch (error) {
                    console.error('Error saving file', error);
                }
            } else {
                console.log('File selection cancelled');
            }
        } catch (error) {
            console.error('Error picking document', error);
        }
    };

    const clearDatabase = async () => {
        try {
            await AsyncStorage.removeItem('midiFiles');
            alert('Database cleared');
        } catch (error) {
            console.error('Error clearing database', error);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={pickDocument} style={styles.button}>
                <Text style={styles.buttonText}>Pick MIDI File</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearButton} onPress={clearDatabase}>
                <Text style={styles.clearButtonText}>Clear Database</Text>
            </TouchableOpacity>
        </View>
    );
}

export function ListScreen() {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const loadFiles = async () => {
            try {
                const storedFiles = await AsyncStorage.getItem('midiFiles');
                if (storedFiles) {
                    const parsedFiles = JSON.parse(storedFiles);
                    setFiles(parsedFiles);
                    logMidiFiles(parsedFiles);
                }
            } catch (error) {
                console.error('Error loading files', error);
            }
        };

        loadFiles();
    }, []);

    const logMidiFiles = (files) => {
        console.log('MIDI Files JSON:', JSON.stringify(files, null, 2));
    };

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text>{item.name}</Text>
        </View>
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
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    clearButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'red',
        borderRadius: 5,
    },
    clearButtonText: {
        color: '#fff',
        fontSize: 16,
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