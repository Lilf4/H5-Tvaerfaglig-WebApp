<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import AnimatedLoading from "$lib/Components/AnimatedLoading.svelte"
    import { ValidateSession, Get, GetSessionToken, Post, SetSessionToken } from "$lib/DataFetcher";
    import { goto } from "$app/navigation";
    import HomeScreenButton from "$lib/Components/HomeScreenButton.svelte";

    import userImg from "$lib/assets/user.png"
    import logoutImg from "$lib/assets/logout.png"
    import checkinImg from "$lib/assets/check-in.png"
    import requestImg from "$lib/assets/request.png"
    import scheduleImg from "$lib/assets/schedule.png"
    import adminImg from "$lib/assets/admin.png"
    import Loading from "$lib/Components/AnimatedLoading.svelte";

    let name
    let role
    let ready = false
    onMount(async ()=>{
        let userData = await Get("self", {"session-token": GetSessionToken()}).then((d) => {return d[0]})
        name = userData["user"]["name"]
        role = userData["user"]["role"]["role"]
        ready = true
    })

    function Logout(){
        Post("logout", null, {"session-token": GetSessionToken()}).then((d)=>{
            SetSessionToken("")
            ValidateSession()
        })
    }

	function ForceCheckInOut(){
		
	}

	export let data;
</script>


<style>
    #HomeScreenTitle{
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    h1{
        margin: 0px;
    }

    #HomeScreenButtons{
        margin: auto;
        margin-top: 10%;
        width: 375px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 15px;
    }
</style>

{#if ready}
    <div id="HomeScreenTitle">
        <h1>Hello {name}!</h1>
    </div>

    <div id="HomeScreenButtons">
        <HomeScreenButton on:click={()=>goto("/profile")} image={userImg} text="Profile"/>
        <HomeScreenButton on:click={()=>goto("/schedule")} image={scheduleImg} text="Schedule"/>
        <HomeScreenButton on:click={()=>goto("/request-overview")} image={requestImg} text="Request"/>
        <HomeScreenButton image={checkinImg} text="Check-in/out"/>
        {#if role === 'leder'}
            <HomeScreenButton on:click={()=>goto("/admin-page")} image={adminImg} text="Admin Page"/>
        {/if}
        <HomeScreenButton on:click={Logout} image={logoutImg} text="Logout"/>
    </div>
{:else}
    <AnimatedLoading/>
{/if}