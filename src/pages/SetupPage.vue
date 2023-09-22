<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
// components
import DialogAddr from 'components/dialog/dialogAddr.vue'

const $q = useQuasar()

const address = ref('127.0.0.1')
const uid = ref('')
const mediafolder = ref('')

function openDialogAddr() {
  $q.dialog({
    component: DialogAddr
  }).onOk((str) => {
    if (str) {
      myAPI.command({ command: 'updateServerAddress', value: str })
    }
  })
}

onMounted(() => {
  myAPI.data((args) => {
    console.log(args)
    switch (args.key) {
      case 'serveraddress':
        address.value = args.value
        break
      case 'deviceId':
        uid.value = args.value
        break
      case 'mediafolder':
        mediafolder.value = args.value
        break
    }
  })
  myAPI.command({ command: 'getServerAddress' })
  myAPI.command({ command: 'getDeviceId' })
  myAPI.command({ command: 'getMediaFolder' })
})
</script>

<template>
  <div class="q-pa-md">
    <div class="bg-grey-2 border-rounded q-pa-md">
      <!-- server ip address -->
      <div class="row justify-between items-center">
        <div class="text-bold font-sans">Server Address</div>
        <div class="row items-center">
          <div class="font-sans">{{ address }}</div>
          <q-btn
            round
            flat
            size="sm"
            icon="edit"
            color="primary"
            @click="openDialogAddr"
          ></q-btn>
        </div>
      </div>
      <!-- uuid -->
      <div class="row justify-between items-center">
        <div class="text-bold font-sans">Device ID</div>
        <div class="row items-center">
          <div class="font-sans">{{ uid }}</div>
          <q-btn round flat size="sm" icon="refresh" color="primary"></q-btn>
        </div>
      </div>
      <!-- media folder -->
      <div class="row justify-between items-center">
        <div class="text-bold font-sans">Default Media Folder</div>
        <div class="row items-center">
          <div class="font-sans">{{ uid }}</div>
          <q-btn round flat size="sm" icon="refresh" color="primary"></q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
