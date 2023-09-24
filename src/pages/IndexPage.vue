<script setup>
import DeviceTable from 'components/devices/deviceTable.vue'
</script>

<template>
  <div class="q-pa-md">
    <DeviceTable />
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage'
})
</script>
