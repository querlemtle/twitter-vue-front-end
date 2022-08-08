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
        <!-- modal body: cited tweet, reply user icon and textarea -->
        <div class="modal-body">
          <!-- cited tweet card -->
          <div class="modal-tweet">
            <img
              class="user-image-sm tweet-user-image"
              :src="initialSpecTweet.user.avatar | emptyImage"
            />
            <div class="card-info">
              <div class="card-header">
                <div class="user-naming">
                  <p class="user-name">{{ initialSpecTweet.user.name }}</p>
                  <p class="user-handle">
                    @{{ initialSpecTweet.user.account }}<span>・</span
                    ><span class="time-stamp">{{
                      initialSpecTweet.createdAt | fromNow
                    }}</span>
                  </p>
                </div>
              </div>
              <div class="card-body">
                <p class="tweet-content">
                  {{ initialSpecTweet.description }}
                </p>
              </div>
              <div class="card-footer">
                <div class="link-line"></div>
                <p class="user-handle">
                  回覆給
                  <span class="user-name-highlight"
                    >@{{ initialSpecTweet.user.account }}</span
                  >
                </p>
              </div>
            </div>
          </div>
          <!-- reply card -->
          <div class="card-reply">
            <img
              :src="currentUser.avatar | emptyImage"
              alt="reply-user-image"
              class="user-image-sm reply-user-image"
            />
            <textarea
              class="reply-textarea"
              placeholder="推你的回覆"
              v-model="replyContent"
              @input="clearErrorMessage"
            ></textarea>
          </div>
        </div>
        <!-- modal footer: warning message, push reply button -->
        <div class="modal-footer">
          <span class="tweet-warning mx-3">{{ this.errorMessage }}</span>
          <button
            class="tweet-btn btn-bg btn-border"
            :class="{ disabled: isProcessing }"
            @click.prevent.stop="
              handleReplySubmit(initialSpecTweet.id, replyContent)
            "
          >
            回覆
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import { emptyImageFilter } from "../utils/mixins";
import { fromNowFilter } from "../utils/mixins";
import { mapState } from "vuex";
import { Toast } from "../utils/helpers";
import repliesAPI from "../apis/reply";

export default {
  name: "ReplyModal",
  mixins: [emptyImageFilter, fromNowFilter],
  props: {
    // 從 Home.vue 或 Tweet.vue 傳來
    show: Boolean,
    userTweet : {
      type: Object,
    },
    // 來自 Tweet.vue or Home.vue
    initialSpecTweet: {
      type: Object,
    },
  },
  data() {
    return {
      replyContent: "",
      errorMessage: "",
      isProcessing: false,
    };
  },
  methods: {
    async handleReplySubmit(tweetId, content) {
      try {
        if (!content || content.trim().length === 0) {
          this.errorMessage = "內容不可空白";
          return;
        } else if (content.trim().length > 140) {
          this.errorMessage = "字數不可超過 140 字";
          return;
        }

        // disable reply button to prevent duplicate requests
        this.isProcessing = true;

        // POST api/tweets/:tweet_id/replies
        const { data } = await repliesAPI.postReply(tweetId, content);

        if (data.status === "error") {
          throw new Error(data.message);
        }

        // emit to tweet.vue
        this.$emit("after-reply-submit", tweetId);
        // notify user
        Toast.fire({
          icon: "success",
          title: "成功送出回覆",
        });

        // re-enable tweet button
        this.isProcessing = false;
        // clear reply content
        this.replyContent = "";
        // close the modal after submitted
        this.$emit("close");
      } catch (error) {
        console.error(error.response.data);
        // re-enable reply button
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
    tweet: {
      get() {
        return this.initialSpecTweet;
      },
      set(value) {
        // update props: initialSpecTweet or initialTweet
        this.$emit("update-tweet", value);
      },
    },
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
  height: 500px;
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

/* modal body: cited tweet, reply user icon and textarea */
.modal-body {
  width: 100%;
  background-color: var(--dark-10);
  padding: 1rem;
  position: relative;
  display: flex;
  flex-direction: column;
  row-gap: 1.25rem;
}

/* cited tweet card */
.card-tweet {
  display: flex;
  position: relative;
}

.tweet-user-image {
  margin-right: 0.5rem;
}

.card-info {
  display: flex;
  flex-direction: column;
}

/* cited tweet card header: user name, handle and creating tweet time */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-bottom: 1rem;
}

.user-naming {
  display: flex;
  column-gap: 0.5rem;
}

/* cited tweet card footer: link-line, reply to whom */
.card-footer {
  margin-top: 9px;
  display: flex;
  column-gap: 2.58rem;
}

.link-line {
  width: 2px;
  height: 50px;
  background-color: var(--dark-60);
  position: absolute;
  top: 50%;
  left: calc(50px / 2);
}

.user-name-highlight {
  color: var(--main-color);
}

/* reply card */
.card-reply {
  display: flex;
  column-gap: 10px;
  height: 100%;
}

.reply-textarea {
  background-color: inherit;
  border: none;
  resize: none;
  font-size: 1.125rem;
  width: 100%;
  height: 100%;
  padding-top: 0.5rem;
}

.reply-textarea:focus {
  outline: none;
}

/* modal footer: warning message, push reply button */
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