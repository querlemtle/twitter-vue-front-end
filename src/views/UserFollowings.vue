<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <SideBar />
      </div>
      <div class="col-7 scrollable-part">
        <div class="main-title">
          <router-link :to="{ name: 'user', params: { id: user.id } }">
          <img
            :src="require('../assets/pictures/prev.png')"
            class="prev-icon"
            alt="..."
          />
          </router-link>
          <div>
            <h5 class="user-name m-0">
              {{ user.name }}
            </h5>
            <span class="card-text">{{ user.tweetCount }} 推文</span>
          </div>
        </div>
        <UserFollowsNav 
        :user="user"/>
        <UserFollowsCard 
          v-for="Following in allFollowings"
          :key="Following.id"
          :initial-following="Following" />
      </div>
      <div class="col">
        <PopularUsers />
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from "../components/Sidebar";
import PopularUsers from "../components/PopularUsers";
import UserFollowsCard from "../components/UserFollowsCard";
import UserFollowsNav from "../components/UserFollowsNav";
import userAPI from "./../apis/user";
import { Toast } from "../utils/helpers";

export default {
  name: "UserFollowings",
  data() {
    return {
      user:[],
      allFollowings: [],
    };
  },
  components: {
    SideBar,
    PopularUsers,
    UserFollowsCard,
    UserFollowsNav
  },
  created() {
    // 取得動態路由位置
    const { id: userId } = this.$route.params;
    this.fetchUserFollowings(userId);

    switch (this.$route.name) {
      case "user-followers":
        // 顯示[追隨者]清單
        break;
    
      case "user-followings":
        // 顯示[正在追隨]清單
        break;
    }
  },
  methods: {
    async fetchUserFollowings(userId) {
      try {
        const response = await userAPI.getUserFollowings({ userId });

        if (response.status !== 200) {
          throw new Error(response.data.message);
        }
        this.user = userId;
        this.allFollowings = response.data;

        console.log("UserProfile response.data", response.data);

        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        Toast.fire({
          icon: "error",
          title: "無法取得使用者資料，請稍後再試",
        });
      }
    }
    
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

/* Scroll bar */
.scrollable-part {
  height: 100vh;
  overflow-y: scroll;
}

.scrollable-part::-webkit-scrollbar {
  background-color: #fafafa;
  width: 15px;
}

.scrollable-part::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 4px;
}
</style>