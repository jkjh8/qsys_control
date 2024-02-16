<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'
// components
import ServerAddress from 'components/setupPage/serverAddr.vue'
import ServerPort from 'components/setupPage/serverPort.vue'
import DeviceId from 'components/setupPage/deviceId.vue'
import MediaFolder from 'components/setupPage/mediaFolder.vue'

const $q = useQuasar()

// lifecycle hook
onMounted(() => {
  ipc.send('status:get')
})

onBeforeUnmount(() => {
  ipc.removeEventListener('db:rt')
})
</script>

<template>
  <div class="q-pa-md">
    <div class="bg-grey-1 border-round q-pa-md">
      <!-- server ip address -->
      <ServerAddress />
      <!-- server port -->
      <ServerPort />
      <!-- <DeviceId /> -->
      <!-- media folder -->
      <MediaFolder />
    </div>
  </div>
</template>

<style scoped>
.border-round {
  border-radius: 0.5rem;
}
</style>
