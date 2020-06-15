import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.scss'
import { connect } from '@tarojs/redux'
import { Aim, Milestone } from 'src/types'
import { toToday } from 'src/utils/format'
import { ComponentClass } from 'react'

import Tabs from 'src/components/Tabs'
import Tab from 'src/components/Tab'

import PlusIcon from 'src/assets/images/plus-white.png'
import TimeIcon from 'src/assets/images/time-white.png'
import DeleteIcon from 'src/assets/images/delete-white.png'
import FlagIcon from 'src/assets/images/flag-white.png'

// 上层组件传入的 props
type OwnProps = {}

// 由 model 传入的 props
type ModelProps = {
  aim: Aim
  milestones: Array<Milestone>
}

interface Index {
  props: OwnProps & ModelProps
}

const initialState = {
  current: 0,
}

type State = Readonly<typeof initialState>

@connect((store) => ({
  aim: store.index.aim,
  milestones: store.index.milestones,
}))
class Index extends Component {

  state: State = initialState

  config: Config = {
    navigationBarBackgroundColor: '#009688',
    navigationBarTextStyle: 'white',
    navigationBarTitleText: '目标',
    backgroundColorTop: '#009688',
  }

  handleAimClick = () => {

  }

  handleFinishAim = () => {
    console.log('click aim finish')
  }

  handleSuspendAim = () => {
    console.log('click aim suspend')
  }

  handleDeleteAim = () => {
    console.log('click aim delete')
  }

  renderHeader() {
    const { aim: { title, subtitle, date } } = this.props

    const actions = [
      {
        icon: FlagIcon,
        title: '完成',
        cb: this.handleFinishAim
      },
      {
        icon: TimeIcon,
        title: '挂起',
        cb: this.handleSuspendAim
      },
      {
        icon: DeleteIcon,
        title: '放弃',
        cb: this.handleDeleteAim
      },
    ]

    return (
      <View className='aim' onClick={this.handleAimClick}>
        <View className='aim__title'>{title ? title : '做有目标的咸鱼'}</View>
        <View className='aim__subtitle'>
          {`${toToday(date)}${date ? '，' : ''}${subtitle ? subtitle : '所有的努力都是灌溉自己。'}`}
        </View>
        <View className="aim__actions">
          {
            actions.map(it => {
              return (
                <View
                  className="aim__action-item"
                  key={it.title}
                  onClick={it.cb}
                >
                  <Image
                    className="aim__action-item__icon"
                    src={it.icon}
                  ></Image>
                  <View className="aim__action-item__title">
                    {it.title}
                  </View>
                </View>
              )
            })
          }
        </View>
      </View>
    )
  }

  render() {
    const { current } = this.state
    return (
      <View>
        {this.renderHeader()}
        <Tabs current={current}>
          <Tab></Tab>
        </Tabs>
      </View>
    )
  }
}

export default Index as ComponentClass<OwnProps>
