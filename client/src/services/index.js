import request from "../utils/request";

export const qrLogin = (queryParamsObject) => request('/calendar/user/miniProgramQrCode', {
  method: 'POST',
  body: queryParamsObject,
});

export const user = {
  put: (data) => request('/calendar/user', {
    method: 'PUT',
    body: data,
  }),
}
