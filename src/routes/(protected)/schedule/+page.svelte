<script>
// @ts-nocheck

    import AnimatedLoading from "$lib/Components/AnimatedLoading.svelte";
    import BackButton from "$lib/Components/BackButton.svelte";
    import { Get, GetSessionToken } from "$lib/DataFetcher";
    import { onMount } from "svelte";
    
    let ready = true
    let user = null
    /*
    onMount(async ()=>{
        let userData = await Get("self", {"session-token": GetSessionToken()})
        user = userData[0]["user"]

        ready = true
    })
    */
</script>

<style>
    #Content{
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: red;
        display: flex;
        flex-direction: column;
    }

    #TopBar{
        width: 100%;
        height: 20%;
        background-color: green;
    }

    #TopBar #TopSection{
        height: 50%;
        background-color: rgba(0, 0, 255, 0.3);
    }
    #TopBar #BottomSection{
        height: 50%;
        background-color: rgba(0, 255, 255, 0.3);
    }

    #ScheduleContent{
        width: 100%;
        height: 80%;
        background-color: pink;
    }

    #ScheduleContent table{
        width: 100%;
        border-collapse: collapse;
        text-align: center;
    }

    #ScheduleContent table thead tr{
        width: 20%;
        height: 30px;
        border-right: 1px solid black;
    }
    #ScheduleContent table tbody tr{
        width: 20%;
        height: 30px;
    }

    #ScheduleContent table thead th{
        border-bottom: 1px solid;
    }

    #ScheduleContent table tr:nth-child(odd){
        background-color: red;
    }
    #ScheduleContent table tr:nth-child(even){
        background-color: lightblue;
    }
</style>

{#if ready}
    <BackButton backPage="/home"/>
    <div id="Content">
        <div id="TopBar">
            <div id="TopSection">

            </div>
            <div id="BottomSection">

            </div>
        </div>
        <div id="ScheduleContent">
            <table>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Schedule</th>
                    </tr>
                </thead>
                <tbody>
                    {#each [...Array(24).keys()] as hour}
                        <tr>
                            <td>{String(hour+1).padStart(2, '0')}:00</td>
                            <td>Schedule item</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
{:else}
    <AnimatedLoading/>
{/if}