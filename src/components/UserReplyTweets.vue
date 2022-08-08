<template>
  <div class="card-container">
    <div v-for="reply in replyTweets" :key="reply.id" class="user-reply-tweets">
      <router-link :to="{ name: 'user', params: { id: user.id } }">
        <img
          class="user-image-sm"
          :src="user.avatar | emptyImage"
          alt=""
        />
      </router-link>

      <div class="card-info">
        <div class="card-header">
          <div class="user-naming">
            <p class="user-name">{{ user.name }}</p>
            <p class="user-handle">
              @{{ user.account }}<span>・</span>
              <span class="time-stamp">{{
                reply.createdAt | fromNow
              }}</span>
            </p>
          </div>
        </div>
        <div class="card-header">
          <div class="user-naming">
            <p class="user-handle">
              <span> 回覆 </span>
                <span class="original-tweet ms-1"
                  >@{{ reply.replyUserAccount }}</span
                >
            </p>
          </div>
        </div>
        <div class="card-body">
          <p class="tweet-content">
            {{ reply.comment }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { emptyImageFilter } from "./../utils/mixins";

import { fromNowFilter } from "./../utils/mixins";
import userAPI from "./../apis/user";
import { Toast } from "../utils/helpers";
// 載入 Vuex
import { mapState } from "vuex";

export default {
  name: "UserReplyTweets",
  mixins: [fromNowFilter, emptyImageFilter],
  data() {
    return {
      replyTweets: [],
      user: {},
    };
  },
  // 從 Vuex 取得 currentUser 的資料
  computed: {
    ...mapState(["currentUser"]),
  },
  created() {
    // 取得動態路由位置
    const { id: userId } = this.$route.params;
    this.fetchReplyTweets(userId);
    this.fetchUserProfile(userId);
  },
  beforeRouteUpdate(to, from, next) {
    const { id } = to.params;
    this.fetchReplyTweets(id);
    this.fetchUserProfile(id);
    next();
  },
  methods: {
    async fetchReplyTweets(userId) {
      try {
        const response = await userAPI.getUserReplyTweets({ userId });

        if (response.status !== 200) {
          throw new Error(response.data.message);
        }

        this.replyTweets = response.data;
      } catch (error) {
        console.log(error.response.data.message);
        Toast.fire({
          icon: "error",
          title: "無法取得回覆推文",
        });
      }
    },
    async fetchUserProfile(userId) {
      try {
        const response = await userAPI.getUser({ userId });

        if (response.status !== 200) {
          throw new Error(response.data.message);
        }

        this.user = response.data;

        this.user = {
          ...this.user,
          introduction: this.user.introduction ? this.user.introduction : "",
        };
        this.isLoading = false;
      } catch (error) {
        console.error(error);
      }
    },
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
.user-reply:hover {
  color: var(--main-color);
}
.avatar {
  width: 50px;
  height: 50px;
  margin-right: 8px;
}
.original-tweet {
  font-size: 15px;
  font-weight: 500;
  color: var(--main-color);
}
</style>
