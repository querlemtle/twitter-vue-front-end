<template>
  <div class="card-container">
    <!-- test -->
    <Spinner v-if="isLoading"/>
    <!-- 原先在此渲染，改在父層渲染 -->
    <div v-for="tweet in tweets" :key="tweet.id" class="user-tweets">
      <!--  到當前使用者的路由 -->
      <!-- <router-link
        :to="{ name: 'user', params: { id: tweet.User.id } }"
      > -->
      <div class="user-image-sm"></div>
      <div class="card-info">
        <div class="card-header">
          <div class="user-naming">
          <!-- todo: 加入自己的link，到個人主頁 -->
            <p class="user-name">{{currentUser.name}}</p>
            <p class="user-handle">
              @{{currentUser.account}}<span>・</span>
              <span class="time-stamp">{{ tweet.createdAt | fromNow }}</span>
            </p>
          </div>
        </div>
        <div class="card-body">
          <p class="tweet-content">
            {{ tweet.description }}
          </p>
        </div>
        <div class="card-footer">
          <div 
          @click.stop.prevent="handleReplyModal(tweet)"
          class="icon-section">
            <div class="footer-icon reply-icon d-flex"></div>
            <span 
            class="counter reply-count">{{ tweet.replyCounts }}
            </span>
          </div>
          <div class="icon-section">
             <div class="footer-icon like-icon">
              <div 
              v-if="!tweet.isLiked"
              @click.stop.prevent="deleteLike(tweet.id)"
              class="section-like d-flex">
                <img
                class="counter like-icon"
                src="../assets/pictures/like.png"
                alt=""
              />{{ tweet.likeCounts }}
              </div>
              <div 
              v-if="tweet.isLiked"
              @click.stop.prevent="addLike(tweet.id)"
              class="section-like d-flex">
                <img
                class="counter like-icon-add"
                src="../assets/pictures/like-icon.svg"
                alt=""
              />{{ tweet.likeCounts }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- todo: not yet -->
    <!-- 改 -->
    <ReplyModal 
      v-show="show === true"
      :show="show === true"
      :tweet="tweetActive"
      @after-reply-submit="afterReplySubmit"
    />
  </div>
</template>


<script>
import Spinner from '../components/Spinner.vue'
import ReplyModal from "./../components/ReplyModal.vue"
import { fromNowFilter } from "./../utils/mixins";

// import likesAPI from "./../apis/like";
import userAPI from "./../apis/user";
import { Toast } from "../utils/helpers";
// 載入 Vuex
import { mapState } from "vuex";

export default {
  name: "UserTweets",
  mixins: [fromNowFilter],
  components: {
    ReplyModal,
    Spinner
  },
  data() {
    return {
      show: false,
      tweetActive: {},
      isLoading: true,
      tweets: [],
    };
  },
  // 從 Vuex 取得 currentUser 的資料
  computed: {
    ...mapState(["currentUser"]),
  },
  created() {
    // 取得動態路由位置
    const { id: userId } = this.$route.params;
    this.fetchUserTweets(userId);
  },
  // 追蹤路由變化
  beforeRouteUpdate(to, from, next) {
    const { id } = to.params;
    this.fetchUserTweets(id);
    next();
  },
  
  methods: {
    // OK 向資料庫撈取 使用者 tweets 資料
    async fetchUserTweets(userId) {
      try {
        const response  = await userAPI.getUserTweets({ userId });
        
        // if (response.status !== 200) {
        //   throw new Error(response.message);
        // }
        const tweetsData = response.data
        
        console.log('tweetsData', tweetsData)
        // this.tweets = tweetsData

        this.isLoading = false;
      } catch (error) {
        console.log(error.response.data.message)
        this.isLoading = false;
        Toast.fire({
          icon: "error",
          title: "無法取得 tweets",
        });
      }
    },
    // 未串 API 前測試
    // addLike(tweetId) {
    //   console.log('tweetId', tweetId)
    // },
    // deleteLike(tweetId) {
    //   console.log('tweetId', tweetId)
    // },
    // todo: 有問題
    // async addLike (tweetId) {
    //   try {
    //     const response = await likesAPI.likeTweet(tweetId);
        
    //     // 錯誤狀態處理
    //       if (response.data.status === "error") {
    //         throw new Error(response.data.message);
    //       }
    //       // 更新 like 數
          
    //     // if (data.status !== 'success') {
    //     //   throw new Error(data.message)
    //     // }
    //     // this.tweet.isLiked = true
    //     // this.tweet.likesCounts += 1
    //   } catch (error) {
    //     Toast.fire({
    //       icon: 'error',
    //       title: '無法按喜歡，請稍後再試'
    //     })
    //   }
    // },
    // todo: 有問題
    // async deleteLike (tweetId) {
    //   try {
    //     const  data  = await likesAPI.unLikeTweet({ tweetId })
    //     console.log('delete like', data)

    //     // if (data.status !== 'success') {
    //     //   throw new Error(data.message)
    //     // }
    //     // this.tweet.isLiked = false
    //     // this.tweet.likesCounts -= 1
    //   } catch (error) {
    //     Toast.fire({
    //       icon: 'error',
    //       title: '無法按喜歡，請稍後再試'
    //     })
    //   }
    // },
    // 
    handleReplyModal(tweet) {
      this.show = true;
      this.tweetActive = tweet;
    },
  
    
    // todo: 未完成
    afterReplySubmit(payload) {
      console.log('payload',payload)
    },
  },
};
</script>

<style scoped>
.user-image-sm {
  padding: 1rem;
  margin-right: 0.5rem;
  background-image: url("./../assets/pictures/dummyUser.png");
  background-size: contain;
  background-repeat: no-repeat;
}

.reply-icon {
  background-image: url("./../assets/pictures/reply.png");
}

.section-like {
  justify-content: center;
  align-items: center;
}
.like-icon, .like-icon-add {
  margin-right: 10px;
  
}
</style>