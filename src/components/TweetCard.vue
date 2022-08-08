<template>
  <div class="card-tweet">
    <router-link :to="{ name: 'user', params: { id: tweet.user.id } }">
      <img
        class="user-image-sm"
        :src="tweet.user.avatar | emptyImage"
        alt="user-image"
      />
    </router-link>
    <div class="card-info">
      <div class="card-header">
        <div class="user-naming">
          <router-link :to="{ name: 'user', params: { id: tweet.user.id } }">
            <p class="user-name">{{ tweet.user.name }}</p>
          </router-link>
          <p class="user-handle">
            @{{ tweet.user.account }}<span>・</span
            ><span class="time-stamp">{{ tweet.createdAt | fromNow }}</span>
          </p>
        </div>
      </div>
      <div class="card-body">
        <router-link :to="{ name: 'tweet', params: { id: tweet.id } }">
          <p class="tweet-content">
            {{ tweet.description }}
          </p>
        </router-link>
      </div>
      <div class="card-footer">
        <div class="icon-section">
          <div
            class="footer-icon reply-icon"
            @click.stop.prevent="showReplyModal(true)"
          ></div>
          <span class="counter reply-count">{{ tweet.replyCounts }}</span>
        </div>
        <div class="icon-section">
          <div
            class="footer-icon like-icon"
            :active="tweet.isLiked"
            @click.prevent.stop="toggleLike(tweet.isLiked, tweet.id)"
          ></div>
          <span class="counter like-count">{{ tweet.likeCounts }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { emptyImageFilter } from "../utils/mixins";
import { fromNowFilter } from "../utils/mixins";
import likesAPI from "../apis/like";
import { Toast } from "../utils/helpers";

export default {
  name: "TweetCard",
  mixins: [emptyImageFilter, fromNowFilter],
  props: {
    initialTweet: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tweet: this.initialTweet,
    };
  },
  methods: {
    showReplyModal(bool) {
      // 通知 Home.vue 要開啟 reply modal
      this.$emit("show-reply-modal", bool, this.tweet);
    },
    async toggleLike(isTweetLiked, tweetId) {
      try {
        // 已經對該 tweet 點過 like
        if (isTweetLiked) {
          // POST /api/tweets/:id/unlike 取消 like
          const response = await likesAPI.unLikeTweet(tweetId);

          // 錯誤狀態處理
          if (response.data.status === "error") {
            throw new Error(response.data.message);
          }

          // 更新 like 數
          this.tweet.likeCounts--;

          // 尚未對該 tweet 點過 like
        } else {
          // POST /api/tweets/:id/like 加入 like
          const response = await likesAPI.likeTweet(tweetId);

          // 錯誤狀態處理
          if (response.data.status === "error") {
            throw new Error(response.data.message);
          }

          // 更新 like 數
          this.tweet.likeCounts++;
        }

        // 修改該 tweet 的 like 狀態
        this.tweet.isLiked = !this.tweet.isLiked;

        // 通知 parent view likecount 有改變
        this.$emit("after-like-clicked");
      } catch (error) {
        console.error(error.response.data.message);
        Toast.fire({
          icon: "error",
          title: error.response.data.message,
        });
      }
    },
  },
  watch: {
    // 偵測該則 tweet 狀態變化
    initialTweet(newValue) {
      this.tweet = newValue;
    },
  },
};
</script>

<style scoped>
/* Tweet card */
.card-tweet {
  display: flex;
  border-bottom: 1px solid var(--page-divider);
  padding: 1rem;
}

.user-image-sm {
  margin-right: 0.5rem;
}

.card-info {
  display: flex;
  flex-direction: column;
}

/* card header: user name, handle and creating tweet time */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-bottom: 1rem;
}

.user-name {
  color: var(--dark-100);
}

.tweet-content {
  color: var(--dark-100);
}

/* card footer: reply & like icons  */
.reply-icon {
  background-image: url("./../assets/pictures/reply.png");
}

.like-icon {
  background-image: url("./../assets/pictures/like.png");
}

.like-icon[active] {
  background-image: url("./../assets/pictures/icon-like.png");
}
</style>