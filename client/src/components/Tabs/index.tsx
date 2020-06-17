import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import classNames from 'classnames'

import './index.scss'
import { ComponentClass } from 'react'

export type Tab = {
  title: string
}

type Props = {
  current?: string | number
  tabList: Array<Tab>
  onChange?: Function
  background?: string
  color?: string
}

interface Index {
  props: Props
}

class Index extends Component {
  public static defaultProps: Props

  handleTabClick = (idx: number) => {
    const { onChange } = this.props
    onChange ? onChange(idx) : null
  }

  render() {
    const {
      tabList,
      current,
      color,
      background
    } = this.props
    const tabItems = tabList.map((it, idx) => (
      <View
        key={it.title}
        className={classNames({
          'tab-item': true,
          'tab-item--active': idx === current
        })}
        onClick={(e) => { this.handleTabClick(idx) }}
      >{it.title}</View>
    ))
    return (
      <View
        className="tabs"
        style={{
          color: color,
          background: background,
        }}
      >
        {tabItems}
      </View>
    )
  }
}

Index.defaultProps = {
  current: 0,
  tabList: [],
  background: '',
  color: '#000'
}

export default Index as ComponentClass<Props>