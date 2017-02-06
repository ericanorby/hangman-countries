$(document).ready(function(){

//object of categories that player gets to choose from
var categories = {
  africa: ["algeria","angola","benin","botswana","burkina","burundi","cameroon","cape verde","central african republic","chad","comoros","congo","djibouti","egypt","eritrea","ethiopia","gabon","gambia","ghana","guinea","ivory coast","kenya","lesotho","liberia",
  "libya","madagascar","malawi","mali","mauritania","mauritius","morocco","mozambique","namibia","niger","nigeria","rwanda","senegal","seychelles","sierra leone","somalia","south africa","south sudan","sudan",
  "swaziland","tanzania","togo","tunisia","uganda","zambia","zimbabwe"],
  asia: ["afghanistan","bahrain","bangladesh","bhutan","brunei","burma","cambodia","china","east timor","india","indonesia","iran","iraq","israel","japan","jordan","kazakhstan","north korea","south korea","kuwait","kyrgyzstan","laos","lebanon","malaysia",
"maldives","mongolia","nepal","oman","pakistan","philippines","qatar","russia","saudi arabia","singapore","sri lanka","syria","tajikistan","thailand","turkey","turkmenistan","united arab emirates","uzbekistan","vietnam","yemen"],
  europe: ["albania","andorra","armenia","austria","azerbaijan","belarus","belgium","bosnia","bulgaria","croatia","cyprus","czech republic","denmark","estonia","finland","france","georgia","germany","greece","hungary","iceland","ireland","italy","latvia",
"liechtenstein","lithuania","luxembourg","macedonia","malta","moldova","monaco","montenegro","netherlands","norway","poland","portugal","romania","san marino","serbia","slovakia","slovenia","spain","sweden","switzerland","ukraine","united kingdom"],
  "north america": ["antigua","bahamas","barbados","belize","canada","costa rica","cuba","dominica","dominican republic","el salvador","grenada","guatemala","haiti","honduras","jamaica","mexico","nicaragua","panama","saint lucia","trinidad","united states"],
  "south america": ["argentina","bolivia","brazil","chile","colombia","ecuador","guyana","paraguay","peru","suriname","uruguay","venezuela"],
  oceania: ["australia","fiji","kiribati","marshall islands","micronesia","nauru","new zealand","palau","papua new guinea","samoa","solomon islands","tonga","tuvalu","vanuatu"]
}

var chosen;
var phrase;
var letters;
var score = 6;
var lettersCompleted = 0;
var imageNumber = 0;
var streak = 0;
var cumulative = 0;
var x = 0;

//assign images into array
var images = [];
images[0] = "images/hangman0.png";
images[1] = "images/hangman1.png";
images[2] = "images/hangman2.png";
images[3] = "images/hangman3.png";
images[4] = "images/hangman4.png";
images[5] = "images/hangman5.png";
images[6] = "images/hangman6.png";

//splits phrase into an array
function createArray(){
  letters = phrase.toUpperCase().split('');
}

//creates alphabet on bottom of page
createAlphabet();

//create blank letters for each word
function createLetters(){
  var word = $("<div></div>").addClass("word")
  $("#letter-board").append(word)
  for (var i = 0; i < letters.length; i++){
    var blank = $("<div></div>").addClass("blank-letter")
    if (letters[i] != ' ') {
      $(word).append(blank)
    } else {
      var space = $("<div></div>")
      $("#letter-board").append(space)
      blank.css("border","none")
      $(space).append(blank)
      //create new word div for next word
      var word = $("<div></div>").addClass("word")
      $("#letter-board").append(word)
      lettersCompleted++
    }
  }
}

//create the alphabet board
function createAlphabet(){
  var alphabet = [];
  var letter;
  for (var i = 65; i < 91; i++) {
    letter = String.fromCharCode(i);
    alphabet.push(letter);
    var link = $("<a></a>").addClass("letter")
    $(link).attr("href","#")
    $(".alphabet").append(link)
    $(link).text(letter)
  }
}

//when a letter is clicked on
function guessedLetter(){
  event.preventDefault();
  //make the letter in the alphabet grayed out
  $(this).css("color", "lightgray")
  $(this).css("pointer-events","none")
  //if the letter clicked is included in the phrase:
    //make the letter in the phrase appear
  if (letters.indexOf($(this).text()) !== -1) {
    for (var i = 0; i <= letters.length; i++) {
      if (letters[i] == $(this).text()) {
        $(".blank-letter").eq(i).html(letters[i])
        lettersCompleted++
      }
    }
    setTimeout(winGame, 500);
  }
  //if the letter clicked is NOT included in the phrase:
    //add next piece of the skeleton
  else {
    changeImage();
    decreaseScore();
    setTimeout(loseGame, 500);
  }
}

function enterPhrase(){
  phrase = $("input").val();
  reset();
  createArray(phrase);
  createLetters();
  $(".categories").css("pointer-events","none")
}

//if player guesses incorrectly, subtract from score
function decreaseScore(){
  if (score > 0) {
    score--;
    $("#score").text(score)
  }
}

//if player loses, show notification
function loseGame(){
  if (imageNumber >= 6) {
    imageNumber = 0;
    $(".letter").css("pointer-events","none")
    $(".notification").html("<p>YOU LOSE!</p>")
    $(".notification p").css({"color":"red",
                            "font-size":"50px"})
    setTimeout(playAgain, 1000)
    streak = 0;
    $("#streak").text(streak)
    cumulative = 0;
    $("#cumulative").text(cumulative)
    fillInPuzzle();
    $(".categories").css("pointer-events","auto")
  }
}

//fill in remaining puzzle letters if player loses
function fillInPuzzle(){
  if (x < letters.length) {
    $(".blank-letter").eq(x).html(letters[x])
    setTimeout(fillInPuzzle, 80);
    x++
  }
}

//if player wins, show notification
function winGame(){
  if (lettersCompleted == letters.length){
    $(".notification").html("<p>YOU WIN!</p>")
    $(".notification p").css({"color":"green",
                            "font-size":"50px"})
    setTimeout(playAgain, 1000)
    streak++
    $("#streak").text(streak)
    cumulative = cumulative + score;
    $("#cumulative").text(cumulative)
    $(".categories").css("pointer-events","auto")
  }
}

//ask if user wants to play again
function playAgain(){
  var replayText = "<p>play again?</p>" + "<p style='font-size: 24px; padding-left: 0px'>choose a category or enter your own puzzle.</p>"
  $(".notification").append(replayText)
  $(".notification").append("<input placeholder='Type your word or phrase' maxlength='30'></input>")
  $(".notification").append("<button>Click Here</button>")
  $("button").on("click",enterPhrase)
}

//cycles through images when player guesses a wrong letter
function changeImage(){
  imageNumber++
  $(".hangman > img").attr("src", images[imageNumber])
}

//lots of toggle events!

$(".instructions").mouseenter(function(){
  $("#instructions-panel").toggle()
})
$(".instructions").mouseleave(function(){
  $("#instructions-panel").toggle()
})

$(".categories").mouseenter(function(){
  $("#categories-panel").toggle()
})

$(".categories").mouseleave(function(){
  $("#categories-panel").toggle()
})

$("#categories-panel").mouseleave(function(){
  $("#categories-panel").toggle()
})

//if a category is clicked, begin a new puzzle with a random phrase from chosen category
$("#categories-panel > a").click(startGame)

function startGame(){
  reset();
  //create variable to pick a random number from 0-9
  chosen = $(this).text()
  var random = Math.floor(Math.random() * categories[chosen].length);
  var addCategory = $(".notification").append("<p></p>")
  $(".notification p").text(chosen)
  phrase = categories[chosen][random]
  createArray(phrase);
  createLetters();
  $(".categories").css("pointer-events","none")
}

//reset board and scores if new game is selected
function reset(){
  event.preventDefault();
  lettersCompleted = 0;
  imageNumber = 0;
  score = 6;
  x = 0;
  $("#score").text(score)
  $(".letter").css("color", "black")
  $(".letter").css("pointer-events","auto")
  $(".hangman > img").attr("src", images[imageNumber])
  $("#letter-board").empty()
  $(".notification > * ").remove()
}

//when a letter of the alphabet is clicked:
$(".letter").click(guessedLetter)

//when button is clicked:
$("button").on("click",enterPhrase)

});
