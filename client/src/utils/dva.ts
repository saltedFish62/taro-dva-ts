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
