import request from '../utils/request'

export const getChannelList = () => {
  return request({
    url: '/channels',
    method: 'get',
  })
}
