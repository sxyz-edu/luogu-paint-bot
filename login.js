const cookies = require('./cookies.json');

const accounts = cookies.map((cookie) => {
  const keys = [];
  const cakes = [];
  for (const key in cookie) {
    keys.push(key);
    cakes.push(key + '=' + cookie[key]);
  }
  return () => {
    for (const key of keys) {
      // console.log(key + '=;path=/;domain=.luogu.org');
      document.cookie = key + '=;path=/;domain=.luogu.org';
    }
    for (const cake of cakes) {
      // console.log(cake + ';path=/;domain=.luogu.org');
      document.cookie = cake + ';path=/;domain=.luogu.org';
    }
  }
})

module.exports = accounts;
