<script setup>
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import DialogAddr from 'src/components/dialog/dialogAddr.vue'

import { storeToRefs } from 'pinia'
import { useStatusStore } from '/src/stores/status.js'

const { status } = storeToRefs(useStatusStore())

// props
// const props = defineProps({
//   address: String
// })

const $q = useQuasar()

function openDialogAddr() {
  $q.dialog({
    component: DialogAddr,
    componentProps: {
      serverAddr: status.value.serverAddr
    }
  }).onOk((str) => {
    if (str) {
      ipc.send('db:update', { key: 'serverAddr', value: str })
    }
  })
}

onMounted(() => {
  ipc.send('status:get')
})
</script>

<template>
  <div class="row justify-between items-center">
    <div class="text-bold font-sans">Server Address</div>
    <div class="row items-center q-gutter-x-sm">
      <div class="font-sans">{{ status.serverAddr }}</div>
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
</template>

<style scoped></style>
