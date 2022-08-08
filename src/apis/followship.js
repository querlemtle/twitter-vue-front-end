import { apiHelper } from './../utils/helpers'
const getToken = () => localStorage.getItem('token')

export default {
  getTopUsers() {
    return apiHelper.get('/followships/top_users', {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  followUser({ userId }) {
    return apiHelper.post('/followships', { id: userId }, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  unFollowUser({ userId }) {
    return apiHelper.delete(`/followships/${userId}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  }
}