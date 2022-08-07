<template>
  <div class="card-container">
    <Spinner v-if="isLoading" />
    <div
      v-for="tweet in userLikeTweets"
      :key="tweet.id"
      class="user-like-tweets"
    >
    <!-- 有圖片時 -->
     <router-link
        v-if="tweet.Tweet.User.avatar"
        :to="{ name: 'user', params: { id: tweet.Tweet.User.id } }"
      >
        <img :src="tweet.Tweet.User.avatar" class="user-avatar" alt="" />
      </router-link>
      <!-- 沒有圖片時 -->
      <router-link
        v-else
        :to="{ name: 'user', params: { id: tweet.Tweet.User.id } }"
      >
        <div class="user-image-sm"></div>
      </router-link>
      <div class="card-info">
        <div class="card-header">
          <div class="user-naming">
            <p class="user-name">{{tweet.Tweet.User.name}}</p>
            <p class="user-handle">
              @{{tweet.Tweet.User.account}}<span>・</span>
              <span class="time-stamp">{{ tweet.createdAt | fromNow }}</span>
            </p>
          </div>
        </div>
        <div class="card-body">
          <p class="tweet-content">
            {{ tweet.Tweet.description }}
          </p>
        </div>
        <div class="card-footer">
          <div class="icon-section">
            <div class="footer-icon reply-icon"></div>
            <span class="counter reply-count">{{
              tweet.Tweet.replyCounts
            }}</span>
          </div>
          <!-- From UserTweets -->
          <!-- <div class="icon-section">
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
          </div> -->
          <!-- Here -->
          <div class="icon-section">
            <div
              v-if="!tweet.isLike"
              @click.stop.prevent="addLike(tweet.id)"
              class="footer-icon like-icon"
            ></div>
            <div
              v-else
              @click.stop.prevent="deleteLike(tweet.id)"
              class="footer-icon like-icon-add"
            ></div>
            <span class="counter like-count">{{ tweet.Tweet.likeCounts }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from "./../components/Spinner.vue";
import { fromNowFilter } from "./../utils/mixins";
import userAPI from "./../apis/user";
import { Toast } from "../utils/helpers";
// 載入 Vuex
import { mapState } from "vuex";

export default {
  name: "UserLikeTweets",
  mixins: [fromNowFilter],

  data() {
    return {
      userLikeTweets: [],
      // check
      isLoading: false,
    };
  },
  components: {
    Spinner,
  },
  computed: {
    ...mapState(["currentUser"]),
  },
  created() {
    // 取得動態路由位置
    const { id: userId } = this.$route.params;
    this.fetchLikeTweets(userId);
  },
  methods: {
    async fetchLikeTweets(userId) {
      try {
        const { data } = await userAPI.getUserLikeTweets({ userId });
        console.log("likeTweets", data);

        this.userLikeTweets = data;
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "無法取得 likeTweets",
        });
      }
    },
    // todo: API
    // addLike(id) {

    // }
    // deleteLike(id) {

    // }
  },
};
</script>

<style scoped>
/* 有圖片時 */
.user-avatar {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin-right: 0.5rem;
  background-size: contain;
  background-repeat: no-repeat;
}
/* 沒有圖片時 */
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

.like-icon {
  background-image: url("./../assets/pictures/like.png");
}
.like-icon-add {
  background-image: url("./../assets/pictures/icon-like.png");
}
</style>