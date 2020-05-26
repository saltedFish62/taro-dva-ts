import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

import SafeAreaTop from 'src/components/SafeAreaTop'
import HeaderAim from '../HeaderAim'
import HeaderMilestone from '../HeaderMilestone'
import AimPopup from '../AimPopup'

import './index.scss'

export default function Header() {
  return (
    <View className='header'>
      <AimPopup></AimPopup>
      <View className='header__bg'></View>
      <SafeAreaTop>
        <View className='header__content'>
          <View className='header__content__aim'>
            <HeaderAim></HeaderAim>
          </View>
          <View className='header__content__milestone'>
            <HeaderMilestone></HeaderMilestone>
          </View>
        </View>
      </SafeAreaTop>
    </View>
  )
}
