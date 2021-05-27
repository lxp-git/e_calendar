import request from "../../utils/request";

export const fetchHolidays = () => {
  return request('/calendar/holiday');
}

export const user = {
  login: ({code}) => {
    return request(`/calendar/user/login?wechat_miniprogram_code=${code}`);
  },
}
