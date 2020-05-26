const cloud = require('wx-server-sdk')
const validate = require('validate.js')

const dayjs = require('dayjs')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

validate.extend(validate.validators.datetime, {
  parse: function (value, options) {
    return +dayjs(value).unix()
  },
  format: function (value, options) {
    var format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss";
    return dayjs(value).format(format);
  }
});

const validateRules = {
  title: {
    presence: {
      message: '标题字段为空'
    },
    type: {
      type: 'string',
      message: '输入类型错误了'
    },
    length: {
      minimum: 0,
      maximum: 8,
      tooLong: '再精简一下目标吧'
    }
  },
  subtitle: {
    type: {
      type: 'string',
      message: '输入类型错误了'
    },
    length: {
      max: 100,
      tooLong: '标语太长啦'
    }
  }
}

/**
 * @param {String} title    - 目标
 * @param {String} subtitle - 标语
 * @param {Date}   date     - 最后日期
 */
exports.main = async (event, context) => {
  const now = dayjs().toDate()
  const startOfToday = dayjs().startOf('day')

  // 校验输入
  const errors = validate(event, validateRules)
  if (event.date && startOfToday.isAfter(dayjs(event.date))) {
    errors = Object.assign(errors, { date: ['结束日期错误'] })
  }
  if (errors) {
    return {
      code: 400,
      msg: errors
    }
  }

  const wxContext = cloud.getWXContext()
  const { OPENID, ENV } = wxContext
  if (!OPENID) return {
    code: 401,
    msg: '用户未登录'
  }

  const db = cloud.database().collection('aim')

  // 将所有状态为进行中的目标切换成挂起状态
  await db.where({ state: 1, _openId: OPENID, })
    .update({ data: { state: 2, } })

  const aim = {
    title: event.title,            // 目标标题
    subtitle: event.subtitle,      // 标语
    date: (event.date ? dayjs(event.date).toDate() : null),         // 最后日期
    createTime: now,               // 创建时间
    _openId: OPENID,               // 归属人
    milestones: [],                // 里程碑
    state: 1,                      // 状态 1-进行中 0-废弃 2-挂起
  }
  const dbAddRes = await db.add({ data: aim })

  const { _id } = dbAddRes
  const {
    data: { title, subtitle, milestones, date, createTime, state}
  } = await db.doc(_id).get()

  const data = {
    title,
    subtitle,
    milestones,
    date,
    createTime,
    id: _id,
    state
  }

  return {
    code: 0,
    data,
    msg: 'ok',
  }
}
