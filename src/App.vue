<script setup>
import { onMounted } from 'vue'
import useSocket from 'src/composables/useSocket.js'

onMounted(() => {
  useSocket()
  ipc.on('qsys:data', (data) => {
    console.log(data)
  })
  ipc.send('socket:start')
})
</script>

<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App'
})
</script>
