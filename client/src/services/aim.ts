import { AimState, MilestoneState } from 'src/constants/enums'
import BasicServices from './basic'
import { CreateAimReq, CreateMilestoneReq, Aim } from 'src/types'

export default class AimService extends BasicServices {

  createAim = async (req: CreateAimReq): Promise<Aim> => {
    const { title, subtitle, date } = req
    const collection = 'aim'

    const res = await this.where({
      collection,
      data: {
        state: this.command.eq(AimState.Current)
      }
    })

    if (res && res.length > 0) {
      // 标记原先已进行的目标为挂起
      for (let i = 0; i < res.length; i++) {
        await this.put({
          collection,
          data: {
            id: res[i]._id!,
            state: AimState.Hangup
          }
        })
      }
    }

    const createRes = await this.post({
      collection,
      data: {
        title,
        subtitle,
        date,
        milestones: [],
        state: AimState.Current,
      }
    })

    return this.get({
      collection,
      id: createRes,
    })

  }

  retrieveCurrentAim = () => {
    return this.where({
      collection: 'aim',
      data: {
        state: this.command.eq(AimState.Current)
      }
    })
  }

  createMilestone = async (req: CreateMilestoneReq) => {
    const {
      aimId,
      index = 0,
      aim = '',
      state = MilestoneState.Current,
      desc = '',
      reward = '',
      result = '',
    } = req

    const key = 'milestones.' + index.toString()
    const collection = 'aim'

    const createTime = new Date()

    await this.put({
      collection,
      data: {
        id: aimId,
        [key]: {
          aim, state, desc, reward, result, createTime,
        }
      }
    })

    return this.get({
      collection,
      id: aimId
    })
  }
}