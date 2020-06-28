import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { ComponentClass } from 'react'
import className from 'classnames'

import './index.scss'
import TimePng from 'src/assets/images/time-orange.png'
import QuestionPng from 'src/assets/images/question-dark.png'
import CheckPng from 'src/assets/images/check-green.png'
import UrgentPng from 'src/assets/images/exclamation-red.png'
import DeletePng from 'src/assets/images/delete-red.png'
import { TaskState } from 'src/constants/enums'
import { Task } from 'src/types'
import dayjs from 'dayjs'

type OwnProps = {
  open: boolean
  onOpen: Function
  onClose: Function
  onChange: Function
} & Task

interface TaskItem {
  props: OwnProps
}

class TaskItem extends Component {
  static defaultProps: OwnProps

  getCurrentPng = () => {
    const { state, minutes } = this.props
    if (dayjs().add(minutes + 60, 'minute').isAfter(dayjs().endOf('day'))) {
      return UrgentPng
    }
    switch (state) {
      case TaskState.Doing:
        return TimePng
      case TaskState.Finished:
        return CheckPng
      case TaskState.Waiting:
        return QuestionPng
      default:
        return TimePng
    }
  }

  getActions = () => {
    const { state } = this.props
    switch (state) {
      case TaskState.Doing:
        return [{
          nextState: TaskState.Finished,
          png: CheckPng
        }]
      case TaskState.Waiting:
        return [{
          nextState: TaskState.Doing,
          png: TimePng
        }, {
          nextState: TaskState.Finished,
          png: CheckPng
        }]
      case TaskState.Finished:
        return []
      default:
        return [
          {
            nextState: TaskState.Finished,
            png: CheckPng
          }
        ]
    }
  }

  handleToggleActions = () => {
    const { onOpen, onClose, open } = this.props
    open ? (onClose && onClose()) : (onOpen && onOpen())
  }

  handleAction = (state) => {
    const { onChange } = this.props
    onChange && onChange(state)
  }

  render() {
    const {
      plan, open
    } = this.props

    const list = this.getActions()
    list.push({
      nextState: -1,
      png: DeletePng
    })

    return (
      <View className='item'>
        <View
          className='item__icon'
          onClick={this.handleToggleActions}
        >
          <Image className='item__icon--current' src={this.getCurrentPng()}></Image>
        </View>
        <View
          className={
            className({
              'scroll-actions': 1,
              'scroll-actions__open': open,
            })
          }
        >
          {list.map((it, idx) => (
            <Image
              key={idx}
              src={it.png}
              className={
                className({
                  'item__icon': 1,
                  'item__icon--open': 1
                })
              }
              onClick={() => { this.handleAction(it.nextState) }}
            ></Image>
          ))}
        </View>
        <View className='item__title'>{plan}</View>
      </View>
    )
  }
}

TaskItem.defaultProps = {
  state: TaskState.Waiting,
  plan: '',
  minutes: 0,
  sort: -1,
  open: false,
  onOpen: () => { },
  onClose: () => { },
  onChange: () => { },
}

export default TaskItem as ComponentClass<OwnProps>