import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'

type Props = {
  open: boolean
  mask: boolean
  onClose: Function
  children: any
}

const initialState = {
  safeBottomPadding: 0,
  popupHeight: 0,
  pullingStart: 0,
  pullingOffset: 0,
}

type State = Readonly<typeof initialState>

interface Index {
  props: Props
}

class Index extends Component {

  static defaultProps = {
    open: false,
    mask: false
  }

  state: State = {
    safeBottomPadding: 0,
    popupHeight: 0,
    pullingStart: 0,
    pullingOffset: 0,
  }

  componentDidMount() {
    const sys = Taro.getSystemInfoSync()
    const safeBottomPadding = sys.screenHeight - sys.safeArea.bottom
    this.setState({ safeBottomPadding })
  }

  disableEvent(e: { stopPropagation: () => void; }) {
    e.stopPropagation()
  }

  onPullingStart({ changedTouches }) {
    Taro.createSelectorQuery()
      .in(this.$scope)
      .selectAll('.popup__container')
      .boundingClientRect()
      .exec(res => {
        this.setState({
          popupHeight: res[0][0].height
        })
      })
    this.setState({
      pullingStart: changedTouches[0].clientY
    })
  }

  onPulling(e) {
    e.stopPropagation()
    const clientY = e.changedTouches[0].clientY

    const { pullingStart, popupHeight } = this.state

    let pullingOffset = Math.floor((clientY - pullingStart) / popupHeight * 100)
    pullingOffset = pullingOffset < 0 ? 0 : pullingOffset
    this.setState({ pullingOffset })
  }

  onPullingEnd({ changedTouches }) {
    const clientY = changedTouches[0].clientY
    const { pullingStart } = this.state

    if (pullingStart == 0) {
      return
    }

    if (clientY - pullingStart > 120) {
      this.props.onClose()
    }
    setTimeout(() => {
      this.setState({
        pullingOffset: 0,
        pullingStart: 0,
      })
    }, 0)
  }

  render() {
    const {
      open, mask, onClose
    } = this.props

    const {
      safeBottomPadding, pullingOffset, pullingStart
    } = this.state

    const containerStyle = {
      paddingBottom: safeBottomPadding + 'px;',
    }

    if (pullingOffset > 0 && pullingStart > 0) {
      containerStyle['transition'] = 'none;'
    }

    if (pullingOffset > 0) {
      containerStyle['transform'] = `translateY(${pullingOffset}%);`
    }

    return (
      <View className={(open ? 'popup--actived' : '') + ' popup'}>
        <View
          className={mask ? 'popup__mask' : 'popup__mask--transparent'}
          onClick={(_) => { onClose() }}
          onTouchMove={this.disableEvent}
        ></View>
        <View
          className='popup__container'
          style={containerStyle}
        >
          <View
            onTouchMove={this.onPulling}
            onTouchStart={this.onPullingStart}
            onTouchEnd={this.onPullingEnd}
            onClick={this.disableEvent}
            className='popup__pull-down'>
            <View className='popup__pull-down__btn'></View>
          </View>
          <View
            onTouchMove={this.disableEvent}
          >
            {this.props.children}
          </View>
        </View>
      </View>
    )
  }
}

export default Index
