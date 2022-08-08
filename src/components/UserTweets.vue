<template>
  <div class="card-container">
    <Spinner v-if="isLoading" />
    <div v-for="tweet in tweets" :key="tweet.id" class="user-tweets">
      <router-link :to="{ name: 'user', params: { id: currentUser.id } }">
        <img
          class="user-image-sm"
          :src="currentUser.avatar | emptyImage"
          alt=""
        />
      </router-link>
      <div class="card-info">
        <div class="card-header">
          <div class="user-naming">
            <router-link :to="{ name: 'user', params: { id: currentUser.id } }">
              <p class="user-name">{{ currentUser.name }}</p>
            </router-link>
            <p class="user-handle">
              @{{ currentUser.account }}<span>・</span>
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
            class="icon-section"
          >
            <div class="footer-icon reply-icon d-flex"></div>
            <span class="counter reply-count">{{ tweet.replyCounts }} </span>
          </div>
          <div class="icon-section">
            <div class="footer-icon like-icon">
              <div
                v-if="tweet.isLiked"
                @click.stop.prevent="deleteLike(tweet.id)"
                class="section-like d-flex"
              >
                <img
                  class="counter like-icon"
                  src="../assets/pictures/like-icon.svg"
                  alt=""
                />{{ tweet.likeCounts }}
              </div>
              <div
                v-else
                @click.stop.prevent="addLike(tweet.id)"
                class="section-like d-flex"
              >
                <img
                  class="counter like-icon-add"
                  src="../assets/pictures/like.png"
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
      :show="tweetActive"
      :userTweet="tweetActive"
    />
  </div>
</template>


<script>
import Spinner from "../components/Spinner.vue";
import ReplyModal from "./../components/ReplyModal.vue";
import { fromNowFilter } from "./../utils/mixins";

import likesAPI from "./../apis/like";
import userAPI from "./../apis/user";
import { Toast } from "../utils/helpers";
// 載入 Vuex
import { mapState } from "vuex";

export default {
  name: "UserTweets",
  mixins: [fromNowFilter],
  components: {
    ReplyModal,
    Spinner,
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
    async fetchUserTweets(userId) {
      try {
        const response = await userAPI.getUserTweets({ userId });

        if (response.status !== 200) {
          throw new Error(response.message);
        }
        const tweetsData = response.data;

        this.tweets = tweetsData;

        this.isLoading = false;
      } catch (error) {
        console.log(error.response.data.message);
        this.isLoading = false;
        Toast.fire({
          icon: "error",
          title: "無法取得 tweets",
        });
      }
    },
    async addLike(tweetId) {
      try {
        const response = await likesAPI.likeTweet(tweetId);
        console.log("response", response);
        console.log("response.data.status", response.data.status);

        if (response.data.status !== "success") {
          throw new Error(response.data.message);
        }

        this.tweets = this.tweets.map((tweet) => {
          if (tweet.id === tweetId) {
            return {
              ...tweet,
              isLiked: false,
              likeCounts: tweet.likeCounts + 1,
            };
          }
          return tweet;
        });
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "無法按喜歡，請稍後再試",
        });
      }
    },
    // todo: 有問題
    async deleteLike(tweetId) {
      try {
        const response = await likesAPI.unLikeTweet(tweetId);
        console.log("delete like", response);

        if (response.data.status !== "success") {
          throw new Error(response.data.message);
        }
        this.tweets = this.tweets.map((tweet) => {
          if (tweet.id === tweetId) {
            return {
              ...tweet,
              isLiked: false,
              likeCounts: tweet.likeCounts - 1,
            };
          }
          return tweet;
        });
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "無法取消喜歡，請稍後再試",
        });
      }
    },

    handleReplyModal(tweet) {
      this.show = true;
      this.tweetActive = tweet;
      console.log("tweet", tweet);
    },

    // todo: 未完成
    // afterReplySubmit(payload) {
    //   // this.show = false;
    //   // this.tweetActive = {};
    //   console.log('payload',payload)
    // },
  },
};
</script>

<style scoped>
.user-image-sm {
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
.like-icon,
.like-icon-add {
  margin-right: 10px;
}
.like-icon[active] {
  background-image: url("./../assets/pictures/icon-like.png");
}
</style>