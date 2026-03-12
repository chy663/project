<template>
    <view :class="['container', isDark ? 'dark-mode' : '']">
        <view class="section-card">
            <view class="section-title">Edit Profile</view>
            <view class="input-item">
                <text class="label">Nickname</text>
                <input class="uni-input" v-model="nickname" placeholder="Enter new nickname" />
            </view>
            <button class="save-btn" @tap="handleUpdateProfile">Save Name</button>
        </view>

        <view class="section-card">
            <view class="section-title">Change Password</view>
            <view class="input-item">
                <input class="uni-input" type="password" v-model="pwdForm.oldPassword" placeholder="Current Password" />
            </view>
            <view class="input-item">
                <input class="uni-input" type="password" v-model="pwdForm.newPassword" placeholder="New Password" />
            </view>
            <button class="save-btn" @tap="handleChangePassword">Update Password</button>
        </view>
    </view>
</template>

<script>
import { themeMixin } from '@/mixins/theme.js';
export default {
    mixins: [themeMixin],
    data() {
        return {
            userId: null,
            nickname: '',
            pwdForm: { oldPassword: '', newPassword: '' }
        };
    },
    onLoad() {
        const userInfo = uni.getStorageSync('userInfo');
        if (userInfo) {
            this.userId = userInfo.id;
            this.nickname = userInfo.nickname || userInfo.username;
        }
    },
    methods: {
        handleUpdateProfile() {
            uni.request({
                url: `http://localhost:8089/api/users/${this.userId}/profile`,
                method: 'PUT',
                data: { nickname: this.nickname },
                success: (res) => {
                    if (res.statusCode === 200) {
                        uni.setStorageSync('userInfo', res.data); // 更新本地缓存
                        uni.showToast({ title: 'Name Updated' });
                    }
                }
            });
        },
        handleChangePassword() {
            if (!this.pwdForm.oldPassword || !this.pwdForm.newPassword) {
                return uni.showToast({ title: 'Please fill all fields', icon: 'none' });
            }
            uni.request({
                url: `http://localhost:8089/api/users/${this.userId}/password`,
                method: 'PUT',
                data: this.pwdForm,
                success: (res) => {
                    if (res.statusCode === 200) {
                        uni.showToast({ title: 'Password Changed' });
                        this.pwdForm = { oldPassword: '', newPassword: '' };
                    } else {
                        uni.showToast({ title: res.data, icon: 'none' });
                    }
                }
            });
        }
    }
}
</script>

<style>
/* 复用 mine.vue 或 systemsetting.vue 的样式卡片风格 */
.container { padding: 30rpx; background-color: #f5f7fa; min-height: 100vh; }
.section-card { background: #fff; border-radius: 24rpx; padding: 30rpx; margin-bottom: 30rpx; }
.section-title { font-size: 32rpx; font-weight: bold; margin-bottom: 30rpx; color: #333; }
.input-item { border-bottom: 1rpx solid #eee; padding: 20rpx 0; margin-bottom: 20rpx; }
.label { font-size: 26rpx; color: #999; }
.save-btn { background: #28a745; color: #fff; border-radius: 50rpx; font-size: 28rpx; margin-top: 10rpx; }
.dark-mode .section-card { background: #2c2c2c; }
.dark-mode .section-title { color: #e0e0e0; }
.dark-mode .uni-input { color: #fff; }
</style>