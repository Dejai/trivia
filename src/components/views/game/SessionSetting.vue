<template>
    <main>
        <label>{{  props.setting?.Name }}</label>
        <div class="selectOptions" v-if="isDropdown">
            <select v-model="optionID" @change="emitChange">
                <option v-for="option in optionList"
                    :value="option?.optionID"    
                    >
                    {{ option?.label }}
                </option>
            </select>
        </div>
        <div class="inputOptions" v-if="isTextField">
            <input :type="props.setting?.Type" v-model="textFieldValue" :placeholder="textFieldPlaceholder" @keyup="emitChange" @change="emitChange" />
        </div>
    </main>
</template>

<script setup lang="ts">

    import Setting from '@/models/Setting'
    import { onMounted, ref, computed } from 'vue'

    const props = defineProps<{
        setting?:Setting,
        rules?:any[]
    }>()

    const emit = defineEmits(["change"])

    const isDropdown = computed( () => props.setting?.Type == "select" )
    const optionList = computed( () => props.rules?.filter( (rule:any) => rule.Name == props.setting?.Name)?.[0]?.Options ?? [])
    const optionID = ref(props.setting?.OptionID)

    // For non-select fields
    const isTextField = computed( () => !isDropdown.value )
    const textFieldDefault = computed( () => optionList.value?.[0]?.default ?? undefined )
    const textFieldValue = ref(textFieldDefault)
    const textFieldPlaceholder = computed( () => optionList.value?.[0]?.label ?? "" )
    

    // Emit changes to this setting
    function emitChange(){
        emit("change", {
            "Name": props.setting?.Name,
            "Type": props.setting?.Type,
            "OptionID": optionID.value,
            "Value": textFieldValue.value
        })
    }
</script>

<style scoped>
    .sessionFormRow label { width:20%;  }
</style>