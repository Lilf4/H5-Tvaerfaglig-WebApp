<script>
    // @ts-nocheck
    import { page } from "$app/stores";
    import AnimatedLoading from "$lib/Components/AnimatedLoading.svelte";
    import BackButton from "$lib/Components/BackButton.svelte";
    import { Get, GetSessionToken, Put } from "$lib/DataFetcher";
    import { onMount } from "svelte";
    const id = $page.params.id;
    const schedule_id = $page.params.schedule_id;
    let ready = false
    let originalSchedule = null;
    let schedule = null;

    let Weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    let SelectedWeekday = null;
    let formattedStartTime = null;
    let formattedEndTime = null;

    let newPass = "";
    let newPassConfirm = "";
    onMount(async () => {
        await setDefault()
    })

    async function setDefault(){
        let data = await Get("scheduled_time/"+schedule_id, {"session-token": GetSessionToken()});
        originalSchedule = {...data[0]["schedule"]};
        schedule = {...data[0]["schedule"]};
        SelectedWeekday = Weekdays[schedule.weekDay-1]
        formattedStartTime = schedule.startTime.split(":").slice(0, 2).join(":")
        formattedEndTime = schedule.endTime.split(":").slice(0, 2).join(":");
        console.log(data)

        newPass = ""
        newPassConfirm = ""
        if (!ready) ready = true;
        return
    }

    async function update(){
        let role_id = -1
        for (let role in roles){
            if (chosen_role == role.role){
                role_id = role.id
                break;
            }
        }
        let password = null
        if (newPass && newPass === newPassConfirm) {
            password = newPass;
        }
        await Put(
            "user/"+user.id, 
            {
                "name": originalUser.name != user.name ? user.name : null, 
                "username": originalUser.username != user.username ? user.username : null, 
                "password": password, 
                "role_id": role_id}, 
            {"session-token": GetSessionToken()}
        ).then(() => {
            ready = false
            setDefault()
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

    #SpacerDiv{
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
    <BackButton backPage="/admin-page"/>
    <div id="Content">
        <h1>Edit Schedule</h1>
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

        <div id="ButtonDiv">
            <button type="button" on:click={() => {update()}}>Update</button>
            <button type="button" on:click={async () => {setDefault()}}>Defaults</button>
        </div>
    </div>
{:else}
    <AnimatedLoading/>
{/if}