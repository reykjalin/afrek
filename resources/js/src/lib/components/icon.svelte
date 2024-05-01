<script lang="ts">
	export let width = '100';
	export let icon = '';
</script>

<img class="icon" {width} src={`/openmoji/${icon}.svg`} alt={`OpenMoji ${icon}`} />

<style>
	img.icon {
		/**
         * Disable pointer events to allow on:mousedown event to pass through the icon.
         * This is necessary for the drag event handler in the tasks list to work properly.
         */
		pointer-events: none;
	}
</style>
