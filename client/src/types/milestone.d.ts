import { MilestoneState } from "src/constants/enums"

export type Milestone = {
  id?: Taro.DB.Document.DocumentId
  aim?: string
  state?: MilestoneState
  desc?: string
  reward?: string
  result?: string
  finishTime?: Date
  aim_id: Taro.DB.Document.DocumentId
}

