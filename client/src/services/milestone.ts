import { Milestone } from 'src/types'
import cr from 'src/lib/cloud_request'
import { MilestoneState } from 'src/constants/enums'

const collection = 'milestone'

export default class MilestoneService {

  create = (req: Milestone) => {
    return cr.post({
      collection,
      data: {
        ...req,
        state: MilestoneState.Current
      }
    })
  }

  update = async (req: Milestone) => {
    const res = await cr.put({
      collection,
      data: {
        id: req.id!,
        ...req
      }
    })

    if (res) {
      return cr.get({
        collection,
        id: res
      })
    }
  }

  retrieve = (id: string) => {
    return cr.get({
      collection,
      id,
    })
  }

  remove = (id: string) => {
    return cr.delete({
      collection,
      id
    })
  }

  list = (aimId: Taro.DB.Document.DocumentId, filters?: any) => {
    const req = {
      aim_id: cr.command.eq(aimId)
    }
    if (filters && Object.keys(filters).length > 0) {
      for (const key in filters) {
        req[key] = cr.command.eq(filters[key])
      }
    }

    return cr.where({
      collection,
      data: req
    })

  }
}