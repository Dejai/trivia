import { ref, computed, onMounted } from 'vue'
import { defineStore } from 'pinia'
import appConfig from '@/assets/config/app.json'
import { useFetch } from '@/composables/useFetch'

export const useAuthStore = defineStore('auth', () => {

    const authEndpoint = appConfig?.auth?.endpoint ?? ""
    const userName = ref("Guest")
    const userKey = ref("")
    const isLoggedIn = ref(false)
    const authActionText = computed( () => isLoggedIn.value ? "Log out" : "Log in")

    // Shared func to handle auth actions
    async function onAuthAction(){
        let action = isLoggedIn.value ? "logout" : "login";
        var returnPath = encodeURIComponent(location.href);
        window.open(`${authEndpoint}/${action}/?return=${returnPath}`, '_top')
    }

    // Get details about the auth session
    async function getSessionDetails() {
        const { data, error } = await useFetch("POST", `${authEndpoint}/session/active`)
        if(error == null){
            userKey.value = data?.user?.Key ?? data?.user?.key ?? "";
            userName.value = data?.user?.FirstName ?? userName.value
            isLoggedIn.value = data?.active ?? false
        }
	}

    onMounted( () => {
        getSessionDetails()
    })

  return { isLoggedIn, userName, userKey, authActionText, onAuthAction }
})
