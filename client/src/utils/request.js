import Taro from '@tarojs/taro';

import application from './Application';
// import { get as getGlobalData } from './global_data';
import { createAction } from './index'

// const codeMessage = {
//   200: '服务器成功返回请求的数据。',
//   201: '新建或修改数据成功。',
//   202: '一个请求已经进入后台排队（异步任务）。',
//   204: '删除数据成功。',
//   400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
//   401: '用户没有权限（令牌、用户名、密码错误）。',
//   403: '用户得到授权，但是访问是被禁止的。',
//   404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
//   406: '请求的格式不可得。',
//   410: '请求的资源被永久删除，且不会再得到的。',
//   422: '当创建一个对象时，发生一个验证错误。',
//   500: '服务器发生错误，请检查服务器。',
//   502: '网关错误。',
//   503: '服务不可用，服务器暂时过载或维护。',
//   504: '网关超时。',
// };

// const checkStatus = (response) => {
//   // if (response.status >= 200 && response.status < 300) {
//   //   return response;
//   // }
//   if (response.status < 500) {
//     return response;
//   }
//   const errortext = codeMessage[response.status] || response.statusText;
//   // notification.error({
//   //     message: `请求错误 ${response.status}: ${response.url}`,
//   //     description: errortext,
//   // });
//   const error = new Error(errortext);
//   error.name = response.status;
//   error.response = response;
//   throw error;
// };

// const cachedSave = (response, hashcode) => {
//   /**
//    * Clone a response data and store it in sessionStorage
//    * Does not support data other than json, Cache only json
//    */
//   const contentType = response.headers.get('Content-Type');
//   if (contentType && contentType.match(/application\/json/i)) {
//     // All data is saved as text
//     response
//       .clone()
//       .text()
//       .then((content) => {
//         if (process.env.TARO_ENV === 'h5') {
//           window.sessionStorage.setItem(hashcode, content);
//           window.sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
//         }
//       });
//   }
//   return response;
// };

const systemInfoJsonString = JSON.stringify(Taro.getSystemInfoSync());
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, option) {
  // const token = Taro.getStorageSync(config.storageKeys.token);
  if (!url.startsWith('http')) {
    url = `${application.baseUrl}${url}`;
    // url = `https://bestshareapi.herokuapp.com/api/v1/${url}`
    // url = `https://api.bestshare.org/v1/${url}`
  }
  // const { user = {} } = getGlobalData('dvaApp')._store.getState().home;
  // const { school_id = 0 } = user;
  // if (school_id) {
  //   if (url.includes('?')) {
  //     url = `${url}&school_id=${school_id}`;
  //   } else {
  //     url = `${url}?school_id=${school_id}`;
  //   }
  // }
  const options = {
    expirys: false,
    ...option,
  };
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  // const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
  // const hashcode = hash
  //   .sha256()
  //   .update(fingerprint)
  //   .digest('hex');
  const defaultOptions = {
    // credentials: 'include',
    mode: 'cors',
    method: 'GET',
    headers: {
      // 'x-language': languageMap[global.language] || 'hk',
      // 'x-device-info': systemInfoJsonString,
      // 'x-app-version': config.version,
    },
  };
  if (application.cookiesMap) {
    let cookieString = '';
    for(let key in application.cookiesMap) {
      cookieString = `${cookieString}${key}=${application.cookiesMap[key]}; `;
    }
    if (cookieString) {
      defaultOptions.headers['Cookie'] = cookieString;
    }
  }
  // if (token) {
    // defaultOptions.headers['x-access-token'] = token;
  // }
  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === 'POST'
    || newOptions.method === 'PUT'
    || newOptions.method === 'DELETE'
  ) {
    if (typeof window === 'undefined' || !(newOptions.body instanceof window.FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  // const expirys = options.expirys && 60;
  // options.expirys !== false, return the cache,
  // if (process.env.TARO_ENV === 'h5' && options.expirys !== false) {
  //   const cached = window.sessionStorage.getItem(hashcode);
  //   const whenCached = window.sessionStorage.getItem(`${hashcode}:timestamp`);
  //   if (cached !== null && whenCached !== null) {
  //     const age = (Date.now() - whenCached) / 1000;
  //     if (age < expirys) {
  //       const response = new Response(new Blob([cached]));
  //       return response.json();
  //     }
  //     if (window) {
  //       window.sessionStorage.removeItem(hashcode);
  //       window.sessionStorage.removeItem(`${hashcode}:timestamp`);
  //     }
  //   }
  // }
  return Taro.request({ url: url, ...newOptions, header: {
      ...newOptions.headers,
    }, data: newOptions.body })
    // .then(checkStatus)
    // .then(response => cachedSave(response, hashcode))
    .then((response) => {
      // DELETE and 204 do not return data by default
      // using .json will report an error.
      // if (newOptions.method === 'DELETE' || response.status === 204) {
      //   return response.text();
      // }
      // const responseJson = response.json();
      // return responseJson;
      // Cache-Control: "no-store, no-cache, must-revalidate"
      // Connection: "keep-alive"
      // Content-Type: "application/json; charset=utf-8"
      // Date: "Sat, 15 Feb 2020 12:26:13 GMT"
      // Expires: "Thu, 19 Nov 1981 08:52:00 GMT"
      // Pragma: "no-cache"
      // Server: "Tengine"
      // Set-Cookie: "PHPSESSID=2i4qdrhbf50j75nmqguh1elpcn; path=/; HttpOnly"
      // Transfer-Encoding: "chunked"
      if (response.header['Set-Cookie']) {
        const cookiesMap = application.cookiesMap;
        const PHPSESSID = response.header['Set-Cookie'].split(';')[0].split('=')[1];
        cookiesMap['PHPSESSID'] = PHPSESSID;
        application.cookiesMap = cookiesMap;
      }
      const { statusCode, data } = response;
      if (statusCode === 401 || statusCode === 403) {
        global.dvaApp._store.dispatch(createAction('user/save')({
          token: '',
          profile: {},
        }));
        //情况本地相关的数据
        // Taro.setStorageSync(config.storageKeys.token, null)
        // Taro.setStorageSync(config.storageKeys.profile, null)
        // if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
        //   window.location.href = `https://wx.bestshare.org/api/v1/wechat/access?redirect_uri=${encodeURIComponent(window.location.href)}`;
        // }
        // else if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
        //   window.location.reload();
        // }
      }
      return data;

    }).catch((e) => {
      console.log('e', e);
      // e.response.text().then((response) => {
      //   console.log(url, response);
      // });
      const status = e.name;
      if (status === 401) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        // window.g_app._store.dispatch({
        //     type: 'login/logout',
        // });
        return;
      }
      // environment should not be used
      if (status === 403) {
        // router.push('/exception/403');
        return;
      }
      if (status <= 504 && status >= 500) {
        // router.push('/exception/500');
        return;
      }
      if (status >= 404 && status < 422) {
        // router.push('/exception/404');
      }
    });
}
