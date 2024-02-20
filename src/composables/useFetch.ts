import { ref } from 'vue'

export async function useFetch(method:string, url:string, fetchObj:any={}){

    let data:any = null
	let error:any = null


    const responseType = _getResponseType(fetchObj);
    const fetchObject = _getFetchObject(method, fetchObj);

    // Get response type 
    function _getResponseType (fetchObj:any) {
		var responseType = "json"
		if(fetchObj.hasOwnProperty("responseType")){
			responseType = fetchObj["responseType"]
		}
		return responseType;
	}

    // Local function to make sure fetchObj is configured
    function _getFetchObject(method:string, fetchObj:any) {
		fetchObj["method"] = method;
		fetchObj["credentials"] = "include";
		if(fetchObj.hasOwnProperty("responseType")){
			delete fetchObj["responseType"]
		}
		return fetchObj;
	}

    // Get the response in a certain format
	async function _getResponseData(response:any, responseType:string) {
		var data = undefined;
		switch(responseType)
		{
			case "text":
				data = await response.text();
				break;
			case "blob":
				data = await response.blob();
				break;
			default:
				data = await response.json();
		}
		return data;
	}

    // Make the fetch call:
    await fetch(url, fetchObject)
        .then( async (res) => await _getResponseData(res, responseType) )
        .then( (responseData) => (data = responseData) )
        .catch( (err) => (error = err))

    return { data, error }
}