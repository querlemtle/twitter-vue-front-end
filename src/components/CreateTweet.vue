<template>
  <div class="tweet-container">
    <div class="tweet-body">
      <img
        :src="currentUser.avatar | emptyImage"
        :alt="currentUser.name"
        class="user-image-sm"
      />
      <textarea
        class="tweet-textarea"
        placeholder="有什麼新鮮事？"
        v-model="tweetContent"
        @input="clearErrorMessage"
      ></textarea>
    </div>
    <div class="tweet-footer">
      <span class="tweet-warning mx-3">{{ this.errorMessage }}</span>
      <button
        class="tweet-btn btn-bg btn-border"
        :disabled="isProcessing"
        @click.prevent.stop="handleTweetSubmit(tweetContent)"
      >
        推文
      </button>
    </div>
  </div>
</template>

<script>
import tweetsAPI from "../apis/tweet";
import { emptyImageFilter } from "../utils/mixins";
import { Toast } from "../utils/helpers";
import { mapState } from "vuex";

export default {
  name: "CreateTweet",
  mixins: [emptyImageFilter],
  data() {
    return {
      tweetContent: "",
      errorMessage: "",
      isProcessing: false,
    };
  },
  methods: {
    async handleTweetSubmit(content) {
      try {
        if (!content || content.trim().length === 0) {
          this.errorMessage = "內容不可空白";
          return;
        } else if (content.trim().length > 140) {
          this.errorMessage = "字數不可超過 140 字";
          return;
        }
        // disable tweet button to prevent duplicate requests
        this.isProcessing = true;

        // POST api/tweets
        const { data } = await tweetsAPI.postTweet(content);

        if(data.status === "error") {
          throw new Error(data.message)
        }

        // emit to Home.vue
        this.$emit("after-tweet-submit");
        // notify user
        Toast.fire({
          icon: "success",
          title: "成功送出推文"
        })
        // re-enable tweet button
        this.isProcessing = false;
        this.tweetContent = "";
      } catch (error) {
        console.error(error.response.data)
        // re-enable tweet button
        this.isProcessing = false;
        Toast.fire({
          icon: "error",
          title: error.message
        })
      }
    },
    clearErrorMessage() {
      this.errorMessage = "";
    },
  },
  computed: {
    ...mapState(["currentUser"])
  }
};
</script>

<style scoped>
.tweet-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 8.5rem;
  border-radius: 0.875rem;
  background-color: var(--dark-10);
  margin-bottom: 1rem;
}

/* tweet body: 使用者圖示、文字輸入區 */
.tweet-body {
  flex-grow: 1;
  width: 100%;
  background-color: var(--dark-10);
  padding: 1rem;
  position: relative;
  display: flex;
  column-gap: 10px;
}

.tweet-textarea {
  background-color: inherit;
  border: none;
  resize: none;
  font-size: 1.125rem;
  font-weight: 700;
  width: 100%;
  padding-top: 0.5rem;
}

.tweet-textarea:focus {
  outline: none;
}

/* tweet footer: warning message, push tweet button */
.tweet-footer {
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.tweet-warning {
  color: var(--danger-color);
}

.tweet-btn {
  width: 4.5rem;
  height: 2.5rem;
  border-radius: 50px;
}

.tweet-btn:focus,
.tweet-btn:active {
  outline: none;
}
</style>