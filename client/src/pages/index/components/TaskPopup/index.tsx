import {map} from 'lodash'
import Taro, { Component } from '@tarojs/taro'
import { View, Picker, Button } from '@tarojs/components'
import Popup from 'src/components/Popup'
import { CustomInput, PickerContent } from 'src/components/Form'

import './index.scss'
import { ComponentClass } from 'react'
import { connect } from '@tarojs/redux'
import dayjs from 'dayjs'

type OwnProps = {
  open: boolean
  onClose: Function
}

type ModelProps = {
  dispatch: Function
}

interface TaskPopup {
  props: OwnProps & ModelProps
}

const selectorRange = [
  map((new Array(7)), (_it, idx) => ({
    value: idx,
    text: idx + '小时'
  })),
  map((new Array(60)), (_it, idx) => ({
    value: idx,
    text: idx + '分钟'
  }))
]

const initialState = {
  selectorRange,
  plan: '',
  time: [],
  error: {},
}

type State = Readonly<typeof initialState>

@connect(({ }) => ({}))
class TaskPopup extends Component {

  state: State = initialState

  onTimeChange = ({ detail: { value } }) => {
    this.setState({ time: value })
  }

  onPlanInput = ({ value }) => {
    this.setState({ plan: value })
  }

  async submit() {
    const { onClose, dispatch } = this.props
    const { plan, time } = this.state

    if (!this.validateForm()) return

    let expireAt: Date | null = null
    if (time.length > 0) {
     expireAt = dayjs().endOf('day')
      .subtract(time[0] || 0, 'hour')
      .subtract(time[1] || 0, 'minute')
      .toDate()
    }

    await dispatch({
      type: 'index/createTask',
      payload: {
        expireAt,
        plan,
      }
    })
    
    onClose()
    this.clear()
  }

  clear() {
    this.setState({
      plan: '',
      time: [],
    })
  }

  validateForm() {
    const { plan, time } = this.state

    const error = {}

    if (!plan) {
      error['plan'] = '请输入事项'
    }

    if (time.length > 0 && time[0] == 0 && time[1] == 0) {
      error['time'] = '请选择正确的时间'
    }

    this.setState({ error })
    return Object.keys(error).length < 1
  }

  render() {
    const { open, onClose } = this.props

    const { plan, time, error, selectorRange } = this.state

    let timeText = ''
    if (selectorRange.length > 0 && time.length > 0) {
      timeText += selectorRange[0][time[0]].text
      timeText += selectorRange[1][time[1]].text
    }

    return (
      <Popup
        open={open}
        mask={true}
        onClose={onClose}
      >
        <View className='task'>
          <View className='title p-b'>一个事项:</View>
          <View className='p-b'>
            <CustomInput
              placeholder='要做什么'
              value={plan}
              error={error['plan']}
              onInput={this.onPlanInput}
            ></CustomInput>
          </View>
          <View className='p-b--large'>
            <Picker
              range={selectorRange}
              rangeKey='text'
              mode='multiSelector'
              onChange={this.onTimeChange}
              value={time}
            >
              <PickerContent
                placeholder='要用多久'
                value={timeText}
                error={error['time']}
              ></PickerContent>
            </Picker>
          </View>
          <View className='p-b'>
            <Button
              className='btn'
              onClick={this.submit}
            >确定</Button>
          </View>
        </View>
      </Popup>
    )
  }
}

export default TaskPopup as ComponentClass<OwnProps>