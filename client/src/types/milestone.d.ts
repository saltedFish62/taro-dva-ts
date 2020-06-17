import { MilestoneState } from "src/constants/enums"

export type Milestone = {
  aim?: string
  state?: MilestoneState
  desc?: string
  reward?: string
  rewarded?: boolean
  result?: string
  finishTime?: Date
}

export type UpsertMilestoneReq = {
  id?: string | number
  aimId: Taro.DB.Document.DocumentId
  aim: string
  state?: MilestoneState
  desc?: string
  reward: string
  rewarded?: boolean
  result?: string
}

