<script lang="ts">
	import Link from '../lib/components/link.svelte';
</script>

<div class="footer">
	<div>
		<p><Link href="/blog">Blog</Link></p>
		<p><Link href="/privacy">Privacy</Link></p>
		<p><Link href="mailto:contact@afrek.app">Contact</Link></p>
	</div>

	<p>
		Developed with &lt;3 by <Link href="https://www.thorlaksson.com">Kristófer Reykjalín</Link>
	</p>
</div>

<style>
	div.footer {
		background-color: #250048;
		color: white;
		text-align: center;
		padding: 5rem;
		margin-block-start: 5rem;
		margin-inline: 0;
	}
</style>
