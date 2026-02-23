<script>
    import { goto } from "$app/navigation";
    import backImg from "$lib/assets/back.png"
    export let backPage
</script>

<style>
    button{
        z-index: 99;
        position: absolute;
        top: 5px;
        left: 5px;
        height: 70px;
        width: 70px;
        border: 1px solid black;
        border-radius: 5px;
        background-color: lightgrey;
        font-size: large;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
    button:hover{
        background-color: darkgray;
    }
    img{
        width: 50px;
    }
</style>

<button type="button" on:click={() => goto(backPage)} title="Go to home">
    <img src="{backImg}" alt="Home">
</button>