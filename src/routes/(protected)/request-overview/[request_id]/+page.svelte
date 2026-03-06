<script>
// @ts-nocheck

    import AnimatedLoading from "$lib/Components/AnimatedLoading.svelte";
    import { page } from "$app/stores";
    import BackButton from "$lib/Components/BackButton.svelte";
    import { Delete, Get, GetSessionToken, Post } from "$lib/DataFetcher";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    let ready = false

    let User = null
    const request_id = $page.params.request_id;

    let RequestTypes = null;
    let RequestData = null
    let reasonText = null;
    let SelectedType = null;
    let formattedStartTime = null;
    let formattedEndTime = null;

    onMount(async () => {
        await setDefault()
    })

    async function setDefault(){
        let userData = await Get("self", {"session-token": GetSessionToken()})
        User = userData[0].user

        let requestTypeData = await Get("request_types", {"session-token": GetSessionToken()})
        RequestTypes = requestTypeData[0].request_types
        if (request_id == -1) {
            formattedStartTime = null
            formattedEndTime = null
            reasonText = null
            SelectedType = null

            if (!ready) ready = true;
            return
        }

        
        let requestData = await Get("request/"+request_id+"&true", {"session-token": GetSessionToken()})
        RequestData = requestData[0].request
        formattedStartTime = RequestData.startDay.split(".")[0]
        formattedEndTime = RequestData.endDay.split(".")[0]
        reasonText = RequestData.reason
        SelectedType = RequestTypes[RequestData.type_id-1].type_name

        if (!ready) ready = true;
        return
    }

    async function createRequest(){
        if (formattedStartTime == null || formattedEndTime == null || reasonText == "" || SelectedType == null){
            alert("All fields must have a value")
            return
        }

        let type_id = -1
        for(let i = 0; i < RequestTypes.length; i++){
            if (SelectedType == RequestTypes[i].type_name){
                type_id = i + 1
                break
            }
        }

        let newRequest = {
            "reason": reasonText,
            "startDay": formattedStartTime,
            "endDay": formattedEndTime,
            "type_id": type_id,
            "user_id": User.id
        }
        await Post("request", newRequest, {"session-token": GetSessionToken()})
        goto("/request-overview")
    }

    async function removeRequest(){
        await Delete("request/"+request_id, {"session-token": GetSessionToken()}).then(()=>{
            goto("/request-overview")
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

    input, select{
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
</style>
{#if ready}
    <BackButton backPage="/request-overview"/>
    <div id="Content">
        {#if request_id != -1}
            <h1>View Request</h1>
            <label id="TypeLabel" for="TypeSelect">
                Request Type
                <select id="TypeSelect" bind:value={SelectedType} disabled>
                    <option value="" disabled selected>Select Type</option>
                    {#each RequestTypes as RequestType}
                        <option value="{RequestType.type_name}" selected={RequestType.type_name === SelectedType}>{RequestType.type_name}</option>
                    {/each}
                </select>
            </label>
            <label id="StartTimeLabel" for="StartTimeInput">
                Start Time
                <input id="StartTimeInput" type="datetime-local" bind:value={formattedStartTime} placeholder="HH:mm" disabled>
            </label>
            <label id="EndTimeLabel" for="EndTimeInput">
                End Time
                <input id="EndTimeInput" type="datetime-local" bind:value={formattedEndTime} placeholder="HH:mm" disabled>
            
            </label>
            <label id="ReasonTextLabel" for="ReasonTextInput">
                Reason
                <textarea id="ReasonTextInput" bind:value={reasonText} placeholder="Enter reason..." disabled></textarea>
            </label>
            <div class="SpacerDiv"></div>
            <div id="ButtonDiv">
                <button type="button" on:click={() => {removeRequest()}}>Delete</button>
            </div>
        {:else}
            <h1>Create Request</h1>
            <label id="TypeLabel" for="TypeSelect">
                Request Type
                <select id="TypeSelect" bind:value={SelectedType}>
                    <option value="" disabled selected>Select Type</option>
                    {#each RequestTypes as RequestType}
                        <option value="{RequestType.type_name}" selected={RequestType.type_name === SelectedType}>{RequestType.type_name}</option>
                    {/each}
                </select>
            </label>
            <label id="StartTimeLabel" for="StartTimeInput">
                Start Time
                <input id="StartTimeInput" type="datetime-local" bind:value={formattedStartTime} placeholder="HH:mm">
            </label>
            <label id="EndTimeLabel" for="EndTimeInput">
                End Time
                <input id="EndTimeInput" type="datetime-local" bind:value={formattedEndTime} placeholder="HH:mm">
            
            </label>
            <label id="ReasonTextLabel" for="ReasonTextInput">
                Reason
                <textarea id="ReasonTextInput" bind:value={reasonText} placeholder="Enter reason..."></textarea>
            </label>
            <div class="SpacerDiv"></div>
            <div id="ButtonDiv">
                <button type="button" on:click={() => {createRequest()}}>Create</button>
                <button type="button" on:click={async () => {setDefault()}}>Defaults</button>
            </div>
        {/if}
            
    </div>
{:else}
    <AnimatedLoading/>
{/if}