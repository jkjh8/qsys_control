<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { devices } from 'src/composables/useDevices.js'
import columns from './columns.js'

function qsysRefresh(id) {
  ipc.send('qsys:refresh', { deviceId: id })
}

function reloadDevices() {
  ipc.send('socket:devices')
}
onMounted(() => {})
</script>

<template>
  <div>
    <div>
      <q-btn round flat color="primary" icon="refresh" @click="reloadDevices" />
    </div>
    <q-table :columns="columns" :rows="devices">
      <template #body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">
            <div>
              <q-badge rounded :color="props.row.connected ? 'green' : 'red'" />
              {{ props.row.name }}
            </div>
          </q-td>
          <q-td key="deviceId" :props="props">
            {{ props.row.deviceId }}
          </q-td>
          <q-td key="ipaddress" :props="props">
            <a :href="`http://${props.row.ipaddress}`" target="_blank">{{
              props.row.ipaddress
            }}</a>
          </q-td>
          <!-- <q-td key="deviceType" :props="props">
            <div>{{ props.row.deviceType.deviceType }}</div>
            <div class="caption">{{ props.row.deviceType.model }}</div>
          </q-td> -->
          <q-td key="actions" :props="props">
            <div>
              <q-btn
                round
                flat
                icon="refresh"
                color="primary"
                @click="qsysRefresh(props.row.deviceId)"
              />
            </div>
            <!-- <div>
              <q-btn
                round
                flat
                icon="link"
                color="primary"
                @click="qsysConnect(props.row)"
              ></q-btn>
              <q-btn
                round
                flat
                icon="refresh"
                color="primary"
                @click="qsysGetPa(props.row)"
              ></q-btn>
              <q-btn
                round
                flat
                icon="upload"
                color="primary"
                @click="qsysUpload(props.row)"
              />
              <q-btn
                round
                flat
                icon="play_arrow"
                color="primary"
                @click="qsysMessage(props.row)"
              />
            </div> -->
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<style scoped></style>
