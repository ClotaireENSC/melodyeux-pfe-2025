const http = require('http');
const fs = require('fs');

const midiData = {
    // Example MIDI data
    notes: [
        { note: 'C4', duration: '4n' },
        { note: 'E4', duration: '4n' },
        { note: 'G4', duration: '4n' },
    ],
};

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(midiData)),
    },
};

const req = http.request(options, (res) => {
    const filePath = 'output.mp3';
    const fileStream = fs.createWriteStream(filePath);

    res.on('data', (chunk) => {
        fileStream.write(chunk);
    });

    res.on('end', () => {
        fileStream.end();
        console.log(`MP3 file saved as ${filePath}`);
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.write(JSON.stringify(midiData));
req.end();