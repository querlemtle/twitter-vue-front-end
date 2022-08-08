<template>
  <div class="card-group">
    <div class="card">
      <div class="card-header mt-3">
        <div class="d-flex align-items-center">
          <div class="me-2">
            <router-link to="/home">
            <img
              :src="require('../assets/pictures/prev.png')"
              class="prev-icon"
              alt="..."
            />
            </router-link>
          </div>
          <div>
            <h5 class="user-name m-0">
              {{ user.name }}
            </h5>
            <span class="card-text">{{ user.tweetCounts }} 推文</span>
          </div>
        </div>
      </div>
      <!-- profile -->
      <div class="profile-wrapper position-relative">
        <div class="profile-cover">
          <img
            class="banner-img w-100"
            :src="user.banner | emptyBanner"
            style="height: 200px"
            alt="user-banner"
          />
        </div>

        <!-- person-img -->
        <div class="person-img">
          <img
            class="avatar-img rounded-circle position-absolute"
            :src="user.avatar | emptyImage"
          />
        </div>
        <div class="d-flex justify-content-end">
          <!-- If its current user: Edit button -->
          <div class="d-flex justify-content-end">
            <button
              v-if="currentUser.id === +this.$route.params.id"
              type="button"
              @click.stop.prevent="showEditModal(true)"
              class="btn btn-edit btn-border btn-50"
            >
              編輯個人資料
            </button>
            <!-- If its other users: noti and mail icons, follow button -->
            <div
              class="icon-section"
              v-if="currentUser.id !== +this.$route.params.id"
            >
              <div class="icon-round">
                <img
                  class="icon"
                  :src="require('../assets/pictures/mail.png')"
                />
              </div>
              <div class="icon-round">
                <img
                  class="icon"
                  :src="require('../assets/pictures/noti.png')"
                />
              </div>
              <button class="btn-border btn-50 btn-clip btn-edit"
              :class="user.isFollowed"
              @click="changeFollowingCount(user.isFollowed)"
              @click.prevent.stop="toggleFollowUser(user.isFollowed, user.id)"
              >{{ user.isFollowed ? "正在跟隨" : "跟隨" }}</button>
            </div>
          </div>
        </div>

        <div class="card-body text-start">
          <h5 class="user-name">{{ user.name }}</h5>
          <span class="card-text">@ {{ user.account }}</span>
          <p class="introduction">{{ user.introduction }}</p>
          <span class="card-text me-4">
            <router-link :to="{ name: 'user-followings', params: { id: user.id } }">
            <span class="num">{{ user.followingCounts }}個</span>跟隨中
            </router-link>
          </span>
          <span class="card-text">
            <router-link :to="{ name: 'user-followers', params: { id: user.id } }">
            <span class="num">{{ user.followerCounts }}位</span>追隨者
            </router-link>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { emptyImageFilter } from "./../utils/mixins";
import { mapState } from "vuex";
import followsAPI from "../apis/followship";
import { Toast } from "../utils/helpers";
import { bus } from '../main';

export default {
  name: "UserProfileCard",
  mixins: [emptyImageFilter],
  data() {
    return {
      showProfileEditModal: false,
      isEditing: false,
      isLoading: true,
    };
  },
  props: {
    user: {
      Type: Array,
      required: true,
    },
  },
  methods: {
    showEditModal(bool) {
      // 通知 User.vue 顯示 edit modal
      this.$emit("show-edit-modal", bool);
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

      } catch (error) {
        console.error(error.response.data.message);
        Toast.fire({
          icon: "error",
          title: error.response.data.message,
        });
      }
    },
    viewingUser() {
      bus.$emit("viewing-user", this.user);
    }
  },
  computed: {
    ...mapState(["currentUser"]),
  }, 
};
</script>

<style scope>
a,
a:hover {
  color: var(--secondary-color);
}
.card-group {
  border-left: 1px solid var(--border-line-color);
  border-right: 1px solid var(--border-line-color);
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
.introduction {
  font-size: 0.875rem;
  line-height: 1.375rem;
  text-align: left;
  color: var(--dark-100);
}
/* text-setting */
span.card-text {
  color: var(--secondary-color);
}
span.num {
  color: initial;
}
.btn-edit {
  margin-top: 1rem;
  margin-right: 1rem;
  color: var(--main-color);
}
button[active] {
  background-color: var(--main-color);
  color: #ffffff;
}
.avatar-img {
  top: 50%;
  left: 10%;
  transform: translate(-30%, -50%);
  width: 140px;
  height: 140px;
  border: 4px #ffffff solid;
}
.icon-round {
  width: 40px;
  height: 40px;
  border: 1px solid var(--main-color);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  margin-right: 1rem;
}
.icon {
  width: 20px;
  height: 20px;
  filter: brightness(0) saturate(100%) invert(38%) sepia(52%) saturate(2219%)
    hue-rotate(2deg) brightness(107%) contrast(105%);
  cursor: pointer;
}
</style>