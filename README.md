# Pre-Fetch Plugin

Pre-Fetch Plugin 是一个为 Vite 和 Webpack 设计的插件，用于在页面加载时预先获取数据，从而提高应用性能。

## 安装

使用 npm 安装插件：

```bash
npm install pre-fetch-plugin
```

## 使用方法

### Vite

在您的 `vite.config.ts` 文件中：

```typescript
import { defineConfig } from 'vite';
import { createVitePlugin } from 'pre-fetch-plugin';
export default defineConfig({
    plugins: [
        createVitePlugin({
            options: [
                {
                    pathList: ['/home', '/user'],
                    hashList: ['all'],
                    reqs: [
                        {
                            key: 'userInfo',
                            method: 'GET',
                            url: '/api/user',
                            queryParams: { id: 'userId' },
                            cookieParams: { token: 'authToken' },
                            staticParams: { version: '1.0' }
                        }
                    ]
                }
            ]
        })
    ]
});
```

### Webpack

在您的 `webpack.config.js` 文件中：

```javascript
const { WebpackPreFetchPlugin } = require('pre-fetch-plugin');

module.exports = {
  // ... 其他配置
  plugins: [
    new WebpackPreFetchPlugin({
      options: [
            {
                pathList: ['/home', '/user'],
                hashList: ['all'],
                reqs: [
                    {
                        key: 'userInfo',
                        method: 'GET',
                        url: '/api/user',
                        queryParams: { id: 'userId' },
                        cookieParams: { token: 'authToken' },
                        staticParams: { version: '1.0' }
                    }
                ]
            }
        ]
    })
  ]
};
```

## 配置选项

插件接受一个 `options` 数组，每个选项包含以下字段：

- `pathList`: 匹配的路径列表。使用 `['all']` 匹配所有路径。
- `hashList`: 匹配的 hash 列表。使用 `['all']` 匹配所有 hash。
- `reqs`: 预加载请求的配置数组。

每个请求配置包含以下字段：

- `key`: 用于存储结果的键名。
- `method`: HTTP 方法（GET 或 POST）。
- `url`: 请求的 URL。
- `queryParams`: URL 查询参数。
- `cookieParams`: 从 cookie 中获取的参数。
- `staticParams`: 静态参数。

参数优先级：queryParams > cookieParams > staticParams

## 在应用中使用预加载数据

插件会在全局对象上添加一个 `getPreFetchResult` 方法。您可以在应用代码中使用这个方法来获取预加载的数据：

```javascript
async function fetchSomeData(key) {
  const preFetchResult = await window.getPreFetchResult(key);
  if (preFetchResult) {
    return preFetchResult;
  } else {
    // 如果没有预加载结果，执行正常的请求逻辑
    return await normalFetchFunction();
  }
}
```

## 注意事项

1. 预加载脚本会异步加载，不会阻塞 DOM 解析。
2. 确保在使用预加载数据之前，相关的 DOM 元素已经加载完成。
3. 预加载请求会并行执行，以提高性能。
4. 如果预加载请求失败，插件会在控制台输出错误信息，但不会影响页面的正常加载。

## 许可证

MIT
