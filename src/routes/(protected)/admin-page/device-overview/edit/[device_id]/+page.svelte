<script>
    // @ts-nocheck
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import AnimatedLoading from "$lib/Components/AnimatedLoading.svelte";
    import BackButton from "$lib/Components/BackButton.svelte";
    import { Delete, Get, GetSessionToken, Post, Put } from "$lib/DataFetcher";
    import { onMount } from "svelte";
    const device_id = $page.params.device_id;
    let ready = false
    let originalDevice = null;
    let device = null;

    let deviceCode = null;

    onMount(async () => {
        await setDefault()
    })

    async function setDefault(){
        if (device_id == -1) {
            let emptyDevice = {
                "name": ""
            }
            originalDevice = {...emptyDevice};
            device = {...emptyDevice};
            if (!ready) ready = true;
            return
        }

        let data = await Get("check_in_device/"+device_id, {"session-token": GetSessionToken()});
        originalDevice = {...data[0]["device"]};
        device = {...data[0]["device"]};
        deviceCode = device.code;

        if (!ready) ready = true;
        return
    }

    async function update(){
        if (device_id == -1){
            await Post(
                "check_in_device/"+device.name,
                null,
                {"session-token": GetSessionToken()}
            ).then(()=>{
                goto("/admin-page/device-overview")
            })
        }
    }

    async function removeDevice() {
        Delete("check_in_device/"+device_id, {
            "session-token": GetSessionToken()
        }).then(()=>{
            goto("/admin-page/device-overview")
        })
    }
</script>
<style>
    #Content{
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
        display: flex;
        flex-direction: column;
        position: absolute;
        font-size: larger;
    }
    label{
        display: flex;
        flex-direction: column;
        width: 280px;
        height: 80px;
    }

    input{
        font-size: large;
        height: 30px;
    }

    .SpacerDiv{
        height: 50px;
    }

    #ButtonDiv{
        display: flex;
        flex-direction: row;
        gap: 15px;
    }

    button{
        width: 115px;
        height: 30px;
        border: none;
    }

    p{
        width: 200px;
        word-wrap: break-word;
        white-space: normal;
    }
</style>
{#if ready}
    <BackButton backPage={"/admin-page/device-overview"}/>
    <div id="Content">
        <h1>Edit Device</h1>
        <label id="NameLabel" for="NameInput">
            Device Name
            {#if device_id == -1}
            <input id="NameInput" type="text" bind:value={device.name} placeholder="Device Name">
            {:else}
            <input id="NameInput" type="text" bind:value={device.name} placeholder="Device Name" disabled>
            {/if}
        </label>
        {#if deviceCode}
        <p>Device Code: {deviceCode}</p>
        {/if}
        <div class="SpacerDiv"></div>
        <div id="ButtonDiv">
            {#if device_id == -1}
            <button type="button" on:click={() => {update()}}>Create</button>
            {/if}
            <button type="button" on:click={() => {removeDevice()}}>Delete</button>
        </div>
        <div class="SpacerDiv"></div>
        <div id="ButtonDiv">
        </div>
    </div>
{:else}
    <AnimatedLoading/>
{/if}