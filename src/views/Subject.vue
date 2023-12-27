<script setup>
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { useToast } from "vue-toastification";

import { useAxios } from "@/hooks/useAxios";
import { useSubjectStore } from "@/stores/entities/useSubjectStore.js";

import Grid from '@/components/Grid.vue';

const defaultModel = {
  id: null,
  description: null,
};

const modelForm = ref(null);
const editMode = ref(false);
const modelItem = ref(defaultModel);

const subjectStore = useSubjectStore();
const { subjects } = storeToRefs(subjectStore);

const emits = defineEmits([
  "on-blur",
  "update:modelValue",
]);

const modalTitle = computed(() =>
  editMode.value ? `Editar` : `Adicionar`
);

const handleBlurInput = (e) => {
  const value = e.target.value || null;
  emits("on-blur", value);
};

const handleDelete = (id) => {
  const confirm = window.confirm('Deseja realmente remover este registro?');
  if (confirm) {
    const { data } =  useAxios({
      url: `/subjects/${id}`,
      method: 'DELETE',
    });
    watch(
      data,
      (response) => {
        useToast().success('Assunto removido com sucesso!');
        subjectStore.fetchSubjects();
      }
    );
  }
};

const handleGetSubject = (id) => {
  const { data } = useAxios({
    url: `/subjects/${id}`,
    method: 'GET',
  });
  watch(
    data,
    (response) => {
      editMode.value = true;
      modelItem.value = response.data;
    }
  );
};

const handleSubmit = () => {
  const body = new FormData(modelForm.value);
  const { data, error } = useAxios({
    url: editMode.value ? `/subjects/${modelItem.value.id}` : "/subjects",
    method: editMode.value ? "PUT" : "POST",
    body,
  });
  watch(
    [data, error],
    (response) => {
      if (response[0]?.data) {
        useToast().success('Assunto salvo com sucesso!');
        subjectStore.fetchSubjects();
        handleCancel();
      } else if (response[1]) {
        useToast().error(response[1]);
      }
    },
  );
};

const handleCancel = () => {
  editMode.value = false;
  modelItem.value = {
    id: null,
    description: null,
  };
}

subjectStore.fetchSubjects();
</script>

<template>
  <section class="section">
    <form ref="modelForm" autocomplete="off" @submit.prevent="handleSubmit">
      <h3 class="mb-4">{{ modalTitle }} Assunto</h3>
      <div class="mb-0">
        <label for="description">Descrição *</label>
        <input
          required
          type="text"
          maxlength="20"
          id="description"
          name="description"
          placeholder="Entre com a descrição..."
          class="focus:outline-none focus:shadow-outline"
          v-model="modelItem.description"
          @blur="handleBlurInput($event)"
          @input="$emit('update:modelValue', $event.target.value || null)"
        />
      </div>
      <div class="mt-5 w-100 flex justify-end">
        <a @click="handleSubmit" class="button">Salvar</a>
        <a @click="handleCancel" class="button">Cancelar</a>
      </div>
    </form>
  </section>
  <section class="section">
    <Grid
      :data="subjects"
      aliasTitle="Descrição"
      aliasKey="description"
      @on-delete="handleDelete"
      @on-update="handleGetSubject"
    />
  </section>
</template>
