// SpeechHandler.js
import * as Speech from 'expo-speech';

const speechTexts = {
    Home: 'Bienvenue sur la page d\'accueil!',
    List: 'Voici la liste des éléments.',
    Imports: 'Ceci est la page des imports.',
    SoundDetail: 'Détails du son sélectionné.',
    TrackScreen: 'Ceci est la page de suivi.',
    // Ajoutez plus de pages et leurs textes respectifs ici
};

const speak = (page) => {
    const text = speechTexts[page];
    if (text) {
        Speech.speak(text);
    } else {
        console.warn(`Aucun texte de discours trouvé pour la page: ${page}`);
    }
};

export default speak;