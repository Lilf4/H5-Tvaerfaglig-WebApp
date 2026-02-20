<script>
    import { goto } from "$app/navigation";

</script>
<button type="button" on:click={() => goto("/home")} aria-label="Go to Home">
    Go Home
</button>