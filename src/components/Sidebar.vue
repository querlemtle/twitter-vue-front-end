<template>
  <nav class="nav">
    <div class="nav-top">
      <div class="nav-logo"></div>
      <ul class="nav-list">
        <li class="nav-item">
          <router-link to="/home" class="nav-link">
            <div class="nav-icon home-icon"></div>
            <span class="nav-title">首頁</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'user', params: { id: currentUser.id } }" class="nav-link">
            <div class="nav-icon person-icon"></div>
            <span class="nav-title">個人資料</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/setting" class="nav-link">
            <div class="nav-icon setting-icon"></div>
            <span class="nav-title">設定</span>
          </router-link>
        </li>
      </ul>
      <button
        class="add-tweet-btn btn-bg btn-border btn-50"
        @click.stop.prevent="showTweetModal(true)"
      >
        推文
      </button>
    </div>
    <div class="nav-bottom">
      <ul class="nav-list">
        <li class="nav-item">
          <div @click.prevent.stop="logout" class="nav-link">
            <div class="nav-icon quit-icon"></div>
            <span class="nav-title">登出</span>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Sidebar",
  methods: {
    showTweetModal(bool) {
      // 通知 Home.vue or Tweet.vue 要開啟 tweet modal
      this.$emit("show-tweet-modal", bool);
    },
    logout() {
      this.$store.commit("revokeAuthentication");
      this.$router.push("/login");
    }
  },
  computed: {
    ...mapState(["currentUser"])
  }
};
</script>

<style scoped>
.nav {
  margin-right: 1.5rem;
}
.nav-logo {
  margin: 0.8125rem 0 0 0.8125rem;
  width: 40px;
  height: 40px;
  background-image: url("./../assets/pictures/logo.png");
  background-size: cover;
  background-repeat: no-repeat;
}

.home-icon {
  background-image: url("./../assets/pictures/home.png");
  background-size: contain;
  background-repeat: no-repeat;
}

.nav-link:hover .home-icon,
.nav-link.active .home-icon {
  background-image: url("./../assets/pictures/home-dark.png");
}

.person-icon {
  background-image: url("./../assets/pictures/person.png");
  background-size: contain;
  background-repeat: no-repeat;
}

.nav-link:hover .person-icon,
.nav-link.active .person-icon {
  background-image: url("./../assets/pictures/person-dark.png");
}

.setting-icon {
  background-image: url("./../assets/pictures/setting.png");
  background-size: contain;
  background-repeat: no-repeat;
}

.nav-link:hover .setting-icon,
.nav-link.active .setting-icon {
  background-image: url("./../assets/pictures/setting-dark.png");
}

.nav-bottom .nav-item {
  margin-bottom: 0;
}

.add-tweet-btn {
  max-width: 11.1rem;
  height: 2.875rem;
  padding: 0.5rem 1.5rem;
}

.quit-icon {
  background-image: url("./../assets/pictures/quit.png");
  background-size: contain;
  background-repeat: no-repeat;
}
</style>