<script>
// @ts-nocheck

    import AnimatedLoading from "$lib/Components/AnimatedLoading.svelte";
    import BackButton from "$lib/Components/BackButton.svelte";
    import { Get, GetSessionToken, Post, Put } from "$lib/DataFetcher";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    let ready = false;
    let originalUser = null;
    let user = null;
    let roles = null;
    let chosen_role = null

    let newPass = "";
    let newPassConfirm = "";
    onMount(async () => {
        await setDefault()
        
    });
    
    async function setDefault(){
        let data = await Get("self", {"session-token": GetSessionToken()});
        originalUser = {...data[0]["user"]};
        user = {...data[0]["user"]};
        chosen_role = user["role"]["role"]
        
        let roleData = await Get("roles", {"session-token": GetSessionToken()});
        roles = roleData[0]["roles"];
        
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
    <BackButton backPage="/home"/>

    <div id="Content">
        <h1>Profile Page</h1>
        <label id="UsernameLabel" for="UsernameInput">
            Username
            <input id="UsernameInput" type="text" placeholder="Username" bind:value="{user.username}">
        </label>
        <label id="NameLabel" for="NameInput">
            Name
            <input id="NameInput" type="text" placeholder="Name" bind:value={user.name}>
        </label>
        <label id="RoleLabel" for="RoleInput">
            Role
            <select id="RoleSelect" disabled bind:value={chosen_role}>
                <option value="" disabled selected>Select Role</option>
                {#each roles as role}
                    <option value="{role.role}" selected={role.role === user.role.role}>{role.role}</option>
                {/each}
            </select>
        </label>
        <p id="CreatedTime">Created at: {user.created_at}</p>
        <div id="SpacerDiv"></div>
        <label id="NewPasswordLabel" for="NewPasswordInput">
            New Password
            <input id="NewPasswordInput" type="password" placeholder="Password" bind:value={newPass}>
        </label>
        <label id="NewPasswordConfirmLabel" for="NewPasswordConfirmInput">
            New Password Again
            <input id="NewPasswordConfirmInput" type="password" placeholder="Password" bind:value={newPassConfirm}>
        </label>

        <div id="ButtonDiv">
            <button type="button" on:click={() => {update()}}>Update</button>
            <button type="button" on:click={async () => {setDefault()}}>Defaults</button>
        </div>
    </div>

{:else}
    <AnimatedLoading/>
{/if}