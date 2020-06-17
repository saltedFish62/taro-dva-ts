import { AimState } from 'src/constants/enums'
import { CreateAimReq, UpsertMilestoneReq, Aim } from 'src/types'

import cr from 'src/lib/cloud_request'

export default class AimService {

  createAim = async (req: CreateAimReq): Promise<Aim> => {
    const { title, subtitle, date } = req
    const collection = 'aim'

    const res = await cr.where({
      collection,
      data: {
        state: cr.command.eq(AimState.Current)
      }
    })

    if (res && res.length > 0) {
      // 标记原先已进行的目标为挂起
      for (let i = 0; i < res.length; i++) {
        await cr.put({
          collection,
          data: {
            id: res[i]._id!,
            state: AimState.Hangup
          }
        })
      }
    }

    const createRes = await cr.post({
      collection,
      data: {
        title,
        subtitle,
        date,
        milestones: [],
        state: AimState.Current,
      }
    })

    return cr.get({
      collection,
      id: createRes,
    })

  }

  retrieveCurrentAim = () => {
    return cr.where({
      collection: 'aim',
      data: {
        state: cr.command.eq(AimState.Current)
      }
    })
  }

  createMilestone = async (req: UpsertMilestoneReq) => {
    // const {
    //   aimId,
    //   aim = '',
    //   state = MilestoneState.Current,
    //   desc = '',
    //   reward = '',
    //   result = '',
    // } = req

    // const collection = 'aim'

    // const createTime = new Date()

    // await cr.put({
    //   collection,
    //   data: {
    //     id: aimId,
    //     [key]: {
    //       aim, state, desc, reward, result, createTime,
    //     }
    //   }
    // })

    // return cr.get({
    //   collection,
    //   id: aimId
    // })
  }
}