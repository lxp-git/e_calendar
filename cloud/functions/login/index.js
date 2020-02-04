const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

exports.main = async () => {
  const wxContext = cloud.getWXContext()
  const userCollection = db.collection('user')
  const where = {
    wechat_miniprogram_open_id: wxContext.OPENID,
  };
  const userList = await userCollection.where(where).get();
  let loginUser;
  if (userList && userList && userList.data && userList.data[0]) {
    loginUser = userList.data[0];
  } else {
    /// 没有这个用户需要创建
    const addResult = await userCollection.add({
      data: {
        ...where,
        created_at: (new Date()).toISOString(),
      },
    });
    loginUser = {
      ...where,
      ...addResult,
    };
  }
  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    ...loginUser,
  }
}