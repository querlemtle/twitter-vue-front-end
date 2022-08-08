<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <SideBar @show-tweet-modal="toggleTweetModal(true)" />
      </div>
      <div class="col-7 scrollable-part">
        <h4 class="main-title">首頁</h4>
        <CreateTweet @after-tweet-submit="afterTweetSubmit" />
        <div class="divider"></div>
        <div class="card-container">
          <TweetCard
            v-for="tweet in allTweets"
            :key="tweet.id"
            :initial-tweet="tweet"
            @show-reply-modal="toggleReplyModal(true, tweet)"
          />
        </div>
      </div>
      <div class="col">
        <PopularUsers />
      </div>
    </div>
    <TweetModal
      :show="showTweetModal"
      @close="toggleTweetModal(false)"
      @after-tweet-submit="afterTweetSubmit"
    />
    <ReplyModal
      :show="showReplyModal"
      :initial-spec-tweet.sync="selectedTweet"
      @close="toggleReplyModal(false)"
      @after-reply-submit="afterReplySubmit"
    />
  </div>
</template>

<script>
import SideBar from "../components/Sidebar";
import PopularUsers from "../components/PopularUsers";
import TweetModal from "../components/TweetModal";
import CreateTweet from "../components/CreateTweet";
import TweetCard from "../components/TweetCard";
import ReplyModal from "../components/ReplyModal";
import tweetsAPI from "../apis/tweet";
import { Toast } from "../utils/helpers";
import { mapState } from "vuex";

export default {
  name: "Home",
  data() {
    return {
      showTweetModal: false,
      showReplyModal: false,
      allTweets: [],
      // for ReplyModal.vue
      selectedTweet: {}
    };
  },
  components: {
    SideBar,
    PopularUsers,
    TweetModal,
    CreateTweet,
    TweetCard,
    ReplyModal,
  },
  created() {
    this.fetchTweets();
  },
  methods: {
    toggleTweetModal(bool) {
      this.showTweetModal = bool;
    },
    toggleReplyModal(bool, tweet) {
      this.showReplyModal = bool;
      this.selectedTweet = tweet;
    },
    async fetchTweets() {
      try {
        const response = await tweetsAPI.getTweets();

        this.allTweets = response.data;

        if (response.data.status === "error") {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error(error.response.data.message);
        Toast.fire({
          icon: "error",
          title: "無法取得所有推文，請稍後再試",
        });
      }
    },
    afterTweetSubmit() {
      this.fetchTweets();
    },
    afterReplySubmit() {
      this.fetchTweets();
    }
  },
  computed: {
    ...mapState(["currentUser"]),
  },
};
</script>

<style scoped>
/* 標題文字設定 */
.main-title {
  padding: 1.5rem;
  font-weight: 700;
  border-bottom: 1px solid var(--page-divider);
}

/* 取消中間區塊的 padding，讓網格線可以接起來 */
.row > * {
  padding-left: 0;
  padding-right: 0;
}

/* 區塊分隔線 */
.divider {
  width: 100%;
  height: 0.625rem;
  background-color: var(--page-divider);
}
</style>
