<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <SideBar @show-tweet-modal="toggleTweetModal(true)" />
      </div>
      <div class="col-7 scrollable-part">
        <div class="main-title">
          <router-link to="/home">
            <img
              :src="require('../assets/pictures/prev.png')"
              class="prev-icon"
              alt="..."
            />
          </router-link>
          <h4>推文</h4>
        </div>
        <TweetDetail
          @show-reply-modal="toggleReplyModal(true)"
          :initial-spec-tweet.sync="specTweet"
        />
        <ReplyCard
          v-for="reply in replies"
          :key="reply.id"
          :initial-reply="reply"
        />
      </div>
      <div class="col">
        <PopularUsers />
      </div>
    </div>
    <TweetModal :show="showTweetModal" @close="toggleTweetModal(false)" />
    <ReplyModal
      :initial-spec-tweet.sync="specTweet"
      :show="showReplyModal"
      @close="toggleReplyModal(false)"
      @after-reply-submit="afterReplySubmit"
    />
  </div>
</template>

<script>
import SideBar from "../components/Sidebar";
import PopularUsers from "../components/PopularUsers";
import TweetModal from "../components/TweetModal";
import ReplyModal from "../components/ReplyModal";
import TweetDetail from "../components/TweetDetail";
import ReplyCard from "../components/ReplyCard";
import tweetsAPI from "../apis/tweet";
import repliesAPI from "../apis/reply";
import { Toast } from "../utils/helpers";

export default {
  name: "Tweet",
  data() {
    return {
      showTweetModal: false,
      showReplyModal: false,
      specTweet: {
        id: -1,
        description: "",
        createdAt: "",
        user: {
          id: -1,
          account: "",
          name: "",
          avatar: "",
        },
        isLiked: false,
        likeCounts: 0,
        replyCounts: 0,
      },
      replies: [],
    };
  },
  components: {
    SideBar,
    PopularUsers,
    TweetModal,
    ReplyModal,
    TweetDetail,
    ReplyCard,
  },
  created() {
    const { id } = this.$route.params;
    this.fetchSpecTweet(id);
    this.fetchReplies(id);
  },
  beforeRouteUpdate(to, from, next) {
    // 直接輸入 url 也可取得推文內容
    const { id } = to.params;
    this.fetchSpecTweet(id);
    this.fetchReplies(id);
    next();
  },
  methods: {
    toggleTweetModal(bool) {
      this.showTweetModal = bool;
    },
    toggleReplyModal(bool) {
      this.showReplyModal = bool;
    },
    async fetchSpecTweet(tweetId) {
      try {
        const { data } = await tweetsAPI.getSpecTweet(tweetId);
        if (data.status === "error") {
          throw new Error(data.message);
        }
        const {
          id,
          description,
          createdAt,
          user,
          isLiked,
          likeCounts,
          replyCounts,
        } = data;

        this.specTweet = {
          id,
          description,
          createdAt,
          user,
          isLiked,
          likeCounts,
          replyCounts,
        };
      } catch (error) {
        console.error(error.response.data.message);
        Toast.fire({
          icon: "error",
          title: "無法取得推文資料，請再試一次",
        });
      }
    },
    async fetchReplies(tweetId) {
      try {
        const response = await repliesAPI.getReplies(tweetId);

        if (response.data.status === "error") {
          throw new Error(response.data.message);
        }

        this.replies = response.data;
      } catch (error) {
        console.error(error.respone.data.message);
        Toast.fire({
          icon: "error",
          title: "無法取得回覆，請再試一次",
        });
      }
    },
    afterReplySubmit() {
      this.fetchReplies(this.specTweet.id);
      // 收到 ReplyModal.vue 通知後，將回覆數++
      this.specTweet.replyCounts++;
    },
  },
};
</script>

<style scoped>
.prev-icon {
  width: 17px;
  height: 14px;
}

/* 標題文字設定 */
.main-title {
  padding: 1.5rem;
  font-weight: 700;
  border-bottom: 1px solid var(--page-divider);
  display: flex;
  align-items: center;
  column-gap: 1.1875rem;
}

/* 取消中間區塊的 padding，讓網格線可以接起來 */
.row > * {
  padding-left: 0;
  padding-right: 0;
}
</style>
