class CookieObj{
    Name:string;
    Value:string;
    constructor(cookieString:string){
			let cookiePair = cookieString.split("=");
			this.Name = (cookiePair[0] ?? "").trim();
			this.Value = (cookiePair[1] ?? "").trim();
    }
}

export function useCookie(action:string, cookieName:string, cookieValue:string="", attributes:any ={}){

    // Get a cookie by name
	const _getCookie = () => {
		// Get all the cookies; Split up into list
		let decodedCookies = decodeURIComponent(document.cookie);
		let cookieList = decodedCookies.split(";");
        let cookies = cookieList.map( (cookieString:string) => new CookieObj(cookieString))
        let match = cookies.filter( (cookie:CookieObj) => cookie.Name === cookieName)?.[0] ?? new CookieObj("");
        cookieValue = match?.Value ?? ""
        return match;
	}

	// Set a cookie; Expiration provided in minutes;
	const _setCookie = () => { 
		// Base cookie;
		var cookie = `${cookieName}=${cookieValue}`;

		// If no path is specified, default to /
		if(!attributes.hasOwnProperty("path")){
			attributes["path"] = "/"
		}

		// Loop through any attributes and set them as well;
		Object.keys(attributes)?.forEach( (key)=> {
			var val = attributes[key];
			var attr = ` ; ${key}=${val}`;
			cookie += attr;
		});

		// Set the cookie
		document.cookie = cookie;
	}

	// "Delete" a cookie by expiring it
	const _deleteCookie = () => {
        attributes["Max-Age"] = 0;
        cookieValue = ""
        _setCookie()
	}

	// Get an expiration date based on mins
	const _getExpirationDate = (mins:number) => { 
		var expDate = "";
		if(mins != undefined){
			var expirationDate = new Date();
			expirationDate.setTime(expirationDate.getTime() + (mins*60000)); // 60,000 milliseconds seconds a minute;
			var utcDate = expirationDate.toUTCString();
			expDate = `${utcDate};`;
		}
		return expDate;
	}

    // Switch on the given action & do the related cookie thing
    switch(action){
        case "add":
        case "set":
            _setCookie();
            return cookieName
        case "remove":
        case "delete":
            _deleteCookie();
            return cookieName;
        case "get":
            _getCookie();
            return cookieValue;
        default:
            return cookieName;
    }
}