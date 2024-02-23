import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { defineStore } from 'pinia'
import { useFetch } from '@/composables/useFetch'
import Game from '@/models/Game'
import Media from '@/models/Media'
import appConfig from '@/assets/config/app.json'

export const useMediaStore = defineStore('media', () => {

  const route = useRoute()

  const media = ref(new Array<Media>())
  const mediaLoaded = ref(false)
  const mediaUrl = appConfig.Urls.media;

  // Function to load the games
  async function getMedia() {
    let gameID = route.params?.gameID ?? ""
    let { data, error } = await useFetch("GET", `https://files.the-dancinglion.workers.dev/trivia/media/?key=${gameID}`)
    if(data != null && error == null){
        media.value = data?.map( (media:any) => new Media( {Name: media, GameID:gameID, Url: getMediaURL(media) } ));
        mediaLoaded.value = true;
    }
  }

  // Get media url
  function getMediaURL(mediaName?:string){
    if(mediaName == undefined || mediaName == ""){
      return ""
    }
    return `${mediaUrl}/${mediaName}`
  }

  // Clear out media stored (in case navigating between games)
  function clearMedia(){
    media.value = new Array<Media>()
  }

  // Refresh the game media
  async function refreshMedia(){
    await getMedia()
  }

  onMounted( async ()=> {
    getMedia()
  })

  return { media, getMediaURL, refreshMedia, clearMedia }
})
