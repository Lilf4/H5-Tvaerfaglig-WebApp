<script>
// @ts-nocheck

    import { goto } from "$app/navigation";
    import AnimatedLoading from "$lib/Components/AnimatedLoading.svelte";
    import BackButton from "$lib/Components/BackButton.svelte";
    import ListItem from "$lib/Components/ListItem.svelte";
    import { Get, GetSessionToken } from "$lib/DataFetcher";
    import { onMount } from "svelte";
    let ready = false
    let devices = null

    onMount(async ()=>{
        let deviceData = await Get("check_in_devices", {"session-token": GetSessionToken()})
        devices = deviceData[0]["device"]
        ready = true
    })

    function createDevice(){
        goto("/admin-page/device-overview/edit/-1")
    }

    function gotoDevice(id = -1){
        goto("/admin-page/device-overview/edit/"+id)
    }

    let searchQuery = "";
                
    $: filteredDevices = devices?.filter(device => 
        device.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h1>Device Overview</h1>
        <div id="ListContent">
            <div id="ListSearch">
                <input type="text" placeholder="Search Device" bind:value={searchQuery}>
                <button type="button" on:click={createDevice()}>+</button>
            </div>
            <div id="List">
                {#each filteredDevices as device (device.id)}
                    <ListItem text={device.name} on:click={() => gotoDevice(device.id)}/>
                {/each}
            </div>
        </div>
    </div>
{:else}
    <AnimatedLoading/>
{/if}