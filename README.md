## Fork from [ruanyf](https://github.com/ruanyf/webpack-demos)

转自阮老师的repo，加上了你自己的见解和demo修改。

添加了`scripts`字段，规避要全局安装`webpack`和`webpack-dev-server`的条件，整理成`npm`指令模式运行。

## 使用预备

clone下这个repo，并安装依赖包。

```bash
$ git clone https://github.com/shellphon/webpack-demos
$ cd webpack-demos
$ npm i
```

## 关于[script指令](http://www.ruanyifeng.com/blog/2016/10/npm_scripts.html)

> 比较特别的是，npm run新建的这个 Shell，会将当前目录的node_modules/.bin子目录加入PATH变量，执行结束后，再将PATH变量恢复原样。

于是我们可以通过将“进入目录”和“运行webpack”两个命令写进`scripts`字段来执行。

比如`demo01`的运行指令主要是

```bash
$ cd demo01
$ webpack
```

我们可以写成:

```javascript
"scripts":{
  "demo1":"cd demo01 && webpack"
}
```

然后在repo根目录运行：

```bash
$ npm run demo1
```

## Demo01: 入口文件 ([source](https://github.com/shellphon/webpack-demos/tree/master/demo01))

```bash
$ npm run d1
```

webpack通过将入口文件编译构建成bundle

例如, `main.js` 是一个入口文件

```javascript
// main.js
document.write('<h1>Hello World</h1>');
```

index.html

```html
<html>
  <body>
    <script type="text/javascript" src="dist/bundle.js"></script>
  </body>
</html>
```

Webpack 通过 `webpack.config.js` 配置来构建`bundle.js`.

```javascript
// webpack.config.js
module.exports = {
  entry: './main.js',
  output: {
    path:'dist',//文件输出目录
    filename: 'bundle.js'
  }
};
```

直接浏览器打开`index.html`就可以看到效果，或者查看是否输出对应文件。也可以架设本地服务启动。

```bash
$ webpack-dev-server
```

## Demo02:  多入口文件 ([source](https://github.com/shellphon/webpack-demos/tree/master/demo02))

```bash
$ npm run d2
```

多入口文件也是支持的，适用于多页面网站前端开发。

```javascript
// main1.js
document.write('<h1>Hello World</h1>');

// main2.js
document.write('<h2>Hello Webpack</h2>');
```

index.html

```html
<html>
  <body>
    <script src="dist/bundle1.js"></script>
    <script src="dist/bundle2.js"></script>
  </body>
</html>
```

webpack.config.js

```javascript
module.exports = {
  entry: {
    bundle1: './main1.js',
    bundle2: './main2.js'
  },
  output: {
    path:'dist',
    filename: '[name].js'
  }
};
```

## Demo03: Babel-loader ([source](https://github.com/shellphon/webpack-demos/tree/master/demo03))

```bash
$ npm run d3
```

Loader是一个转换资源文件的预处理器 ([更多信息](http://webpack.github.io/docs/using-loaders.html)). 比如, [Babel-loader](https://www.npmjs.com/package/babel-loader) 可以将 JSX/ES6 文件转译成 JS 文件. 官方提供了一系列可用的 [loaders](http://webpack.github.io/docs/list-of-loaders.html).

`main.jsx` 是一个jsx文件.

```javascript
const React = require('react');
const ReactDOM = require('react-dom');

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.querySelector('#wrapper')
);
```

index.html

```html
<html>
  <body>
    <div id="wrapper"></div>
    <script src="dist/bundle.js"></script>
  </body>
</html>
```

webpack.config.js

```javascript
module.exports = {
  entry: './main.jsx',
  output: {
    path:'dist',
    filename: 'bundle.js'
  },
  module: {
    loaders:[
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel-loader?presets[]=es2015&presets[]=react'
      },
    ]
  }
};
```

在配置文件 `webpack.config.js`里, `module.loaders` 字段用于配置所需的 loaders. 如上配置的 `babel-loader` 需要配合安装插件 [babel-preset-es2015](https://www.npmjs.com/package/babel-preset-es2015) 和 [babel-preset-react](https://www.npmjs.com/package/babel-preset-react) 来编译 ES6 和 React. 当然也可以利用`query`子字段来配置相关内容。

```javascript
module: {
  loaders: [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'react']
      }
    }
  ]
}
```

## Demo04: CSS-loader ([source](https://github.com/shellphon/webpack-demos/tree/master/demo04))

```bash
$ npm run d4
```

Webpack 允许通过在js里引入CSS文件, 编译时将通过 CSS-loader来预处理 CSS.

main.js

```javascript
require('./app.css');
```

app.css

```css
body {
  background-color: blue;
}
```

index.html

```html
<html>
  <head>
    <script type="text/javascript" src="dist/bundle.js"></script>
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

webpack.config.js

```javascript
module.exports = {
  entry: './main.js',
  output: {
    path:'dist',
    filename: 'bundle.js'
  },
  module: {
    loaders:[
      { test: /\.css$/, loader: 'style-loader!css-loader' },
    ]
  }
};
```

注意, 你需要用到两个loader来编译CSS文件. 首先是 [CSS-loader](https://www.npmjs.com/package/css-loader) 读取css文件 然后用 [Style-loader](https://www.npmjs.com/package/style-loader) 将样式内容以 Style 标签形式内嵌到 HTML 页面中. 多个loader用`!`来连接.

构建完成后，打开index.html会呈现出如下源码：

```html
<head>
  <script type="text/javascript" src="dist/bundle.js"></script>
  <style type="text/css">
    body {
      background-color: blue;
    }
  </style>
</head>
```

## Demo05: Image loader ([source](https://github.com/shellphon/webpack-demos/tree/master/demo05))

```bash
$ npm run d5
```

Webpack 同样可以在js里引入图片资源.

main.js

```javascript
var img1 = document.createElement("img");
img1.src = require("./small.png");
document.body.appendChild(img1);

var img2 = document.createElement("img");
img2.src = require("./big.png");
document.body.appendChild(img2);
```

index.html

```html
<html>
  <body>
    <script type="text/javascript" src="dist/bundle.js"></script>
  </body>
</html>
```

webpack.config.js

```javascript
module.exports = {
  entry: './main.js',
  output: {
    filename: 'dist/bundle.js'
  },
  module: {
    loaders:[
      { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }
    ]
  }
};
```

[url-loader](https://www.npmjs.com/package/url-loader) 用于转换图片资源文件. 如上配置，如果图片大小小于 8192 bytes, 该图片将会转换为 Data URL; 否则, 它将转换为普通的 URL. 如上，`?`用于传递参数的分隔符。

上例运行之后，两个图片将会呈现出如下链接：

```html
<img src="data:image/png;base64,iVBOR...uQmCC">
<img src="4853ca667a2b8b8844eb2693ac1b2578.png">
```

## Demo06: CSS 模块 ([source](https://github.com/shellphon/webpack-demos/tree/master/demo06))

```bash
$ npm run d6
```

`css-loader?modules` (配置参数modules) 启动了 [CSS Modules](https://github.com/css-modules/css-modules).

这就意味着你的模块css默认拥有局部作用域. 可以通过 选择器带上`:global(...)` 来关闭局部作用域. ([更多信息](https://css-modules.github.io/webpack-demo/))

index.html

```html
<html>
<body>
  <h1 class="h1">Hello World</h1>
  <h2 class="h2">Hello Webpack</h2>
  <div id="example"></div>
  <script src="./dist/bundle.js"></script>
</body>
</html>
```

app.css

```css
.h1 {
  color:red;
}

:global(.h2) {
  color: blue;
}
```

main.jsx

```javascript
var React = require('react');
var ReactDOM = require('react-dom');
var style = require('./app.css');

ReactDOM.render(
  <div>
    <h1 className={style.h1}>Hello World</h1>
    <h2 className="h2">Hello Webpack</h2>
  </div>,
  document.getElementById('example')
);
```

webpack.config.js

```javascript
module.exports = {
  entry: './main.jsx',
  output: {
    filename: 'dist/bundle.js'
  },
  module: {
    loaders:[
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules'
      }
    ]
  }
};
```
打开页面，你会发现，只有第二个h1才是红色字体 ，因为其css是局部作用域的，不会影响到其他h1,(其实际产出的选择器名做了处理) ，而所有h2都是蓝色的，是因为其关闭了作用域选项。

## Demo07: UglifyJs 插件 ([source](https://github.com/shellphon/webpack-demos/tree/master/demo07))

```bash
$ npm run d7
```

Webpack 具备插件系统来扩展其功能.  [UglifyJs Plugin](http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin) 压缩输出(`bundle.js`) JS 文件.

main.js

```javascript
var longVariableName = 'Hello';
longVariableName += ' World';
document.write('<h1>' + longVariableName + '</h1>');
```

index.html

```html
<html>
<body>
  <script src="dist/bundle.js"></script>
</body>
</html>
```

webpack.config.js

```javascript
var webpack = require('webpack');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
module.exports = {
  entry: './main.js',
  output: {
    filename: 'dist/bundle.js'
  },
  plugins: [
    new uglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};
```

构建之后，将得到这样一个bundle.js

```javascript
var o="Hello";o+=" World",document.write("<h1>"+o+"</h1>")
```

## Demo08: HTML Webpack 插件 和 启动浏览器Webpack Plugin ([source](https://github.com/shellphon/webpack-demos/tree/master/demo08))

```bash
$ npm run d8
```

这个demo展示如何使用第三方插件。

[html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin) 能自动创建html, 而 [open-browser-webpack-plugin](https://github.com/baldore/open-browser-webpack-plugin) 能在webpack加载时自动启动浏览器打开页面.

main.js

```javascript
document.write('<h1>Hello World</h1>');
```

webpack.config.js

```javascript
var HtmlwebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
  entry: './main.js',
  output: {
    filename: 'dist/bundle.js'
  },
  plugins: [
    new HtmlwebpackPlugin({
      title: 'Webpack-demos',
      filename: 'index.html'
    }),
    new OpenBrowserPlugin({
      url: 'http://localhost:8080'
    })
  ]
};
```

启动`webpack-dev-server`.

这样，你无需手动创建index.html和用浏览器打开页面，webpack自动帮你做了这些操作。

## Demo09: 设置环境变量 ([source](https://github.com/shellphon/webpack-demos/tree/master/demo09))

```bash
$ npm run d9
```

利用DefinePlugin可以让js使用全局变量，比如读取环境变量等。

main.js

```javascript
document.write('<h1>Hello World</h1>');

if (__DEV__) {
  document.write(new Date());
}
```

index.html

```html
<html>
<body>
  <script src="bundle.js"></script>
</body>
</html>
```

webpack.config.js

```javascript
var webpack = require('webpack');

var devFlagPlugin = new webpack.DefinePlugin({
  //通过node的api读取环境变量
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
});

module.exports = {
  entry: './main.js',
  output: {
    filename: 'dist/bundle.js'
  },
  plugins: [devFlagPlugin]
};
```

设置环境变量并运行

```bash
# Linux & Mac
$ env DEBUG=true webpack-dev-server

# Windows
$ set DEBUG=true
$ webpack-dev-server
```

## Demo10: 代码分割 ([source](https://github.com/shellphon/webpack-demos/tree/master/demo10))

```bash
$ npm run d10
```

在大型web应用了，将所有js都放在一个单独的js文件里并不高效, Webpack 允许你将其分割成几个chunks. 特别是一些模块只需要在特定情形下才需要用到，它可以实现按需异步加载.

首先, 使用 `require.ensure` 来定义一个代码分割点. ([官方文档](http://webpack.github.io/docs/code-splitting.html))

```javascript
// main.js
require.ensure(['./a'], function(require) {
  var content = require('./a');
  document.open();
  document.write('<h1>' + content + '</h1>');
  document.close();
});
```

`require.ensure` 告知webpack `./a.js` 需要从`bundle.js`分离，并构建得到一个独立的chunk.

```javascript
// a.js
module.exports = 'Hello World';
```

webpack会自动处理这些异步以及输出对应文件，而无需手动去html或者配置文件里添加内容。

```html
<html>
  <body>
    <script src="dist/bundle.js"></script>
  </body>
</html>
```

webpack.config.js

```javascript
module.exports = {
  entry: './main.js',
  output: {
    path:'dist',
    filename: 'bundle.js'
  }
};
```

实际上Webpack 已经将 `main.js` 和 `a.js` 构建成不同的chunk (`bundle.js` and `1.bundle.js`), 然后 `1.bundle.js` 是在 `bundle.js` 内异步加载进去的.

## Demo11:  通过bundle-loader来做代码分割 ([source](https://github.com/shellphon/webpack-demos/tree/master/demo11))

```bash
$ npm run d11
```

另外一种代码分割的方式，利用 [bundle-loader](https://www.npmjs.com/package/bundle-loader).

```javascript
// main.js

// Now a.js is requested, it will be bundled into another file
var load = require('bundle-loader!./a.js');

// To wait until a.js is available (and get the exports)
//  you need to async wait for it.
load(function(file) {
  document.open();
  document.write('<h1>' + file + '</h1>');
  document.close();
});
```

`require('bundle-loader!./a.js')` 告知webpack要异步加载 `a.js`.

而webpack将 `main.js` 转化为 `bundle.js`, 将 `a.js` 转化为 `1.bundle.js`.

实际上看过bundle的代码会发现，其实最终还是用了`require.ensure`，不过源码编写方式不同了。

## Demo12: Common chunk ([source](https://github.com/shellphon/webpack-demos/tree/master/demo12))

```bash
$ npm run d12
```

当多个脚本共用一部分代码时，我们可以通过插件 CommonsChunkPlugin 来将公共部分独立开来（主要是独立出模块化实现部分）.

```javascript
// main1.jsx
var React = require('react');
var ReactDOM = require('react-dom');

ReactDOM.render(
  <h1>Hello World</h1>,
  document.getElementById('a')
);

// main2.jsx
var React = require('react');
var ReactDOM = require('react-dom');

ReactDOM.render(
  <h2>Hello Webpack</h2>,
  document.getElementById('b')
);
```

index.html

```html
<html>
  <body>
    <div id="a"></div>
    <div id="b"></div>
    <script src="dist/init.js"></script>
    <script src="dist/bundle1.js"></script>
    <script src="dist/bundle2.js"></script>
  </body>
</html>
```

webpack.config.js

```javascript
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
module.exports = {
  entry: {
    bundle1: './main1.jsx',
    bundle2: './main2.jsx'
  },
  output: {
    path:'dist',
    filename: '[name].js'
  },
  module: {
    loaders:[
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      },
    ]
  },
  plugins: [
    new CommonsChunkPlugin('init.js')
  ]
}
```

## Demo13: Vendor chunk ([source](https://github.com/shellphon/webpack-demos/tree/master/demo13))

```bash
$ npm run d13
```

利用 CommonsChunkPlugin 插件，将库框架等公共文件抽离出来.

main.js

```javascript
var $ = require('jquery');
$('h1').text('Hello World');
```

index.html

```html
<html>
  <body>
    <h1></h1>
    <script src="vendor.js"></script>
    <script src="bundle.js"></script>
  </body>
</html>
```

webpack.config.js

```javascript
var webpack = require('webpack');

module.exports = {
  entry: {
    app: './main.js',
    vendor: ['jquery'],
  },
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendor', /* filename= */'vendor.js')
  ]
};
```

如果你想在每个模块里都能使用某个模块, 比如在每个模块内，不需要写`require("jquery")`而让 $ 和 jQuery 能够直接使用。 可以用 `ProvidePlugin`插件实现 ([官方文档](http://webpack.github.io/docs/shimming-modules.html)).

```javascript
// main.js
$('h1').text('Hello World');


// webpack.config.js
var webpack = require('webpack');

module.exports = {
  entry: {
    app: './main.js'
  },
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    })
  ]
};
```

## Demo13_1: manifest ([source](https://github.com/shellphon/webpack-demos/tree/master/demo13_1))

从前面几个demo来看，我们不想把所有js都合并在一起，那就用`CommonsChunkPlugins`分离出公共部分，通常会把库\框架如`jquery`\`react`也抽离出来，但是如果仔细查看会发现，webpack的模块化代码抽离出来了，里面由包含一些时常要更新的内容，很多时候，框架或者库等公共部分，只要一次编译，几乎就没有更新的需求，而且由于其内容比较多，花的编译时间也长，我们可以考虑把其中需要经常更新的部分抽离出来，把框架等无需长期更新的部分独立开来，分割出`manifest`和`vender`,解决此类问题。

```bash
$ npm run d13_1
```

index.html

```html
<html>
  <body>
    <h1></h1>
    <script src="dist/manifest.js"></script>
    <script src="dist/vendor.js"></script>
    <script src="dist/app.js"></script>
  </body>
</html>
```

main.js

```javascript
var $ = require('jquery');
$('h1').text('Hello World');
```

webpack.config.js

```javascript
var webpack = require('webpack');

module.exports = {
  entry: {
    app: './main.js',
    vendor: ['jquery'],
  },
  output: {
    path:'dist',
    filename: '[name].js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names:['vendor','manifest']
    })
  ]
};
```

## Demo14: Exposing global variables ([source](https://github.com/shellphon/webpack-demos/tree/master/demo14))

```bash
$ npm run d14
```

如果你想使用全局变量，又不想把这些变量放置到bundle里, 可以配置 `externals` 选项([官方文档](http://webpack.github.io/docs/library-and-externals.html)).

比如`data.js`.

```javascript
var data = 'Hello World';
```

我们可以设置`data`作为全局变量 

```javascript
// webpack.config.js
module.exports = {
  entry: './main.jsx',
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders:[
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      },
    ]
  },
  externals: {
    // require('data') is external and available
    //  on the global var data
    'data': 'data'
  }
};
```

这样就可以 require `data` 作为一个模块变量使用，但实际上它已经是全局变量了.

```javascript
// main.jsx
var data = require('data');
var React = require('react');
var ReactDOM = require('react-dom');

ReactDOM.render(
  <h1>{data}</h1>,
  document.body
);
```

## Demo15: Hot Module Replacement (热替换) ([source](https://github.com/shellphon/webpack-demos/tree/master/demo15))

```bash
$ npm run d15
```

[Hot Module Replacement](https://github.com/webpack/docs/wiki/hot-module-replacement-with-webpack) (HMR) 实现应用启动后无需重新加载页面即可更新模块.

有两种 [方法](http://webpack.github.io/docs/webpack-dev-server.html#hot-module-replacement) 通过webpack-dev-server启动热替换

(1) 命令行参数 `--hot` 和 `--inline` 

```bash
$ webpack-dev-server --hot --inline
```

参数描述:

- `--hot`: 加入插件 HotModuleReplacementPlugin 并且开启服务热启动模式.
- `--inline`: 将webpack-dev-server运行时加入bundle.
- `--hot --inline`: 同时添加了 webpack/hot/dev-server 入口.

(2) 配置 `webpack.config.js`.

- 添加plugins插件配置 `new webpack.HotModuleReplacementPlugin()`
- 入口文件添加 `webpack/hot/dev-server` 和 `webpack-dev-server/client?http://localhost:8080`

`webpack.config.js` 如下

```javascript
var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080',
    './index.js'
  ],
  output: {
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react']
      },
      include: path.join(__dirname, '.')
    }]
  }
};
```

页面将实时反馈，呈现源码修改的内容更新。

App.js

```javascript
import React, { Component } from 'react';

export default class App extends Component {
  render() {
    return (
      <h1>Hello World</h1>
    );
  }
}
```

index.js

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
```

index.html

```html
<html>
  <body>
    <div id='root'></div>
    <script src="/static/bundle.js"></script>
  </body>
</html>
```

## Demo16: React router ([source](https://github.com/shellphon/webpack-demos/tree/master/demo16))

```bash
$ npm run d16
```

利用webpack去构建 [React-router](https://github.com/rackt/react-router/blob/0.13.x/docs/guides/overview.md)的官方例子.

想象一下做一个app具备dashboard, inbox, 和 calendar.

```
+---------------------------------------------------------+
| +---------+ +-------+ +--------+                        |
| |Dashboard| | Inbox | |Calendar|      Logged in as Jane |
| +---------+ +-------+ +--------+                        |
+---------------------------------------------------------+
|                                                         |
|                        Dashboard                        |
|                                                         |
|                                                         |
|   +---------------------+    +----------------------+   |
|   |                     |    |                      |   |
|   | +              +    |    +--------->            |   |
|   | |              |    |    |                      |   |
|   | |   +          |    |    +------------->        |   |
|   | |   |    +     |    |    |                      |   |
|   | |   |    |     |    |    |                      |   |
|   +-+---+----+-----+----+    +----------------------+   |
|                                                         |
+---------------------------------------------------------+
```

```bash
$ webpack-dev-server --history-api-fallback
```

## 参考链接

- [Webpack docs](http://webpack.github.io/docs/)
- [webpack-howto](https://github.com/petehunt/webpack-howto), by Pete Hunt
- [Diving into Webpack](https://web-design-weekly.com/2014/09/24/diving-webpack/), by Web Design Weekly
- [Webpack and React is awesome](http://www.christianalfoni.com/articles/2014_12_13_Webpack-and-react-is-awesome), by Christian Alfoni
- [Browserify vs Webpack](https://medium.com/@housecor/browserify-vs-webpack-b3d7ca08a0a9), by Cory House
- [React Webpack cookbook](https://christianalfoni.github.io/react-webpack-cookbook/index.html), by Christian Alfoni

## License

MIT
