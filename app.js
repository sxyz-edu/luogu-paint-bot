'use strict';

const offsetX = 0;
const offsetY = 0;

const randomElement = (arr) => {
  if (!arr.length) {
    return null;
  }

  return arr[Math.floor(Math.random() * arr.length)];
}

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

const run = (fakeBoard) => {

  const image = require('./data.json').map((str) => str.split([]).map((hex) => parseInt(hex, 36)));
  const w = image.length;
  const h = image[0].length;

  console.log(`[INFO] Image parsed, w: ${w}, h: ${h}`);

  const board = fakeBoard.trim().split('\n').map((str) => str.split([]).map((hex) => parseInt(hex, 36)));

  console.log(`[INFO] Board got, w: ${board.length}, h: ${board[0].length}`);

  const findDiff = () => {
    const tasklist = [];
    for (let i = 0; i < w; ++ i) {
      for (let j = 0; j < h; ++ j) {
        if (board[i + offsetX][j + offsetY] !== image[i][j]) {
          if (i === 0 || j === 0 || i === w - 1 || j === h - 1) {
            console.log(`[DIFF] Border first`);
            return [[i, j]];
          }
          tasklist.push([i, j]);
        }
      }
    }
    console.log(`[DIFF] Found ${tasklist.length} differences`);
    return tasklist;
  }

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
        // not concerned update
        return;
      }
      if (image[ix][iy] === color) {
        console.log('[TEAM] Teammate found');
      } else {
        console.log('[TEAM] Enemy found');
      }
    }
  }
  ws.onclose = (err) => {
    console.error('[ERRO] WebSocket closed');
  }

  const paint = () => {
    const task = randomElement(findDiff());

    if (!task) {
      console.log('[PROC] Nothing to do with');
      // retry 10s later
      setTimeout(paint, 10000);
      return;
    }
    const ix = task[0], iy = task[1];
    const color = image[ix][iy];
    const x = ix + offsetX, y = iy + offsetY;

    console.log(`[PROC] Fixing ${x} ${y} to ${color}`);

    post('https://www.luogu.org/paintBoard/paint', { x, y, color })
      .then((data) => {
        if (data.status !== 200) {
          console.error(`[PROC] Request status ${data.status}`);
          console.error('[ERRO] ' + data.data);
          // retry 10s later
          setTimeout(paint, 10000);
        } else {
          console.log(`[PROC] Request status ${data.status}`);
          console.log(`[PROC] Fixed ${x} ${y} to ${color}`);
          // retry 30s later
          setTimeout(paint, 31000);
        }
      }, (err) => {
        console.error('[ERRO] ' + err);
        // retry 10s later
        setTimeout(paint, 10000);
      });
  }

  paint();
}

get('https://www.luogu.org/paintBoard/board')
  .then(run, console.error);
