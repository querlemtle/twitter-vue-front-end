<template>
  <div class="tweet-container">
    <div class="tweet-header">
      <router-link :to="{ name: 'user', params: { id: tweet.user.id } }">
        <img
          :src="tweet.user.avatar | emptyImage"
          :alt="tweet.user.name"
          class="user-image-sm"
        />
      </router-link>
      <div class="user-naming">
        <router-link :to="{ name: 'user', params: { id: tweet.user.id } }">
          <p class="user-name">{{ tweet.user.name }}</p>
        </router-link>
        <span class="user-handle">@{{ tweet.user.account }}</span>
      </div>
    </div>
    <div class="tweet-body">
      {{ tweet.description }}
    </div>
    <div class="tweet-footer">
      <span class="time-stamp">{{
        tweet.createdAt | customLongDateFormat
      }}</span>
    </div>
    <div class="counter-section">
      <span class="reply-count"><span class="reply-number">{{ tweet.replyCounts }} </span>回覆</span>
      <span class="like-count"><span class="like-number">{{ tweet.likeCounts }}</span> 喜歡次數</span>
    </div>
    <div class="icon-section">
      <div
        class="footer-icon reply-icon"
        @click.stop.prevent="showReplyModal(true)"
      ></div>
      <div
        class="footer-icon like-icon"
        :active="tweet.isLiked"
        @click.stop.prevent="
          toggleLike(initialSpecTweet.isLiked, initialSpecTweet.id)
        "
      ></div>
    </div>
  </div>
</template>

<script>
import { emptyImageFilter } from "../utils/mixins";
import { customLongDateFormatter } from "../utils/mixins";
import likesAPI from "../apis/like";
import { Toast } from "../utils/helpers";

export default {
  name: "TweetDetail",
  mixins: [emptyImageFilter, customLongDateFormatter],
  props: {
    initialSpecTweet: {
      type: Object,
      required: true,
    },
  },
  computed: {
    tweet: {
      get() {
        return this.initialSpecTweet;
      },
      set(value) {
        this.$emit("update-tweet", value);
      },
    },
  },
  methods: {
    showReplyModal(bool) {
      // 通知 Tweet.vue 要開啟 reply modal
      this.$emit("show-reply-modal", bool);
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
};
</script>

<style scoped>
.tweet-container {
  padding: 1rem;
  border-bottom: 1px solid var(--page-divider);
}

/* tweet header: user name, handle and image */
.tweet-header {
  display: flex;
  align-items: center;
  width: 100%;
  padding-bottom: 1rem;
}

.user-image-sm {
  margin-right: 0.5rem;
}

.user-naming {
  display: flex;
  flex-direction: column;
}

/* tweet body: tweet content */
.tweet-body {
  font-size: 1.5rem;
}

/* tweet footer: time stamp */
.tweet-footer {
  margin-top: 9px;
  border-bottom: 1px solid var(--page-divider);
}

.time-stamp {
  font-size: 0.875rem;
  color: var(--secondary-color);
}

/* below: counter section */
.counter-section {
  color: var(--secondary-color);
  font-size: 1.1875rem;
  font-weight: 600;
  padding: 1rem 0;
  border-bottom: 1px solid var(--page-divider);
  display: flex;
  column-gap: 1.5rem;
}

/* below: icon section */
.icon-section {
  padding-top: 1rem;
  display: flex;
  align-items: center;
  column-gap: 3.5rem;
}

.footer-icon {
  width: 1.875rem;
  height: 1.875rem;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}

/* disable filter setting from basic.css */
.icon-section:hover {
  filter: none;
}

/* add individual icon filter setting */
.footer-icon:hover {
  filter: brightness(0) saturate(100%) invert(38%) sepia(52%) saturate(2219%)
    hue-rotate(2deg) brightness(107%) contrast(105%);
}

.reply-number,
.like-number {
  color: var(--dark-100);
}

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