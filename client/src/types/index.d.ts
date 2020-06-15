import { AimState, MilestoneState, TaskState } from 'src/constants/enums'
import { DBStruct } from './DB'

export type CreateAimReq = {
  title: string      // 目标标题
  subtitle?: string  // 小标题
  date?: Date        // 截止日期 - 时间戳
}

export type Aim = {
  _id: string | number
  createTime: Date
  date: Date
  state: AimState
  title: string
  subtitle: string
  milestones: Milestone[]
}

export type Milestone = {
  aim?: string
  state?: MilestoneState
  desc?: string
  reward?: string
  rewarded?: boolean
  result?: string
  finishTime?: Date
}

export type CreateMilestoneReq = {
  aimId: Taro.DB.Document.DocumentId
  index: number
  aim: string
  state?: MilestoneState
  desc?: string
  reward: string
  rewarded?: boolean
  result?: string
}

export type CreateTaskReq = DBStruct.TodoItem

export type Task = DBStruct.TodoItem