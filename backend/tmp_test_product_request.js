import http from 'http';

const data = JSON.stringify({ nombre: 'Prueba', descripcion: 'Prueba', precio: 5.5, stock: 10, imagen: '' });

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/products',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};

const req = http.request(options, (res) => {
  console.log('STATUS', res.statusCode);
  let body = '';
  res.on('data', (chunk) => { body += chunk.toString(); });
  res.on('end', () => { console.log('BODY', body); });
});

req.on('error', (err) => {
  console.error('REQUEST ERROR', err.message);
});
req.write(data);
req.end();
