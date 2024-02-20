<template>
    <main id="modalContainer">
        <div id="modalBlock">
            <slot name="header">
                <p>&nbsp;</p>
            </slot>
            <slot name="body">
                <p>&nbsp;</p>
            </slot>
            <slot name="footer">
                <p>&nbsp;</p>
            </slot>
        </div>
    </main>
</template>

<style>
    #modalContainer { 
        position: absolute;
        z-index: 1000;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #modalBlock { 
        border: 1px solid gray; 
        background-color:lightgray; 
        border-radius: 77px;
        width:45%;
        min-height:240px;
        display:flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
    }   

    .boardModal{ 
        position: absolute;
        z-index: 1000;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>