import request from "../../utils/request";

export const fetchHolidays = () => {
  return request('/holiday');
}

export const event = {
  fetch: ({start, end}) => {
    return request(`/events?start=${start}&end=${end}`);
  },
  post: (body) => {
    return request('/events', {
      method: 'POST',
      body: body,
    });
  },
  delete: (id) => request(`/events?id=${id}`, {
    method: 'DELETE',
  }),
}

export const user = {
  login: ({code}) => {
    return request(`/user/login?wechat_miniprogram_code=${code}`);
  },
}
