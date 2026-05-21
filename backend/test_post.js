const http = require('http');

const data = JSON.stringify({
    title: 'Test Case from Node',
    date: '2026-03-15',
    location: 'Mumbai Court'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/hearings/add',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
