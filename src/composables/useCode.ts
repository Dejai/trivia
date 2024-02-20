
export function useCode(length:number, type:string = "letters"){

    const reserved = [ "DEMO", "TEST" ]

    // Get a random letter
    function _getRandomLetter(){
		var characters = "abcdefghijklmnopqrstuvwxyz";
		var randChar = Math.floor(Math.random()*characters.length);
		return characters[randChar].toUpperCase();
    }

    function _getRandomDigit(){
		var digits = "0123456789";
		var randChar = Math.floor(Math.random()*digits.length);
		return digits[randChar];
	}

	function _getRandomCharacter(){
		var coin = Math.floor(Math.random()*2);
		return (coin == 1) ? _getRandomDigit() : _getRandomLetter();
	}

    let code = "";
    
    let keepTrying = true
    while(keepTrying)
    {
        code = ""
        for(var idx = 0; idx < length; idx++)
		{
			code += (type == "mix") ? _getRandomCharacter() : (type == "digits") ? _getRandomDigit() : _getRandomLetter();
		}
        // Only keep trying if the given code is reserved
        keepTrying = reserved.includes(code)
    }

    return { code }
}