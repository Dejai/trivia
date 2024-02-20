<template>
    <main>
        <h3>Session Details </h3>
        <div id="sessionForm">
            <div class="sessionFormRow hover">
                <label for="">Session Code</label> 
                <input type="text" name="sessionCode" v-model="sessionCode"/> 
                <button @click="_getNewCode">New Code</button>
            </div>
            <div class="sessionFormRow hover">
                <label for="">Session Expires</label> 
                <select name="expireMonth" id="expireMonth" v-model="expireMonth">
                    <option v-for="month in months" :value="month">{{ month }}</option>
                </select>
                <select name="expireDay" id="expireDay" v-model="expireDay">
                    <option v-for="day in days" :value="day">{{ day }}</option>
                </select>
                <input name="expireYear" id="expireYear" v-model="expireYear" type="number">
            </div>
            <SessionSetting :class="'sessionFormRow hover'" v-for="setting in sessionSettings"
                :setting="setting"
                :rules="rules"
                @change="onSettingChange"
                />
            <div class="sessionFormRow" style="padding-top:3%;">
                <div class="sessionFormActions" style="width:50%;">
                    <div>
                        <button v-if="isNewSession" @click="onAddSession">ADD SESSION</button>
                        <button v-else @click="onUpdateSession">UPDATE SESSION</button>
                        &nbsp;
                        <button @click="onCancelSessionChange">CANCEL</button> 
                    </div>
                    <div v-if="!isNewSession">
                        <button @click="onDeleteSession">DELETE</button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">

    import { onMounted, ref, computed } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useCode } from '@/composables/useCode'
    import { useDateFormat } from '@/composables/useDateFormat'
    import { useGamesStore } from '@/stores/games'
    import { useFiltersStore } from '@/stores/filters'
    import Session from '@/models/Session'
    import Setting from '@/models/Setting'
    import SessionSetting from '@/components/views/game/SessionSetting.vue'
    import rules from '@/assets/config/rules2.json'
    import { useDateParts } from '@/composables/useDateParts'

    const props = defineProps<{
        session?:Session,
        isNew?:boolean
    }>()
    const emit = defineEmits(["cancel", "save"])

    const gamesStore = useGamesStore()
    const filtersStore = useFiltersStore()
    const { currentGame } = storeToRefs(gamesStore)

    const { months, currMonth, year, days, currDay } = useDateParts()
    const expireMonth = ref( props.session?.Expires?.Month ?? currMonth)
    const expireDay = ref( props.session?.Expires?.Day ?? currDay+3) // expire in 3 days
    const expireYear = ref( props.session?.Expires?.Year ?? year)

    // Some staples to use below
    const defaultSettings = rules.map( (r:any) => new Setting({ "Name": r.Name, "Type": r.Type, "OptionID": r.Options?.[0]?.optionID ?? 1 } ) )
    let settingsMap : { [id: string] : any} = {}
    for(let setting of defaultSettings){
        settingsMap[setting?.Name] = setting
    }

    // Session form details
    const sessionCode = ref(props.session?.Code ?? "")
    const sessionSettings = ref(props.session?.Settings ?? defaultSettings )

    const isNewSession = computed( () => props.isNew )
    const gameExists = computed( () => currentGame.value != undefined )


    // Account for changes to settings
    function onSettingChange(data:any){
        settingsMap[data?.Name] = data
    }

    // Cancel making changes to a session
    function onCancelSessionChange(){
        _clearFilter()
        emit("cancel")
    }

    // Add a session
    function onAddSession(){
        if(gameExists.value){
            currentGame.value.manageSessions("add", _getSessionObj())
            _clearFilter()
            emit("save")
        }
    }

    // Update a session 
    function onUpdateSession(){
        if(gameExists.value){
            currentGame.value.manageSessions("update", _getSessionObj())
            _clearFilter()
            emit("save")
        }
    }

    // Delete a session
    function onDeleteSession(){
        let proceed = confirm("Are you sure you want to remove this session")
        if(proceed && gameExists.value){
            currentGame.value.manageSessions("delete", props.session)
            _clearFilter()
        }
    }

    // Get the added/updated session object
    function _getSessionObj(){
        let sessionObj =  {
            "Code": sessionCode.value,
            "Expires": {
                "Month": expireMonth.value,
                "Day": expireDay.value,
                "Year": expireYear.value
            },
            "Settings": Object.values(settingsMap)
        }
        return sessionObj
    }

    // Clear filter on session form 
    function _clearFilter(){
        filtersStore.clearFilter("session")
    }

    // Get a new code for this session
    function _getNewCode(){
        let { code } = useCode(4)
        sessionCode.value = code
    }

    onMounted( () => {
        if(sessionCode.value == ""){
            _getNewCode()
        }
    })

</script>

<style scoped>
    #sessionForm { display:flex; flex-direction: column; gap:10px; padding-left:5%; margin-bottom:3%; }
    .sessionFormRow { display:flex; flex-wrap: wrap; gap:10px; justify-content: left; align-items: center;  }
    /* .sessionFormRow.hover:hover { background-color:gray; color:white; cursor:pointer; } */
    .sessionFormRow label { width:15%; }
    .sessionFormActions { display:flex; flex-wrap: wrap; justify-content:space-between; align-items: center; }
</style>