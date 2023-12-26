import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const routes = [
	{
		name: 'Home',
		path: '/',
		component: Home
	},
	{
		name: 'Assuntos',
		path: '/subjects',
		component: () => import('@/views/Subject.vue')
	},
	{
		name: 'Autores',
		path: '/authors',
		component: () => import('@/views/Authors.vue')
	},
	{
		name: 'Livros',
		path: '/books',
		component: () => import('@/views/Books.vue')
	}
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

export default router
