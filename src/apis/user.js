import { apiHelper } from './../utils/helpers'
const getToken = () => localStorage.getItem('token')

export default {
  getCurrentUser() {
    return apiHelper.get('/get_current_user', {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  getUserFollowings(userId) {
    return apiHelper.get(`/users/${userId}/followings`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  getUserFollowers(userId) {
    return apiHelper.get(`/users/${userId}/followers`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  editSelfData(userId, { name, introduction, avatar, banner }) {
    return apiHelper.put(`/users/${userId}`, {
      name, introduction, avatar, banner
    }, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  }
}