import Taro, { Component } from '@tarojs/taro'
import { View, Textarea } from '@tarojs/components'

import './index.scss'

type Props = {
  onInput?: Function
  name?: string
  value?: string | number
  placeholder?: string
  error?: string
}

const initialState = {
  isFocus: false
}

type State = Readonly<typeof initialState>

interface CustomTextarea {
  props: Props
}

class CustomTextarea extends Component {

  state: State = initialState

  onFocus() {
    this.setState({
      isFocus: true
    })
  }

  onBlur() {
    this.setState({
      isFocus: false
    })
  }

  onInput({ detail }) {
    const { onInput, name } = this.props
    onInput!({
      ...detail,
      name,
    })
  }

  render() {
    const {
      value, placeholder, error, name,
    } = this.props
    const {
      isFocus,
    } = this.state

    let inputClasses = 'input'
    if (isFocus || value) inputClasses += ' input--focus'
    if (error) inputClasses += ' input--error'

    let hint = !!error ? error : placeholder

    return (
      <View className={inputClasses}>
        <View className='input__placeholder'>{hint}</View>
        <Textarea
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          className='input__content'
          value={value ? value!.toString() : ''}
          name={name}
          onInput={this.onInput}
          cursorSpacing={35}
        ></Textarea>
      </View>
    )
  }
}

export default CustomTextarea