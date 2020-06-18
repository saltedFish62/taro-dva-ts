import Taro, { Component, Config } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { Aim, Milestone } from 'src/types'
import { toToday } from 'src/utils/format'
import { ComponentClass } from 'react'
import { map } from 'lodash'

import { View, Image } from '@tarojs/components'
import Tabs from 'src/components/Tabs'
import MilestoneList from './components/List'
import AimPopup from './components/AimPopup'

import './index.scss'
import PlusIcon from 'src/assets/images/plus-white.png'
import TimeIcon from 'src/assets/images/time-white.png'
import DeleteIcon from 'src/assets/images/delete-white.png'
import FlagIcon from 'src/assets/images/flag-white.png'
import { AimState } from 'src/constants/enums'

// 上层组件传入的 props
type OwnProps = {}

// 由 model 传入的 props
type ModelProps = {
  aim: Aim
  milestones: Array<Milestone>
  dispatch: Function
  loading: boolean
}

interface Index {
  props: OwnProps & ModelProps
}

const initialState = {
  current: 0,
  tabs: [
    { title: '全部里程碑' },
    { title: '待达成' },
    { title: '待奖励' },
    { title: '已终结' }
  ],
  lists: map(new Array(4), () => []),

  aimPopup: false,
}

type State = Readonly<typeof initialState>

@connect(({ index, loading }) => ({
  aim: index.aim,
  milestones: index.milestones,
  loading: loading.models.index
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
    const { aim } = this.props
    this.refs.aimPopup.init(aim)
    this.setState({
      aimPopup: true
    })
  }

  handleUpdateAim = async (updatingAim) => {
    const { aim } = this.props
    const req = {
      id: aim.id,
      title: updatingAim.title,
      subtitle: updatingAim.subtitle,
      date: updatingAim.date
    }

    await this.props.dispatch({
      type: 'index/updateAim',
      payload: req
    })
    this.setState({ aimPopup: false })
  }

  handleFinishAim = () => {
    Taro.showModal({
      title: '祝贺你！',
      content: '这将意味着你完成了这一目标！',
      cancelText: '稍等一下',
      confirmText: '完成！',
      confirmColor: '#52c41a',
      success: async res => {
        if (res.confirm) {
          const { aim, dispatch } = this.props
          await dispatch({
            type: 'index/updateAim',
            payload: {
              id: aim.id,
              state: AimState.Achieved
            }
          })
          Taro.showToast({
            title: '继续加油',
          })
          await dispatch({
            type: 'index/clearAim',
          })
          setTimeout(() => {
            Taro.navigateBack({ delta: 1 })
          }, 2000)
        }
      }
    })
  }

  handleSuspendAim = () => {
    console.log('click aim suspend')
  }

  handleDeleteAim = () => {
    console.log('click aim delete')
  }

  handleTabsChange = (idx) => {
    this.setState({
      current: idx
    })
  }

  handleAddClick = () => {
    console.log('click add')
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
      <View className='aim'>
        <View
          className='aim__title'
          onClick={this.handleAimClick}
        >{title ? title : '做有目标的咸鱼'}</View>
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
    const { current, tabs, aimPopup } = this.state
    const { milestones, loading } = this.props

    if (loading) {
      Taro.showLoading({ title: '加载中..' })
    } else {
      Taro.hideLoading()
    }

    return (
      <View>
        {this.renderHeader()}
        <View className="tabs-bar">
          <Tabs
            tabList={tabs}
            current={current}
            color="#fff"
            onChange={this.handleTabsChange}
          ></Tabs>
          <Image
            className="add-btn"
            src={PlusIcon}
            onClick={this.handleAddClick}
          ></Image>
        </View>
        <MilestoneList list={milestones}></MilestoneList>
        <AimPopup
          open={aimPopup}
          onClose={() => this.setState({ aimPopup: false })}
          onSubmit={this.handleUpdateAim}
          ref='aimPopup'
        ></AimPopup>
      </View>
    )
  }
}

export default Index as ComponentClass<OwnProps>
