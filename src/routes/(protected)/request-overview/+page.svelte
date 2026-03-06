<script>
// @ts-nocheck

    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import AnimatedLoading from "$lib/Components/AnimatedLoading.svelte";
    import BackButton from "$lib/Components/BackButton.svelte";
    import ListItem from "$lib/Components/ListItem.svelte";
    import { Get, GetSessionToken } from "$lib/DataFetcher";
    import { onMount } from "svelte";
    let ready = false
    let requests = null
    let requestTypes = null
    let user = null

    onMount(async ()=>{
        let userData = await Get("self", {"session-token": GetSessionToken()})
        user = userData[0]["user"]

        let requestData = await Get("requests/"+user.id+"&"+"true", {"session-token": GetSessionToken()})
        requests = requestData[0]["requests"]

        let requestTypeData = await Get("request_types", {"session-token": GetSessionToken()})
        requestTypes = requestTypeData[0]["request_types"]
        console.log(requestTypes)
        ready = true
    })

    function gotoRequest(request_id = -1){
        goto("/request-overview/"+request_id)
    }

    let searchQuery = "";
                
    $: filteredRequests = requests && requestTypes ? requests.filter(request => 
        (requestTypes[request.type_id-1].type_name).includes(searchQuery.toLowerCase())
    ) : [];
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
    <BackButton backPage={"/"}/>
    <div id="Content">
        <h1>Schedule Overview</h1>
        <div id="ListContent">
            <div id="ListSearch">
                <input type="text" placeholder="Search Schedule" bind:value={searchQuery}>
                <button type="button" on:click={()=>gotoRequest()}>+</button>
            </div>
            <div id="List">
                {#each filteredRequests as request (request.id)}
                    <ListItem text={requestTypes[request.type_id-1].type_name} on:click={() => gotoRequest(request.id)}/>
                {/each}
            </div>
        </div>
    </div>
{:else}
    <AnimatedLoading/>
{/if}