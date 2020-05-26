## Taro + dva + ts

### 介绍

搭建一个 Taro + dva + ts 的框架。

之前写微信小程序都是使用原生的来写，非常繁琐。有一次接触到了 AntD Pro，其中集成了dvajs，船新的 redux 写法让我耳目一新，所以来试试把 dva 和 Taro 结合起来。

#### dva

github地址：[dvajs/dva](https://github.com/dvajs/dva)

#### Taro

github地址：[NervJS/taro](https://github.com/NervJS/taro)

### 创建 Taro 应用

##### 安装 Taro 开发工具

```shell
$ npm install -g @tarojs/cli
$ yarn global add @tarojs/cli
```

##### 创建项目模板

```shell
$ taro init myApp
typescript? :y
状态管理: n
```

##### 安装 dva

```shell
$ npm i --save dva-core dva-loading
```

##### 安装redux

```shell
$ npm i --save redux @tarojs/redux @tarojs/redux-h5
```

##### 引入 dva

在 `/src/utils/` 目录下创建 dva.ts。不添加插件，创建一个最简单的 dva 应用。

```js
import { create } from 'dva-core'
import createLoading from 'dva-loading'
import { Store } from 'redux'

interface GetStore {
  (): Store
}

export interface dvaApp {
  use: Function
  getStore: GetStore 
}

/**
 * 创建 dva 应用
 * 
 * @param opt
 */
function createApp(opt: Object = {}, models: any[] = []) {
  // 创建应用
  const app = create(opt)

  // 注册 model
  if (app._models.length != models.length + 1) {
    models.forEach(it => app.model(it))
  }

  app.use({
    onError: (err) => {
      console.error(err)
    }
  })

  app.use(createLoading())

  // 启动应用
  app.start()

  // 定义返回 store 的接口
  app.getStore = () => app._store

  return app
}

export {
  createApp,
}

```

##### 创建 dvaApp
修改 `/src/app.tsx` 如下：

```js
import Taro, { Component, Config } from '@tarojs/taro'
import Index from './pages/index'
import models from './models'
import { createApp } from './utils/dva'
import { Provider } from '@tarojs/redux'

const dvaApp = createApp({}, models)
const store = dvaApp.getStore()

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  componentDidMount() { }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))

```

##### 创建 models

创建目录 `/src/models/` ，并在该目录下创建文件 `index.js`：

```js
import common from "./common";

export default [
  common,
]

```

收集所有页面的 model ，组合成数组导出，方便创建 dva 应用时插入 model。接着在 `/src/pages/index/` 下创建 `model.js` ：

```js
const delay = () => new Promise(res => setTimeout(res, 1000))

export default {
  namespace: 'common',
  state: {
    count: 0,
  },
  effects: {
    * asyncAdd({ }, { call, put }) {
      yield call(delay)
      yield put({
        type: 'add'
      })
    },
  },
  reducers: {
    add(state) {
      return {
        ...state,
        count: state.count + 1,
      }
    }
  }
}
```

##### connect 页面

在 `/src/index/index.jsx` 中，将组件连接到redux：

```js
import Taro, { Component, Config } from '@tarojs/taro'
import { ComponentClass } from 'react'
import { View } from '@tarojs/components'

import './index.scss'
import { connect } from '@tarojs/redux'

// 上层组件传入的 props
type OwnProps = {}

// 由 model 传入的 props
type ModelProps = {
  count: number
  dispatch: Function
}

interface Index {
  props: OwnProps & ModelProps
}

@connect(({ common }) => ({
  count: common.count,
}))
class Index extends Component {

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页'
  }

  render() {
    const { dispatch, count } = this.props

    return (
      <View className='index'>
        <View
          onClick={() => { dispatch({ type: 'common/asyncAdd' }) }}
        >Click me to add 1 async</View>
        <View>{count}</View>
      </View>
    )
  }
}

// 将上层传入的属性暴露
export default Index as ComponentClass<OwnProps>
```

在终端输入 `npm run dev:weapp` 编译并预览。至此就成功引入 dva 了。

