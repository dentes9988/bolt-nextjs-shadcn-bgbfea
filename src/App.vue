<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900">AI 产品经理助手</h1>
      </div>
    </header>
    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <ProductManagerDashboard />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import ProductManagerDashboard from './components/ProductManagerDashboard.vue'
</script>

<style>
/* 这里不需要再导入 Tailwind，因为我们在 main.ts 中已经导入了 style.css */
</style>