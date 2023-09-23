<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'
// components
import ServerAddress from 'components/setupPage/serverAddr.vue'
import DeviceId from 'components/setupPage/deviceId.vue'
import MediaFolder from 'components/setupPage/mediaFolder.vue'

const $q = useQuasar()

const address = ref('')
const uid = ref('')
const mediafolder = ref('')

// lifecycle hook
onMounted(() => {
  ipc.on('db:rt', (args) => {
    if (args && args.key) {
      switch (args.key) {
        case 'serveraddress':
          address.value = args.value
          break
        case 'deviceid':
          uid.value = args.value
          break
        case 'mediafolder':
          mediafolder.value = args.value
          break
      }
    }
  })
})

onBeforeUnmount(() => {
  ipc.removeEventListener('db:rt')
})
</script>

<template>
  <div class="q-pa-md">
    <div class="bg-grey-1 border-round q-pa-md">
      <!-- server ip address -->
      <ServerAddress :address="address" />
      <!-- uuid -->
      <DeviceId :uid="uid" />
      <!-- media folder -->
      <MediaFolder :mediafolder="mediafolder" />
    </div>
  </div>
</template>

<style scoped>
.border-round {
  border-radius: 0.5rem;
}
</style>
