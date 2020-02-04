const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    return db.collection('form_id').add({
        // data 字段表示需新增的 JSON 数据
        data: {
            wechat_miniprogram_open_id: wxContext.OPENID,
            ...event,
        },
        success: function(res) {
            // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
            console.log(res)
        }
    });
}