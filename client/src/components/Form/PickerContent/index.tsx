import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'

type Props =  {
  value?: string
  placeholder?: string
  error?: string
}

interface PickerContent {
  props: Props
}

class PickerContent extends Component {
  render() {
    const {
      value, placeholder, error
    } = this.props

    let pickerClasses = 'picker'
    if (value) pickerClasses += ' picker--fill'
    if (error) pickerClasses += ' picker--error'

    const hint = !!error ? error : placeholder

    return (
      <View className={pickerClasses}>
        <View className='picker__placeholder'>{hint}</View>
        <View className='picker__content'>{value}</View>
      </View>
    )
  }
}
export default PickerContent