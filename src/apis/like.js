import { apiHelper } from './../utils/helpers'
const getToken = () => localStorage.getItem('token')

export default {
  likeTweet(tweetId) {
    return apiHelper.post(`/tweets/${tweetId}/like`, null, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  unLikeTweet(tweetId) {
    return apiHelper.post(`/tweets/${tweetId}/unlike`, null, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
}