<script>
// @ts-nocheck

    import AnimatedLoading from "$lib/Components/AnimatedLoading.svelte";
    import BackButton from "$lib/Components/BackButton.svelte";
    import { Get, GetSessionToken } from "$lib/DataFetcher";
    import { onMount } from "svelte";
    import scheduleImg from "$lib/assets/schedule.png"
    let ready = true
    let user = null
    let SelectedDate = new Date();
    let dateInput;

    function openCalendar() {
        dateInput.showPicker();
    }

    function dateChanged(e) {
        SelectedDate = new Date(e.target.value);
    }

    function getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));

        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        
        const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        
        return weekNo;
    }
    $: weekNumber = getWeekNumber(SelectedDate);

    function getWeekDayNumbers(date) {
        const d = new Date(date);
        let numbers = []
        let OffsetToMonday = (d.getDay()-1 == -1 ? 6 : d.getDay()-1)
        
        let Monday = new Date(d)
        Monday.setDate(d.getDate()-OffsetToMonday)
        
        for(let i = 0; i < 7; i++){
            let temp = new Date(Monday)
            temp.setDate(Monday.getDate()+i);
            numbers.push(temp.getDate())
        }
        return numbers;
    }
    $: weekRange = getWeekDayNumbers(SelectedDate)
    function SelectNewDate(dateNumber){
        const newDate = new Date(SelectedDate)
        newDate.setDate(dateNumber)
        SelectedDate = newDate
    }

    /*
    onMount(async ()=>{
        let userData = await Get("self", {"session-token": GetSessionToken()})
        user = userData[0]["user"]

        ready = true
    })
    */
</script>

<style>
    /*START Main Boxes START*/
    #Content{
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    #ScheduleContent{
        width: 100%;
        height: 80%;
        overflow-y: scroll;
    }
    #TopBar{
        width: 100%;
        height: 20%;
    }
    #TopBar > .TopSection{
        height: 50%;
    }
    #TopBar > .BottomSection{
        height: 50%;
    }
    #ScheduleContent table{
        width: 100%;
        border-collapse: collapse;
        text-align: center;
    }

    #ScheduleContent table tbody tr{
        height: 50px;
    }
    #ScheduleContent table tbody td:nth-child(1){
        width: 20%;
        border-right: 1px solid black;
    }

    #ScheduleContent table tr:nth-child(odd){
        background-color: rgb(126, 126, 126);
    }
    #ScheduleContent table tr:nth-child(even){
        background-color: rgb(202, 202, 202);
    }
    /*END Main Boxes END*/

    /*START Week/Date Display START*/
    #TopBar > .BottomSection > .TopSection,#TopBar > .BottomSection > .BottomSection{
        height: 50%;
    }
    
    #TopBar > .BottomSection > .TopSection table td, #TopBar > .BottomSection > .BottomSection table td{
        width: 14.28%;
    }

    /*Top*/
    #TopBar > .BottomSection > .TopSection table{
        width: 100%;
        height: 100%;
        text-align: center;
    }
    
    /*Bottom*/
    #TopBar > .BottomSection > .BottomSection table{
        width: 100%;
        height: 100%;
        text-align: center;
        border-bottom: 1px solid black;
    }

    #TopBar > .BottomSection > .BottomSection table td{
        border-radius: 25px;
        user-select: none;
        cursor: pointer;
    }
    #TopBar > .BottomSection > .BottomSection table td:hover{
        background-color: rgba(255, 255, 255, 0.5);
    }

    #TopBar > .BottomSection > .BottomSection table td.today{
        background-color: rgb(201, 201, 201);
    }
    
    #TopBar > .BottomSection > .BottomSection table td.selected{
        background-color: white;
    }
    /*END Week/Date Display END*/

    /*START Week Display START*/
    #TopBar > .TopSection{
        display: flex;
        justify-content: flex-end;
    }

    #TopBar > .TopSection > .MiddleSection{
        height: 100%;
        width: 33.33%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: larger;
    }
    #TopBar > .TopSection > .RightSection{
        height: 100%;
        width: 33.33%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #TopBar > .TopSection > .RightSection button{
        width: 50%;
        background: none;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #TopBar > .TopSection > .RightSection img{
        width: 100%;
    }
    /*END Week Display END*/
</style>

{#if ready}
    <BackButton backPage="/home"/>
    <input
        type="date"
        bind:this={dateInput}
        value={SelectedDate.toISOString().split("T")[0]}
        on:change={dateChanged}
        style="position:absolute;opacity:0;width:0;height:0;"
    />
    <div id="Content">
        <div id="TopBar">
            <div class="TopSection">
                <div class="MiddleSection">
                    <p>Week: {weekNumber}</p>

                </div>
                <div class="RightSection">
                    <button on:click={openCalendar} type="button" aria-label="Schedule options">
                        <img src={scheduleImg} alt="Schedule">
                    </button>
                </div>
            </div>
            <div class="BottomSection">
                <div class="TopSection">
                    <table>
                        <tbody>
                            <tr>
                                <td>Mon</td>
                                <td>Tue</td>
                                <td>Wed</td>
                                <td>Thu</td>
                                <td>Fri</td>
                                <td>Sat</td>
                                <td>Sun</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="BottomSection">
                    <table>
                        <tbody>
                            <tr>
                                {#each weekRange as day}
                                    <td on:click={()=>SelectNewDate(day)} class={(day === SelectedDate.getDate() ? 'selected' : '')+' '+(day === new Date().getDate() ? 'today' : '')}>
                                        {day}
                                    </td>
                                {/each}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div id="ScheduleContent">
            <table>
                <tbody>
                    {#each [...Array(24).keys()] as hour}
                        <tr>
                            <td>{String(hour).padStart(2, '0')}:00</td>
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