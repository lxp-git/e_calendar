import request from "../utils/request";

export const qrLogin = (queryParamsObject) => request('/calendar/user/miniProgramQrCode', {
  method: 'POST',
  body: queryParamsObject,
});
