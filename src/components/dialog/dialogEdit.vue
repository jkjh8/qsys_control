<script setup>
import { ref, onMounted } from 'vue'
import { useDialogPluginComponent } from 'quasar'

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent()

const props = defineProps({
  name: String,
  currentValue: String,
  type: String,
  label: String
})
const emit = defineEmits([...useDialogPluginComponent.emits])

const newValue = ref('')

onMounted(() => {
  newValue.value = props.currentValue
})
</script>

<template>
  <q-dialog ref="dialogRef">
    <q-card class="q-dialog-plugin" style="border-radius: 8px">
      <q-card-section class="row no-wrap q-gutter-x-sm items-center">
        <div class="font-ubuntumono font-md text-bold">{{ name }}</div>
      </q-card-section>
      <q-card-section>
        <q-input
          class="q-mx-md"
          v-model="newValue"
          dense
          filled
          :label="props.label"
          :placeholder="newValue"
          :type="props.type ?? String"
          @keyup.enter="onDialogOK(newValue)"
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
            @click="onDialogOK(newValue)"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
