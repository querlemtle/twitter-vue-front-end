<template>
  <div class="card-group">
    <!-- User Followers/ following card list -->
    <div class="card-container">
      <div class="card-follow">
        <div class="user-image">
          <router-link :to="{ name: 'user', params: { id: follower.id } }">
            <img
              class="user-image-sm"
              :src="follower.avatar | emptyImage"
              alt="user-image"
            />
          </router-link>
        </div>
        <div class="card-info" >
          <div class="card-header ">
            <p class="user-name">
              <router-link :to="{ name: 'user', params: { id: follower.id } }">
                <p class="user-name">{{ follower.name }}</p>
              </router-link>
            </p>
            <button class="btn-border btn-clip btn-50 user-follow-btn"
              v-if="follower.id !== currentUser.id"
              :active="follower.isFollowed"
              @click="changeFollowingCount(follower.isFollowed)"
              @click.prevent.stop="toggleFollowUser(follower.isFollowed, follower.id)"
            >
              {{ follower.isFollowed ? "正在跟隨" : "跟隨" }}
            </button>
          </div>
          <div class="card-body">
            <p class="introduction">
               {{ follower.introduction }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { emptyImageFilter } from "../utils/mixins";
import followsAPI from "../apis/followship";
import { mapState } from "vuex";
import { Toast } from "../utils/helpers";

export default {
  name: "UserFollowsCard",
  mixins: [emptyImageFilter],
  props: {
    initialFollower: {
      type: Object,
      required: true,
    },
    initialFollowing: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      follower: this.initialFollowing,
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
          const response = await followsAPI.unFollowUser(userId);

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
          const response = await followsAPI.followUser(userId);

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
  computed: {
    ...mapState(["currentUser"]),
  },
};
</script>

<style scoped>
/* User page header */
.card-group {
  max-width: 640px;
  border-left: 1px solid var(--border-line-color);
  border-right: 1px solid var(--border-line-color);
  display: flex;
  flex-direction: column;
}
.card {
  border: initial;
}
.card-header {
  background-color: initial;
}
.card-text {
  color: var(--dark-100);
}
.prev-icon {
  width: 17px;
}
.user-name {
  font-weight: 700;
  line-height: 26px;
  color: var(--dark-100);
}

/* User Followers/ following card list */
.card-container {
  display: flex;
  flex-direction: column;
}

.card-follow {
  display: flex;
  border-bottom: 1px solid #e6ecf0;
  padding: 1rem;
}

.user-image {
  margin-right: 0.5rem;
  width: 50px;
  height: 50px;
}

.card-info {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
}

.user-follow-btn {
  width: max-content;
  padding: 0.5rem 1rem;
  justify-self: end;
}

button[active] {
  background-color: var(--main-color);
  color: #ffffff;
}

</style>