<script>
// @ts-nocheck

    import { goto } from "$app/navigation";
    import AnimatedLoading from "$lib/Components/AnimatedLoading.svelte";
    import BackButton from "$lib/Components/BackButton.svelte";
    import ListItem from "$lib/Components/ListItem.svelte";
    import { Get, GetSessionToken } from "$lib/DataFetcher";
    import { onMount } from "svelte";
    let ready = false
    let users = null

    onMount(async ()=>{
        let userData = await Get("users", {"session-token": GetSessionToken()})
        users = userData[0]["users"]
        ready = true
    })

    function createUser(){
        goto("/admin-page/user-overview/user/edit-user")
    }

    function gotoUser(id = -1){
        goto("/admin-page/user-overview/user/"+id)
    }

    let searchQuery = "";
                
    $: filteredUsers = users?.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? [];
</script>

<style>
    #Content{
        position: absolute;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }
    #ListContent{
        height: 550px;
        width: 250px;
        background-color: darkgray;
        border: 1px solid black;
    }
    #ListSearch{
        width: 100%;
        height: 50px;
        display: flex;
        flex-direction: row;
    }
    #ListSearch input{
        width: 80%;
        height: calc(100% - 4px);
        border: 1px solid black;
        font-size: large;
    }
    #ListSearch button{
        width: calc(20% - 2px);
        height: 100%;
        border: 1px solid black;
        font-size: x-large;
    }
    #List{
        height: calc(100% - 30px);
        display: flex;
        flex-direction: column;
        gap: 1px;
        overflow-y: scroll;
    }
</style>

{#if ready}
    <BackButton backPage="/admin-page"/>
    <div id="Content">
        <h1>User Overview</h1>
        <div id="ListContent">
            <div id="ListSearch">
                <input type="text" placeholder="Search User" bind:value={searchQuery}>
                <button type="button" on:click={createUser}>+</button>
            </div>
            <div id="List">
                {#each filteredUsers as user (user.id)}
                    <ListItem text={user.name} on:click={() => gotoUser(user.id)}/>
                {/each}
            </div>
        </div>
    </div>
{:else}
    <AnimatedLoading/>
{/if}