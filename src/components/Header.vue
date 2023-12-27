<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const movePage = to => router.push({ name: to });
const routes = [
  {
    name: 'Assuntos',
    to: 'Assuntos',
  },
  {
    name: 'Autores',
    to: 'Autores',
  },
  {
    name: 'Livros',
    to: 'Livros',
  },
];
</script>

<template>
	<main>
		<h1 class="text-3xl mb-5 text-center">Catálogo de Livros</h1>
		<section class="section text-center">
			<template v-for="(route, i) in routes" :key="i">
				<a @click="movePage(route.to)" class="button">
					{{ route.name }}
				</a>
			</template>
      <a href="http://localhost:8000/api/catalog" class="button">
        Relatório
      </a>
		</section>
	</main>
</template>