<script>
    export let image;
    export let text;
</script>

<style>
    .FancyButton{
        height: 200px;
        width: 180px;
        background-color: lightgrey;
        padding: 2px;
        border: 2px solid black;
        user-select: none;
    }
    .FancyButton:hover{
        background-color: rgb(114, 114, 114);
        cursor: pointer;
    }
    .FancyButton div{
        border-bottom: 2px solid black;
        height: 70%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .FancyButton .ImgDiv img{
        width: 85%; 
        height: 85%; 
        object-fit: contain;
    }
    .FancyButton .TxtDiv{
        margin: 0px;
        height: 30%;
        text-align: center;
        font-size: medium;
    }
</style>

<button type="button" class="FancyButton" on:click>
    <div class="ImgDiv">
        <img src={image} alt="User">
    </div>
    <div class="TxtDiv">
        <p>{text}</p>
    </div>
</button>