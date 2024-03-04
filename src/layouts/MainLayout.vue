<script setup>
import { ref, onMounted, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

const $r = useRouter()
import { status } from '/src/composables/useStatus.js'
import { devices } from '/src/composables/useDevices.js'

onBeforeMount(() => {
  ipc.on('status:rt', (args) => {
    console.log('status:rt')
    for (let item in args) {
      switch (item) {
        case 'serverAddr':
          status.value.serverAddr = args[item]
          break
        case 'serverPort':
          status.value.serverPort = args[item]
          break
        case 'connected':
          status.value.connected = args[item]
          break
        case 'mediafolder':
          status.value.mediafolder = args[item]
          break
      }
    }
  })
  ipc.on('device:rt', (arr) => {
    console.log('device:rt')
    devices.value = arr
  })
  ipc.send('status:get')
  ipc.send('ui:open')
})
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-black border-bottom">
      <q-toolbar class="justify-between">
        <div
          class="q-pl-md cursor-pointer row no-wrap q-gutter-x-sm"
          @click="$r.push('/')"
        >
          <q-icon name="home" color="primary" size="sm" />
          <div class="font-ubuntumono font-md text-bold">Q-SYS Bridge</div>
          <div class="online">Online</div>
        </div>
        <div>
          <div class="btn cursor-pointer" @click="$r.push('/setup')">Setup</div>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.btn {
  font-size: 12px;
  font-weight: 400;
  padding: 4px 10px 4px 10px;
  border-radius: 5px;
  color: #444;
}
.btn:hover {
  background: #eee;
}
.online {
  color: v-bind(status.connected ? 'green': 'red');
  border: 1px solid v-bind(status.connected ? 'green': 'red');
  border-radius: 5px;
  padding: 0 1px 0 1px;
  font-size: 10px;
  height: 18px;
}
</style>
