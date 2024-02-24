<template>
    <div>
        <FormContainer >
            <FormRow class="form-column form-justify-left form-align-center form-gap-10">
                <label>Select File</label>
                <input type="file" id="mediaFileInput" name="filename" accept="image/jpeg,audio/mp3"  @change="onFilesSelected" multiple/>
            </FormRow>
            <FormActions >
                <div v-if="!isUploading">
                    <button class="bg-color-blue color-white button-round" @click="onUploadFile" v-if="showUploadButton">UPLOAD</button>
                    &nbsp;
                    <button class="color-black button-round" @click="onCancelFileUpload">CANCEL</button> 
                </div>
                <div v-if="isUploading" class="width-100">
                    <h3>
                        Uploading <spinner-icon/> {{ currentUploadIndex }} of {{  totalBeingUploaded }}
                    </h3>
                </div>
            </FormActions>
        </FormContainer>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import { storeToRefs } from 'pinia'
    import { useMediaStore } from '@/stores/media'
    import { useFiltersStore } from '@/stores/filters'
    import { useFetch } from '@/composables/useFetch'
    import useFileEncode from '@/composables/useFileEncode'
    import FormContainer from '@/components/views/forms/FormContainer.vue'
    import FormRow from '@/components/views/forms/FormRow.vue'
    import FormActions from '@/components/views/forms/FormActions.vue'
    import SpinnerIcon from '@/components/icons/FontAwesome/SpinnerIcon.vue'
    import appConfig from "@/assets/config/app.json"

    const mediaStore = useMediaStore()
    const filtersStore = useFiltersStore()
    const route = useRoute()

    const gameID = route.params.gameID ?? ""
    const isUploading = ref(false)
    const showUploadButton = ref(false)

    const totalBeingUploaded = ref(0)
    const currentUploadIndex = ref(0)
    
    // Get the uploaded file
    function getUploadedFiles(){
        let fileInput = document.getElementById("mediaFileInput") as HTMLInputElement;
        return fileInput?.files ?? []
    }

    function onFilesSelected(){
        let files = getUploadedFiles()
        showUploadButton.value = files.length > 0
    }

    // Get the content type for the file
    function _getContentType(fileName:string){
        let fName = fileName?.toLowerCase()
        let dotIdx = fName.indexOf(".")
        let fileExt = fName?.substring(dotIdx) ?? ""
        switch(fileExt){
            case ".png":
            case ".jpg":
            case ".jpeg":
                return "image/png"
            case ".mp3":
                return "audio/mpeg"
            default:
                return ""
        }
    }

    async function onUploadFile(){
        let files = getUploadedFiles()
        totalBeingUploaded.value = files.length
        isUploading.value = true;

        for(let file of files){
            let contentType = _getContentType(file.name)
            if(contentType != ""){
                let cleanName = file.name.toString().replace(/\s/g, "_").toLowerCase()
                let uploadFileName = `${gameID}_${cleanName}`
                await useFileEncode(file, async (fileString:any) => {
                    let { data, error } = await useFetch("POST", `${appConfig.Urls.files}/trivia/media/?key=${uploadFileName}`, { body: fileString } )
                    if(data?.status == 200){
                        currentUploadIndex.value++

                        if(currentUploadIndex.value == totalBeingUploaded.value){
                            isUploading.value = false;
                            filtersStore.clearFilter("mediaForm")
                            await mediaStore.refreshMedia()
                        }
                    } else { 
                        console.error(error);
                    }
                });
            }
        }
    }

    function onCancelFileUpload(){
        filtersStore.clearFilter("mediaForm")
    }
</script>