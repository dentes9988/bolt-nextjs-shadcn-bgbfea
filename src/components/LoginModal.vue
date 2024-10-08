<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3 text-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900">{{ isLogin ? '登录' : '注册' }}</h3>
        <div class="mt-2 px-7 py-3">
          <form @submit.prevent="isLogin ? handleLogin : handleRegister">
            <input v-model="username" type="text" placeholder="用户名" class="mt-2 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" required />
            <input v-if="!isLogin" v-model="email" type="email" placeholder="邮箱" class="mt-2 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" required />
            <input v-model="password" type="password" placeholder="密码" class="mt-2 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" required />
            <div v-if="!isLogin" class="flex mt-2">
              <input v-model="verificationCode" type="text" placeholder="验证码" class="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-2/3 rounded-md sm:text-sm focus:ring-1" required />
              <button @click.prevent="sendVerificationCode" type="button" class="ml-2 px-3 py-2 bg-blue-500 text-white text-sm font-bold uppercase rounded">发送验证码</button>
            </div>
            <button type="submit" class="mt-4 px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
              {{ isLogin ? '登录' : '注册' }}
            </button>
          </form>
        </div>
        <div class="items-center px-4 py-3">
          <button @click="isLogin = !isLogin" class="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">
            {{ isLogin ? '切换到注册' : '切换到登录' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const emit = defineEmits(['close', 'login']);

const isLogin = ref(true);
const username = ref('');
const password = ref('');
const email = ref('');
const verificationCode = ref('');

const handleLogin = async () => {
  try {
    const response = await axios.post('/api/auth/login', {
      username: username.value,
      password: password.value
    });
    const user = { 
      username: username.value, 
      token: response.data.token,
      isAdmin: response.data.isAdmin
    };
    localStorage.setItem('user', JSON.stringify(user));
    emit('login', user);
  } catch (error) {
    console.error('登录失败:', error.message);
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
    console.error('注册失败:', error.message);
    alert('注册失败，请检查输入信息');
  }
};

const sendVerificationCode = async () => {
  try {
    await axios.post('/api/auth/send-verification', { email: email.value });
    alert('验证码已发送，请查看邮箱');
  } catch (error) {
    console.error('发送验证码失败:', error.message);
    alert('发送验证码失败，请稍后重试');
  }
};
</script>