<script setup>
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { useToast } from "vue-toastification";

import { useAxios } from "@/hooks/useAxios";
import { useAuthorStore } from "@/stores/entities/useAuthorStore.js";

import Grid from '@/components/Grid.vue';

const defaultModel = {
  id: null,
  name: null,
};

const modelForm = ref(null);
const editMode = ref(false);
const modelItem = ref(defaultModel);

const authorStore = useAuthorStore();
const { authors } = storeToRefs(authorStore);

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
      url: `/authors/${id}`,
      method: 'DELETE',
    });
    watch(
      data,
      (response) => {
        useToast().success('Autor removido com sucesso!');
        authorStore.fetchAuthors();
      }
    );
  }
};

const handleGetAuthor = (id) => {
  const { data } = useAxios({
    url: `/authors/${id}`,
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
    url: editMode.value ? `/authors/${modelItem.value.id}` : "/authors",
    method: editMode.value ? "PUT" : "POST",
    body,
  });
  watch(
    [data, error],
    (response) => {
      if (response[0]?.data) {
        useToast().success('Autor salvo com sucesso!');
        authorStore.fetchAuthors();
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
    name: null,
  };
}

authorStore.fetchAuthors();
</script>

<template>
  <section class="section">
    <form ref="modelForm" autocomplete="off" @submit.prevent="handleSubmit">
      <h3 class="mb-4">{{ modalTitle }} Autor</h3>
      <div class="mb-0">
        <label for="name">Nome *</label>
        <input
          required
          type="text"
          maxlength="40"
          id="name"
          name="name"
          placeholder="Entre com o nome do autor..."
          class="focus:outline-none focus:shadow-outline"
          @blur="handleBlurInput($event)"
          v-model="modelItem.name"
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
      :data="authors"
      aliasTitle="Nome Completo"
      aliasKey="name"
      @on-delete="handleDelete"
      @on-update="handleGetAuthor"
    />
  </section>
</template>
