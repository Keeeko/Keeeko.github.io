var gameSearchResults;
var companyName = "No company info on record";

function findGame(){
	console.log("Test"); 
	var page = document.getElementById("inputSearch").value;
	console.log("Entered search term is: " + page);
	document.getElementById('cardArea').innerHTML = "";
	var results = makeAPIRequest(page)
}

function makeAPIRequest(searchString){

	var request = new XMLHttpRequest();

	request.open('GET', 'https://api-endpoint.igdb.com/games/?search=' + searchString + '&fields=*' + '&limit=50', true );

	request.setRequestHeader("user-key", "ef35b52d30f89b8573f2659e0c886f90");
	request.setRequestHeader("Accept", "application/json");

	request.onload = function(){
		var data = JSON.parse(this.response);
		gameSearchResults = data;

		if(request.status >= 200 && request.status < 400){

			data.forEach(game => {

				var imageUrl = "";

				if(game.hasOwnProperty('cover')){
					var imageUrl = game.cover.url.replace('//', 'https://');
					imageUrl = imageUrl.replace('t_thumb', 't_cover_big');
					
				}
				else{
					imageUrl = "https://images.igdb.com/igdb/image/upload/t_cover_big/nocover_qhhlj6.jpg";
				}

				var releaseDate = 'N/A';

				if(game.hasOwnProperty('first_release_date'))
				{
					var releaseDate = convertEpochToDate(game.first_release_date);
				}

				generateCard(game.name, game.platforms, releaseDate , imageUrl, game.id);

				
			});

			// getPlatforms();
			//Do stuff successfuly
		}else{
			console.log('Error making api request');
		}

	}

	
	
	request.send();
}

function developerToID(id){
	var request = new XMLHttpRequest();

	request.open('GET', 'https://api-endpoint.igdb.com/companies/' + id + '/', true );

	request.setRequestHeader("user-key", "ef35b52d30f89b8573f2659e0c886f90");
	request.setRequestHeader("Accept", "application/json");


	request.onload = function(){
		var data = JSON.parse(this.response);

	if(request.status >= 200 && request.status < 400){
			companyName = data[0].name;
			console.log(companyName);
			document.getElementById("developerLabel").innerHTML = "<strong>Developer -</strong> " + companyName;
		}
	}

	request.send();
}

function convertEpochToDate(time){
	var newTime = new Date(time);
	newTime = newTime.getDate() + '/' + newTime.getMonth() + '/' + newTime.getFullYear();

	return newTime;
}

function getPlatforms(){

	var request = new XMLHttpRequest();

	request.open('GET', 'https://api-endpoint.igdb.com/platforms/?fields=*', true );

	request.setRequestHeader("user-key", "ef35b52d30f89b8573f2659e0c886f90");
	request.setRequestHeader("Accept", "application/json");

	request.onload = function(){
		var data = JSON.parse(this.response);

		if(request.status >= 200 && request.status < 400){

			data.forEach(platform =>{
				// console.log(platform);
			});
		}
	}
request.send();

}

function generateCard(gameTitle, platform, releaseDate, coverArt, id){

	var resultingCard = "<div class=\"col-12 col-md-4 col-lg-3 col-sm-12 mb-4\" id=\" \">\n<div class=\"card\">\n<img class=\"card-img-top img-fluid\" src=\"" + 
	coverArt + "\" alt=\"Card image cap\">\n<div class=\"card-body\">\n<h5 class=\"card-title\">" + gameTitle + "</h5>\n<p class=\"card-text\">Year: " + releaseDate + "</p>\n<a href=\"#\" class=\"btn btn-primary btn-block\" id=\"game-" + 
	id + "\" onClick = \"populateModal("+ id +")\" data-toggle=\"modal\" data-target=\"#gameInfoModal\">View</a>\n</div>\n</div>\n</div>";


	document.getElementById('cardArea').insertAdjacentHTML('beforeend', resultingCard);


	return resultingCard;
}

function populateModal(id){

	var game = findGameById(id);        

	//Clear content that might of been left over
	document.getElementById('modal-game-content').innerHTML = "";

	console.log(gameSearchResults);
	if(game != null){
		// Set modals title to game title
		document.getElementById('modal-game-title').innerHTML = game.name;

		//Set modals body to game info
		var gameSummary = "No Summary for game on record";
		var gameStoryline = "No storyline for game on record";
		var releaseDate = "No release date on record";
		var reviewScore = 0;
		var numberOfCritics = "0";
		var coverArtPath = "https://images.igdb.com/igdb/image/upload/t_cover_big/nocover_qhhlj6.jpg";


		if(game.hasOwnProperty('cover')){
			coverArtPath = "https://images.igdb.com/igdb/image/upload/t_cover_big/" + game.cover.cloudinary_id + '.jpg';
		}

		if(game.hasOwnProperty('summary')){
			gameSummary = game.summary;
		}

		if(game.hasOwnProperty('storyline')){
			gameStoryline = game.storyline;
		}

		if(game.hasOwnProperty('developers')){
			developerToID(game.developers[0]);

		}
		else{

		}

		if(game.hasOwnProperty('first_release_date')){
			releaseDate = convertEpochToDate(game.first_release_date);
		}

		if(game.hasOwnProperty('total_rating')){
			reviewScore = Math.round(Number(game.total_rating));
		}

		if(game.hasOwnProperty('total_rating_count')){
			numberOfCritics = game.total_rating_count;
		}
		var bodyHtml = "<div class = \"container\">          <div class = \"row topRow\">            <div class=\"col-md-3 col-sm-6 img-fluid d-flex justify-content-center\" id=\"coverArt\">               <img src=\"" + 
		coverArtPath + "\" class=\"img-fluid\" alt=\"coverArt\">            </div>            <div class=\"col-md-6 col-sm-6 gameInfo\" id=\"modal-game-content\">               <P id =\"developerLabel\"><strong>Developer -</strong> " + 
		companyName + "</P>              <P><strong>Release Date -</strong> " + 
		releaseDate + "</P></div>            <div class=\"col-md-3 col-sm-6 ratingInfo\"> <p><strong> " + reviewScore + "/100 <p id=\"control-rating-review-amount\"><strong>Rating based on " + 
		numberOfCritics + " critics</strong></p>            </div>          </div>          <div class = \"row\">            <div class=\"col-12\" id=\"gameInfoBody\">              <p><strong>Summary:</strong> " + 
		gameSummary +"</p>     <p><strong>Storyline:</strong> " + 
		gameStoryline +" <p>              </div>            </div>                              </div> </div>          </div>";
		
		document.getElementById('modal-body-content').innerHTML = bodyHtml;

	}else{
		console.log("No game found with id: " + id);
	}

}

function findGameById(id){

	for(var i = 0; i < gameSearchResults.length; i++){
		if(gameSearchResults[i].id === id){
			return gameSearchResults[i];
		}
	}

	return null;
}