import request from "../utils/request";

export const qrLogin = (queryParamsObject) => request('/user/miniProgramQrCode', {
  method: 'POST',
  body: queryParamsObject,
});
