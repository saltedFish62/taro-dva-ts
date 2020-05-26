import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'

const initialState = {
  safeBottomPadding: 0
}

type State  = Readonly<typeof initialState>

type Props = {
  children: any
}

interface SafeAreaBottom {
  props: Props
}

class SafeAreaBottom extends Component {

  state: State = initialState

  componentDidMount() {
    const system = Taro.getSystemInfoSync()
    const safeBottomPadding = system.screenHeight - system.safeArea.bottom
    this.setState({ safeBottomPadding })
  }

  render() {
    const {
      safeBottomPadding
    } = this.state
    return (
      <View className='safe-area' style={{paddingBottom: safeBottomPadding + 'px;'}}>
        <View className='content'>{this.props.children}</View>
      </View>
    )
  }
}

export default SafeAreaBottom