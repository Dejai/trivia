import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { defineStore } from 'pinia'
import { useFetch } from '@/composables/useFetch'
import Game from '@/models/Game'
import Session from '@/models/Session'
import appConfig from '@/assets/config/app.json'

export const useGamesStore = defineStore('games', () => {

  const route = useRoute()
  const filesBaseUrl = appConfig.Urls.files

  const games = ref(new Array<Game>())
  const loadedGames = ref(new Array<Game>())
  const gamesLoaded = ref(false)
  const currentGame = ref()
  const currentSession = ref(new Session({}))

  // Keeping track of changes & what needs to be saved
  const changes = ref(new Array<Date>)
  const lastSyncDate = ref(new Date())
  const newChanges = computed( () => changes.value.filter( (changeDate:Date) => changeDate > lastSyncDate.value) ?? [] )
  const toBeSaved = ref(false)
  const isSaveSuccess = ref(false)
  const isSyncing = ref(false)
  const isSaving = ref(false)
  const syncCountdown = ref(5)
  const syncNeeded = ref(false)


  // Function to load the games
  async function getGames() {
    let { data, error } = await useFetch("GET", _getFilesUrl(`/trivia/list`))
    if(data != null && error == null){
      games.value = data?.map( (game:any) => new Game(game));
      gamesLoaded.value = true;
    }
  }

  // Get the current game (based on )
  async function getCurrentGame(){
    let gameID = route.params?.gameID ?? ""
    let { data, error } = await useFetch("GET", `https://files.the-dancinglion.workers.dev/trivia/?key=${gameID}`)
    if(data != null && error == null){
      currentGame.value = new Game(data)
    }
  }

  // Set the current game
  async function setCurrentGame(gameID:string){
    let existingGame = loadedGames.value.filter( (game:any) => game.GameID == gameID )?.[0] ?? undefined
    if(existingGame){
      currentGame.value = existingGame
    } else { 
      let { data, error } = await useFetch("GET", `https://files.the-dancinglion.workers.dev/trivia/?key=${gameID}`)
      if(data != null && error == null){
        let theGame = new Game(data)
        currentGame.value = theGame
        loadedGames.value.push(theGame)
      }
    }
  }

  function setCurrentSession(){
    let sessionID = route.params?.sessionID?.toString() ?? ""
    if(sessionID != "" && currentGame.value != undefined){
      currentSession.value = currentGame.value.Sessions?.filter( (x:any) => x.Code == sessionID )?.[0] ?? undefined;
    }
  }

  // Toggle if a game save is needed
  function setGameSaveNeeded(){
    toBeSaved.value = true;
  }

  // Set sync as required if name or description changed
  function setSyncNeeded(){
    syncNeeded.value = true
  }
  
  // Save game
  async function saveGame(){
    if(toBeSaved.value){
        await _saveGame();
     }
     if(syncNeeded.value){
      _syncGames();
     }
  }

  // Post the game to be saved
  async function _saveGame(){
    let gameID = route.params?.gameID ?? ""
    let gameJson = JSON.stringify(currentGame.value)
    isSaving.value = true
    let saveUrl = _getFilesUrl(`/trivia/?key=${gameID}`)
    let { data, error } = await useFetch("POST", saveUrl, { body: gameJson });
    isSaving.value = false;
    console.log(data)
    if(data != null && error == null){
      isSaveSuccess.value = true
        setTimeout( () => {
          toBeSaved.value = false;
          isSaveSuccess.value = false;
        }, 1000)
    } else { 
      console.error(error)
    }
  }

  // Sync the games list
  async function _syncGames(){
    await useFetch("GET", "https://files.the-dancinglion.workers.dev/trivia/sync/?key=1")
    await getGames()
  }

  // Get the Files path URL to use
  function _getFilesUrl(path:string){
    path = (path.startsWith("/")) ? path.substring(1) : path
    return `${filesBaseUrl}/${path}`;
  }

  // Logged in user is admin of this game
  function isAdmin(userKey:string){
    return currentGame.value?.Admins?.includes(userKey) ?? false;
  }

  onMounted( async ()=> {
    getGames();
  })

  return { 
    gamesLoaded, currentGame, currentSession, games, toBeSaved, isSyncing, syncCountdown, isSaving, isSaveSuccess,
    getGames, setCurrentGame, getCurrentGame, setCurrentSession, setGameSaveNeeded, saveGame, setSyncNeeded, isAdmin
  }
})
