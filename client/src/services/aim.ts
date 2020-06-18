import { AimState } from 'src/constants/enums'
import { CreateAimReq, Aim } from 'src/types'

import cr from 'src/lib/cloud_request'

const collection = 'aim'

export default class AimService {

  createAim = async (req: CreateAimReq): Promise<Aim> => {
    const { title, subtitle, date } = req

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
        state: AimState.Current,
      }
    })

    return cr.get({
      collection,
      id: createRes,
    })

  }

  retrieveCurrentAim = async () => {
    const aimRsp = await cr.where({
      collection,
      data: {
        state: cr.command.eq(AimState.Current)
      }
    })

    return aimRsp.length > 0 ? aimRsp[0] : null
  }

}