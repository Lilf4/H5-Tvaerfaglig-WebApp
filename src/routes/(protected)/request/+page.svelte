<script>
    import AnimatedLoading from "$lib/Components/AnimatedLoading.svelte";
    import BackButton from "$lib/Components/BackButton.svelte";
    let ready = true
</script>
{#if ready}
    <BackButton backPage="/home"/>
{:else}
    <AnimatedLoading/>
{/if}