// SpeechHandler.js
import * as Speech from 'expo-speech';

const speechTexts = {
    Home: 'Vous êtes sur la page d\'accueil. Glissez vers la gauche pour afficher la liste des éléments, ou glissez vers la droite pour afficher la page des imports.',
    List: 'Voici la liste des éléments. Glissez vers le haut pour faire défiler les musiques importées.',
    Imports: 'Ceci est la page des imports.',
    SoundDetail: 'Détails du son sélectionné.',
    TrackScreen: 'Ceci est la page de suivi.',
};

const speak = (page) => {
    const text = speechTexts[page];
    if (text) {
        Speech.stop(); // Stop any ongoing speech
        Speech.speak(text);
    } else {
        console.warn(`Aucun texte de discours trouvé pour la page: ${page}`);
    }
};

export default speak;