<script lang="ts">
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';

	const { user } = getContext('auth');

	$: {
		if (!$user) {
			goto('/login');
		}
	}
</script>

<h2>Tasks</h2>

<ul>
	<li>Task 1</li>
	<li>Task 2</li>
	<li>Task 3</li>
	<li>Task 4</li>
</ul>
