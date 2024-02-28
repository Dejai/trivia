// Helper to stringify json, but ignore private properties

export function useJsonStringify(data:any){
    const ignorePrivateProperties = (key:string, value:string) => {
        return (key.startsWith("_")) ? undefined : value
    }
    return JSON.stringify(data, ignorePrivateProperties)
}
