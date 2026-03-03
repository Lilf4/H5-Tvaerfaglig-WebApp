<script>
// @ts-nocheck

    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import AnimatedLoading from "$lib/Components/AnimatedLoading.svelte";
    import BackButton from "$lib/Components/BackButton.svelte";
    import ListItem from "$lib/Components/ListItem.svelte";
    import { Get, GetSessionToken } from "$lib/DataFetcher";
    import { onMount } from "svelte";
    const id = $page.params.id;
    let ready = false
    let schedules = null

    let Weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    onMount(async ()=>{
        let scheduleData = await Get("scheduled_times/"+id, {"session-token": GetSessionToken()})
        console.log(scheduleData)
        schedules = scheduleData[0]["schedules"]
        ready = true
    })

    function gotoSchedule(schedule_id = -1){
        goto("/admin-page/user-overview/user/"+id+"/schedules/schedule-editor/"+schedule_id)
    }
    let e = ";";

    let searchQuery = "";
                
    $: filteredSchedules = schedules?.filter(schedule => 
        (Weekdays[schedule.weekDay-1].toLowerCase()+": "+(schedule.startTime.split(":").slice(0, 2).join(":"))+"-"+(schedule.endTime.split(":").slice(0, 2).join(":"))).includes(searchQuery.toLowerCase())
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
    <BackButton backPage={"/admin-page/user-overview/user/"+id}/>
    <div id="Content">
        <h1>Schedule Overview</h1>
        <div id="ListContent">
            <div id="ListSearch">
                <input type="text" placeholder="Search Schedule" bind:value={searchQuery}>
                <button type="button" on:click={()=>gotoSchedule()}>+</button>
            </div>
            <div id="List">
                {#each filteredSchedules as schedule (schedule.id)}
                    <ListItem text={Weekdays[schedule.weekDay-1]+": "+(schedule.startTime.split(":").slice(0, 2).join(":"))+"-"+(schedule.endTime.split(":").slice(0, 2).join(":"))} on:click={() => gotoSchedule(schedule.id)}/>
                {/each}
            </div>
        </div>
    </div>
{:else}
    <AnimatedLoading/>
{/if}