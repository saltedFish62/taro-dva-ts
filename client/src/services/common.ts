import BasicServices from './basic'

export default class Common extends BasicServices {

  /**
   * 登录获取用户信息
   */

  login = () => {

    return this.call({
      name: 'login'
    })

  }

}