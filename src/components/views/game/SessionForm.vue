<template>
    <main>
        <FormContainer>
            <FormRow>
                <label for="">Session Code</label>
                <div class="flex-row flex-gap-5">
                    <input type="text" name="sessionCode" v-model="sessionCode"/> 
                    <button @click="_getNewCode">New Code</button>
                </div>
            </FormRow>
            <FormRow>
                <label for="">Session Expires</label> 
                <div class="flex-row flex-justify-left flex-align-center flex-gap-5">
                    <select name="expireMonth" id="expireMonth" v-model="props.session.Expires.Month">
                        <option v-for="month in months" :value="month">{{ month }}</option>
                    </select>
                    <select name="expireDay" id="expireDay" v-model="props.session.Expires.Day">
                        <option v-for="day in days" :value="day">{{ day }}</option>
                    </select>
                    <input name="expireYear" id="expireYear" style="max-width:25%;" v-model="props.session.Expires.Year" type="number">
                </div>
            </FormRow>
            <SessionSetting v-for="setting in props.session?.Settings"
                :setting="setting"
                :session="props.session"
                :rules="rules"
                />
            <FormActions>
                <div>
                    <button v-if="isNewSession" class="button-round bg-color-green color-block" @click="onAddSession">ADD SESSION</button>
                    <button v-else class="button-round bg-color-blue color-white" @click="onUpdateSession">UPDATE SESSION</button>
                    &nbsp;
                    <button class="button-round color-black" @click="onCancelSessionChange">CANCEL</button> 
                </div>
                <div v-if="!isNewSession">
                    <button class="button-round bg-color-red color-white" @click="onDeleteSession">DELETE</button>
                </div>
            </FormActions>
        </FormContainer>
    </main>
</template>

<script setup lang="ts">

    import { onMounted, ref, computed } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useCode } from '@/composables/useCode'
    import { useGamesStore } from '@/stores/games'
    import { useFiltersStore } from '@/stores/filters'
    import { useDateParts } from '@/composables/useDateParts'
    import Session from '@/models/Session'
    import Setting from '@/models/Setting'
    import SessionSetting from '@/components/views/game/SessionSetting.vue'
    import FormContainer from '@/components/views/forms/FormContainer.vue'
    import FormRow from '@/components/views/forms/FormRow.vue'
    import FormActions from '@/components/views/forms/FormActions.vue'

    import rules from '@/assets/config/rules.json'

    const props = defineProps<{
        session:Session,
        isNew?:boolean
    }>()
    const emit = defineEmits(["cancel", "save"])

    const gamesStore = useGamesStore()
    const filtersStore = useFiltersStore()
    const { currentGame } = storeToRefs(gamesStore)

    const { filters } = storeToRefs(filtersStore)
    const { months, currMonth, year, days, currDay } = useDateParts()
    const expireMonth = ref( props.session?.Expires?.Month ?? currMonth)
    const expireDay = ref( props.session?.Expires?.Day ?? currDay+3) // expire in 3 days
    const expireYear = ref( props.session?.Expires?.Year ?? year)
    const sessionCode = ref(props.session?.Code ?? "")

    const isNewSession = computed( () => props.isNew )
    const gameExists = computed( () => currentGame.value != undefined )


    // Cancel making changes to a session
    function onCancelSessionChange(){
        _clearFilter()
        emit("cancel")
    }

    // Add a session
    function onAddSession(){
        if(gameExists.value){
            props.session.Code = sessionCode.value
            currentGame.value.Sessions.push(props.session)
            _clearFilter()
            emit("save")
        }
    }

    // Update a session 
    function onUpdateSession(){
        if(gameExists.value){
            props.session.Code = sessionCode.value
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
    /* .sessionFormRow label { width:15%; } */
    .sessionFormActions { display:flex; flex-wrap: wrap; justify-content:space-between; align-items: center; }
</style>