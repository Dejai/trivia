
export default function useFileEncode(file:any, callback:any){
    var reader = new FileReader();
    reader.onloadend = () => {
        callback(reader.result)
        // let results = reader.result?.toString()
        // return results;
    }
    reader.readAsDataURL(file);

}