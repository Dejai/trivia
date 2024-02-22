<template>
    <div>
        <FormContainer v-if="showMediaForm">
            <FormRow>
                <label>Select File</label>
                <p class="italic">Only JPEG and MP3 files allowed</p>
                <input type="file" id="mediaFileInput" name="filename" accept="image/jpeg,audio/mp3" @change="getFileDetails">
            </FormRow>
            <FormRow>
                <label for="">File Name</label>
                <input type="text" name="categoryName" placeholder="Enter a name" autocomplete="off" v-model="fileName" >
            </FormRow>
            <p>Upload Name: {{  uploadName }}</p>
            <FormActions v-if="hasFile">
                <div v-if="!isUploading">
                    <button class="bg-color-blue color-white button-round" @click="onUploadFile">UPLOAD</button>
                    &nbsp;
                    <button class="color-black button-round" @click="onCancelFileUpload">CANCEL</button> 
                </div>
                <div v-if="isUploading" class="width-100">
                    <h3>
                        <spinner-icon :label="'Uploading'" />
                    </h3>
                </div>
            </FormActions>
        </FormContainer>

        <h2>Game Media | {{ images.length }} images | {{  audios.length }} audio </h2>
        <hr/>
        <div id="gameMediaSection">
            <Image v-for="image in images"
                :key="image.Name" 
                :url="image.Url" 
                :label="image.DisplayName"
                :is-preview="true"
                />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { useRoute } from 'vue-router'
    import { storeToRefs } from 'pinia'
    import { useMediaStore } from '@/stores/media'
    import { useFiltersStore } from '@/stores/filters'
    import { useFetch } from '@/composables/useFetch'
    import type Media from '@/models/Media'
    import useFileEncode from '@/composables/useFileEncode'
    import Image from '@/components/views/media/Image.vue'
    import FormContainer from '@/components/views/forms/FormContainer.vue'
    import FormRow from '@/components/views/forms/FormRow.vue'
    import FormActions from '@/components/views/forms/FormActions.vue'
    import SpinnerIcon from '@/components/icons/FontAwesome/SpinnerIcon.vue'
    import appConfig from "@/assets/config/app.json"

    const mediaStore = useMediaStore()
    const filtersStore = useFiltersStore()
    const { media } = storeToRefs(mediaStore)
    const { filters } = storeToRefs(filtersStore)

    const route = useRoute()
    const gameID = route.params.gameID ?? ""

    const isUploading = ref(false)
    const fileName = ref("")

    const fileExt = ref("")
    const uploadName = computed( () => fileName.value.toString().replace(/\s/g, "_").toLocaleLowerCase() + fileExt.value )
    const uploadFileName = computed ( () => `${gameID}_${uploadName.value}`)
    const showMediaForm = computed( () => filters.value.mediaForm )
    const hasFile = computed( () => fileName.value != "")

    const images = computed( () => media.value.filter( (x:Media) => x.Type == "Image" ) )
    const audios = computed( () => media.value.filter( (x:Media) => x.Type == "Audio" ) )

    // Get the uploaded file
    function getUploadedFile(){
        let fileInput = document.getElementById("mediaFileInput") as HTMLInputElement;
        let file = fileInput?.files?.[0] ?? undefined
        return file;
    }

    function getFileDetails(){
        let file = getUploadedFile();
        if(file != undefined){
            let fName = file.name?.toLocaleLowerCase()
            let dotIdx = fName.indexOf(".")
            dotIdx = (dotIdx == -1) ? fName.length : dotIdx;
            fileExt.value = fName?.substring(dotIdx) ?? ""
            fileName.value = fName?.substring(0,dotIdx)
        }
    }

    // Get the content type for the file
    function _getContentType(){
        switch(fileExt.value){
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
        let file = getUploadedFile()
        let contentType = _getContentType()
        if(file != undefined && contentType != ""){
            isUploading.value = true;
            useFileEncode(file, async (fileString:any) => {
                let { data, error } = await useFetch("POST", `${appConfig.Urls.files}/trivia/media/?key=${uploadFileName.value}`, { body: fileString } )
                isUploading.value = false;
                if(data?.status == 200){
                    isUploading.value = false;
                    filtersStore.clearFilter("mediaForm")
                    fileName.value = ""
                    fileExt.value = ""
                    await mediaStore.refreshMedia()
                } else { 
                    console.error(error);
                }
            })
            
        }
        
    }

    function onCancelFileUpload(){
        filtersStore.clearFilter("mediaForm")
    }
</script>

<style scoped>
    #gameMediaSection { display:flex; flex-wrap: wrap; gap:1%;; align-items: start; justify-content: left; max-height:740px; overflow-y: scroll; }
</style>