<template>
  <div class="user-analysis-phase">
    <h2>用户分析阶段</h2>
    <form @submit.prevent="generateUserPersonas">
      <div class="mb-4">
        <label for="userGroup" class="block text-sm font-medium text-gray-700">目标用户群体</label>
        <input
          v-model="userGroup"
          type="text"
          id="userGroup"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        >
      </div>
      <div class="mb-4">
        <label for="requirementDescription" class="block text-sm font-medium text-gray-700">需求描述</label>
        <textarea
          v-model="requirementDescription"
          id="requirementDescription"
          rows="4"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        ></textarea>
      </div>
      <button
        type="submit"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        生成用户画像
      </button>
    </form>
    <div v-if="userPersonas.length > 0" class="mt-4">
      <h3 class="text-lg font-medium text-gray-900">用户画像</h3>
      <div v-for="(persona, index) in userPersonas" :key="index" class="mt-4 p-4 bg-gray-100 rounded-md">
        <h4 class="font-medium">{{ persona.type }}</h4>
        <p><strong>年龄层：</strong> {{ persona.ageRange }}</p>
        <p><strong>收入来源：</strong> {{ persona.incomeSource }}</p>
        <p><strong>收入范围：</strong> {{ persona.incomeRange }}</p>
        <p><strong>个性化偏好：</strong> {{ persona.preferences.join(', ') }}</p>
        <p><strong>常用APP：</strong> {{ persona.commonApps.join(', ') }}</p>
        <p><strong>需求动机：</strong> {{ persona.motivation }}</p>
        <p><strong>使用前场景：</strong> {{ persona.beforeScenario }}</p>
        <p><strong>使用后场景：</strong> {{ persona.afterScenario }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const userGroup = ref('');
const requirementDescription = ref('');
const userPersonas = ref([]);

const generateUserPersonas = async () => {
  try {
    const response = await axios.post('/api/generate-user-personas', {
      userGroup: userGroup.value,
      requirementDescription: requirementDescription.value
    });
    userPersonas.value = response.data.personas;
  } catch (error) {
    let errorMessage = '生成用户画像失败';
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    } else if (typeof error === 'string') {
      errorMessage += `: ${error}`;
    }
    console.error(errorMessage);
    // 使用 alert 或其他方式向用户显示错误信息
    alert(errorMessage);
  }
};
</script>