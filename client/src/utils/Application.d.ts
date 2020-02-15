declare namespace application {
  interface User extends Object {
    appid: string;
    openid: string;
    wechat_miniprogram_open_id?: any;
    _id?: any;
    id?: any;
  }

  /**
   * 传入阳历年月日获得详细的公历、农历object信息 <=>JSON
   * @param y  solar year
   * @param m  solar month
   * @param d  solar day
   * @return JSON object
   * @eg:console.log(calendar.solar2lunar(1987,11,01));
   */
  export function solar2lunar(y, m, d): User;

  export var loginUser: User;

  export var setting: any;

  export var cookiesMap: any;
}

export = application
