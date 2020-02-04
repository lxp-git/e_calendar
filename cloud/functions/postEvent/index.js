const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { userInfo, ...data } = event;
  return db.collection('event').add({
    data: {
      wechat_miniprogram_open_id: wxContext.OPENID,
      ...data,
    },
  });
}