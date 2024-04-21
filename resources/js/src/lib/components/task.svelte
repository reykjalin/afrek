<script lang="ts">
	export let task;

	let showMeta = false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:mouseenter={() => (showMeta = true)} on:mouseleave={() => (showMeta = false)}>
	<p>{task.description}</p>

	{#if showMeta}
		<div class="meta">
			<p><small><b>ID:</b> {task.id}</small></p>
			<p><small><b>Order:</b> {task.order}</small></p>
			<p><small><b>Created at:</b> {task.created_at}</small></p>
			<details>
				<summary><small>Details</small></summary><small>{task.details}</small>
			</details>
		</div>
	{/if}
</div>

<style>
	div {
		border: 1px solid black;
		padding: 0.5rem;
		margin: 0.5rem;

		& p {
			padding: 0;
			margin: 0.5rem 0;
		}

		& div {
			border: none;
			display: flex;
			flex-direction: row;
			gap: 0.5rem;
			justify-content: flex-start;

			& p {
				padding: 0;
				margin: 0;
			}
		}
	}
</style>
