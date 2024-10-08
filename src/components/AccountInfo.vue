<template>
  <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-4">
    <h2 class="text-2xl mb-4">账户信息</h2>
    <p>虚拟余额: ¥{{ balance.toFixed(2) }}</p>
    <p>剩余免费请求次数: {{ freeRequests }}</p>
    <button @click="showRechargeModal = true" class="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
      充值
    </button>
    
    <div v-if="showRechargeModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900">选择充值金额</h3>
          <div class="mt-2 px-7 py-3">
            <button v-for="amount in [10, 20, 50, 100, 300]" :key="amount" @click="handleRecharge(amount)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2">
              {{ amount }} 元
            </button>
          </div>
          <div class="items-center px-4 py-3">
            <button @click="showRechargeModal = false" class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300">
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>

    <h3 class="text-xl mt-6 mb-2">交易记录</h3>
    <ul>
      <li v-for="order in orders" :key="order.orderId" class="mb-2">
        订单号: {{ order.orderId }} - 金额: ¥{{ (order.amount / 100).toFixed(2) }} - 状态: {{ order.status }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const balance = ref(0);
const freeRequests = ref(0);
const orders = ref([]);
const showRechargeModal = ref(false);

const fetchAccountInfo = async () => {
  try {
    const response = await axios.get('/api/account/balance');
    balance.value = response.data.balance / 100; // 转换为元
    freeRequests.value = response.data.freeRequestsRemaining;
    orders.value = response.data.orders || [];
  } catch (error) {
    console.error('获取账户信息失败:', error);
  }
};

const handleRecharge = async (amount: number) => {
  try {
    const response = await axios.post('/api/payment/create', { amount });
    window.location.href = response.data.paymentUrl;
  } catch (error) {
    console.error('创建支付订单失败:', error);
    alert('创建支付订单失败，请稍后重试');
  }
};

onMounted(fetchAccountInfo);
</script>