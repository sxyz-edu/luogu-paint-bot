const fs = require('fs');

const cookie = fs.readFileSync('cookies.txt', 'utf8');
const data = cookie.trim().split('\n').map(str => str.trim().split('; ').reduce((obj, kv) => {
  const key = kv.slice(0, kv.indexOf('='));
  const value = kv.slice(kv.indexOf('=') + 1);
  obj[key] = value;
  return obj;
}, Object.create(null)));

fs.writeFileSync('cookies.json', JSON.stringify(data, null, 2));
