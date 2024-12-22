<template>
    <a-date-picker v-model:value="value1" />
</template>
<script lang="ts" setup>
import { ref } from "vue";
import type { Dayjs } from "dayjs";
const value1 = ref<Dayjs>();
</script>
