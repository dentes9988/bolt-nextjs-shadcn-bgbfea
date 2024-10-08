<template>
  <div class="home">
    <h2>{{ $t('welcome') }}</h2>
    <product-manager-dashboard />
  </div>
</template>

<script lang="ts" setup>
import ProductManagerDashboard from '../components/ProductManagerDashboard.vue';
</script>