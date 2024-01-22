<script setup>
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { v4 as uuidv4 } from 'uuid'
// components
import DialogConfirm from 'src/components/dialog/dialogConfirm.vue'

// store
import { storeToRefs } from 'pinia'
import { useStatusStore } from 'src/stores/status.js'
const { status } = storeToRefs(useStatusStore())

const $q = useQuasar()

function openDialog() {
  $q.dialog({
    component: DialogConfirm,
    componentProps: {
      message: 'did you want to refresh device id?'
    }
  }).onOk(() => {
    ipc.send('status:deviceId')
  })
}

onMounted(() => {
  ipc.send('status:get')
})
</script>

<template>
  <div class="row justify-between items-center">
    <div class="text-bold font-sans">Device ID</div>
    <div class="row items-center q-gutter-x-sm">
      <div class="font-sans">{{ status.deviceId }}</div>
      <q-btn
        round
        flat
        size="sm"
        icon="refresh"
        color="primary"
        @click="openDialog"
      ></q-btn>
    </div>
  </div>
</template>

<style scoped></style>
