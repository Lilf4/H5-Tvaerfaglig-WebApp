<script>
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<style>
	:global(body){
		background-color: rgb(126, 126, 126);
		margin: 0px;
	}

	:global(.hidden){
		visibility: hidden;
		display: none;
	}
	:global(.visible){
		visibility: visible;
	}
</style>

{@render children()}
