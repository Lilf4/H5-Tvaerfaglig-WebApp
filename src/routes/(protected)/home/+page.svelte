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
        console.log(userData)
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
        width: 90%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
</style>

{#if ready}
    <div id="HomeScreenTitle">
        <h1>Hello {name}!</h1>
    </div>

    <div id="HomeScreenButtons">
        <HomeScreenButton image={userImg} text="Profile"/>
        <HomeScreenButton image={scheduleImg} text="Schedule"/>
        <HomeScreenButton image={requestImg} text="Request"/>
        <HomeScreenButton image={checkinImg} text="Check-in/out"/>
        {#if role === 'leder'}
            <HomeScreenButton image={adminImg} text="Admin Page"/>
        {/if}
        <HomeScreenButton on:click={Logout} image={logoutImg} text="Logout"/>
    </div>
{:else}
    <AnimatedLoading/>
{/if}