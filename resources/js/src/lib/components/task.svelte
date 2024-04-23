<script lang="ts">
	export let task;

	export let isDragging = false;
</script>

<div class={isDragging ? 'is-dragging' : ''}>
	<p>{task.description}</p>

	<div class="meta">
		<p><small><b>ID:</b> {task.id}</small></p>
		<p><small><b>Order:</b> {task.order}</small></p>
		<p><small><b>Created at:</b> {task.created_at}</small></p>
		<details>
			<summary><small>Details</small></summary><small>{task.details}</small>
		</details>
	</div>
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

	.is-dragging {
		background-color: lightgray;

		& > * {
			opacity: 0;
		}
	}
</style>
