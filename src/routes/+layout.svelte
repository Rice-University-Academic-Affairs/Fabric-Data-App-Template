<script lang="ts">
	import "../app.css";

	let { data, children } = $props();
</script>

{#if !data.authenticated}
	<p>Open this app inside the Fabric portal.</p>
{:else}
	{@render children()}
{/if}
