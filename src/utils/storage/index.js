import Taro from '@tarojs/taro';

class Storage {
  static storage = {}
  setAsync = Taro.setStorageSync;
  getAsync = Taro.getStorageSync;
  async init() {
    return '此环境不需要初始化';
  }
}
const storage = new Storage();
export default storage;
