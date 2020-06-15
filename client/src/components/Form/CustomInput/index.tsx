import Taro, { Component } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'

import './index.scss'

type Props = {
  onInput: Function
  name?: string
  value?: string | number
  placeholder?: string
  error?: string
}

const initialState = {
  isFocus: false
}

type State = Readonly<typeof initialState>

interface Index {
  props: Props
}

class Index extends Component {

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
    onInput({
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

    const hint = !!error ? error : placeholder

    return (
      <View className={inputClasses}>
        <View className='input__placeholder'>{hint}</View>
        <Input
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          className='input__content'
          value={value ? value!.toString() : ''}
          name={name}
          onInput={this.onInput}
          cursorSpacing={35}
        ></Input>
      </View>
    )
  }
}

export default Index