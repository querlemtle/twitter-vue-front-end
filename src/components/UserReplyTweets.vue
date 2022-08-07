<template>
  <div class="card-container">
    <div v-for="reply in replyTweets" :key="reply.id" class="user-reply-tweets">
      <!-- <div class="user-image-sm"></div> -->
      <!-- <router-link :to="{ name: 'user-profile' ,params:{userId: userId}}">
      <img :src="userAvatar" class="avatar" alt="" />
      </router-link> -->
      <!--  -->
      <router-link :to="{ name: 'user', params: { id: currentUser.id } }">
        <img :src="currentUser.avatar | emptyImage" class="avatar" alt="" />
      </router-link>

      <div class="card-info">
        <div class="card-header">
          <div class="user-naming">
            <p class="user-name">{{ currentUser.name }}</p>
            <p class="user-handle">
              @{{ currentUser.account }}<span>・</span>
              <span class="time-stamp">{{
                currentUser.createdAt | fromNow
              }}</span>
            </p>
          </div>
        </div>
        <div class="card-header">
          <div class="user-naming">
            <p class="user-handle">
              <span> 回覆 </span>
              <!-- todo: 這邊連結過去的畫面和預期不同 -->
              <router-link
                :to="{ name: 'user', params: { id: reply.UserId } }"
              >
                <span class="original-tweet ms-1"
                  >@{{ reply.replyUserAccount }}</span
                >
              </router-link>
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
  },
  methods: {
    async fetchReplyTweets(userId) {
      try {
        if(data.status === "error"){
          throw new Error(data.message)
        }
        const { data } = await userAPI.getUserReplyTweets({ userId });
        console.log("data", data);

        this.replyTweets = data;
      } catch (error) {
        console.log(error.response.data.message)
        Toast.fire({
          icon: "error",
          title: "無法取得 replyTweets",
        });
      }
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
