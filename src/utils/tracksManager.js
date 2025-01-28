const getBatchedNotes = function (item) {
    const tracks = item.content.tracks;
    const ppq = item.content.header.ppq;
    const eotts = tracks.map(track => track.endOfTrackTicks);

    const eott = eotts.filter(eott => eott !== undefined)[0];
    const nbBeats = eott / ppq;

    const batches = new Array(nbBeats).fill(null).map(() => []);

    tracks.forEach(track => {
        track.notes.forEach(note => {
            const beats = getNoteBeats(note, ppq);
            beats.forEach(beat => {
                batches[beat].push({
                    name: note.name,
                    velocity: note.velocity,
                    durationTicks: note.durationTicks
                });
            });
        });
    });

    return batches;
}

const getNoteBeats = function (note, ppq) {
    const beats = [];
    for (let i = note.ticks; i < note.ticks + note.durationTicks; i += ppq) {
        beats.push(~~(i / ppq));
    }

    return beats;
}

export { getBatchedNotes };
