
import router from '@/router'

export function useNewTab(routeObj:any){
    const routeData = router.resolve( routeObj )
    window.open(routeData.href, '_blank');
}
