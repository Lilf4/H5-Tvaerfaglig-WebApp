<script>
    import { goto } from "$app/navigation";
    import AnimatedLoading from "$lib/Components/AnimatedLoading.svelte";
    import BackButton from "$lib/Components/BackButton.svelte";
    import HomeScreenButton from "$lib/Components/HomeScreenButton.svelte";
    import userImg from "$lib/assets/user.png"
    import requestImg from "$lib/assets/request.png"
    import deviceImg from "$lib/assets/device.png"
    let ready = true
</script>
<style>
    div{
        position: absolute;
        height: 100%;
        width: 100%;
        margin: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }
</style>
{#if ready}
    <BackButton backPage="/home"/>
    <div>
        <h1>Admin Page</h1>
        <HomeScreenButton on:click={() => goto("/admin-page/user-overview")} image={userImg} text="User Overview"/>
        <HomeScreenButton on:click={() => goto("/admin-page/request-overview")} image={requestImg} text="Request Overview"/>
        <HomeScreenButton on:click={() => goto("/admin-page/device-overview")} image={deviceImg} text="Device Overview"/>
    </div>
{:else}
    <AnimatedLoading/>
{/if}