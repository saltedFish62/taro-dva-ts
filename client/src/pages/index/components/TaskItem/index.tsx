import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { ComponentClass } from 'react'

import './index.scss'
import TimePng from 'src/assets/images/time-orange.png'
import QuestionPng from 'src/assets/images/question-dark.png'
import CheckPng from 'src/assets/images/check-green.png'
import UrgentPng from 'src/assets/images/exclamation-red.png'
import { TaskState } from 'src/constants/enums'
import { Task } from 'src/types'

type OwnProps = {
  open: boolean
} & Task

interface TaskItem {
  props: OwnProps
}

class TaskItem extends Component {
  static defaultProps: OwnProps

  getCurrentPng = () => {
    const { state, minutes } = this.props
    if (1) {
      // TODO: 时间紧迫
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

  render() {
    const {
      plan,
    } = this.props

    return (
      <View className='item'>
        <View className="item__icon">
          <Image className='item__icon--current' src={this.getCurrentPng()}></Image>
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
}

export default TaskItem as ComponentClass<OwnProps>