<script setup>
import Header from '@/components/Header.vue';
</script>

<template>
	<main class="app">
		<Header />
		<router-view></router-view>
	</main>
</template>

<style scoped>
	.app {
		@apply p-5 w-full md:w-6/12 lg:w-5/12 md:mx-auto xl:w-5/12
	}
</style>
