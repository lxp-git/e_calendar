import request from "../../utils/request";

export const fetchHolidays = () => {
  return request('/calendar/holiday');
}

export const event = {
  fetch: ({start, end}) => {
    return request(`/calendar/events?start=${start}&end=${end}`);
  },
  post: (body) => {
    return request('/calendar/events', {
      method: 'POST',
      body: body,
    });
  },
  delete: (id) => request(`/calendar/events?id=${id}`, {
    method: 'DELETE',
  }),
}

export const user = {
  login: ({code}) => {
    return request(`/calendar/user/login?wechat_miniprogram_code=${code}`);
  },
}
