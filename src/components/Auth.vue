<template>
  <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div v-if="isLogin">
      <h2 class="text-2xl mb-4">登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
            用户名
          </label>
          <input v-model="username" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="用户名">
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            密码
          </label>
          <input v-model="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************">
        </div>
        <div class="flex items-center justify-between">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            登录
          </button>
          <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#" @click.prevent="isLogin = false">
            注册新账号
          </a>
        </div>
      </form>
    </div>
    <div v-else>
      <h2 class="text-2xl mb-4">注册</h2>
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="register-username">
            用户名
          </label>
          <input v-model="username" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="register-username" type="text" placeholder="用户名">
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="register-email">
            邮箱
          </label>
          <input v-model="email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="register-email" type="email" placeholder="邮箱">
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="register-password">
            密码
          </label>
          <input v-model="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="register-password" type="password" placeholder="******************">
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="verification-code">
            验证码
          </label>
          <div class="flex">
            <input v-model="verificationCode" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="verification-code" type="text" placeholder="验证码">
            <button @click.prevent="sendVerificationCode" class="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
              发送验证码
            </button>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            注册
          </button>
          <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#" @click.prevent="isLogin = true">
            已有账号？登录
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import axios from 'axios';

const isLogin = ref(true);
const username = ref('');
const email = ref('');
const password = ref('');
const verificationCode = ref('');

const emit = defineEmits(['login']);

const handleLogin = async () => {
  try {
    const response = await axios.post('/api/auth/login', {
      username: username.value,
      password: password.value
    });
    localStorage.setItem('token', response.data.token);
    emit('login');
  } catch (error) {
    console.error('登录失败:', error);
    alert('登录失败，请检查用户名和密码');
  }
};

const handleRegister = async () => {
  try {
    await axios.post('/api/auth/register', {
      username: username.value,
      email: email.value,
      password: password.value,
      verificationCode: verificationCode.value
    });
    alert('注册成功，请登录');
    isLogin.value = true;
  } catch (error) {
    console.error('注册失败:', error);
    alert('注册失败，请检查输入信息');
  }
};

const sendVerificationCode = async () => {
  try {
    await axios.post('/api/auth/send-verification', { email: email.value });
    alert('验证码已发送，请查看邮箱');
  } catch (error) {
    console.error('发送验证码失败:', error);
    alert('发送验证码失败，请稍后重试');
  }
};
</script>