<template>
  <div class="product-manager-dashboard">
    <div class="mb-4">
      <button
        v-for="phase in phases"
        :key="phase.value"
        @click="setActivePhase(phase.value)"
        :class="[
          'mr-2 px-4 py-2 rounded',
          activePhase === phase.value
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        {{ phase.label }}
      </button>
    </div>
    <component :is="currentPhaseComponent"></component>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import IdeationPhase from './phases/IdeationPhase.vue';
import UserAnalysisPhase from './phases/UserAnalysisPhase.vue';

const phases = [
  { value: 'ideation', label: '构思阶段' },
  { value: 'userAnalysis', label: '用户分析' },
  // 其他阶段可以在这里添加
];

const activePhase = ref('ideation');

const setActivePhase = (phase: string) => {
  activePhase.value = phase;
};

const currentPhaseComponent = computed(() => {
  switch (activePhase.value) {
    case 'ideation':
      return IdeationPhase;
    case 'userAnalysis':
      return UserAnalysisPhase;
    // 其他阶段的组件可以在这里添加
    default:
      return IdeationPhase;
  }
});
</script>