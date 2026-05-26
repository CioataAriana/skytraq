import selfsigned from 'selfsigned';
import fs from 'fs';

// Generate a certificate for your specific local IP
const attrs = [{ name: 'commonName', value: '192.168.1.133' }];

// ✨ THE FIX: Add "await" right here so Node waits for it to finish!
const pems = await selfsigned.generate(attrs, { days: 365 });

// Save the files to your backend folder
fs.writeFileSync('server.crt', pems.cert);
fs.writeFileSync('server.key', pems.private);

console.log('✅ Certificates generated successfully!');