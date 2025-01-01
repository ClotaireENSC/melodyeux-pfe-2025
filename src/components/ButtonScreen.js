import React from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ButtonScreen() {
    const pickDocument = async () => {
        try {
            let result = await DocumentPicker.getDocumentAsync({ type: 'audio/midi' });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                // Save the selected file to AsyncStorage
                try {
                    let files = await AsyncStorage.getItem('midiFiles');
                    files = files ? JSON.parse(files) : [];
                    files.push(result.assets[0]);
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
            <Button title="Choose File" onPress={pickDocument} />
            <TouchableOpacity style={styles.clearButton} onPress={clearDatabase}>
                <Text style={styles.clearButtonText}>Clear Database</Text>
            </TouchableOpacity>
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
    clearButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'red',
        borderRadius: 5,
    },
    clearButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});