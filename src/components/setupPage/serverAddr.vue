<script setup>
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import DialogEdit from 'src/components/dialog/dialogEdit.vue'

import { status } from 'src/composables/useStatus.js'

const $q = useQuasar()

function openDialogAddr() {
  $q.dialog({
    component: DialogEdit,
    componentProps: {
      name: '서버 주소 수정',
      label: 'Server Address',
      currentValue: status.value.serverAddr
    }
  }).onOk((str) => {
    if (str) {
      ipc.send('db:update', { key: 'serverAddr', value: str })
    }
  })
}
</script>

<template>
  <div class="row justify-between items-center">
    <div class="text-bold font-sans">서버 주소</div>
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
