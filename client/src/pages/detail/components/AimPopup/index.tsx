import Taro, { Component } from '@tarojs/taro'
import { View, Button, Picker } from '@tarojs/components'
import Popup from 'src/components/Popup'
import { CustomInput, PickerContent } from 'src/components/Form'
import Dayjs from 'dayjs'
import { Aim } from 'src/types'
import { toToday } from 'src/utils/format'

import './index.scss'
import { ComponentClass } from 'react'

type Props = {
  open: boolean
  onClose: Function
  onSubmit: Function
}

interface Index {
  props: Props
}

const initialState = {
  title: '',
  subtitle: '',
  date: '',
  error: {},
  today: Dayjs().format('YYYY-MM-DD'),
}

type State = Readonly<typeof initialState>

class Index extends Component {

  static defaultProps: Props

  state: State = initialState

  onInput = ({ name, value }) => {
    this.setState({
      [name]: value
    })
  }

  onDateChange = ({ detail: { value } }) => {
    this.setState({
      date: value
    })
  }

  init = (aim: Aim) => {
    this.setState({
      title: aim.title,
      subtitle: aim.subtitle,
      date: aim.date ? Dayjs(aim.date).format('YYYY-MM-DD') : ''
    })
  }

  submit = () => {
    if (!this.validateForm()) return

    const {
      title, subtitle, date
    } = this.state

    const {
      onSubmit
    } = this.props

    onSubmit && onSubmit({
      title, subtitle, date
    })
  }

  validateForm() {
    const {
      title, subtitle
    } = this.state

    const error = {}
    if (!title) {
      error['title'] = '还没想好目标么'
    }
    if (title.length > 8) {
      error['title'] = '简练的描述更有力量'
    }
    if (subtitle && subtitle.length > 50) {
      error['subtitle'] = '勉励的话说太多了'
    }

    this.setState({
      error
    })
    return Object.keys(error).length < 1
  }

  onClose = () => {
    const { onClose } = this.props
    onClose && onClose()
  }

  render() {
    const {
      open
    } = this.props

    const {
      error, today, title, subtitle, date
    } = this.state


    return (
      <Popup open={open} onClose={this.onClose} mask>
        <View className='form'>
          <View className='title p-b'>修改这个目标:</View>
          <View className='p-b'>
            <CustomInput
              placeholder='远大的抱负用八个字足以形容'
              name='title'
              value={title}
              onInput={this.onInput}
              error={error['title']}
            ></CustomInput>
          </View>
          <View className='p-b'>
            <CustomInput
              placeholder='再写一句勉励自己'
              name='subtitle'
              value={subtitle}
              onInput={this.onInput}
            ></CustomInput>
          </View>
          <View className='p-b--large'>
            <Picker
              mode='date'
              onChange={this.onDateChange}
              value={date}
              start={today}
            >
              <PickerContent
                placeholder='死线是最高生产力'
                value={date ? `${date}   ${toToday(new Date(date))}` : ''}
              ></PickerContent>
            </Picker>
          </View>
          <View className='p-b'>
            <Button
              className='btn'
              onClick={this.submit}
            >修正航线</Button>
          </View>
        </View>
      </Popup>
    )
  }
}

Index.defaultProps = {
  open: false,
  onClose: () => { },
  onSubmit: () => { }
}

export default Index as ComponentClass<Props>