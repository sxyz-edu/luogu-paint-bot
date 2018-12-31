# luogu-paint-bot

**使用方式**

1. 下载源码

   ```bash
   git clone https://github.com/sxyz-edu/luogu-paint-bot
   cd luogu-paint-bot
   git checkout manyuser
   npm install --registry=https://registry.npm.taobao.org
   ```

2. 编译图片

   ```bash
   node image-parse.js wzp-small.jpg
   ```

   将会把 `wzp-small.jpg` 编译生成一个 `data.json` 文件。
   注意原图像素，脚本不做缩放处理。

3. 编译 Cookie

   新建一个 `cookies.txt` 文件，按照如下方式写入 cookie：

   ```plain
   __client_id=xxxxx; UM_distinctid=xxx-xxx-xxx; _uid=xxxx
   __client_id=xxxxx; UM_distinctid=xxx-xxx-xxx; _uid=xxxx
   __client_id=xxxxx; UM_distinctid=xxx-xxx-xxx; _uid=xxxx
   ```

   注意 `.gitignore` 会忽略这个文件，请妥善保管！！

4. 修改绘制位置

   打开 `app.js`，更改第 3 至 4 行即可。
   `offsetX` 是水平偏移，`offsetY` 是垂直偏移。

5. 生成脚本

   ```bash
   npm run build
   ```

6. 工作

   - 使用浏览器隐身窗口打开洛谷首页；
   - 使用插件将 `__client_id` Cookie 的 `HttpOnly` 选项去掉；
   - 粘贴脚本并运行。
