const http = require('http');
const fs = require('fs');
const path = require('path');
const exp = require('constants');

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.headers['content-type'] === 'application/json') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            const midiData = JSON.parse(body);
            console.log('Received MIDI data:', midiData);

            // Simulate processing MIDI data and returning an MP3 file
            const mp3Path = path.join(__dirname, 'sample.mp3');
            fs.access(mp3Path, fs.constants.F_OK, (err) => {
                if (err) {
                    res.statusCode = 404;
                    res.end('MP3 file not found');
                    return;
                }

                const mp3Stream = fs.createReadStream(mp3Path);
                res.writeHead(200, {
                    'Content-Type': 'audio/mpeg',
                    'Content-Disposition': 'attachment; filename="output.mp3"',
                });

                mp3Stream.pipe(res);
            });
        });
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});