import request from "../../utils/request";


export const fetch = ({start, end}) => {
  return request(`/calendar/events?start=${start}&end=${end}`);
}
export const post = (body) => {
  return request('/calendar/events', {
    method: 'POST',
    body: body,
  });
}
export const destroy = (id) => request(`/calendar/events?id=${id}`, {
  method: 'DELETE',
})
