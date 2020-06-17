import { UpsertMilestoneReq } from 'src/types'
import cr from 'src/lib/cloud_request'

const collection = 'milestone'

export default class MilestoneService {

  create = (req: UpsertMilestoneReq) => {
    return cr.post({
      collection,
      data: req
    })
  }

  update = (req: UpsertMilestoneReq) => {
    return cr.put({
      collection,
      data: {
        id: req.id!,
        ...req
      }
    })
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

  list = (aimId: Taro.DB.Document.DocumentId, filters: any, pageNo: number = 1) => {
  }
}