import Taro, { Component, ComponentClass } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import Popup from 'src/components/Popup'
import { CustomInput, CustomTextarea } from 'src/components/Form'

import './index.scss'

type OwnProps = {
  open: boolean
  onClose: Function
}

type ModelProps = {
  dispatch: Function
}

interface MilestonePopup {
  props: OwnProps & ModelProps
}

const initialState = {
  aim: '',
  desc: '',
  reward: '',

  error: {},
}

type State = Readonly<typeof initialState>

@connect(() => ({}))
class MilestonePopup extends Component {

  state: State = initialState

  async submit() {
    if (!this.validateForm()) return

    const { dispatch, onClose } = this.props
    const { aim, desc, reward } = this.state
    await dispatch({
      type: 'index/createMilestone',
      payload: {
        aim, desc, reward
      }
    })
    onClose && onClose()
    this.clearState()
  }

  clearState() {
    this.setState(initialState)
  }

  validateForm(): boolean {
    const {
      aim, reward
    } = this.state

    const error = {}

    if (!aim) {
      error['aim'] = '取名也是仪式感的一部分'
    }
    if (!reward) {
      error['reward'] = '哪怕丰盛点的麻辣烫也是奖励呢'
    }

    this.setState({ error })
    return Object.keys(error).length < 1
  }

  onInput = ({ name, value }) => {
    this.setState({
      [name]: value
    })
  }

  render() {
    const {
      open, onClose
    } = this.props

    const {
      aim, desc, reward, error
    } = this.state

    return (
      <Popup
        open={open}
        mask
        onClose={onClose}
      >
        <View className='milestone'>
          <View className='title p-b'>里程碑:</View>
          <View className='p-b'>
            <CustomInput
              placeholder='为即将踏出的一步命名'
              name='aim'
              value={aim}
              error={error['aim']}
              onInput={this.onInput}
            ></CustomInput>
          </View>
          <View className='p-b'>
            <CustomTextarea
              placeholder='写下周全的计划'
              name='desc'
              value={desc}
              onInput={this.onInput}
            ></CustomTextarea>
          </View>
          <View className='p-b--large'>
            <CustomInput
              placeholder='干完这一票，就要这样犒劳自己'
              name='reward'
              value={reward}
              error={error['reward']}
              onInput={this.onInput}
            ></CustomInput>
          </View>
          <View className='p-b'>
            <Button
              className='btn'
              onClick={this.submit}
            >立下里程碑</Button>
          </View>
        </View>
      </Popup>
    )
  }
}

export default MilestonePopup as ComponentClass<OwnProps>