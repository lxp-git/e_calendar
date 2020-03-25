import Taro from '@tarojs/taro';


class Storage {
  static storage = {}
  setAsync(key, newData) {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      Taro.setStorageSync(key, newData);
      return;
    }
    const syncData = {};
    syncData[key] = newData;
    Storage.storage[key] = newData;
    Taro.setStorage({
      key,
      data: newData,
    });
    console.log(`setAsync`, `${key}=${Storage.storage[key]}`);
  }
  getAsync(key) {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      return Taro.getStorageSync(key);
    }
    return Storage.storage[key];
  }

  async init() {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      return;
    }
    const storageInfo = await Taro.getStorageInfo();
    const results = await Promise.all(storageInfo.keys.map((key) => Taro.getStorage({ key })));
    results.forEach((item, index) => {
      Storage.storage[storageInfo.keys[index]] = item.data;
    });
    return Storage.storage;
  }
}
const storage = new Storage();
export default storage;
