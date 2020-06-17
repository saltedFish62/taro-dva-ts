import Taro, { Component, Config } from '@tarojs/taro'
import { ComponentClass } from 'react'
import { View } from '@tarojs/components'

import './index.scss'
import { connect } from '@tarojs/redux'
import Header from './components/Header'
import Tasks from './components/Tasks'

// 上层组件传入的 props
type OwnProps = {}

// 由 model 传入的 props
type ModelProps = {
  loading: boolean
  dispatch: Function
}

interface Index {
  props: OwnProps & ModelProps
}

@connect(({ loading }) => ({
  loading: loading.models.index,
}))
class Index extends Component {

  config: Config = {
    navigationStyle: 'custom',
    backgroundColorTop: '#E0F2F1',
  }

  componentDidMount = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'index/fetchAim'
    })
    dispatch({
      type: 'index/fetchTasks'
    })

    Taro.navigateTo({ url: '/pages/detail/index' })
  }

  render() {
    const { loading } = this.props

    if (loading) {
      Taro.showLoading({ title: '加载中..' })
    } else {
      Taro.hideLoading()
    }

    return (
      <View>
        <Header></Header>
        <Tasks></Tasks>
      </View>
    )
  }
}

export default Index as ComponentClass<OwnProps>
