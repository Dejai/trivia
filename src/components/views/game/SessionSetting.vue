<template>
    <FormRow>
        <label>{{  props.setting?.Name }}</label>
        <div class="selectOptions" v-if="isDropdown">
            <select v-model="props.setting.OptionID">
                <option v-for="option in optionList"
                    :value="option?.optionID">
                    {{ option?.label }}
                </option>
            </select>
        </div>
        <div class="inputOptions" v-if="isTextField">
            <input :type="props.setting?.Type" v-model="props.setting.Value" :placeholder="textFieldPlaceholder" />
        </div>
    </FormRow>
</template>

<script setup lang="ts">

    import Setting from '@/models/Setting'
    import Session from '@/models/Session'
    import { computed } from 'vue'
    import FormRow from '@/components/views/forms/FormRow.vue'

    const props = defineProps<{
        session:Session,
        setting:Setting,
        rules?:any[]
    }>()

    const emit = defineEmits(["change"])

    const isDropdown = computed( () => props.setting?.Type == "select" )
    const optionList = computed( () => props.rules?.filter( (rule:any) => rule.Name == props.setting?.Name)?.[0]?.Options ?? [])

    // For non-select fields
    const isTextField = computed( () => !isDropdown.value )
    const textFieldDefault = computed( () => optionList.value?.[0]?.default ?? undefined )
    const textFieldPlaceholder = computed( () => optionList.value?.[0]?.label ?? "" )

</script>

<style scoped>
    .sessionFormRow label { width:20%;  }
</style>