
const pitches = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const known_chords = {};
const chord_types = {
    'min': [0, 3, 7],
    'maj7': [0, 4, 7, 11],
    'min7': [0, 3, 7, 10],
    '7': [0, 4, 7, 10],
    'm7b5': [0, 3, 6, 10],
    'dim7': [0, 3, 6, 9],
    'sus4': [0, 5, 7, 10],
    '6': [0, 4, 7, 9],
    '2': [0, 2, 7, 9]
};
pitches.forEach(pitch => {
    known_chords[pitch] = [pitch, pitches[(pitches.indexOf(pitch) + 4) % pitches.length], pitches[(pitches.indexOf(pitch) + 7) % pitches.length]];
    Object.keys(chord_types).forEach(type => {
        const chord_name = pitch + type;
        known_chords[chord_name] = chord_types[type].map(interval => pitches[(pitches.indexOf(pitch) + interval) % pitches.length]);
    });
});
// For easier comparison, we sort the notes of each chord
for (const chord in known_chords) {
    known_chords[chord] = known_chords[chord].sort();
}
console.log(known_chords);

/////////////////////// METHODS ///////////////////////

function generateRandomBatch() {
    ///// A batch is under the form [{name: 'C5', velocity: 0.5}, ...] /////

    const velocities = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
    const batch = [];
    const nb_notes = Math.floor(Math.random() * 15) + 1;
    for (let i = 0; i < nb_notes; i++) {
        const pitch = pitches[Math.floor(Math.random() * pitches.length)];
        const velocity = velocities[Math.floor(Math.random() * velocities.length)];
        batch.push({ name: pitch + '5', velocity: velocity });
    }
    return batch;
}

function extractPitchFromChord(chord) {
    ///// We transform something like 'A#min7' to 'A#'  /////

    return chord.match(/[A-G]#?/)[0];
}

function extractPitches(batch) {
    ///// The result is under the form [{name: 'C', velocity: 0.5}, ...] /////

    // We extract the pitches wich is all the string except the last character (octave)
    const pitches = batch.map((note) => ({
        name: note.name.slice(0, -1),
        velocity: note.velocity
    }));
    return pitches;
}
// Needs batch to have pitches extracted from the names
function batchToMostFrequentNotes(batch) {
    ///// The chord is under the form {notes: ['C', 'E', 'G'], velocity: 0.5} /////

    // We calculate the mean velocity of the chord
    const velocity = batch.reduce((acc, note) => acc + note.velocity, 0) / batch.length;
    // For each pitch, we count the number of occurences
    const pitches_count = batch.reduce((acc, note) => {
        acc[note.name] = (acc[note.name] || 0) + 1;
        return acc;
    }, {});
    // We only keep the 4 most common notes. If equal, we use velocity to sort them
    const notes = Object.keys(pitches_count).sort((a, b) => pitches_count[b] - pitches_count[a] || batch.find(note => note.name === b).velocity - batch.find(note => note.name === a).velocity).slice(0, 4);
    return { notes, velocity };
}

// Needs an input from batchToMostFrequentNotes. notes is under the form ['C', 'E', 'G']
function mostFrequentNotesToChord(notes) {
    ///// The chord is one of the keys of known_chords /////

    if (notes.length === 0) {
        return "silence";
    }

    // We first sort the notes
    notes = notes.sort();
    similarities = [];
    // We check if the chord is known
    for (const chord in known_chords) {
        // chord is under the form 'Cmaj7' and known_chords[chord] is under the form ['C', 'E', 'G', 'B']
        if (known_chords[chord].every((note, i) => note === notes[i])) {
            return chord;
        }
        // Calculate the similarity between the chord and the notes using the number of common notes
        var similarity = 0;
        similarity += known_chords[chord].filter(note => notes.includes(note)).length;
        // We also upgrade the similarity if the notes contain the root of the chord
        const root = extractPitchFromChord(chord);
        similarity += notes.includes(root);
        // Another bonus is given depending on the size of the chord and the number of notes
        // The bigger the difference, the lower the bonus. We only use integers though
        similarity += 4 - Math.abs(known_chords[chord].length - notes.length);
        similarities.push({ chord, similarity });
    }
    // We sort the similarities by number of common notes
    similarities.sort((a, b) => b.similarity - a.similarity);
    // We return the chord with the most common notes
    return similarities[0].chord;
}

function getBeatsPerChord(timeSignature) {
    // We first decide how many beats we will have for each chord depending on the time signature
    let beatsPerChord;
    switch (timeSignature.join('/')) {
        case '2/2':
            beatsPerChord = 1;
            break;
        case '2/4':
            beatsPerChord = 1;
            break;
        case '4/4':
            beatsPerChord = 2;
            break;
        case '6/4':
            beatsPerChord = 2;
            break;
        case '6/8':
            beatsPerChord = 3;
            break;
        case '9/8':
            beatsPerChord = 3;
            break;
        case '12/8':
            beatsPerChord = 6;
            break;
        default:
            beatsPerChord = 1; // Default to 4/4 if time signature is not recognized
    }
    return beatsPerChord;
}

function batchesToChords(batches, timeSignature = [4, 4]) {
    // Each batch corresponds to a group of all the notes in a beat
    beatsPerChord = getBeatsPerChord(timeSignature);
    // We create new batches with the notes grouped by beat depending on the number of beats per chord
    // Ex : beatsPerChord = 2, batches = [['C#', 'D'], ['G'], ...] => newBatches = [['C#', 'D', 'G'], ...] with half the size
    const newBatches = [];
    for (let i = 0; i < batches.length; i += beatsPerChord) {
        newBatches.push(batches.slice(i, i + beatsPerChord).flat());
    }

    // We go through all the batches beat by beat
    return {
        beatsPerChord: beatsPerChord,
        chords: newBatches.map(batch => {
            // console.log("batch", batch);
            const pitches = extractPitches(batch);
            // console.log("pitches", pitches);
            const mostFrequentNotes = batchToMostFrequentNotes(pitches);
            // console.log("mostFrequentNotes", mostFrequentNotes);
            const chord = mostFrequentNotesToChord(mostFrequentNotes.notes);
            // console.log("chord", chord);
            if (chord === "silence") {
                return { chord: chord, velocity: -1 };
            }
            return { chord: chord, velocity: mostFrequentNotes.velocity };
        })
    }
};

/////////////////////// EXAMPLE ///////////////////////


// We generate 10 random batches
const batches = Array.from({ length: 10 }, generateRandomBatch);
// batches.map(batch => {
//     console.log(batch);
// });
// console.log("----");
// console.log(batchesToChords(batches));
batchesToChords(batches);
export { batchesToChords };