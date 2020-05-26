import Taro from '@tarojs/taro'

export interface GetReq {
  collection: string
  id: string | number | undefined
}

export interface PostReq {
  collection: string
  data: PostBody
}

export interface PostBody {
  createTime?: Taro.DB.Database.ServerDate
  [key: string]: any
}

export interface DeleteReq {
  collection: string
  id: string | number
}

export interface PutReq {
  collection: string
  data: PutBody
  method?: string
}

export interface PutBody {
  id: string | number
  [key: string]: any
}

export interface WhereReq {
  collection: string
  data: any
}

export interface CallReq {
  name: string
  data?: any
}

export default class BasicService {
  constructor() {
    const cloud = Taro.cloud
    cloud.init({
      env: process.env.CLOUD_ENV
    })
    this._db = cloud.database()
    this._callFunction = cloud.callFunction
    this.command = this._db.command
  }

  _db: Taro.DB.Database
  _callFunction: Function
  command: Taro.DB.Command

  // 全局错误处理
  errorHandler(err: Taro.General.CallbackResult, reject: Function): void {
    Taro.showToast({
      title: err.errMsg,
      icon: 'none',
    })
    reject(err)
  }

  get(req: GetReq): Promise<any> {
    const { collection, id } = req
    if (!collection) throw 'db: collection shouldn\'t be empty'
    if (!id) throw 'db: id shouldn\'t be empty'

    return new Promise((resolve, reject) => {
      this._db.collection(collection).doc(id).get({
        success: res => resolve(res.data),
        fail: err => this.errorHandler(err, reject)
      })
    })
  }

  post(req: PostReq): Promise<Taro.DB.Document.DocumentId> {
    const { collection, data } = req
    if (!collection) throw 'db: collection shouldn\'t be empty'

    return new Promise((resolve, reject) => {
      data.createTime = this._db.serverDate()
      this._db.collection(collection)
        .add({
          data,
        })
        .then(res => {
          resolve(res._id)
        })
        .catch((err: Taro.General.CallbackResult) => this.errorHandler(err, reject))
    })
  }

  delete(req: DeleteReq): Promise<number> {
    const { collection = '', id = '' } = req
    if (!collection) throw 'db: collection shouldn\'t be empty'
    if (!id) throw 'db: id shouldn\'t be empty'

    return new Promise((resolve, reject) => {
      this._db.collection(collection).doc(id)
        .remove({
          success: res => resolve(res.stats.removed),
          fail: err => this.errorHandler(err, reject)
        })
    })
  }

  put(req: PutReq): Promise<number> {
    const { collection, data, method = 'update' } = req
    if (!collection) throw 'db: collection shouldn\'t be empty'
    if (!data.id) throw 'db: id shouldn\'t be empty'
    if (!method) throw 'db: method shouldn\t be empty'

    return new Promise((resolve, reject) => {
      const id = data.id
      delete data.id

      this._db.collection(collection).doc(id)[method]({
        data,
        success: res => resolve(res.stats.updated),
        fail: (err: Taro.General.CallbackResult) => this.errorHandler(err, reject)
      })
    })
  }

  where(req: WhereReq): Promise<Taro.DB.Document.IDocumentData[]> {
    const { collection, data } = req
    if (!collection) throw 'db: collection shouldn\'t be empty'

    return new Promise((resolve, reject) => {
      this._db.collection(collection).where({
        ...data,
      })
        .get()
        .then(res => resolve(res.data))
        .catch(err => this.errorHandler(err, reject))
    })
  }

  call(req: CallReq): Promise<any> {
    const { name, data } = req
    if (!name) throw 'request: name shouldn\t be empty'

    return new Promise((resolve, reject) => {
      this._callFunction({
        name,
        data,
        success: ({ result: { code, data, msg } }) => {
          if (code !== 0) {
            this.errorHandler(msg, reject)
          } else {
            resolve(data)
          }
        },
        fail: (err: Taro.General.CallbackResult) => this.errorHandler(err, reject)
      })
    })
  }
}
