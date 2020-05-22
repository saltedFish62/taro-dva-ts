import Taro, { Component, Config } from '@tarojs/taro'
import { ComponentClass } from 'react'
import { View } from '@tarojs/components'

import './index.scss'
import { connect } from '@tarojs/redux'

type OwnProps = {}

type ModelProps = {
  count: number
  dispatch: Function
}

interface Index {
  props: OwnProps & ModelProps
}

@connect(({ common }) => ({
  count: common.count,
}))
class Index extends Component {

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页'
  }

  render() {
    const { dispatch, count } = this.props

    return (
      <View className='index'>
        <View
          onClick={() => { dispatch({ type: 'common/asyncAdd' }) }}
        >Click me to add 1 async</View>
        <View>{count}</View>
      </View>
    )
  }
}

export default Index as ComponentClass<OwnProps>