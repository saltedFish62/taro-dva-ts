import Taro, { useState } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { toToday } from 'src/utils/format'

import SafeAreaTop from 'src/components/SafeAreaTop'
import HeaderMilestone from '../HeaderMilestone'
import AimPopup from '../AimPopup'

import './index.scss'

const defaultProps = {
  aim: {
    title: '',
    subtitle: '',
    date: '',
    id: ''
  }
}

function Header(props) {
  const [aimPopup, setAimPopup] = useState(false)

  const { aim: { title, subtitle, date, id } } = props

  const handleClickAim = () => {
    if (!id) {
      setAimPopup(true)
    } else {
      Taro.navigateTo({
        url: "/pages/detail/index",
      })
    }
  }

  return (
    <View className='header'>
      <AimPopup open={aimPopup} onClose={() => { setAimPopup(false) }}></AimPopup>
      <View className='header__bg'></View>
      <SafeAreaTop>
        <View className='header__content'>
          <View className='header__content__aim'>
            <View className='aim' onClick={handleClickAim}>
              <View className='aim__title'>{title ? title : '做有目标的咸鱼'}</View>
              <View className='aim__subtitle'>
                {`${toToday(date)}${date ? '，' : ''}${subtitle ? subtitle : '所有的努力都是灌溉自己。'}`}
              </View>
            </View>
          </View>
          <View className='header__content__milestone'>
            <HeaderMilestone></HeaderMilestone>
          </View>
        </View>
      </SafeAreaTop>
    </View>
  )
}

Header.defaultProps = defaultProps

export default Header