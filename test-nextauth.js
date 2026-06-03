const { authOptions } = require('./src/lib/auth');

console.log('NextAuth authOptions loaded successfully!');
console.log('Providers:', authOptions.providers.map(p => p.id));
console.log('Adapter:', typeof authOptions.adapter);
console.log('Secret:', authOptions.secret ? 'configured' : 'missing');
