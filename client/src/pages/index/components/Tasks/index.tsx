import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { ComponentClass } from 'react'

import TaskPopup from '../TaskPopup'
import TaskList from '../TasksList'

import PlusGreenPng from 'src/assets/images/plus-green.png'
import './index.scss'

type OwnProps = {}

interface Tasks {
  props: OwnProps
}

const initialState = {
  taskPopupOpen: false
}

type State = Readonly<typeof initialState>

class Tasks extends Component {

  state: State = initialState

  openTaskPopup = () => { this.setState({ taskPopupOpen: true }) }
  closeTaskPopup = () => { this.setState({ taskPopupOpen: false }) }

  render() {
    const {
      taskPopupOpen,
    } = this.state

    return (
      <View className='task'>
        <View className='task__header'>
          <View className='task__header__title'>今日安排</View>
          <Image
            className='task__header__plus'
            src={PlusGreenPng}
            onClick={this.openTaskPopup}
          ></Image>
        </View>

        <TaskList></TaskList>

        <TaskPopup
          open={taskPopupOpen}
          onClose={this.closeTaskPopup}
        ></TaskPopup>
      </View>
    )
  }
}
export default Tasks as ComponentClass<OwnProps>