'use strict';

const offsetX = 423;
const offsetY = 75;

const get = (url) => {
  return new Promise((resolve, reject) => {
    $.get(url, (res) => {
      resolve(res);
    });
  })
}
const post = (url, body) => {
  return new Promise((resolve, reject) => {
    $.post(url, body, (res) => {
      resolve(res);
    });
  })
}

const tasklist = [];

const run = async () => {

  const image = require('./data.json');
  const w = image.length;
  const h = image[0].length;

  console.log(`[INFO] Image parsed, w: ${w}, h: ${h}`);

  const board = (await get('https://www.luogu.org/paintBoard/board'))
    .split('\n').map((str) => str.split([]).map((hex) => parseInt(hex, 36)));

  console.log(`[INFO] Board got, w: ${board.length}, h: ${board[0].length}`);

  for (let i = 0; i < w; ++ i) {
    for (let j = 0; j < h; ++ j) {
      if (board[i + offsetX][j + offsetY] !== image[i][j]) {
        tasklist.push([i, j]);
      }
    }
  }

  console.log(`[INFO] Find ${tasklist.length} differences`);

  const ws = new WebSocket('wss://ws.luogu.org/ws');
  ws.onopen = () => {
    console.log('[INFO] Connected to WebSocket');
    const message = {
      type: 'join_channel',
      channel: 'paintboard',
      channel_param: ''
    };
    ws.send(JSON.stringify(message));
  }
  ws.onmessage = (res) => {
    const data = JSON.parse(res.data);
    if (data.type === 'paintboard_update') {
      const { x, y, color } = data;
      board[x][y] = color;
      const ix = x - offsetX;
      const iy = y - offsetY;
      if (ix < 0 || ix >= w || iy < 0 || iy >= h) {
        // console.log('{PROC} not concerned update', x, y);
        return;
      }
      if (image[ix][iy] === color) {
        console.log('[PROC] Yes, it truly fixed');
      } else {
        tasklist.push(x, y);
        console.log(`[PROC] ${x} ${y} has changed to ${color}, fixing...`);
      }
    }
  }
  ws.onclose = (err) => {
    console.error('[ERRO] WebSocket closed');
  }

  const paint = () => {
    let x, y, color = -1;
    while (tasklist.length) {
      [x, y] = tasklist.shift();
      color = image[x][y];
      if (board[x + offsetX][y + offsetY] === color) {
        console.log(`[PROC] already fixed ${x + offsetX} ${y + offsetY}`);
        color = -1;
        continue;
      }
      x += offsetX;
      y += offsetY;
      break;
    }
    if (color === -1) {
      console.log('[PROC] no task');
      return;
    }
    console.log(`[PROC] fixing ${x} ${y} ${color}`);
    post('https://www.luogu.org/paintBoard/paint', { x, y, color })
    .then((data) => {
      console.log(data);
      if (data.status !== 200) {
        console.error('[ERRO] ' + data.data);
      } else {
        console.log(`[PROC] fixed ${x} ${y} to ${color}`);
      }
    }, console.error);
    setTimeout(paint, 31000);
  }

  paint();
}
run();
