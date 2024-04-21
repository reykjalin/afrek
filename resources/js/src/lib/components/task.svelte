<script lang="ts">
	export let task;
</script>

<div>
	<p><b>ID:</b> {task.id}</p>
	<p><b>Order:</b> {task.order}</p>
	<p><b>Description:</b> {task.description}</p>
	<p><b>Details:</b> {task.details}</p>
	<p><b>Created at:</b> {task.created_at}</p>
</div>

<style>
	div {
		border: 1px solid black;
		padding: 0.5rem;
		margin: 0.5rem;
	}
</style>
