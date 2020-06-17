export type Task = {
  date: string // YYYY-MM-DD
  plan: string
  state: number
  expireAt: Date
  sort: number
  _id?: string
}