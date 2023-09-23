<script setup>
import { ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent()
const emit = defineEmits([...useDialogPluginComponent.emits])

const current = ref('')
</script>

<template>
  <q-dialog ref="dialogRef">
    <q-card class="q-dialog-plugin" style="border-radius: 6px">
      <q-card-section class="row no-wrap q-gutter-x-sm items-center">
        <q-icon name="edit" color="primary" size="sm"></q-icon>
        <div class="font-ubuntumono font-md text-bold">Server address</div>
      </q-card-section>
      <q-card-section>
        <q-input
          class="q-mx-md"
          v-model="current"
          dense
          filled
          label="Server Address"
          @keyup.enter="onDialogOK(current)"
        ></q-input>
      </q-card-section>

      <q-card-actions align="right">
        <div class="q-px-sm q-gutter-x-sm">
          <q-btn
            round
            flat
            icon="cancel"
            color="red-10"
            @click="onDialogCancel"
          />
          <q-btn
            round
            flat
            icon="check"
            unelevated
            no-caps
            color="primary"
            @click="onDialogOK(current)"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
