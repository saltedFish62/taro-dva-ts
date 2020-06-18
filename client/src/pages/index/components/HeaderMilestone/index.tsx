import Taro, { Component } from '@tarojs/taro'
import { orderBy } from 'lodash'
import { View, Swiper, SwiperItem } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { ComponentClass } from 'react'

import MilestonePopup from '../MilestonePopup'
import MilestoneItem from '../HeaderMilestoneItem'

import './index.scss'
import { Milestone } from 'src/types'
import { MilestoneState } from 'src/constants/enums'

type OwnProps = {}

type ModelProps = {
  list: Milestone[]
  current: number
  aimId: number | string
  dispatch: Function
}

interface HeaderMilestone {
  props: OwnProps & ModelProps
}

const initialState = {
  milestonePopup: false,

  swiperConfig: {
    'indicator-dots': false,
    'indicator-color': '#999',
    'indicator-active-color': '#fff',
    'autoplay': false,
    'interval': 1000,
    'duration': 500,
    'circular': false,
    'vertical': false,
    'previous-margin': '0rpx',
    'next-margin': '80rpx',
    'display-multiple-items': 1,
    'easing-function': 'easeInOutCubic',
  },
}

type State = Readonly<typeof initialState>

@connect(({ index }) => {
  let current = 0
  const list = orderBy(index.milestones, 'state', 'desc')
  if (list) {
    current = list.findIndex(it => it.state === MilestoneState.Current)
    current = current === -1 ? list.length : current
  }
  return {
    current, list, aimId: index.aim.id
  }
})
class HeaderMilestone extends Component {

  state: State = initialState

  closeMilestonePopup = () => {
    this.setState({ milestonePopup: false })
  }

  openMilestonePopup = () => {
    const { aimId, dispatch } = this.props
    if (aimId) {
      this.setState({ milestonePopup: true })
    } else {
      dispatch({ type: 'index/openAimPopup' })
    }
  }

  onMilestoneItemTap = (e) => {
    console.log(e)
  }

  render() {
    const {
      swiperConfig, milestonePopup,
    } = this.state
    const {
      list, current
    } = this.props
    return (
      <View className="milestone-container">
        <MilestonePopup
          open={milestonePopup}
          onClose={this.closeMilestonePopup}
        ></MilestonePopup>
        <Swiper
          indicatorDots={swiperConfig['indicator-dots']}
          indicatorColor={swiperConfig['indicator-color']}
          indicatorActiveColor={swiperConfig['indicator-active-color']}
          autoplay={swiperConfig['autoplay']}
          interval={swiperConfig['interval']}
          duration={swiperConfig['duration']}
          circular={swiperConfig['circular']}
          vertical={swiperConfig['vertical']}
          previousMargin={swiperConfig['previous-margin']}
          nextMargin={swiperConfig['next-margin']}
          displayMultipleItems={swiperConfig['display-multiple-items']}
          easingFunction={swiperConfig['easing-function'] as any}
          current={current}
          className='milestones'
        >
          {
            list.map((it) => {
              return (
                <SwiperItem
                  key={it.id}
                  itemId={it.id as string}
                  onClick={this.onMilestoneItemTap}
                >
                  <MilestoneItem {...it}></MilestoneItem>
                </SwiperItem>
              )
            })
          }
          <SwiperItem
            key='add'
            itemId='add'
            onClick={this.openMilestonePopup}
          >
            <MilestoneItem add={true}></MilestoneItem>
          </SwiperItem>
        </Swiper>
      </View>
    )
  }
}
export default HeaderMilestone as ComponentClass<OwnProps>