<script>
// @ts-nocheck
    import { goto } from "$app/navigation";
    import { Post, SetSessionToken } from "$lib/DataFetcher";

    let Username
    let Password
    let ErrorText
    let HideError = true
    function Login(){
        Post(
            "login", 
            {"username": Username, "password": Password}
        ).then((d) => {
            console.log(d)
            if (d[1] != 200){
                ErrorText = d[0]["message"]
                HideError = false
            }
            else{
                SetSessionToken(d[0]["session_token"])
                goto("/home")
            }
        })
    }
</script>

<style>
    #Content{
        display: flex;
        flex-direction: column;
        width: 100%;
        position: absolute;
        justify-content: center;
        align-items: center;
        top: 0px;
        bottom: 0px;
        gap: 50px;
    }
    #Title h1{
        margin: 0px;
    }
    #Inputs{
        height: 100px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 50%;
        gap: 5px;
    }
    #Inputs input{
        height: 25px;
        font-size: large;
    }
    #Button{
        width: 40%;
        display: flex;
        justify-content: center;
    }
    #Button input{
        width: 100%;
        height: 50px;
        font-size: large;
    }
    #ErrorText{
        color: rgb(151, 0, 0);
    }
</style>

<div id=Content>
    <div id="Title">
        <h1>Login</h1>
    </div>
    <div id="Inputs">
        <input type="text" id=UsernameInput placeholder="username" tabindex="0" bind:value={Username}>
        <input type="password" id=PasswordInput placeholder="password" tabindex="0" bind:value={Password}>
        {#if !HideError}
            <p id="ErrorText">{ErrorText}</p>
        {/if}
    </div>
    <div id="Button">
        <input type="button" value="Login" on:click={Login} tabindex="0">
    </div>
</div>