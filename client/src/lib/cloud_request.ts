import Taro from '@tarojs/taro'
import { GetReq, PostReq, DeleteReq, PutReq, PageReq, CallReq, WhereReq } from 'src/types'
import { map } from 'lodash'

class CloudRequest {
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

  /**
   * 查询
   * @param req 
   */
  get(req: GetReq): Promise<any> {
    const { collection, id } = req
    if (!collection) throw 'db: collection shouldn\'t be empty'
    if (!id) throw 'db: id shouldn\'t be empty'

    return new Promise((resolve, reject) => {
      this._db.collection(collection).doc(id).get({
        success: res => resolve(this.filterFields(res.data)),
        fail: err => this.errorHandler(err, reject)
      })
    })
  }

  /**
   * 创建
   * @param req 
   */
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

  /**
   * 删除
   * @param req 
   */
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

  /**
   * 更新
   * @param req 
   */
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
    // TODO: 小程序 limit 默认20
    const { collection, data } = req
    if (!collection) throw 'db: collection shouldn\'t be empty'

    return new Promise((resolve, reject) => {
      this._db.collection(collection).where({
        ...data,
      })
        .get()
        .then(res => resolve(this.filterListFields(res.data)))
        .catch(err => this.errorHandler(err, reject))
    })
  }

  /**
   * 翻页
   * @param req 
   */
  page(req: PageReq): Promise<any> {
    // TODO: 小程序 limit 默认20
    const { collection, sort, filters, pageNo, pageSize = 10 } = req
    if (!collection) throw 'db: collection shouldn\'t be empty'

    return new Promise((resolve, reject) => {
      let model = this._db.collection(collection).aggregate()

      // 有filters
      if (!!filters && Object.keys(filters).length > 0) {
        model = model.match(filters)
      }

      // 有sort
      if (!!sort && Object.keys(sort).length > 0) {
        model = model.sort(sort)
      }

      if (!!pageNo && pageNo > 0) {
        model = model.skip(pageNo * pageSize)
      }

      model.limit(pageSize)
        .end()
        .then(res => resolve(this.filterListFields(res)))
        .catch(err => this.errorHandler(err, reject))
    })
  }

  /**
   * 调用云函数
   * @param req 
   */
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

  filterListFields = (list) => {
    return map(list, this.filterFields)
  }

  filterFields = (item) => {
    if (item['_id']) {
      item['id'] = item._id
      delete item['_id']
    }
    if (item['_openid']) {
      delete item['_openid']
    }
    return item
  }
}

export default new CloudRequest()