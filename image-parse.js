'use strict';

const fs = require('fs');
const getPixels = require('get-pixels');

const colors = [ [0, 0, 0], [255, 255, 255], [170, 170, 170], [85, 85, 85], [254, 211, 199], [255, 196, 206], [250, 172, 142], [255, 139, 131], [244, 67, 54], [233, 30, 99], [226, 102, 158], [156, 39, 176], [103, 58, 183], [63, 81, 181], [0, 70, 112], [5, 113, 151], [33, 150, 243], [0, 188, 212], [59, 229, 219], [151, 253, 220], [22, 115, 0], [55, 169, 60], [137, 230, 66], [215, 255, 7], [255, 246, 209], [248, 203, 140], [255, 235, 59], [255, 193, 7], [255, 152, 0], [255, 87, 34], [184, 63, 39], [121, 85, 72] ];

const findSimilarColor = (r, g, b) => {
  const similarity = ([sr, sg, sb], id) => {
    return [(sr - r) * (sr - r) + (sg - g) * (sg - g) + (sb - b) * (sb - b), id];
  }
  return colors.map(similarity).sort(([a, _], [b, __]) => a - b)[0][1];
}

getPixels(process.argv[2], (err, pixels) => {
  if (err) {
    console.error(err);
    return;
  }

  const w = pixels.shape[0];
  const h = pixels.shape[1];
  const data = [];
  for (let i = 0; i < w; ++ i) {
    const duck = [];
    for (let j = 0; j < h; ++ j) {
      const r = pixels.get(i, j, 0);
      const g = pixels.get(i, j, 1);
      const b = pixels.get(i, j, 2);
      duck.push(findSimilarColor(r, g, b));
    }
    data.push(duck);
  }

  fs.writeFileSync('data.json', JSON.stringify(data.map((line) => line.map((color) => color.toString(36)).join('')), null, 2));
})
