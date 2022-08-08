<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-container">
        <!-- modal header: close button -->
        <div class="modal-header">
          <img
            src="./../assets/pictures/close.png"
            alt="close-btn"
            class="close-btn"
            @click.stop.prevent="$emit('close')"
          />
        </div>
        <!-- modal body: user icon and textarea -->
        <div class="modal-body">
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
        <!-- modal footer: warning message, push tweet button -->
        <div class="modal-footer">
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
    </div>
  </Transition>
</template>

<script>
import tweetsAPI from "../apis/tweet";
import { emptyImageFilter } from "../utils/mixins";
import { Toast } from "../utils/helpers";
import { mapState } from "vuex";

export default {
  name: "TweetModal",
  mixins: [emptyImageFilter],
  props: {
    // 從 Home.vue 傳來
    show: Boolean,
  },
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

        if (data.status === "error") {
          throw new Error(data.message);
        }

        // emit to Home.vue
        this.$emit("after-tweet-submit");
        // notify user
        Toast.fire({
          icon: "success",
          title: "成功送出推文",
        });
        // re-enable tweet button
        this.isProcessing = false;
        // clear tweet content
        this.tweetContent = "";
        // close the modal after submitted
        this.$emit('close');
      } catch (error) {
        console.error(error.response.data);
        // re-enable tweet button
        this.isProcessing = false;
        Toast.fire({
          icon: "error",
          title: error.message,
        });
      }
    },
    clearErrorMessage() {
      this.errorMessage = "";
    },
  },
  computed: {
    ...mapState(["currentUser"]),
  },
};
</script>

<style scoped>
/* 外層遮罩 */
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-container {
  position: fixed;
  top: 3.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  width: 45%;
  height: 300px;
  border-radius: 0.875rem;
  background-color: var(--dark-10);
}

/* modal header: close button */
.modal-header {
  width: 100%;
  padding: 1.22rem;
  border-bottom: 1px solid var(--page-divider);
}

.close-btn {
  width: 1.5rem;
  height: auto;
  cursor: pointer;
}

/* modal body: user icon and textarea */
.modal-body {
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
  width: 100%;
  padding-top: 0.5rem;
}

.tweet-textarea:focus {
  outline: none;
}

/* modal footer: warning message, push tweet button */
.modal-footer {
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
  width: 4rem;
  height: 2.5rem;
  border-radius: 50px;
}

.tweet-btn.disabled {
  opacity: 0.5;
}

.tweet-btn:focus,
.tweet-btn:active {
  outline: none;
}
</style>