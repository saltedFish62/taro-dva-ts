import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtSwipeAction } from "taro-ui"

import './index.scss'
import { ComponentClass } from 'react'
import { Milestone } from 'src/types'
import { MilestoneState } from 'src/constants/enums'

type Props = {
  list: Array<Milestone>
}

interface Index {
  props: Props
}

const initialState = {
  openedIdx: -1
}

type State = Readonly<typeof initialState>

class Index extends Component {
  static defaultProps: Props

  state: State = initialState

  getOptions = (title: string) => {
    const result = [
      { text: '删除', style: { background: '#FF7A45', color: '#fff' } },
    ]
    return !!title ? result.concat([{ text: title, style: { background: '#009688', color: '#fff' } }]) : result
  }

  mapState2Title(state: MilestoneState) {
    switch (state) {
      case MilestoneState.Current: return '完成'
      case MilestoneState.Achieved: return '奖励'
      case MilestoneState.Rewarded: return ''
      default: return ''
    }
  }

  deleteItem = (idx) => {
    console.log('delete', idx)
  }

  forwardItem = (idx) => {
    console.log('forward', idx)
  }

  handleOpenItem = (idx) => {
    this.setState({
      openedIdx: idx
    })
  }

  handleClickOption = (optionIdx: number, idx: number) => {
    switch (optionIdx) {
      case 0: this.deleteItem(idx); break;
      case 1: this.forwardItem(idx); break;
      default: break
    }
  }

  render() {
    const { list } = this.props
    const { openedIdx } = this.state
    return (
      <View className='list'>
        {
          list.map((it, idx) => (
            <View
              className="list-item"
              key={it.id}
            >
              <AtSwipeAction
                onClick={(_option, optionIdx, _e) => { this.handleClickOption(optionIdx, idx) }}
                onOpened={(_e) => { this.handleOpenItem(idx) }}
                isOpened={idx === openedIdx}
                options={this.getOptions(this.mapState2Title(it.state!))}
              >
                <View className="list-item__content">
                  <View className="list-item__content__aim">
                    {it.state === MilestoneState.Achieved ? '已完成：' : '目标：' + it.aim}
                  </View>
                  <View className="list-item__content__desc">
                    {it.state === MilestoneState.Achieved ? it.result : it.desc}
                  </View>
                  <View className="list-item__content__reward">
                    {'奖励：' + it.reward}
                  </View>
                </View>
              </AtSwipeAction>
            </View>
          ))
        }
      </View>
    )
  }
}

Index.defaultProps = {
  list: []
}

export default Index as ComponentClass<Props>