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

export interface PageReq {
  collection: string
  pageNo?: number
  pageSize?: number
  filters?: any
  sort?: Array<any>
}
