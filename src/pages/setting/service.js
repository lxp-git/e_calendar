import request from "../../utils/request";

export const put = () => {
  return request('/calendar/event');
}
