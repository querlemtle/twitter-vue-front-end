<template>
  <aside class="aside">
    <h4 class="card-title">推薦跟隨</h4>
    <div class="card-container">
      <div v-if="isTopUsersUnavailable" class="error-message">
        目前無法取得熱門使用者...
      </div>
      <div class="card-info" v-for="user in popularUsers" :key="user.id">
        <router-link :to="{ name: 'user', params: { id: user.id } }">
        <img
          class="user-image-sm"
          :src="user.avatar | emptyImage"
          alt="user-image"
        />
        </router-link>

        <div class="user-naming-col">
          <router-link :to="{ name: 'user', params: { id: user.id } }">
          <p class="user-name">{{ user.name }}</p>
          </router-link>
          <router-link :to="{ name: 'user', params: { id: user.id } }">
          <p class="user-handle">@{{ user.account }}</p>
          </router-link>
        </div>
        <button
          class="btn-border btn-50 btn-clip user-follow-btn"
          v-if="user.id !== currentUser.id"
          :active="user.isFollowed"
          @click="changeFollowingCount(user.isFollowed)"
          @click.prevent.stop="toggleFollowUser(user.isFollowed, user.id)"
        >
          {{ user.isFollowed ? "正在跟隨" : "跟隨" }}
        </button>
      </div>
    </div>
  </aside>
</template>

<script>
import followsAPI from "../apis/followship";
import { emptyImageFilter } from "../utils/mixins";
import { Toast } from "../utils/helpers";
import { mapState } from "vuex";

export default {
  name: "PopularUsers",
  mixins: [emptyImageFilter],
  data() {
    return {
      popularUsers: [],
      isTopUsersUnavailable: false,
    };
  },
  methods: {
    changeFollowingCount(toggleIsFollowed) {
      console.log("step 1. changeFollowingCount is click")
      this.$emit('change-count',toggleIsFollowed)
    },
    async fetchTopUsers() {
      try {
        const { data } = await followsAPI.getTopUsers();
        this.popularUsers = data;
      } catch (error) {
        console.error(error.response.data.message);
        this.isTopUsersUnavailable = true;
      }
    },
    async toggleFollowUser(isUserFollowed, userId) {
      try {
        // 已經跟隨該 user
        if (isUserFollowed) {
          // DETELE /api/followships/:followingId 取消跟隨
          const response = await followsAPI.unFollowUser({ userId });
          
          if (response.data.status === "success") {
            Toast.fire({
              icon: "success",
              title: "成功取消跟隨",
            });

          // stop
          // //  向 User 傳遞值有變動
          // this.$emit('after-click-followBtn', "unFollow") 
          } else if (response.data.status === "error") {
            throw new Error(response.data.message);
          }
        } else {
          // POST /api/followships 進行跟隨
          const response = await followsAPI.followUser({ userId });

          if (response.data.status === "success") {
            Toast.fire({
              icon: "success",
              title: "成功跟隨",
            });

          } else if (response.data.status === "error") {
            throw new Error(response.data.message);
          }
        }
        // stop
        // //  向 User 傳遞值有變動
        //   this.$emit('after-click-followBtn', "addFollow") 
        
        // 修改該 user.isFollowed
        const targetIndex = this.popularUsers.findIndex(user => user.id === userId);
        this.popularUsers[targetIndex].isFollowed = !this.popularUsers[targetIndex].isFollowed;

      } catch (error) {
        console.error(error.response.data.message);
        Toast.fire({
          icon: "error",
          title: error.response.data.message,
        });
      }
    },
  },
  created() {
    this.fetchTopUsers();
  },
  computed: {
    ...mapState(["currentUser"]),
  },
};
</script>

<style scoped>
.aside {
  height: max-content;
  background-color: var(--dark-20);
  border-radius: 1rem;
  margin-top: 1rem;
}

.card-container {
  width: 100%;
  height: 100%;
  padding: 0.5rem 1.5rem;
  border-top: 1px solid var(--page-divider);
}

.card-title {
  padding: 1.5rem;
  font-weight: 700;
}

.card-info {
  width: 100%;
  display: grid;
  grid-template-columns: 50px 100px 100px;
  column-gap: 0.5rem;
  padding: 0.5rem 0;
}

/* 名稱不換行，過長的名稱後方會以...顯示 */
.user-name,
.user-handle {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-name {
  font-weight: 700;
}

.user-handle {
  color: var(--dark-70);
  font-size: 0.875rem;
  font-weight: 500;
}

.user-follow-btn {
  height: 2.5rem;
  padding: 0.5rem 1rem;
  justify-self: end;
}

button[active] {
  background-color: var(--main-color);
  color: #ffffff;
}
</style>