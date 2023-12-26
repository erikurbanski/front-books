<script setup>
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";

import { useAxios } from "@/hooks/useAxios";
import { useToast } from "vue-toastification";
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

/** Verificar remoção pois esta com problema de integridade. **/
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
          modelItem.value = {
            id: null,
            name: null,
          };
        } else if (response[1]) {
          useToast().error(response[1]);
        }
      },
  );
};

authorStore.fetchAuthors();
</script>

<template>
  <section class="w-full bg-gray-100 py-8 px-5 rounded mb-8">
    <form ref="modelForm" autocomplete="off" @submit.prevent="handleSubmit">
      <h3 class="mb-4">{{ modalTitle }} Autor</h3>
      <div class="mb-0">
        <label class="block text-gray-700 text-sm font-bold mb-2 cursor-pointer" for="name">
          Nome *
        </label>
        <input
            required
            type="text"
            maxlength="40"
            id="name"
            name="name"
            placeholder="Entre com o nome do autor..."
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            @input="$emit('update:modelValue', $event.target.value || null)"
            @blur="handleBlurInput($event)"
            v-model="modelItem.name"
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
        aliasTitle="Nome Completo"
        aliasKey="name"
        :data="authors"
        @on-delete="handleDelete"
        @on-update="handleGetAuthor"
    />
  </section>
</template>
