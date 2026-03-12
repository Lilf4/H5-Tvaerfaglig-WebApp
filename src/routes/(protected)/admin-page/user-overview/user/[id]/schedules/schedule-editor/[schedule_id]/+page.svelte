<script>
    // @ts-nocheck
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import AnimatedLoading from "$lib/Components/AnimatedLoading.svelte";
    import BackButton from "$lib/Components/BackButton.svelte";
    import { Delete, Get, GetSessionToken, Post, Put } from "$lib/DataFetcher";
    import { onMount } from "svelte";
    const id = $page.params.id;
    const schedule_id = $page.params.schedule_id;
    let ready = false
    let originalSchedule = null;
    let schedule = null;

    let Weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    let SelectedWeekday = null;
    let originalFormattedStartTime = null;
    let formattedStartTime = null;
    let originalFormattedEndTime = null;
    let formattedEndTime = null;

    onMount(async () => {
        await setDefault()
    })

    async function setDefault(){
        if (schedule_id == -1) {
            let emptySchedule = {
                "user_id": id,
                "inactive": false,
            }
            originalSchedule = {...emptySchedule};
            schedule = {...emptySchedule};
            SelectedWeekday = Weekdays[0]
            originalFormattedStartTime = "00:00"
            formattedStartTime = "00:00"
            originalFormattedEndTime = "00:00"
            formattedEndTime = "00:00"
            if (!ready) ready = true;
            return
        }

        let data = await Get("scheduled_time/"+schedule_id, {"session-token": GetSessionToken()});
        originalSchedule = {...data[0]["schedule"]};
        schedule = {...data[0]["schedule"]};
        SelectedWeekday = Weekdays[schedule.weekDay-1]
        originalFormattedStartTime = schedule.startTime.split(":").slice(0, 2).join(":")
        formattedStartTime = schedule.startTime.split(":").slice(0, 2).join(":")
        originalFormattedEndTime = schedule.endTime.split(":").slice(0, 2).join(":");
        formattedEndTime = schedule.endTime.split(":").slice(0, 2).join(":");

        if (!ready) ready = true;
        return
    }

    async function update(){
        let weekDayID = -1
        let i = 1;
        for (let weekDay of Weekdays){
            if (SelectedWeekday == weekDay){
                weekDayID = i
                break;
            }
            i++;
        }
        if (schedule_id == -1){
            await Post(
                "scheduled_time",
                {
                    "weekDay": weekDayID,
                    "startTime": formattedStartTime,
                    "endTime": formattedEndTime,
                    "user_id": schedule.user_id, 
                    "inactive": schedule.inactive
                },
                {"session-token": GetSessionToken()}
            ).then(()=>{
                goto("/admin-page/user-overview/user/"+id+"/schedules")
            })
        }
        else{
            await Put(
                "scheduled_time/"+schedule_id, 
                {
                    "weekDay": weekDayID, 
                    "startTime": originalFormattedEndTime != formattedStartTime ? formattedStartTime : null, 
                    "endTime": originalFormattedEndTime != formattedEndTime ? formattedEndTime : null, 
                    "user_id": schedule.user_id, 
                    "inactive": originalSchedule.inactive != schedule.inactive ? schedule.inactive : null}, 
                {"session-token": GetSessionToken()}
            ).then(() => {
                ready = false
                setDefault()
            })
        }
    }

    async function removeSchedule() {
        Delete("scheduled_time/"+schedule_id, {
            "session-token": GetSessionToken()
        }).then(()=>{
            goto("/admin-page/user-overview/user/"+id+"/schedules")
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

    input[type="checkbox"]{
        height: 30px;
        width: 30px;
        align-self: flex-start;
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
    <BackButton backPage={"/admin-page/user-overview/user/"+id+"/schedules"}/>
    <div id="Content">
        {#if schedule_id == -1}
        <h1>Create Schedule</h1>
        {:else}
        <h1>Edit Schedule</h1>
        {/if}
        <label id="WeekdayLabel" for="WeekdaySelect">
            Weekday
            <select id="WeekdaySelect" bind:value={SelectedWeekday}>
                <option value="" disabled selected>Select Weekday</option>
                {#each Weekdays as Weekday}
                    <option value="{Weekday}" selected={Weekday === SelectedWeekday}>{Weekday}</option>
                {/each}
            </select>
        </label>
        <label id="StartTimeLabel" for="StartTimeInput">
            Start Time
            <input id="StartTimeInput" type="time" bind:value={formattedStartTime} placeholder="HH:mm">
        </label>
        <label id="EndTimeLabel" for="EndTimeInput">
            End Time
            <input id="EndTimeInput" type="time" bind:value={formattedEndTime} placeholder="HH:mm">
        </label>
        <label id="InactiveLabel" for="InactiveInput">
            Inactive
            <input id="InactiveInput" type="checkbox" bind:checked={schedule.inactive}>
        </label>
        <div class="SpacerDiv"></div>
        <div id="ButtonDiv">
            {#if schedule_id == -1}
            <button type="button" on:click={() => {update()}}>Create</button>
            {:else}
            <button type="button" on:click={() => {update()}}>Update</button>
            {/if}
            <button type="button" on:click={async () => {setDefault()}}>Defaults</button>
        </div>
        <div class="SpacerDiv"></div>
        {#if schedule_id != -1}
        <div id="ButtonDiv">
            <button type="button" on:click={() => {removeSchedule()}}>Delete</button>
        </div>
        {/if}
    </div>
{:else}
    <AnimatedLoading/>
{/if}