<script setup>
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { useAxios } from "@/hooks/useAxios";
import { useToast } from "vue-toastification";
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

/** Verificar remoção pois esta com problema de integridade. **/
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
  modelItem.value = {
    id: null,
    description: null,
  };
}

subjectStore.fetchSubjects();
</script>

<template>
<section class="w-full bg-gray-100 py-8 px-5 rounded mb-8">
  <form ref="modelForm" autocomplete="off" @submit.prevent="handleSubmit">
    <h3 class="mb-4">{{ modalTitle }} Assunto</h3>
    <div class="mb-0">
      <label class="block text-gray-700 text-sm font-bold mb-2 cursor-pointer" for="description">
        Descrição *
      </label>
      <input
        required
        type="text"
        maxlength="20"
        id="description"
        name="description"
        placeholder="Entre com uma descrição..."
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        @input="$emit('update:modelValue', $event.target.value || null)"
        @blur="handleBlurInput($event)"
        v-model="modelItem.description"
      />
    </div>
    <div class="mt-5 w-100 flex justify-end">
      <a
        @click="handleSubmit"
        class="bg-gray-600 ml-2 hover:bg-opacity-75 focus:ring-2 text-gray-50 px-2 py-2 rounded inline-block cursor-pointer"
      >
        Salvar
      </a>
      <a
        @click="handleCancel"
        class="bg-gray-600 ml-2 hover:bg-opacity-75 focus:ring-2 text-gray-50 px-2 py-2 rounded inline-block cursor-pointer"
      >
        Cancelar
      </a>
    </div>
  </form>
</section>
<section class="w-full bg-gray-100 py-8 px-5 rounded mb-8">
  <Grid
    aliasTitle="Descrição"
    aliasKey="description"
    :data="subjects"
    @on-delete="handleDelete"
    @on-update="handleGetSubject"
  />
</section>
</template>
