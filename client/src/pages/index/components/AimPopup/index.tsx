import Taro, { Component } from '@tarojs/taro'
import { View, Button, Picker } from '@tarojs/components'
import Popup from 'src/components/Popup'
import { CustomInput, PickerContent } from 'src/components/Form'
import Dayjs from 'dayjs'
import { connect } from '@tarojs/redux'

import { toToday } from 'src/utils/format'

import './index.scss'
import { ComponentClass } from 'react'

type Props = {
  open: boolean
  dispatch: Function
}

type OwnProps = {}

const initialState = {
  aim: '',
  slogan: '',
  date: '',
  error: {},
  today: Dayjs().format('YYYY-MM-DD'),
}

type State = Readonly<typeof initialState>

interface AimPopup {
  props: Props & OwnProps
}

@connect(({ index }) => ({
  open: index.aim.popupVisibility,
}))
class AimPopup extends Component {
  // this.validator = validator({
  //   aim: {
  //     rules: 'required|maxlength:8',
  //     message: {
  //       required: '还没想好目标么',
  //       maxlength: '简练的描述更有力量'
  //     }
  //   },
  //   slogan: {
  //     rules: 'maxlength:50',
  //     message: '勉励的话说太多了'
  //   }
  // })

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

  submit = () => {
    if (!this.validateForm()) return

    const {
      aim, slogan, date
    } = this.state

    const {
      dispatch
    } = this.props

    dispatch({
      type: 'index/createAim',
      payload: {
        aim, slogan, date,
      }
    })
  }

  validateForm() {
    // todo: validate

    // const {
    //   aim, slogan, date
    // } = this.state
    return true

    // if (this.validator.checkForm({
    //   aim, slogan, date
    // })) return true

    // const error = {}
    // this.validator.errorList.forEach(it => {
    //   error[it.param] = it.msg
    // })

    // this.setState({
    //   error
    // })
    // return this.validator.valid()
  }

  onClose = () => {
    this.props.dispatch({
      type: 'index/closeAimPopup'
    })
  }

  render() {
    const {
      open
    } = this.props

    const {
      aim, slogan, date, error, today
    } = this.state

    return (
      <Popup open={open} onClose={this.onClose} mask>
        <View className='form'>
          <View className='title p-b'>设立征程的目的地:</View>
          <View className='p-b'>
            <CustomInput
              placeholder='远大的抱负用八个字足以形容'
              name='aim'
              value={aim}
              onInput={this.onInput}
              error={error['aim']}
            ></CustomInput>
          </View>
          <View className='p-b'>
            <CustomInput
              placeholder='再写一句勉励自己'
              name='slogan'
              value={slogan}
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
            >开启征程</Button>
          </View>
        </View>
      </Popup>
    )
  }
}

export default AimPopup as ComponentClass<OwnProps>