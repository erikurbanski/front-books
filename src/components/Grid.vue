<script setup>

import { mdiPencil } from '@mdi/js';
import { mdiDelete } from '@mdi/js';
import SvgIcon from '@jamescoyle/vue-icon';


const emits = defineEmits(['onUpdate', 'onDelete'])
function buttonClick(emit, id) {
  emits(emit, id);
}

const props = defineProps({
  entity: {
    type: String,
  },
  data: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <table class="border-collapse table-auto w-full text-sm">
    <thead>
      <tr>
        <th class="text-left">#</th>
        <th class="text-left">Descrição</th>
        <th class="text-right">Ações</th>
      </tr>
    </thead>
    <tbody class="bg-white dark:bg-slate-800">
      <tr v-for="(item, i) in data" :key="i">
        <td>{{ item.id }}</td>
        <td>{{ item.description }}</td>
        <td class="text-right">
          <button 
            class="mr-2" 
            title="Remover" 
            @click="buttonClick('onDelete', item.id)"
          >
            <svg-icon type="mdi" :path="mdiDelete"></svg-icon>
          </button>
          <button 
            class="mr-2" 
            title="Editar" 
            @click="buttonClick('onUpdate', item.id)"
          >
            <svg-icon type="mdi" :path="mdiPencil"></svg-icon>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
th {
  @apply border-b dark:border-slate-600 font-medium p-3 pl-4 pt-0 pb-3 text-slate-400 dark:text-slate-200;
}
td {
  @apply border-b border-slate-100 dark:border-slate-700 p-3 pl-4 text-slate-500 dark:text-slate-400;
}
</style>
