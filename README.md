# luogu-paint-bot

**使用方式**

1. 下载源码

   ```bash
   git clone https://github.com/sxyz-edu/luogu-paint-bot
   cd luogu-paint-bot
   npm install --registry=https://registry.npm.taobao.org
   ```

2. 编译图片

   ```bash
   node image-parse.js wzp-small.jpg
   ```

   将会把 `wzp-small.jpg` 编译生成一个 `data.json` 文件。
   注意原图像素，脚本不做缩放处理。

3. 修改位置

   打开 `app.js`，更改第 3 至 4 行即可。
   `offsetX` 是水平偏移，`offsetY` 是垂直偏移。

4. 生成脚本

   ```bash
   npm run build
   ```

   如果脚本生成成功，那么你就可以直接将 `dist/test.min.js` 文件散布开去了。

**怎么用这个生成的脚本**

1. 复制这份脚本；
2. 在洛谷随便一个什么地方（最好是首页）打开控制台（`Ctrl+Shift+I`），粘贴脚本并按回车运行；
3. 脚本会自动进行绘制和维护，但请**偶尔检查一下脚本运行情况**，必要时刷新页面重新运行脚本。

