<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <SideBar />
      </div>
      <div class="col-7">
        <UserProfileCard 
        :user="user"
        @show-edit-modal="toggleEditModal(true)" />
        <div>
          <ul class="nav-tab d-flex">
            <li v-for="tab in tabs" :key="tab.id" class="nav-item">
              <router-link :to="tab.path" class="nav-link">
                {{ tab.title }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- todo: 這邊使用 router-link 畫面會 error -->
        <!-- <router-link
          v-for="tweet in tweets"
          :key="tweet.id"
          :initial-tweets="tweets"
        ></router-link>
       -->

        <router-view />
      </div>
      <div class="col">
        <PopularUsers @change-count="handleChangeCount"/>
      </div>
    </div>
    <UserEditModal :show="showEditModal" @close="toggleEditModal(false)" />
  </div>
</template>

<style scoped>
</style>

<script>
import SideBar from "../components/Sidebar";
import UserProfileCard from "./../components/UserProfileCard";
import PopularUsers from "../components/PopularUsers";
import UserEditModal from "../components/UserEditModal";
import userAPI from "./../apis/user";
import { Toast } from "../utils/helpers";

export default {
  name: "User",
  components: {
    SideBar,
    UserProfileCard,
    PopularUsers,
    UserEditModal,
  },
  created() {
    // 取得動態路由位置
    const { id: userId } = this.$route.params;
    this.fetchUserProfile(userId);
  },
  // 追蹤路由變化
  beforeRouteUpdate(to, from, next) {
    const { id } = to.params;
    this.fetchUserProfile(id);
    next();
  },
  data() {
    return {
      tabs: [
        {
          title: "推文",
          path: "tweets",
        },
        {
          title: "回覆",
          path: "replies",
        },
        {
          title: "喜歡的內容",
          path: "likes",
        },
      ],
      currentUser: {},
      tweets: [],
      showEditModal: false,

      user: {
        id: -1,
        account: "",
        name: "",
        email: "",
        introduction: "",
        avatar: "",
        banner: "",
        tweetCounts: 0,
        followingCounts: 0,
        followerCounts: 0,
        likeCount: 0,
        isFollowed: false,
      },
    };
  },
  methods: {
    toggleEditModal(bool) {
      this.showEditModal = bool;
    },
    
    handleChangeCount(value) {
      
      if (value === false) {
        this.user.followingCounts = this.user.followingCounts + 1
      }
      if (value === true) {
        this.user.followingCounts = this.user.followingCounts - 1
      }
    },
  
    async fetchUserProfile(userId) {
      try {
        const response = await userAPI.getUser({ userId });

        if (response.status !== 200) {
          throw new Error(response.message);
        }

        this.user = response.data;

        console.log("UserProfile response.data", response.data);

        this.user = {
          ...this.user,
          introduction: this.user.introduction ? this.user.introduction : "",
        };
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        Toast.fire({
          icon: "error",
          title: "無法取得使用者資料，請稍後再試",
        });
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 90%;
}
.container > div {
  flex-wrap: nowrap;
}
.nav-link.active {
  width: 80px;
  box-shadow: 0px 2px;
  justify-content: center;
  padding: 10px 15px;
  /* todo: 線刪不掉 and 圓弧效果radius:100px  */
}
.navbar-nav {
  flex-direction: row;
}
.nav-item {
  margin: 2rem 2rem 1rem 2rem;
  font-size: 15px;
  font-weight: 700;
  line-height: 22px;
  color: #657786;
}
</style>