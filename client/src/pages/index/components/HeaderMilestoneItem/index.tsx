import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import { MilestoneState } from 'src/constants/enums'

import './index.scss'
import plusPng from 'src/assets/images/plus-dark.png'
import { Milestone } from 'src/types'

type OwnProps = {
  add?: boolean
} & Milestone

interface MilestoneItem {
  props: OwnProps
}

class MilestoneItem extends Component {

  render() {
    const {
      aim, state, desc, reward, rewarded, result, add
    } = this.props

    if (add) {
      return (
        <View className='milestone--add'>
          <Image className='milestone--add__icon' src={plusPng}></Image>
          <View className='milestone__aim'>设立一个新的里程碑</View>
        </View>
      )
    }

    return (
      <View className='milestone'>
        <View className='milestone__aim m-b'>
          {
            (state === MilestoneState.Achieved ? '已完成: ' : '目标: ') + aim
          }
        </View>
        <View className='milestone__desc flex-1'>
          {
            state === MilestoneState.Achieved ? '结果: ' + result : desc
          }
        </View>
        <View className={'milestone__desc' + rewarded ? 'milestone__desc--rewarded' : ''}>奖励: {reward}</View>
      </View>
    )
  }
}

export default MilestoneItem