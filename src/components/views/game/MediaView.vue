<template>
    <div>
        <h3 class="italic" style="padding-bottom:1%;" v-if="showMediaForm">
            NOTE: Only JPEG and MP3 files are allowed
        </h3>
        <div v-if="showMediaForm">
            <MediaForm/>
        </div>

        <h2>Game Media | {{ images.length }} images | {{  audios.length }} audio </h2>
        <hr/>
        <div id="gameMediaSection">
            <Image v-for="image in images"
                :key="image.Name" 
                :url="image.Url" 
                :label="image.DisplayName"
                :is-preview="true"
                />
            <Audio v-for="audio in audios"
                :key="audio.Name"
                :url="audio.Url"
                :label="audio.DisplayName"
                :is-preview="true"
                :controls="true"
                :auto-play="false"
                />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import { storeToRefs } from 'pinia'
    import { useMediaStore } from '@/stores/media'
    import { useFiltersStore } from '@/stores/filters'
    import { useFetch } from '@/composables/useFetch'
    import type Media from '@/models/Media'
    import useFileEncode from '@/composables/useFileEncode'
    import Image from '@/components/views/media/Image.vue'
    import Audio from '@/components/views/media/Audio.vue'
    import MediaForm from '@/components/views/game/MediaForm.vue'
    import appConfig from "@/assets/config/app.json"

    const mediaStore = useMediaStore()
    const { media } = storeToRefs(mediaStore)
    const filtersStore = useFiltersStore()

    const { filters } = storeToRefs(filtersStore)

    const showMediaForm = computed( () => filters.value.mediaForm )
    const images = computed( () => media.value.filter( (x:Media) => x.Type == "Image" ) )
    const audios = computed( () => media.value.filter( (x:Media) => x.Type == "Audio" ) )

    // Refresh media on loading of this tab
    onMounted( async ()=> {
        mediaStore.clearMedia()
        await mediaStore.refreshMedia()
    })
    
</script>

<style scoped>
    #gameMediaSection { display:flex; flex-wrap: wrap; gap:1%;; align-items: start; justify-content: left; max-height:740px; overflow-y: scroll; }
</style>