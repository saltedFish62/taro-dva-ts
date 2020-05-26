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

type OwnProps = Task

interface TaskItem {
  props: OwnProps
}

class TaskItem extends Component {
  render() {
    const {
      plan, state
    } = this.props

    let png: string
    switch (state) {
      case TaskState.Doing:
        png = TimePng
        break
      case TaskState.Finished:
        png = CheckPng
        break
      case TaskState.Waiting:
        png = QuestionPng
        break
      default:
        png = TimePng
    }

    return (
      <View className='item'>
        <Image className='item__icon' src={png}></Image>
        <View className='item__title'>{plan}</View>
      </View>
    )
  }
}
export default TaskItem as ComponentClass<OwnProps>