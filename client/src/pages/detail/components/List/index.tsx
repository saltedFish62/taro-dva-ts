import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'
import { ComponentClass } from 'react'
import { Milestone } from 'src/types'

type Props = {
  list: Array<Milestone>
}

interface Index {
  props: Props
}

const initialState = {
  options: [
    { text: '删除', style: {background: '#FF7A45', color: '#fff'}},
    { text: '', style: {background: '#009688', color: '#fff'}},
  ]
}

class Index extends Component {
  render() {
    return (
      <View></View>
    )
  }
}

export default Index as ComponentClass<Props>