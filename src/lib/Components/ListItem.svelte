<script>
    export let text;
</script>

<style>
    button{
        border: 1px solid black;
        min-height: 40px;
        cursor: pointer;
        font-size: larger;
    }
    p{
        margin: 0px;
    }
</style>

<button type="button" on:click>
    <p>{text}</p>
</button>