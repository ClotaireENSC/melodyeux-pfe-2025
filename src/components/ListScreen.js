import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { ListenMusicContext } from '../utils/ListenMusicContext';

export default function ListScreen() {
    const navigation = useNavigation();
    const [files, setFiles] = useState([]);
    const { setListenMusic } = useContext(ListenMusicContext);

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

        // Set listenMusic to false when the component is mounted
        setListenMusic(false);
    }, [setListenMusic]);

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
