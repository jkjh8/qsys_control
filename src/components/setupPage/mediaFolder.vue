<script setup>
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
// store
import { status } from 'src/composables/useStatus.js'

const $q = useQuasar()

function openDialog() {
  ipc.send('folder:set')
}

function openFolder() {
  ipc.send('folder:open')
}
</script>

<template>
  <div class="row justify-between items-center">
    <div class="text-bold font-sans">Default Media Folder</div>
    <div class="row items-center q-gutter-x-sm">
      <a class="font-sans cursor-pointer text-underline" @click="openFolder">
        {{ status.mediafolder }}
      </a>
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

<style scoped>
.text-underline {
  text-decoration: underline;
}
</style>
