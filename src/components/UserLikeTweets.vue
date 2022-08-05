<template>
  <div class="card-container">
    <Spinner v-if="isLoading" />
    <div
      v-for="tweet in userLikeTweets"
      :key="tweet.id"
      class="user-like-tweets"
    >
    <!-- todo: router 有少 -->
     <!-- <router-link
        :to="{ name: 'user', params: { userId: tweet.Tweet.UserId } }"
      >
        <img :src="tweet.Tweet.User.avatar" class="avatar" alt="" />
      </router-link> -->

      <div class="user-image-sm"></div>
      <div class="card-info">
        <div class="card-header">
          <div class="user-naming">
            <p class="user-name">XXX</p>
            <p class="user-handle">
              @{{tweet.Tweet.replyUserAccount}}<span>・</span>
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