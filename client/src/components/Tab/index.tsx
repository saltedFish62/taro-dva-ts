import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'
import { ComponentClass } from 'react'

type Props = {
}

interface Index {
  props: Props
}

class Index extends Component {
  render() {
    return (
      <View></View>
    )
  }
}

export default Index as ComponentClass<Props>