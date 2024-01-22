<script setup>
import { ref, onMounted, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useStatusStore } from '/src/stores/status.js'

const $r = useRouter()
const { status } = storeToRefs(useStatusStore())
const { initStatusRt } = useStatusStore()
onBeforeMount(() => {
  initStatusRt()
  ipc.send('status:get')
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
          <div class="online">
            {{ status.connected ? 'Online' : 'Offline' }}
          </div>
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
  color: v-bind(online ? 'green': 'red');
  border: 1px solid v-bind(online ? 'green': 'red');
  border-radius: 5px;
  padding: 0 1px 0 1px;
  font-size: 10px;
  height: 18px;
}
</style>
