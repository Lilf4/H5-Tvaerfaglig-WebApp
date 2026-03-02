<script>
// @ts-nocheck

    import AnimatedLoading from "$lib/Components/AnimatedLoading.svelte";
    import BackButton from "$lib/Components/BackButton.svelte";
    import { page } from '$app/stores';
    import HomeScreenButton from "$lib/Components/HomeScreenButton.svelte";
    import { goto } from "$app/navigation";

    import scheduleImg from "$lib/assets/schedule.png"
    import editImg from "$lib/assets/edit.png"
    import trashImg from "$lib/assets/trash.png"
    import { onMount } from "svelte";
    import { Delete, Get, GetSessionToken } from "$lib/DataFetcher";

    let ready = false

    const id = $page.params.id;
    let user = null
    onMount(async () => {
        let userData = await Get("user/"+id, {"session-token": GetSessionToken()})
        user = userData[0]["user"]
        ready = true;
    })

    async function TryDelete() {
        if (confirm("Are you sure you want to delete this user?")) {
            await Delete("user/" + id, {"session-token": GetSessionToken()});
            goto("/admin-page/user-overview");
        }
    }
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
    <BackButton backPage="/admin-page/user-overview"/>
    <div>
        <h1>{user.name} overview</h1>
        <HomeScreenButton on:click={() => goto("/admin-page/user-overview/user/"+id+"/edit")} image={editImg} text="Edit"/>
        <HomeScreenButton on:click={goto("/admin-page/user-overview/user/"+id+"/schedules")} image={scheduleImg} text="Schedules"/>
        <HomeScreenButton on:click={async () => {TryDelete()}} image={trashImg} text="Delete"/>
    </div>
{:else}
    <AnimatedLoading/>
{/if}