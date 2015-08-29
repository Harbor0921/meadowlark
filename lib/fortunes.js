var fortunesCookies = [
	"Harbor001",
	"Harbor002",
	"Fortune!003",
	"Bingo004",
	"Guess my No.",
	"i am0006",
];
exports.getFortunes = function(){
	var idx = Math.floor(Math.random() * fortunesCookies.length);
	return fortunesCookies[idx];
}