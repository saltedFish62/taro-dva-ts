import BasicServices from './basic'
import { CreateTaskReq } from 'src/types';
import dayjs from 'dayjs'

const collection = 'todo'

export default class Todo extends BasicServices {

  create = async (req: CreateTaskReq): Promise<any> => {

    const id = await this.post({
      collection,
      data: req
    })

    return this.get({
      collection,
      id
    })

  }

  list = (): Promise<any> => {

    const today = dayjs().format('YYYY-MM-DD')
    return this.where({
      collection,
      data: {
        date: this.command.eq(today)
      }
    })

  }
}