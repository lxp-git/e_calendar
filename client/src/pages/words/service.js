import request from "../../utils/request";

export const fetch = () => {
  return request('/words/words');
}

/**
 *
 * @param data { retrievability, time_interval, id }
 * @returns {Promise<*>}
 */
export const patch = (data) => {
  return request('/words/words', {
    method: 'PUT',
    body: data,
  });
}
