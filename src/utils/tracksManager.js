const getBatchedNotes = function (item) {
    const tracks = item.content.tracks;
    const ppq = item.content.header.ppq * 4 / item.content.header.timeSignatures[0].timeSignature[1];
    const eotts = tracks.map(track => track.endOfTrackTicks);

    const eott = eotts.filter(eott => eott !== undefined)[0];
    const nbBeats = ~~(eott / ppq);

    // console.log('Number of beats:', nbBeats); // Log the nbBeats value

    const batches = new Array(nbBeats + 1).fill(null).map(() => []);

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

const getBatchesInfo = function (item) {
    const out = {
        beats: getBatchedNotes(item),
        timeSignature: item.content.header.timeSignatures
    };
    return out;
}

export { getBatchesInfo };
