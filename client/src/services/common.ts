import cr from 'src/lib/cloud_request'

export default class Common {

  /**
   * 登录获取用户信息
   */

  login = () => {

    return cr.call({
      name: 'login'
    })

  }

}