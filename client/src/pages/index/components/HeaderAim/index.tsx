import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { toToday } from 'src/utils/format'
import './index.scss'
import { ComponentClass } from 'react'
import { Aim } from 'src/types'

type ModelProps = {
  dispatch: Function
} & Aim

type OwnProps = {}

interface HeaderAim {
  props: ModelProps
}

@connect(({ index }) => ({
  ...index.aim
}))
class HeaderAim extends Component {
  render() {
    const {
      title, subtitle, date, dispatch
    } = this.props

    return (
      <View className='aim' onClick={() => { dispatch({ type: 'index/openAimPopup' }) }}>
        <View className='aim__title'>{title ? title : '做有目标的咸鱼'}</View>
        <View className='aim__subtitle'>
          {`${toToday(date)}${date ? '，' : ''}${subtitle ? subtitle : '所有的努力都是灌溉自己。'}`}
        </View>
      </View>
    )
  }
}

export default HeaderAim as ComponentClass<OwnProps>
