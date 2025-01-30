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

const sing = (chord, chordTime) => {
    const parsedChord = parseChord(chord.chord);
    const rate = Math.max(parsedChord["syllabes"] / 4 * chordTime, 1);

    Speech.speak(parsedChord["text"], { rate: rate });
};

const parseChord = function (chord) {
    const matches = {
        "C": { text: "Do", syllabes: 1 },
        "D": { text: "Ré", syllabes: 1 },
        "E": { text: "Mi", syllabes: 1 },
        "F": { text: "Fa", syllabes: 1 },
        "G": { text: "Sol", syllabes: 1 },
        "A": { text: "La", syllabes: 1 },
        "B": { text: "Si", syllabes: 1 },
        "#": { text: " dièse", syllabes: 2 },
        "min": { text: " mineur", syllabes: 2 },
        "min7": { text: " mineur 7", syllabes: 3 },
        "maj7": { text: " majeur 7", syllabes: 3 },
        "7": { text: " 7", syllabes: 1 },
        "m7b5": { text: " mineur 7 bémol 5", syllabes: 6 },
        "dim7": { text: " dim 7", syllabes: 2 },
        "sus4": { text: " susse 4", syllabes: 2 },
        "6": { text: " 6", syllabes: 1 },
        "2": { text: " 2", syllabes: 1 },
        "silence": { text: " silence", syllabes: 2 }
    };

    let pitch = '';
    let type = '';
    let syllabes = 0;

    for (const [key, value] of Object.entries(matches)) {
        if (chord.includes(key)) {
            if (['C', 'D', 'E', 'F', 'G', 'A', 'B'].includes(key)) {
                pitch = value.text; // Assign directly to avoid duplicates
                syllabes += value.syllabes;
            } else if (key === '#') {
                pitch += value.text; // Append to pitch for sharp notes
                syllabes += value.syllabes;
            } else {
                type = value.text; // Assign directly to avoid duplicates
                syllabes += value.syllabes;
            }
        }
    }

    pitch = pitch.trim();
    type = type.trim();

    const result = `${pitch}${type}`.trim();
    console.log(result);
    return { text: result, syllabes: syllabes };
};

const stopTalking = () => {
    Speech.stop();
}

export { inform };
export { sing };
export { stopTalking };