import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'

type Props = {
  children: any
}

interface Index {
  props: Props
}

class Index extends Component {

  style() {
    const { safeArea } = Taro.getSystemInfoSync()
    return {
      paddingTop: safeArea.top + 'px'
    }
  }

  render() {
    return (
      <View className='safe-area--top' style={this.style()}>
        {this.props.children}
      </View>
    )
  }
}

export default Index
