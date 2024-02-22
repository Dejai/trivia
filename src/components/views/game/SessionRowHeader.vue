<template>
    <main>
        <div class="sessionRowHeader flex-row flex-justify-left flex-nowrap flex-align-start" >
            <div class="column column1">
                <h3>Code</h3>
            </div>
            <div class="column column2">
                <h3>Expiration</h3>
            </div>
            <div class="column column3">
                &nbsp;
            </div>
        </div>
    </main>
</template>

<style scoped>
    .sessionRowHeader { border-bottom:1px dashed white; padding-bottom:1%; margin-bottom:1%; }
    .sessionRowHeader h3 { font-weight: bold; }
    .sessionRowHeader .column { text-align: left; }
    .sessionRowHeader .column1 { width: 20%; }
    .sessionRowHeader .column2 { width: 40%; }
    @media (min-width: 1024px) {
        .sessionRowHeader .column1 { width: 20%; }
        .sessionRowHeader .column2 { width: 40%; }
        .sessionRowHeader .column3 { display:flex; width: 90%; }
    }
</style>