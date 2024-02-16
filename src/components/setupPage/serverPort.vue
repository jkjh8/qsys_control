<script setup>
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import DialogEdit from 'src/components/dialog/dialogEdit.vue'

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
    component: DialogEdit,
    componentProps: {
      name: '서버 포트 수정',
      label: 'Server Port',
      type: 'Number',
      currentValue: status.value.serverPort
    }
  }).onOk((str) => {
    if (str) {
      ipc.send('db:update', { key: 'serverPort', value: str })
    }
  })
}
</script>

<template>
  <div class="row justify-between items-center">
    <div class="text-bold font-sans">서버 포트</div>
    <div class="row items-center q-gutter-x-sm">
      <div class="font-sans">{{ status.serverPort }}</div>
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
