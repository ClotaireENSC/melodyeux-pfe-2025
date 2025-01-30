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
        talkative: "Détails du son sélectionné. Appuyez sur le haut de l'écran pour lancer la transcription audio",
        strict: 'Détails du son.',
    },
};

const inform = (page, mode = 'talkative') => {
    const text = speechTexts[page] ? speechTexts[page][mode] : null;
    Speech.stop();
    if (text) {
        Speech.speak(text);
    } else {
        Speech.speak(page);
    }
};

const sing = (chord, rate) => {
    const parsedChord = parseChord(chord.chord);
    Speech.speak(parsedChord, { pitch: chord.velocity, rate: rate });
};

const parseChord = function (chord) {

    const matches = {
        "C": "Do",
        "D": "Ré",
        "E": "Mi",
        "F": "Fa",
        "G": "Sol",
        "A": "La",
        "B": "Si",
        "#": "dièse",
        "min": "mineur",
        "min7": "mineur 7",
        "maj7": "majeur 7",
        "7": "7",
        "m7b5": "mineur 7 b5",
        "dim7": "dim 7",
        "sus4": "susse 4",
        "6": "6",
        "2": "2",
        "silence": "silence"
    };

    let pitch = '';
    let type = '';

    for (const [key, value] of Object.entries(matches)) {
        if (chord.includes(key)) {
            if (['C', 'D', 'E', 'F', 'G', 'A', 'B', '#'].includes(key)) {
                pitch = value; // Assign directly to avoid duplicates
            } else {
                type = value; // Assign directly to avoid duplicates
            }
        }
    }

    pitch = pitch.trim();
    type = type.trim();

    const parsedChord = `${pitch} ${type}`.trim();

    return parsedChord;
}


const stopTalking = () => {
    Speech.stop();
}

export { inform };
export { sing };
export { stopTalking };