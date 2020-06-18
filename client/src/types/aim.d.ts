import { AimState } from "src/constants/enums"

export type CreateAimReq = {
  title: string      // 目标标题
  subtitle?: string  // 小标题
  date?: Date        // 截止日期 - 时间戳
}

export type Aim = {
  id: string | number
  createTime: Date
  date: Date
  state: AimState
  title: string
  subtitle: string
}