const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { OPENID, ENV } = wxContext
  if (!OPENID) return {
    code: 403,
    msg: '用户未登录'
  }

  const result = {}
  try {
    const data = await cloud.database()
      .collection('aim')
      .aggregate()
      .match({
        _openid: OPENID,
        state: 1
      })
      .lookup({
        from: 'milestone',
        localField: '_id',
        foreignField: 'aim_id',
        as: 'milestones'
      })
      .project({
        createTime: 1,
        date: 1,
        milestones: 1,
        state: 1,
        subtitle: 1,
        title: 1,
        _id: 1
      })
      .end();
    result.data = data.list[0]
    result.code = 0
    result.msg = 'ok'
  } catch (err) {
    result.data = null
    result.code = -1
    result.msg = JSON.stringify(err)
  }

  return result
}
