<template>
  <div class="card-group">
    <div class="card">
      <div class="card-header mt-3">
        <div class="d-flex align-items-center">
          <div class="me-2">
            <img
              :src="require('../assets/pictures/prev.png')"
              class="prev-icon"
              alt="..."
            />
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
        <img
          class="banner-img w-100"
          :src="require('../assets/pictures/banner.png')"
          style="height: 200px"
          alt=""
        />
        <!-- person-img -->
        <div class="person-img">
          <img
            class="avatar-img rounded-circle position-absolute"
            :src="user.avatar | emptyImage"
          />
        </div>
        <!-- button -->
        <div class="d-flex justify-content-end">
          <button
            type="button"
            @click.stop.prevent="showEditModal(true)"
            class="btn btn-edit btn-border btn-50"
          >
            編輯個人資料
          </button>
        </div>
      </div>

      <div class="card-body text-start">
        <h5 class="user-name">{{ user.name }}</h5>
        <span class="card-text">@ {{ user.account }}</span>
        <p class="introduction">{{ user.introduction }}</p>
        <span class="card-text me-4">
          <span class="num">{{ user.followingCounts }}個</span>跟隨中
        </span>
        <span class="card-text">
          <span class="num">{{ user.followerCounts }}位</span>追隨者
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { emptyImageFilter } from "./../utils/mixins";
// import UserEditModal from "../components/TweetCard";

export default {
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
      required: true
    }
  },
  // computed: {
  //   UserEditModal
  // },
  // ===
  methods: {

    showEditModal(bool) {
      // 通知 User.vue edit modal
      this.$emit("show-edit-modal", bool);
    },
  },
  
};
</script>

<style scope>
.card-group {
  max-width: 640px;
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
.btn-edit:hover {
  color: var(--secondary-orange-color);
}
.avatar-img {
  top: 50%;
  left: 10%;
  transform: translate(-10%);
  width: 140px;
  height: 140px;
  border: 4px #ffffff solid;
}
</style>