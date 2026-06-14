<script lang="ts">
    let { data } = $props();

    let previewText = $derived(JSON.stringify(data.preview));
</script>

{#if data.preview.length === 0}
    <p>No data loaded.</p>
{:else}
    <p>{previewText}</p>
{/if}
