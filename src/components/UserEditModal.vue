<template>
  <div>
    <div v-if="show" class="modal-mask">
      <div class="modal-container">
        <form
          class="mx-auto w-100"
          @submit.prevent.stop="handleEditModalSubmit"
        >
          <!-- modal header: close button -->
          <div class="modal-header">
            <div class="modal-title-wrapper d-flex">
              <img
                src="./../assets/pictures/close.png"
                alt="close-btn"
                class="close-btn"
                @click.stop.prevent="$emit('close')"
              />
              <div class="modal-title">編輯個人資料</div>
            </div>
            <button class="save-btn btn-bg btn-border" :disabled="isProcessing">
              儲存
            </button>
          </div>
          <div class="profile-wrapper position-relative">
            <!-- icon -->
            <label for="banner-image" class="banner-icon change-photo"></label>

            <label
              class="banner-icon cancel-change"
              v-if="isCancelBtnShown"
              @click.prevent.stop="handleCancel"
            ></label>
            <!-- preview banner -->
            <img
              v-if="tempUser.banner"
              :src="tempUser.banner"
              class="banner-img w-100 banner-preview"
            />
            <img
              v-if="!tempUser.banner"
              class="banner-img w-100"
              :src="currentUser.banner | emptyBanner"
              alt="banner"
            />

            <input
              name="banner"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              class="upload-banner"
              id="banner-image"
              @change="handleBannerChange"
            />
            <div class="bg-mask banner-mask"></div>

            <div class="person-img">
              <label
                for="avatar-image"
                class="avatar-icon avatar-change-photo"
              ></label>
              <img
                class="avatar-img rounded-circle position-absolute"
                :src="currentUser.avatar | emptyImage"
                alt="person-image"
              />
              <!-- preview avatar -->
              <img
                v-if="tempUser.avatar"
                :src="tempUser.avatar"
                class="avatar-img rounded-circle position-absolute avatar-preview"
                width="200"
                height="200"
              />
              <input
                name="avatar"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                class="upload-avatar"
                id="avatar-image"
                @change="handleAvatarChange"
              />

              <div class="avatar-mask"></div>
            </div>
          </div>
          <div class="modal-body">
            <div class="form-input d-flex flex-column">
              <label for="name" class="form-input-text">名稱</label>
              <input
                type="text"
                name="name"
                id="name"
                :class="{ error: isNameInvalid }"
                v-model="tempUser.name"
                @input="isNameInvalid = false"
                required
              />
              <span v-if="isNameInvalid" class="error-message mx-3">{{
                nameErrorMessage
              }}</span>
            </div>
            <div class="form-input form-introduction d-flex">
              <label for="introduction" class="form-input-text">自我介紹</label>
              <input
                type="text"
                name="introduction"
                id="introduction"
                :class="{ error: isIntroTooLong }"
                v-model="tempUser.introduction"
                @input="isIntroTooLong = false"
                required
              />
              <span v-if="isIntroTooLong" class="error-message mx-3"
                >自我介紹不可超過 160 字！</span
              >
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { emptyImageFilter } from "./../utils/mixins";
import { mapState } from "vuex";
import { Toast } from "../utils/helpers";
import usersAPI from "../apis/user";

export default {
  name: "UserEditModal",
  mixins: [emptyImageFilter],
  data() {
    return {
      tempUser: {
        id: "",
        name: "",
        introduction: "",
        avatar: "",
        banner: "",
      },
      isNameInvalid: false,
      nameErrorMessage: "",
      isIntroTooLong: false,
      isProcessing: false,
      isCancelBtnShown: false,
    };
  },
  created() {
    this.tempUser.id = this.currentUser.id;
    this.tempUser.name = this.currentUser.name;
    this.tempUser.introduction = this.currentUser.introduction;
    this.tempUser.avatar = this.currentUser.avatar;
    this.tempUser.banner = this.currentUser.banner;
  },
  props: {
    // 從 User.vue 傳來
    show: Boolean,
  },
  computed: {
    // 從 Vuex 取得 currentUser 的資料
    ...mapState(["currentUser"]),
  },
  methods: {
    async handleEditModalSubmit(event) {
      try {
        // 若名稱沒填，防止請求送出
        if (!this.tempUser.name) {
          this.isNameInvalid = true;
          this.nameErrorMessage = "名稱不可空白";
          return;
        }

        // 名稱超過 50 字，防止請求送出
        if (this.tempUser.name.length > 50) {
          this.isNameInvalid = true;
          this.nameErrorMessage = "名稱不可超過 50 字！";
          return;
        }

        // 自我介紹超過 160 字，防止請求送出
        if (this.tempUser.introduction.length > 160) {
          this.isIntroTooLong = true;
          return;
        }
        // 暫時關閉按鈕
        this.isProcessing = true;

        const form = event.target;
        const formData = new FormData(form);

        const response = await usersAPI.editSelfData({ userId: this.tempUser.id, formData });

        if (response.data.status === "error") {
          throw new Error(response.data.message);
        }
        // notify User.vue to update user data
        this.$emit("after-edit-submit");
        Toast.fire({
          icon: "success",
          title: "更改個人資料成功！",
        });
        // close the modal after submitted
        this.$emit("close");
        this.isProcessing = false;
      } catch (error) {
        this.isProcessing = false;
        console.error(error.response.data.message);
        switch (error.response.data.message) {
          case "permission denied":
            Toast.fire({
              icon: "error",
              title: "您沒有權限修改",
            });
            break;
          case "Error: Target user not exist":
            Toast.fire({
              icon: "error",
              title: "使用者不存在",
            });
            break;
          default:
            Toast.fire({
              icon: "error",
              title: "修改個人資料失敗，請再試一次",
            });
            break;
        }
      }
    },
    handleAvatarChange(event) {
      const { files } = event.target;
      // 如果有上傳檔案，產生預覽圖
      if (files.length !== 0) {
        const imageURL = window.URL.createObjectURL(files[0]);
        this.tempUser.avatar = imageURL;
      }
    },
    handleBannerChange(event) {
      const { files } = event.target;
      // 如果有上傳檔案，產生預覽圖
      if (files.length !== 0) {
        // 顯示取消按鈕
        this.isCancelBtnShown = true;
        const imageURL = window.URL.createObjectURL(files[0]);
        this.tempUser.banner = imageURL;
        console.log(this.tempUser.banner);
      }
    },
    handleCancel() {
      // 清空 banner
      this.tempUser.banner = "";
      // 隱藏取消按鈕
      this.isCancelBtnShown = false;
    },
  },
};
</script>

<style scoped>
.modal-container {
  min-width: 634px;
}

.modal-body {
  width: 100%;
  padding: 5rem 1rem 1rem 1rem;
  max-height: max-content;
  border-bottom-left-radius: 0.875rem;
  border-bottom-right-radius: 0.875rem;
  background-color: var(--dark-10);
}

.modal-title {
  margin-left: 2.25rem;
  font-size: 18px;
  font-weight: 700;
  line-height: 26px;
  text-align: left;
}

.form-input-text {
  color: var(--dark-80);
}

.form-introduction {
  height: 12.25vh;
  border-radius: 2px;
}

.form-introduction input {
  line-height: 12.25vh;
}

.error-message {
  color: var(--danger-color);
}

.error {
  border-bottom: 2px solid var(--danger-color);
}

/* same as UserProfileCard */
.avatar-img {
  position: absolute;
  top: 124px;
  left: 10%;
  z-index: 66;
  transform: translate(-10%);
  width: 140px;
  height: 140px;
  border: 4px #ffffff solid;
}

.banner-img {
  height: 200px;
}

/* banner、avatar icon(change-photo、cancel) */
.banner-icon,
.avatar-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: block;
  width: 20px;
  height: 20px;
  cursor: pointer;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 999;
}

.banner-icon.change-photo {
  background-image: url("./../assets/pictures/change-photo.png");
}

.upload-banner,
.upload-avatar {
  position: absolute;
  z-index: 999;
  display: none;
}

.upload-banner {
  left: 10%;
  top: 90%;
}

.upload-avatar {
  left: 45%;
  top: 45%;
}

.banner-icon.cancel-change {
  top: 50%;
  left: 60%;
  transform: translate(-50%, -50%);
  background-image: url("./../assets/pictures/cancel-change.png");
}

.avatar-change-photo {
  top: 183px;
  left: 18%;
  transform: translate(-18%);
  background-image: url("./../assets/pictures/change-photo.png");
}

/* banner mask 、avatar mask */
.banner-mask {
  background-color: rgba(23, 23, 37, 0.5);
  opacity: 75%;
}

.bg-mask {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}

.avatar-mask {
  position: absolute;
  left: 10%;
  transform: translate(-10%);
  top: 124px;
  width: 140px;
  height: 140px;
  background-color: rgba(23, 23, 37, 0.5);
  border-radius: 50%;
  z-index: 66;
}

.avatar-preview,
.banner-preview {
  z-index: 66;
}
</style>