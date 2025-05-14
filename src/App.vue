<template>
  <RouterView />
</template>

<script setup>

import { useTheme } from '../src/composables/useTheme'

useTheme()

</script>
