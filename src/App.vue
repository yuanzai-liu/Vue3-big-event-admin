<script setup>
// import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
// const router = useRouter()
// const route = useRoute()
const userStore = useUserStore()
</script>

<template>
  <div>
    <router-view></router-view>

    <hr />
    <hr />
    <el-button type="success">Success</el-button>

    {{ userStore.token }}
    <el-button @click="userStore.setToken('login')">登录</el-button>
    <el-button @click="userStore.removeToken()">退出</el-button>
  </div>
</template>

<style scoped></style>
