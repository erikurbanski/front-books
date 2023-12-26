<template>
	<main>
		<h1 class="text-3xl mb-5 te">Catálogo de Livros</h1>
		<section class="w-full bg-gray-100 py-8 px-5 rounded mb-8 text-center">
			<template v-for="(route, i) in routes" :key="i">
				<a
          @click="movePage(route.to)"
          class="bg-gray-600 mr-2 hover:bg-opacity-75 focus:ring-2 text-gray-50 px-5 py-2 rounded inline-block cursor-pointer"
        >
					{{ route.name }}
				</a>
			</template>
      <a
        href="http://localhost:8000/api/catalog"
        class="bg-gray-600 mr-2 hover:bg-opacity-75 focus:ring-2 text-gray-50 px-5 py-2 rounded inline-block cursor-pointer"
      >
        Relatório
      </a>
		</section>
	</main>
</template>

<script setup>
	import { useRouter } from 'vue-router'
	const router = useRouter()
	const movePage = to => router.push({ name: to })
	const routes = [
		{
			name: 'Assuntos',
			to: 'Assuntos'
		},
		{
			name: 'Autores',
			to: 'Autores'
		},
		{
			name: 'Livros',
			to: 'Livros'
		}
	]
</script>
