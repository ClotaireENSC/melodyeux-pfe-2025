// SpeechHandler.js
import * as Speech from 'expo-speech';

const speechTexts = {
    Home: {
        talkative: 'Page d\'accueil. Glissez vers la gauche pour afficher la liste des éléments, ou glissez vers la droite pour afficher la page des imports.',
        strict: 'Page d\'accueil.',
    },
    List: {
        talkative: "Liste des éléments. Glissez vers le haut pour faire défiler les musiques importées. Appuyez sur l'écran pour jouer le morceau.",
        strict: 'Liste des éléments.',
    },
    Imports: {
        talkative: "Page des imports. Vous pouvez importer de nouvelles musiques en appuyant sur le haut de l'écran.",
        strict: 'Page des imports.',
    },
    SoundDetail: {
        talkative: "Détails du son sélectionné. Appuyez sur le bas de l'écran pour lancer la transcription audio",
        strict: 'Détails du son.',
    },
};

const inform = (page, mode = 'talkative') => {
    const text = speechTexts[page] ? speechTexts[page][mode] : null;
    if (text) {
        Speech.stop();
        Speech.speak(text);
    } else {
        Speech.speak(page);
    }
};

const sing = (chord, rate) => {
    Speech.speak(chord, { rate: rate });
};

const stopTalking = () => {
    Speech.stop();
}

export { inform };
export { sing };
export { stopTalking };