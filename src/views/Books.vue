<script setup>
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { useToast } from "vue-toastification";

import { useAxios } from "@/hooks/useAxios";
import { mdiDelete, mdiPencil } from "@mdi/js";
import { useBookStore } from "@/stores/entities/useBookStore.js";
import { useAuthorStore } from "@/stores/entities/useAuthorStore.js";
import { useSubjectStore } from "@/stores/entities/useSubjectStore.js";

import SvgIcon from "@jamescoyle/vue-icon";
const defaultModel = {
  id: null,
  title: null,
  edition: 1,
  publisher: null,
  year: 2023,
  author: '',
  subject: '',
  value: 0.0
};

const modelForm = ref(null);
const editMode = ref(false);
const modelItem = ref(defaultModel);

const bookStore = useBookStore();
const authorStore = useAuthorStore();
const subjectStore = useSubjectStore();

const { books } = storeToRefs(bookStore);
const { authors } = storeToRefs(authorStore);
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

const handleSelect = (value) => {
  emits("on-change", value);
};

const handleDelete = (id) => {
  const confirm = window.confirm('Deseja realmente remover este registro?');
  if (confirm) {
    const {data} = useAxios({
      url: `/books/${id}`,
      method: 'DELETE',
    });
    watch(
      data,
      (response) => {
        useToast().success('Livro removido com sucesso!');
        bookStore.fetchBooks();
        location.reload();
      }
    );
  }
};

const handleGetBook = (id) => {
  const {data} = useAxios({
    url: `/books/${id}`,
    method: 'GET',
  });
  watch(
    data,
    (response) => {
      editMode.value = true;
      modelItem.value = response.data;
      modelItem.value.author = response.data.authors[0]
      modelItem.value.subject = response.data.subjects[0]
    }
  );
};

const handleSubmit = () => {
  const body = new FormData(modelForm.value);

  body.append("authors[]", modelItem.value.author);
  body.append("subjects[]", modelItem.value.subject);

  const {data, error} = useAxios({
    url: editMode.value ? `/books/${modelItem.value.id}` : "/books",
    method: editMode.value ? "PUT" : "POST",
    body,
  });
  watch(
    [data, error],
    (response) => {
      if (response[0]?.data) {
        useToast().success('Livro salvo com sucesso!');
        bookStore.fetchBooks();
        handleCancel();
      } else if (response[1]) {
        useToast().error(response[1]);
      }
    },
  );
};

const formatCurrency = (value) => {
  const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return currencyFormatter.format(value);
}

const handleCancel = () => {
  editMode.value = false;
  modelItem.value = {
    id: null,
    title: null,
    edition: 1,
    publisher: null,
    year: 2023,
    value: 0,
    author: '',
    subject: '',
  };
}

bookStore.fetchBooks();
authorStore.fetchAuthors();
subjectStore.fetchSubjects();
</script>

<template>
  <section class="section">
    <form ref="modelForm" autocomplete="off" @submit.prevent="handleSubmit">
      <h3 class="mb-4">{{ modalTitle }} Livro</h3>
      <div class="mb-4">
        <label for="title">Título *</label>
        <input
          required
          type="text"
          maxlength="40"
          id="title"
          name="title"
          placeholder="Entre com o título..."
          class="focus:outline-none focus:shadow-outline"
          v-model="modelItem.title"
          @blur="handleBlurInput($event)"
          @input="$emit('update:modelValue', $event.target.value || null)"
        />
      </div>

      <div class="mb-4">
        <label for="publisher">Editora *</label>
        <input
          required
          type="text"
          maxlength="40"
          id="publisher"
          name="publisher"
          placeholder="Entre com a editora..."
          class="focus:outline-none focus:shadow-outline"
          v-model="modelItem.publisher"
          @blur="handleBlurInput($event)"
          @input="$emit('update:modelValue', $event.target.value || null)"
        />
      </div>

      <div class="flex gap-4 justify-center mb-3">
        <div class="xl:w-96">
          <label class="block text-gray-700 text-sm font-bold mb-2 cursor-pointer" for="year">
            Ano *
          </label>
          <input
            required
            type="number"
            maxlength="4"
            id="year"
            name="year"
            placeholder="Entre com o ano..."
            class="focus:outline-none focus:shadow-outline"
            v-model="modelItem.year"
            @blur="handleBlurInput($event)"
            @input="$emit('update:modelValue', $event.target.value || null)"
          />
        </div>
        <div class="xl:w-96">
          <label for="edition">Edição *</label>
          <input
            required
            type="number"
            maxlength="3"
            id="edition"
            name="edition"
            placeholder="Entre com a edição..."
            class="focus:outline-none focus:shadow-outline"
            v-model="modelItem.edition"
            @blur="handleBlurInput($event)"
            @input="$emit('update:modelValue', $event.target.value || null)"
          />
        </div>
        <div class="xl:w-96">
          <label for="value">Valor *</label>
          <input
            required
            type="text"
            id="value"
            name="value"
            placeholder="Entre com o valor..."
            class="focus:outline-none focus:shadow-outline"
            v-model="modelItem.value"
            @blur="handleBlurInput($event)"
            @input="$emit('update:modelValue', $event.target.value || null)"
          />
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2 cursor-pointer" for="author">
          Autor *
        </label>
        <select
          required
          id="author"
          name="author"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          @input="$emit('update:modelValue', $event.target.value || null)"
          @change="handleSelect($event.target.value)"
          v-model="modelItem.author"
        >
          <option value="" selected>-- Selecione um autor --</option>
          <option v-for="(author, i) in authors" :key="i" :value="author.id">
            {{ author.name }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2 cursor-pointer" for="subject">
          Assunto *
        </label>
        <select
          required
          id="subject"
          name="subject"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          @input="$emit('update:modelValue', $event.target.value || null)"
          @change="handleSelect($event.target.value)"
          v-model="modelItem.subject"
        >
          <option value="" selected>-- Selecione um assunto --</option>
          <option v-for="(subject, i) in subjects" :key="i" :value="subject.id">
            {{ subject.description }}
          </option>
        </select>
      </div>

      <div class="mt-5 w-100 flex justify-end">
        <a @click="handleSubmit" class="button">Salvar</a>
        <a @click="handleCancel" class="button">Cancelar</a>
      </div>
    </form>
  </section>

  <section class="section">
    <table class="border-collapse table-auto w-full text-sm">
      <thead>
        <tr>
          <th class="text-left">#</th>
          <th class="text-left">Título</th>
          <th class="text-left">Editora</th>
          <th class="text-left">Ano</th>
          <th class="text-left">Valor</th>
          <th class="text-right">Ações</th>
        </tr>
      </thead>
      <tbody v-if="books.length" class="bg-white dark:bg-slate-800">
        <tr v-for="(item, i) in books" :key="i">
          <td>{{ item.id }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.publisher }}</td>
          <td>{{ item.year }}</td>
          <td>{{ formatCurrency(item.value) }}</td>
          <td class="text-right">
            <button
              class="mr-2"
              title="Remover"
              @click="handleDelete(item.id)"
            >
              <svg-icon type="mdi" :path="mdiDelete"></svg-icon>
            </button>
            <button
              class="mr-2"
              title="Editar"
              @click="handleGetBook(item.id)"
            >
              <svg-icon type="mdi" :path="mdiPencil"></svg-icon>
            </button>
          </td>
        </tr>
      </tbody>
      <tbody v-else class="bg-white dark:bg-slate-800">
        <tr>
          <td class="text-center" colspan="6">Nenhum registro encontrado!</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
th {
  @apply border-b dark:border-slate-600 font-medium p-3 pl-4 pt-0 pb-3 text-slate-400 dark:text-slate-200;
}
td {
  @apply border-b border-slate-100 dark:border-slate-700 p-3 pl-4 text-slate-500 dark:text-slate-400;
}
</style>
