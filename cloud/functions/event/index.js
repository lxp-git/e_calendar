const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const _ = db.command
    const { start, end } = event
    return db.collection('event').where({
        wechat_miniprogram_open_id: wxContext.OPENID,
        created_at: _.gte(start).and(_.lte(end)),
    }).get()
}