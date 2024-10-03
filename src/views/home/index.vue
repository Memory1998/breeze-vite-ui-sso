<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { onMounted } from 'vue'
import { loadGreetings } from '@/utils/times'
import useUserStore from '@/store/modules/user'
import useSettingStore from '@/store/modules/setting.ts'

let settings = useSettingStore().settings
let userStore = useUserStore()

onMounted(() => {
  console.log('index.vue mounted')
})
</script>

<template>
  <el-card>
    <div class="box">
      <img :src="userStore.userInfo?.avatar || settings.logoUrl" alt="" class="avatar" />
      <div class="header">
        <h3 class="title">
          {{ loadGreetings() }}~
          <span class="gradient">{{ userStore.userInfo?.username }}</span>
        </h3>
        <p class="subtitle" v-has="['ROLE_ADMIN']">{{ settings.title }}</p>
      </div>
    </div>
  </el-card>

  <el-card>
    <div class="box">
      <div class="client">DMS</div>
      <div class="client">SRM</div>
      <div class="client">EMS</div>
      <div class="client">MES</div>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.el-card {
  margin: 10px;
}

.box {
  display: flex;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .header {
    margin-top: 15px;
    margin-left: 20px;

    .title {
      margin-bottom: 30px;
      font-size: 35px;
      font-weight: 900;

      .gradient {
        font-size: 24px;
        font-weight: bold;
        color: transparent;
        background: linear-gradient(to right, #001529, #001529, #fff);
        /* 渐变方向是从左到右，颜色从红色到绿色 */
        background-clip: text;
        /* 兼容WebKit浏览器（例如Chrome和Safari） */
        -webkit-background-clip: text;
      }
    }

    .subtitle {
      font-style: italic;
      font-weight: 700;
      color: #ccc;
    }
  }

  .client {
    cursor: pointer;
    width: 100px;
    height: 100px;
    background: #f5f5f5;
    border-radius: 10px;
    margin: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    font-weight: bold;
    color: #333;
  }

  .client:active {
    transform: scale(0.95);
  }
  .client:hover {
    background: #e6e6e6;
  }
}
</style>
