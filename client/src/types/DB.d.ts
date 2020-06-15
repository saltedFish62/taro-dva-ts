export namespace DBStruct {
  export type User = {
    _id: string
    lastestLogin: Date
  }

  export type Aim = {
    _id: string
    _openid: string
    createTime: Date
    date: string // YYYY-MM-DD
    milestones: Milestone[]
    state: number
    title: string
    subtitle: string
  }

  export type Milestone = {
    aim: string
    creatTime: Date
    desc: string
    result: string
    reward: string
    state: number
  }

  export type TodoItem = {
    date: string // YYYY-MM-DD
    plan: string
    state: number
    expireAt: Date
    sort: number
    _id?: string
  }
}