import cr from 'src/lib/cloud_request'
import dayjs from 'dayjs'
import { Task } from 'src/types'

const collection = 'task'

export default class Todo {

  create = async (req: Task): Promise<any> => {

    const id = await cr.post({
      collection,
      data: {
        ...req,
        createTime: cr._db.serverDate()
      }
    })

    return cr.get({
      collection,
      id
    })

  }

  list = (): Promise<any> => {

    const start = dayjs().hour(3).minute(0).second(0)
    const end = start.add(1, 'day')
    return cr.where({
      collection,
      data: {
        createTime: cr.command.and([
          cr.command.gte(start.toDate()),
          cr.command.lte(end.toDate())
        ])
      }
    })

  }

  delete = (id): Promise<number> => {

    return cr.delete({
      collection,
      id
    })

  }

  update = (task: Task) => {
    return cr.put({
      collection,
      data: {
        id: task.id!,
        state: task.state,
        sort: task.sort,
      }
    })
  }
}