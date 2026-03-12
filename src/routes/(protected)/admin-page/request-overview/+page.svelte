<script>
// @ts-nocheck

    import { goto } from "$app/navigation";
    import AnimatedLoading from "$lib/Components/AnimatedLoading.svelte";
    import BackButton from "$lib/Components/BackButton.svelte";
    import ListItem from "$lib/Components/ListItem.svelte";
    import { Get, GetSessionToken } from "$lib/DataFetcher";
    import { onMount } from "svelte";
    let ready = false
    let requests = null
    let requestTypes = null
    let users = null

    onMount(async ()=>{
        let requestData = await Get("requests/false", {"session-token": GetSessionToken()})
        requests = requestData[0]["requests"]

        let requestType = await Get("request_types", {"session-token": GetSessionToken()})
        requestTypes = requestType[0]["request_types"]

        let userData = await Get("users", {"session-token": GetSessionToken()})
        let userTemp = userData[0]["users"]
        users = {}
        for (let i = 0; i < userTemp.length; i++){
            users[userTemp[i].id] = userTemp[i]
        }

        console.log(requests)
        console.log(requestTypes)
        console.log(users)
        ready = true
    })

    function gotoRequest(id = -1){
        goto("/admin-page/request-overview/process/"+id)
    }

    let searchQuery = "";
                
    $: filteredRequests = requests&&requestTypes&&users?requests.filter(request => 
        ((users[request.request.user_id].username + " - " + requestTypes[request.request.type_id-1].type_name).toLowerCase()).includes(searchQuery.toLowerCase())
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
        width: 100%;
        height: calc(100% - 4px);
        border: 1px solid black;
        font-size: large;
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
        <h1>Request Overview</h1>
        <div id="ListContent">
            <div id="ListSearch">
                <input type="text" placeholder="Search Requests" bind:value={searchQuery}>
            </div>
            <div id="List">
                {#each filteredRequests as request (request.request.id)}
                    <ListItem text={users[request.request.user_id].username + " - " + requestTypes[request.request.type_id-1].type_name} on:click={() => gotoRequest(request.request.id)}/>
                {/each}
            </div>
        </div>
    </div>
{:else}
    <AnimatedLoading/>
{/if}