import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
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
                }
            } catch (error) {
                console.error('Error loading files', error);
            }
        };

        loadFiles();
    }, []);

    const playMidi = async (midiJson) => {
        const audioUri = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
        const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
        await sound.playAsync();
    };

    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('SoundDetail', { item })}>
                <Text style={styles.itemText}>{item.name} [{index}]</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={files}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                pagingEnabled
            />
        </View>
    );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    list: {
        flexGrow: 1,
    },
    item: {
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});
