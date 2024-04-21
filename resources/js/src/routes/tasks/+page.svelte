<script lang="ts">
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';
	import { tasks } from '$lib/tasks';

	import Task from '$lib/components/task.svelte';

	const { user } = getContext('auth');

	$: {
		if (!$user) {
			goto('/login');
		}
	}
</script>

<h2>Tasks</h2>

<ul>
	{#each tasks as task}
		<li><Task {task} /></li>
	{/each}
</ul>

<style>
	ul {
		list-style-type: none;
		padding-inline-start: 0;
	}
</style>
