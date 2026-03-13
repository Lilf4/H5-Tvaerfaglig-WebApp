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

    import { CapacitorBarcodeScanner,  CapacitorBarcodeScannerTypeHint, CapacitorBarcodeScannerCameraDirection, CapacitorBarcodeScannerAndroidScanningLibrary } from "@capacitor/barcode-scanner";
    
    let user = null;
    let name
    let role
    let ready = false
    onMount(async ()=>{
        let userData = await Get("self", {"session-token": GetSessionToken()}).then((d) => {return d[0]})
        user = userData["user"]
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

	async function ForceCheckInOut(){
        let CheckInCode = await Get("check_in_code", {"device-code": "A8Tt5OK0nb4TNFY5ttbcw4HIVVeNi1Lq"})
        let CheckInRes = await Post("check_in_out/"+user.id, null, {"check-in-code": CheckInCode[0].code})
        alert(CheckInRes[0].message)
    }

    let qrText = ""

    async function TryCheckInOut(){
        let qrData = await ScanQR()
		let CheckInRes = await Post("check_in_out/"+user.id, null, {"check-in-code": qrData})
        alert(CheckInRes[0].message)
    }

    async function ScanQR(){
        const result = await CapacitorBarcodeScanner.scanBarcode({
            hint: CapacitorBarcodeScannerTypeHint.ALL,
            cameraDirection: CapacitorBarcodeScannerCameraDirection.BACK,
            android: {
                scanningLibrary: CapacitorBarcodeScannerAndroidScanningLibrary.ZXING
            }
        });

        if (result.ScanResult) {
            return result.ScanResult
        }
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
        

        {#if data.isAndroid}
            <HomeScreenButton image={checkinImg} on:click={TryCheckInOut} text="Check-in/out"/>
        {:else}
            <HomeScreenButton image={checkinImg} on:click={ForceCheckInOut} text="Check-in/out"/>
        {/if}    
        
        {#if role === 'leder'}
            <HomeScreenButton on:click={()=>goto("/admin-page")} image={adminImg} text="Admin Page"/>
        {/if}
        <HomeScreenButton on:click={Logout} image={logoutImg} text="Logout"/>
    </div>
{:else}
    <AnimatedLoading/>
{/if}