<template>
  <div id="login" class="d-flex flex-column mx-auto">
    <div class="logo mx-auto mb-4">
      <img :src="require('./../assets/pictures/logo.png')" width="50px" />
    </div>
    <p class="menu-text mx-auto mb-4">登入 Alphitter</p>
    <form class="mx-auto w-100" action="" @submit.prevent.stop="handleSubmit">
      <div class="form-input d-flex flex-column">
        <label for="account" class="form-input-text">帳號</label>
        <input
          type="text"
          name="account"
          id="account"
          v-model.trim="user.account"
          placeholder="請輸入帳號"
          required
        />
      </div>
      <div class="form-input d-flex flex-column">
        <label for="password" class="form-input-text">密碼</label>
        <input
          type="password"
          name="password"
          id="password"
          v-model="user.password"
          placeholder="請輸入密碼"
          required
        />
        <div class="d-flex justify-content-between"></div>
      </div>
      <button
        type="submit"
        class="btn-bg btn-border w-100"
        :disabled="isProcessing"
      >
        {{ isProcessing ? "處理中..." : "登入" }}
      </button>
    </form>
    <div class="text-end">
      <router-link to="/register" class="mx-auto text-blue"
        >註冊 Alphitter</router-link
      >
      <span class="space">．</span>
      <router-link to="/admin" class="mx-auto text-blue">後台登入 </router-link>
    </div>
  </div>
</template>

<script>
import { Toast } from "./../utils/helpers";
import authorizationAPI from "./../apis/authorization";

export default {
  name: "Login",
  data() {
    return {
      user: {
        account: "",
        password: "",
      },
      isProcessing: false,
    };
  },
  methods: {
    async handleSubmit() {
      try {
        if (!this.user.account || !this.user.password) {
          Toast.fire({
            icon: "warning",
            title: "請填寫帳戶、密碼",
          });
          return;
        }
        this.isProcessing = true;

        const response = await authorizationAPI.login({
          account: this.user.account,
          password: this.user.password,
        });

        // 取得 API 請求後的資料
        const data = response.data;

        if (data.status === "error") {
          throw new Error(data.message);
        }
        // token 存取至 localStorage 內
        localStorage.setItem("token", data.token);

        Toast.fire({
          icon: "success",
          title: "登入成功",
        });

        // 成功登入後轉址
        this.$router.push("/home");
      } catch (error) {
        this.isProcessing = false;
        console.error(error.response.data.message);
        switch (error.response.data.message) {
          case "Error: Account or Password error!":
            Toast.fire({
              icon: "error",
              title: "帳號或密碼輸入錯誤！",
            });
            this.user.account = "";
            this.user.password = "";
            break;
          case "Error: account not exist":
            Toast.fire({
              icon: "error",
              title: "帳號不存在！",
            });
            this.user.account = "";
            this.user.password = "";
            break;
        }
      }
    },
  },
};
</script>

<style scoped>
#login {
  width: 540px;
  padding-top: 60px;
}
.menu-text {
  font-size: 1.5rem;
}

.space {
  font-size: 16px;
  font-weight: 400;
  color: #0062ff;
}

button {
  opacity: 1;
  border-radius: 50px;
  margin-top: 40px;
  margin-bottom: 22px;
  padding: 8px 158px 8px 158px;
  background-color: var(--main-color);
  cursor: pointer;
}

.form-input:nth-child(2) {
  margin-bottom: 0rem;
}
</style>