'use strict';
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV,
})

exports.main = async (event, context) => {
    const { OPENID } = cloud.getWXContext()
    const now = new Date()

    const db = cloud.database().collection('user')
    try {
        const res = await db.doc(OPENID).get()
        await db.doc(OPENID).update({
            data: {
                latestLogin: now,
            }
        })
    } catch (e) {
        if (/does not exist/.test(e.errMsg)) {
            await db.add({
                data: {
                    latestLogin: now,
                    _id: OPENID
                }
            })
        }

    }
    return {
        code: 0
    }

    try {
        await db.doc(OPENID).update({
            data: {
                latestLogin: now
            }
        })
    } catch (e) {
        console.log(e)
        await db.add({
            data: {
                latestLogin: now,
                _id: OPENID
            }
        })
    }

    return {
        code: 0,
        msg: 'ok',
    }
}
