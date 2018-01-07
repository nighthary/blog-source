---
title: roll-build-react-app
date: 2018-01-07 20:16:53
toc: true
tags: 
	-React 
	-Rollup
categories:
	-前端
---

## 用Rollup打包React项目

#### 什么是rollup?

​	这是[rollup官网](https://rollupjs.org/zh#introduction)给出的描述

>Rollup 是一个 JavaScript 模块打包器，可以将小块代码编译成大块复杂的代码，例如 library 或应用程序

​	简单的说， rollup就是一个js的打包器，它的优势在于可以通过``Tree-shaking``去掉多余的不需要的代码（webpack 2.x也实现了  Tree-shaking）

<!-- more -->

#### 构建react项目

* 首先，初始化一个项目，如下目录结构

  ```xml
  -public
  	-index.html
  -src
  -index.js
  -package.json
  -rollup.config.js  //rollup的配置文件
  ```

  ``package.json``中的内容

  ```son
  {
      "name": "react-roppup",
      "description": "this is a react project ,and package by rollup",
      "main": "index.js",
      "scripts": {
          "test": "test",
          "build": "rollup -c"
      },
      "keywords": [
          "react",
          "rollup",
          "react-redux",
          "redux"
      ],
      "author": "nighthary",
      "license": "ISC",
      "dependencies": {
          "rollup": "^0.53.3"
      },
      "devDependencies": {
      }
  }
  ```

  rollup 可以通过运行rollup -c 读取配置文件进行打包编译

* 初始化rollup.config.js

  ```js
  export default {
      input: 'index.js',
      output: {
          file: 'dist/bundle.js',
          format: 'cjs', // 'amd', 'cjs', 'es', 'iife' or 'umd'
      },
      plugins: []
  }
  ```

  一个最简单的rollup的配置文件就如上面所示，其中有很多的配置选项，具体可以参考[rollup官网](https://rollupjs.org/zh#introduction)进行扩展阅读。

* 初始化定义react项目

   >简单的实现了一个 计数器可以进行加减，value通过redux来控制。

   详情可见[demo](https://github.com/nighthary/rollup-react)

  * index.js

    本项目直接集成了react和react-redux，所以入口文件就如下面所示。

  ```js
  import React from "react";
  import ReactDOM from "react-dom";
  import { Provider } from "react-redux";

  import App from "./src/App";
  import store from "./src/redux/store";

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("app")
  );
  ```

  * Counter.js

    ```js
    import React, { Component } from 'react';

    import PropTypes from 'prop-types';

    class Counter extends Component {
      static propTypes = {
        value: PropTypes.number.isRequired,
        countOperate: PropTypes.func.isRequired
      }

      render() {
        const { value } = this.props;
        return (
          <div>
            <span>{value}</span>
            <button onClick={ this.add }>Add</button>
            <button onClick={ this.sub }>Sub</button>
          </div>
        );
      }

      add = () => {
        this.props.countOperate('ADD');
      }

      sub = () => {
        this.props.countOperate('SUB');
      }
    }

    export default Counter;
    ```

其他具体的代码就不贴出来了，有兴趣的可以移步[demo](https://github.com/nighthary/rollup-react)

#### 遇到的问题

* 问题一

  ![](http://bobo-img.oss-cn-beijing.aliyuncs.com/blog/image/error01.png)

  需要通过``babel``进行编译

  ```
  npm i rollup-plugin-babel --save-dev
  npm i rollup-plugin-node-resolve --save-dev
  ```

  并在``rollup.config.js``中添加插件

  ```js
  plugins: [
    resolve(),
    babel({
    exclude: 'node_modules/**' 
    })
  ]
  ```

  并在项目根目录新建``.babelrc``文件，写入如下内容

  ```json
  {
      "presets": [
          "es2015-rollup"
      ]
  }
  ```

  再次运行即可

* 问题二

  ![02](https://bobo-img.oss-cn-beijing.aliyuncs.com/blog/image/error02.png)

  这个问题是由于部分模块没有直接``exports``引入的内容导致的，需要添加``commonjs``插件进行编译

  ```
  npm i rollup-plugin-commonjs --save-dev
  ```

  并在``rollup.config.js``中添加如下内容

   ```js
  plugins: [
    commonjs({
    	include: [
    		'node_modules/**'
    	],
    	exclude: [
    		'node_modules/process-es6/**'
    	],
    })
  ]
   ```

* 问题三

![3](https://bobo-img.oss-cn-beijing.aliyuncs.com/blog/image/error03.png)

这个问题和问题二差不多，需要为没有export的模块添加别名即可，这相关知识可以参考[rollup官网-模块导出](https://rollupjs.org/zh#-exporting-)

需要``commonjs``的编译中添加模块导出的别名``namedExports``

```js
commonjs({
            include: [
                'node_modules/**'
            ],
            exclude: [
                'node_modules/process-es6/**'
            ],
            namedExports: {
                'node_modules/react/index.js': [
                    'Children', 
                    'Component', 
                    'PropTypes', 
                    'createElement'
                ],
                "node_modules/immutable/dist/immutable.js": [
                    "fromJS",
                    "Map"
                ]
            }
        })
```

这里把本项目中遇到的所有别名都列出来，具体可以根据实际情况进行修改。

*  问题四

![4](https://bobo-img.oss-cn-beijing.aliyuncs.com/blog/image/error04.png)

 这里给出错误位置的代码，可以发现是``jsx``语法问题

```js
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
);
```

添加插件来编译jsx即可

```
npm i babel-preset-react --save-dev
```

并在``.babelrc``中添加如下配置

```json
"presets": [
	"es2015-rollup", "react"
]
```

* 问题五

![5](http://bobo-img.oss-cn-beijing.aliyuncs.com/blog/image/error05.png)

给出出现错误的代码

```js
class Counter extends Component {
  static propTypes = {
    value: PropTypes.number.isRequired,
    countOperate: PropTypes.func.isRequired
  }
  ...
```

static 好像不被识别， 需要添加babel核心插件来对js进行编译即可

```shell
npm i babel-plugin-stage-0 --save-dev
```

并在``.babelrc``中添加如下配置

```json
"presets": [
        "es2015-rollup", "react", "stage-0"
    ]
```



到目前为止，一个完整的打包就实现了，如果问题欢迎联系我。

QQ: 965548606

[github](https://github.com/nighthary)



有需要看完整代码的朋友请移步[code source](https://github.com/nighthary/rollup-react)