<script setup>
import { ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent()
const emit = defineEmits([...useDialogPluginComponent.emits])

const props = defineProps({
  title: String,
  message: String
})
</script>

<template>
  <q-dialog ref="dialogRef">
    <q-card class="q-dialog-plugin" style="border-radius: 6px">
      <q-card-section class="row no-wrap q-gutter-x-sm items-center">
        <q-icon name="check_circle" color="primary" size="sm"></q-icon>
        <div class="font-ubuntumono font-md text-bold">
          {{ title ? title : 'Confirm' }}
        </div>
      </q-card-section>

      <q-card-section>
        {{ message }}
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
            @click="onDialogOK"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
