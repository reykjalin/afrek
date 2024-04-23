<script lang="ts">
	export let task: {
		id: number;
		order: number;
		created_at: string;
		details?: string;
		description: string;
	};

	export let isDragging = false;
	export let onDelete: (t: typeof task) => void;

	function buttonHandler(ev: MouseEvent) {
		onDelete(task);
	}
</script>

<div class={isDragging ? 'is-dragging' : ''}>
	<div>
		<p>{task.description}</p>
		<button on:click={buttonHandler}>✅</button>
	</div>

	{#if import.meta.env.MODE === 'development'}
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
			justify-content: space-between;

			& p {
				padding: 0;
				margin: 0;
			}
		}
	}

	.is-dragging {
		background-color: lightgray;

		& > * {
			opacity: 0;
		}
	}
</style>
