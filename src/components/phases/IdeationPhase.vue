<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { AnalysisResult } from '@/types/analysis';

const userGroup = ref('');
const requirementDescription = ref('');
const analysisResult = ref<AnalysisResult | null>(null);

// ... rest of the component code
</script>