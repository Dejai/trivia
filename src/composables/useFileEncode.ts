
export default async function useFileEncode(file:any, callback:any){
    var reader = new FileReader();
    reader.onloadend = () => {
        return callback(reader.result)
    }
    reader.readAsDataURL(file);
}