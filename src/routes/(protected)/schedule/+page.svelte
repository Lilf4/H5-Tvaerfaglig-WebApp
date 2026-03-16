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

    let Schedules = null;

    let Requests = null;
    let RequestTypes = null;
    let WorkedTimes = null;

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
        d.setDate(d.getDate()-OffsetToMonday)
        
        for(let i = 0; i < 7; i++){
            let temp = new Date(d)
            temp.setDate(d.getDate()+i);
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

    
    onMount(async ()=>{
        let userData = await Get("self", {"session-token": GetSessionToken()})
        user = userData[0]["user"]
        
        let scheduleData = await Get("scheduled_times/"+user.id, {"session-token": GetSessionToken()})
        Schedules = scheduleData[0]["schedules"]
        
        let requestData = await Get("requests/"+user.id+"&true", {"session-token": GetSessionToken()})
        Requests = requestData[0]["requests"]

        let requestTypeData = await Get("request_types", {"session-token": GetSessionToken()})
        RequestTypes = requestTypeData[0]["request_types"]
        
        let workedTimeData = await Get("worked_times/"+user.id, {"session-token": GetSessionToken()})
        WorkedTimes = workedTimeData[0]["worked_times"]

        selDaySchedule = getRelevantSchedules(SelectedDate)
        selDayRequest = getRelevantRequest(SelectedDate)
        selWorkedTimes = getRelevantWorkedTimes(SelectedDate)
        ready = true
    })

    function getRelevantSchedules(date){
        if (Schedules == null) return [null]
        let relevantSchedule = []
        let tempSchedule = []
        let CurrDay = (date.getDay()-1 == -1 ? 7 : date.getDay())
        Schedules.forEach(schedule => {
            if (CurrDay == schedule.weekDay){
                tempSchedule.push(schedule)
            }
        });
        tempSchedule.forEach(schedule => {
            let startTimeSplit = schedule.startTime.split(":")
            let endTimeSplit = schedule.endTime.split(":")
            relevantSchedule.push({
                "StartHour": Number(startTimeSplit[0]),
                "StartMin": Number(startTimeSplit[1]),
                "StartPercent": (1-startTimeSplit[1]/60)*100,
                "EndHour": Number(endTimeSplit[0]),
                "EndMin": Number(endTimeSplit[1]),
                "EndPercent": (endTimeSplit[1]/60*100)
            })
        })
        return relevantSchedule
    }

    
    function getRelevantRequest(date){
        if (Requests == null) return [null]
        let relevantRequests = []
        let tempRequests = []
        Requests.forEach(request => {
            let DateTimeSplit = request.request.startDay.split("T")
            let splitStartRequestDate = [].concat(DateTimeSplit[0].split("-"), DateTimeSplit[1].split(":").slice(0, 2))
            DateTimeSplit = request.request.endDay.split("T")
            let splitEndRequestDate = [].concat(DateTimeSplit[0].split("-"), DateTimeSplit[1].split(":").slice(0, 2))
            
            if (
                request.processed != null &&
                request.processed.accepted != false &&
                SelectedDate.getFullYear() >= Number(splitStartRequestDate[0]) &&
                SelectedDate.getFullYear() <= Number(splitEndRequestDate[0]) &&
                (SelectedDate.getMonth()+1) >= Number(splitStartRequestDate[1]) &&
                (SelectedDate.getMonth()+1) <= Number(splitEndRequestDate[1]) &&
                SelectedDate.getDate() >= Number(splitStartRequestDate[2]) &&
                SelectedDate.getDate() <= Number(splitEndRequestDate[2])
            ){
                tempRequests.push({...request, "SplitStartRequestDate": splitStartRequestDate, "SplitEndRequestDate": splitEndRequestDate})
            }
        });
        tempRequests.forEach(request => {
            relevantRequests.push({
                "StartYear": Number(request.SplitStartRequestDate[0]),
                "StartMonth": Number(request.SplitStartRequestDate[1]),
                "StartDay": Number(request.SplitStartRequestDate[2]),
                "StartHour": Number(request.SplitStartRequestDate[3]),
                "StartMin": Number(request.SplitStartRequestDate[4]),
                "StartPercent": (1-request.SplitStartRequestDate[4]/60)*100,
                "EndYear": Number(request.SplitEndRequestDate[0]),
                "EndMonth": Number(request.SplitEndRequestDate[1]),
                "EndDay": Number(request.SplitEndRequestDate[2]),
                "EndHour": Number(request.SplitEndRequestDate[3]),
                "EndMin": Number(request.SplitEndRequestDate[4]),
                "EndPercent": (request.SplitEndRequestDate[4]/60*100),
                "RequestType": RequestTypes[request.request.type_id-1].type_name
            })
        })
        return relevantRequests
    }

    function getRelevantWorkedTimes(date){
        let tempDate = new Date(date)
        if (WorkedTimes == null) return [null]
        let relevantWorkedTimes = []
        WorkedTimes.forEach(WorkedTime => {
            let DateTimeSplit = WorkedTime.actualDate.split("-")
            if (tempDate.getFullYear() == DateTimeSplit[0] && tempDate.getMonth()+1 == DateTimeSplit[1] && tempDate.getDate() == DateTimeSplit[2]){
                let SplitStartTime = WorkedTime.actualStart.split(":").slice(0, 2)
                let SplitEndTime = WorkedTime.actualEnd ? WorkedTime.actualEnd.split(":").slice(0, 2) : null
                relevantWorkedTimes.push({
                    "StartHour": Number(SplitStartTime[0]),
                    "StartMin": Number(SplitStartTime[1]),
                    "StartPercent": Number(1-SplitStartTime[1]/60)*100,
                    "EndHour": SplitEndTime ? Number(SplitEndTime[0]) : null,
                    "EndMin": SplitEndTime ? Number(SplitEndTime[1]) : null,
                    "EndPercent": SplitEndTime ? Number(SplitStartTime[1]/60*100) : null,
                    "Active": Boolean(WorkedTime.active)
                })
            }
        })
        console.log(relevantWorkedTimes)
        return relevantWorkedTimes
    }

    $: selDaySchedule = getRelevantSchedules(SelectedDate)
    $: selDayRequest = getRelevantRequest(SelectedDate)
    $: selWorkedTimes = getRelevantWorkedTimes(SelectedDate)
    
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
        table-layout: fixed;
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

    #ScheduleContent table tbody td {
        height: 50px; /* same as you have in tr */
        position: relative; /* needed for absolute children */
        padding: 0;
    }

    #ScheduleContent table tbody td .Start{
        display: flex;
        align-items: flex-end;
        width: 100%;
        position: absolute;
        bottom: 0px;
    }

    /*
    #ScheduleContent table tbody td:has(.Start){
        display: flex;
        align-items: flex-end;
        text-align: left;
    }
*/
    #ScheduleContent table tbody td .Middle{
        width: 100%;
        height: 100%;
    }

    #ScheduleContent table tbody td .Schedule{
        background-color: rgba(244, 164, 96, 0.7);
    }

    #ScheduleContent table tbody td .ProcessedRequest{
        background-color: rgba(0, 255, 255, 0.7);
        
    }

    #ScheduleContent table tbody td .WorkedTime{
        background-color: rgba(129, 218, 88, 0.3);
        
    }

    #ScheduleContent table tbody td .CurrTime{
        background-color: rgba(255, 0, 0, 0.3);
        height: 3px;
        width: 100%;
        position: absolute;
        top: 0%;
    }

    /*
    #ScheduleContent table tbody td:has(.Middle){
        display: flex;
    }
    */
    #ScheduleContent table tbody td .End{
        width: 100%;
        position: absolute;
        top: 0px;
    }
    /*
    #ScheduleContent table tbody td:has(.End){
        display: flex;
        align-items: flex-start;
    }
    */
    #ScheduleContent table tbody td .Start,
    #ScheduleContent table tbody td .Middle,
    #ScheduleContent table tbody td .End {
        display: block;
        min-height: 1px; /* ensures div doesn't collapse */
    }
    #ScheduleContent table tbody td .Start::after,
    #ScheduleContent table tbody td .Middle::after,
    #ScheduleContent table tbody td .End::after {
        content: "";
        display: block;
        height: 100%;
        width: 100%;
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
        width: 50px;
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

    p{
        margin: 0px;
    }
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
                        <td>
                            {String(hour).padStart(2, '0')}:00
                            {#if new Date().getHours() == hour}
                                <div class="CurrTime" style={"top: "+(new Date().getMinutes()/60*100)+"%;"}></div>
                            {/if}
                        </td>
                        {#key hour}
                            {@const schedule = selDaySchedule.find(
                                s => s && hour >= s.StartHour && hour <= s.EndHour
                            )}
                            <td>
                                {#if schedule}
                                    <div
                                        class={(hour == schedule.StartHour ? "Start":"")+" "+((hour>schedule.StartHour&&hour<schedule.EndHour) ? "Middle":"")+" "+(schedule.EndHour===hour ? "End":"")+" Schedule"}
                                        style={((hour == schedule.StartHour) ? "height: "+(schedule.StartPercent)+"%;": "") + ((hour == schedule.EndHour) ? "height: "+(schedule.EndPercent)+"%;": "")}>
                                        {#if hour == schedule.StartHour}
                                            <p style="font-size: smaller; position: absolute; top: 0px;">
                                                {String(schedule.StartHour).padStart(2, '0')}:{String(schedule.StartMin).padStart(2, '0')} -
                                                {String(schedule.EndHour).padStart(2, '0')}:{String(schedule.EndMin).padStart(2, '0')}
                                            </p>
                                        {/if}
                                    </div>
                                {/if}
                                {#each selWorkedTimes as w}
                                    {#if w && hour >= w.StartHour && ((!w.Active && hour <= w.EndHour) || (w.Active && hour <= new Date().getHours()))}
                                        <div
                                            class={(hour == w.StartHour ? "Start":"")+" "+((hour>w.StartHour&&hour<w.EndHour) ? "Middle":"")+" "+(((!w.Active && w.EndHour===hour) || (w.Active && new Date().getHours()===hour)) ? "End":"")+" WorkedTime"}
                                            style={((hour == w.StartHour) ? "height: "+(w.StartPercent)+"%;": "") + (((!w.Active && w.EndHour===hour) || (w.Active && new Date().getHours()===hour)) ? "height: "+(!w.Active ? w.EndPercent : (new Date().getMinutes() / 60 * 100))+"%;": "")}>
                                        </div>
                                    {/if}
                                {/each}
                            </td>
                        {/key}
                        {#each selDayRequest as request}
                        {#if request != null}
                        <td>
                            {#if 
                                SelectedDate.getFullYear() >= request.StartYear &&
                                SelectedDate.getFullYear() <= request.EndYear &&
                                (SelectedDate.getMonth()+1) >= request.StartMonth &&
                                (SelectedDate.getMonth()+1) <= request.EndMonth &&
                                SelectedDate.getDate() >= request.StartDay &&
                                SelectedDate.getDate() <= request.EndDay
                            }
                                <div
                                    class={
                                            ((SelectedDate.getDate() == request.StartDay && hour == request.StartHour) ? "Start" : "") + " " +
                                            (
                                                (
                                                    SelectedDate.getDate() > request.StartDay &&
                                                    SelectedDate.getDate() < request.EndDay
                                                ) ||
                                                (
                                                    (SelectedDate.getDate() == request.StartDay &&
                                                    hour > request.StartHour) && 
                                                    (SelectedDate.getDate() < request.EndDay ||
                                                    hour < request.EndHour)
                                                ) ||
                                                (
                                                    SelectedDate.getDate() == request.EndDay &&
                                                    hour < request.EndHour && 
                                                    (SelectedDate.getDate() > request.StartDay ||
                                                    hour > request.StartHour)
                                                )
                                                ? "Middle"
                                                : ""
                                            ) + " " +

                                            ((SelectedDate.getDate() == request.EndDay && hour == request.EndHour) ? "End" : "") + " ProcessedRequest"
                                        }
                                    style={
                                        ((SelectedDate.getDate() == request.StartDay && hour == request.StartHour) ? "height: "+(request.StartPercent)+"%;": "")+
                                        ((SelectedDate.getDate() == request.EndDay && hour == request.EndHour) ? "height: "+(request.EndPercent)+"%;": "")}
                                >

                                    {#if (SelectedDate.getDate() == request.StartDay && hour == request.StartHour)}
                                        <p style="font-size: smaller; position: absolute; top: 0px;">
                                            {String(request.StartHour).padStart(2, '0')}:{String(request.StartMin).padStart(2, '0')} -
                                            {String(request.EndHour).padStart(2, '0')}:{String(request.EndMin).padStart(2, '0')}: {request.RequestType}
                                        </p>
                                    {/if}

                                </div>
                            {/if}
                        </td>
                        {/if}
                        {/each}
                    </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
{:else}
    <AnimatedLoading/>
{/if}