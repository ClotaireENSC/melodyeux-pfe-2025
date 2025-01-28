
const pitches = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const known_chords = {};
const chord_types = {
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
    Object.keys(chord_types).forEach(type => {
        const chord_name = pitch + type;
        known_chords[chord_name] = chord_types[type].map(interval => pitches[(pitches.indexOf(pitch) + interval) % pitches.length]);
    });
});
console.log(known_chords);

/////////////////////// METHODS ///////////////////////

function generateRandomBatch() {
    const velocities = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
    const batch = [];
    for (let i = 0; i < 20; i++) {
        const pitch = pitches[Math.floor(Math.random() * pitches.length)];
        const velocity = velocities[Math.floor(Math.random() * velocities.length)];
        batch.push({ name: pitch + '5', velocity: velocity });
    }
    return batch;
}
function extractPitches(batch) {
    // We extract the pitches wich is all the string except the last character (octave)
    const pitches = batch.map((note) => ({
        name: note.name.slice(0, -1),
        velocity: note.velocity
    }));
    return pitches;
}
// Needs batch to have pitches extracted from the names
function batchToChord(batch) {
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


/////////////////////// EXAMPLE ///////////////////////


// We generate 10 random batches
const batches = Array.from({ length: 10 }, generateRandomBatch);
batches.map(batch => {
    console.log(batch);
});
console.log("----");
batches.map(batch => {
    console.log(batchToChord(extractPitches(batch)));
});