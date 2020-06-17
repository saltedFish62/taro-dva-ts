import { CreateTaskReq } from 'src/types';
import cr from 'src/lib/cloud_request'
import dayjs from 'dayjs'

const collection = 'todo'

export default class Todo {

  create = async (req: CreateTaskReq): Promise<any> => {

    const id = await cr.post({
      collection,
      data: req
    })

    return cr.get({
      collection,
      id
    })

  }

  list = (): Promise<any> => {

    const today = dayjs().format('YYYY-MM-DD')
    return cr.where({
      collection,
      data: {
        date: cr.command.eq(today)
      }
    })

  }
}