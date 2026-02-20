<script>
// @ts-nocheck

    let LoadText = "Loading"
    import { onMount } from 'svelte';

    let dotCount = 0;
    let interval;

    onMount(() => {
        interval = setInterval(() => {
            dotCount = (dotCount + 1) % 4; // Reset after 3 dots
            LoadText = "Loading" + ".".repeat(dotCount);
        }, 500);

        return () => clearInterval(interval); // Cleanup on component destroy
    });
</script>

<style>
    div{
        height: 100%;
        width: 100%;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    p{
        margin: 0px;
        font-size: xx-large;
        font-weight: bold;
    }
</style>
<div>
    <p>{LoadText}</p>
</div>