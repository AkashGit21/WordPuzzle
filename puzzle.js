// TODO: Generate the Trie to store the word
let DISPLAY = null;
let GRID = {rows:0, cols:0};
let LETTERS = [];
let ITEMS = [];
let FREQ = { 'e':127, 't':91, 'a':82, 'o':75, 'i':70, 'n':67, 's':63, 'h':61, 'r':60, 'd':43, 'l':40, 'c':28, 'u':28, 'm':24, 'w':24, 'f':22, 'g':20, 'y':20, 'p':19, 'b':15, 'v':10, 'k':8, 'j':2, 'x':2, 'q':1, 'z':1};
let CURRENT_WORD = "";
let VALID_WORD = false;
var SCORES = {word:0, total:0, numOfWords:0 };
let SCOREBOARD = {TIMER:null, CURRENT_WORD:null, WORD_SCORE:null, NUM_OF_WORDS:null, TOTAL_SCORE:null};
let REMAINING_TIME = 1200;

window.setInterval(setTimer, 1000);

// Starting function to be initialized at the time of loading the screen
function main() {
  DISPLAY = document.getElementById("grid-view");
  let SCORECARD = document.getElementById("score-side");

  SCOREBOARD.TIMER = SCORECARD.children[0];
  SCOREBOARD.CURRENT_WORD = SCORECARD.children[1];
  SCOREBOARD.WORD_SCORE = SCORECARD.children[2];
  SCOREBOARD.NUM_OF_WORDS = SCORECARD.children[3];
  SCOREBOARD.TOTAL_SCORE = SCORECARD.children[4];

  addEventListeners();  
  initializeLetters(10,10);
  initializeBoard();
}


/* 
  Functionalities related to Grid such as:

  Initializing the Letters
  Initializing the Grid

*/

// Initializes the letters 
function initializeLetters(rows, cols) {
  LETTERS = [];

  GRID.cols = cols;
  GRID.rows = rows;
  for (let i=0;i<GRID.rows;i++) {
    for (let j=0;j<GRID.cols;j++) {
      LETTERS.push(new Letter(i,j));
    }
  }
}

// Initializes a Board with LETTERS generated
function initializeBoard() {

  for (let i=0; i<LETTERS.length; i++) {
    tmp = LETTERS[i].getElement();
    DISPLAY.appendChild(tmp); 
  }
}

/* 
  Functionalities related to ScoreBoard such as:

  Adding Event Listeners
  Setting the Time
  Setting Values inside ScoreBoard
  Updating ScoreBoard
  Clearing the Word
  Submitting the Word
  ...

*/

// Adding event listeners
function addEventListeners() {
  DISPLAY.addEventListener("click", isPossible);
}

function setTimer() {
  if (REMAINING_TIME == 0) {
    DISPLAY.style.opacity = 0;
    window.clearInterval(setTimer);
  }
  REMAINING_TIME--;
  // console.log("Remaining: "+REMAINING_TIME);
  let currentTime = formatTime(REMAINING_TIME); 
  // console.log( "current time: "+ JSON.stringify(currentTime) );

  SCOREBOARD.TIMER.children[1].innerHTML = currentTime;
}

// Formatting the time in minutes and seconds
function formatTime(currentTime) {
  let mins = Math.floor(currentTime/60);
  let secs = currentTime%60;

  return mins+":"+secs;
}

function setInsideScoreBoard(index, value) {
  let tmp = null;
  switch (index){
    case 0:
      tmp = SCOREBOARD.CURRENT_WORD;
      break;
    case 1:
      tmp = SCOREBOARD.WORD_SCORE;
      break;
    case 2:
      tmp = SCOREBOARD.NUM_OF_WORDS;
      break;
    case 3:
      tmp = SCOREBOARD.TOTAL_SCORE;
      break;
    default:
      console.log("Something unexpected happening in the ScoreBoard!");
      break;
  }

  tmp.children[1].innerHTML = value;
}

// Updates the whole ScoreBoard according to the globals 
function updateScoreBoard() {

  setInsideScoreBoard(0,CURRENT_WORD);
  setInsideScoreBoard(1,SCORES.word);
  setInsideScoreBoard(2,SCORES.numOfWords);
  setInsideScoreBoard(3,SCORES.total);
}

function clearWord() {

  CURRENT_WORD = ""
  SCORES.word = 0
  updateScoreBoard();

  while (ITEMS.length > 0) {

    let index = ITEMS[ ITEMS.length-1 ];
    LETTERS[ index ].isVisited = false;
    DISPLAY.children[ index ].classList.remove("selected-letter");
    ITEMS.pop();
  }
}

function checkWordValidity() {

  if (CURRENT_WORD.length > 2) {
    return VALID_WORD = true;
  }
  return VALID_WORD = false;
}


// TODO: Verify the working of submitWord
function submitWord() {

  // TODO: Verify word is correct or not
  if (!checkWordValidity()) return;

  // Update the total score from word

  SCORES.total += SCORES.word
  SCORES.word = 0;
  CURRENT_WORD = "";
  SCORES.numOfWords++;

  // Disappear the characters and re-fill the grid
  // Clear the stack
  while (ITEMS.length > 0) {
    // TODO: Make the letter disappear from GRID
    let index = ITEMS[ ITEMS.length-1 ];
    // LETTERS[ index ].isVisited = false;
    // LETTERS[ index ]. 
    DISPLAY.children[ index ].classList.remove("selected-letter");
    DISPLAY.children[ index ].innerHTML = '';

    DISPLAY.children[index].classList.add("hide");

    ITEMS.pop();
  }

  // TODO: Drop the letters down
  window.setInterval( function() {
    moveDown()
    settleDown()
  }, 100); 

  // TODO: Add new letters to the 
  updateScoreBoard();
}

function settleDown() {
  for (i=0; i<99; i++) {
    DISPLAY.children[i].id = i;
  }
}

function transitLetter(from, to) {
  // DISPLAY.children[from].classList.add("hide");

  LETTERS[from].isVisited = true;
  LETTERS[to].isVisited = false;
  LETTERS[to].letter = LETTERS[from].letter;
  LETTERS[to].score = LETTERS[from].score;
  LETTERS[to].id = from;
  LETTERS[from].id = to;

  var ele1 = DISPLAY.children[from];
  var ele2 =  DISPLAY.children[to];
  var nextEle = ele2.nextElementSibling;

  ele1.replaceWith(ele2);
  DISPLAY.insertBefore(ele1, nextEle);
}

function moveDown() {

  if (!VALID_WORD) return;
  for (i=0; i<90;i++) {
    if (LETTERS[i + GRID.cols].isVisited) {

      transitLetter(i, i+GRID.cols);
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      const isFirstRow = firstRow.includes(i)
      if (isFirstRow && (LETTERS[i].isVisited)) {
        
        // Remove this piece, and insert new one
        let child = DISPLAY.children[i];
        let nextChild = child.nextElementSibling;
        DISPLAY.removeChild(child);

        LETTERS[i] = new Letter(0,i);
        DISPLAY.insertBefore(LETTERS[i].getElement(), nextChild);
      }
    }
  }
}

/* 
  Functionalities related to Gameplay such as:

  Check possibilty of letter clicked
  Adding New Letter
  Removing Previous Letter
  Checking for neighbors
*/


function isPossible(evt) {

  VALID_WORD = false;

  tmp = evt.target;
  if (tmp.childElementCount === GRID.rows*GRID.cols) return;
  if (tmp.childElementCount === 0) {
    tmp = tmp.parentNode;
  }

  let id = parseInt(tmp.id);

  // If the last element of stack is current element go for removePreviousLetter
  if (ITEMS.length > 0 && ITEMS[ ITEMS.length-1] == id){
    // console.log("Remove Previous letter!")
    removePreviousLetter();
  } else {

    // Check for neighbors only
    if (!checkForNeighbors(id)) return

    // Wrong Move: Re-visiting is not allowed
    if (LETTERS[id].isVisited) return;

    // console.log("Add new LEtter!")
    addNewLetter(tmp);
  }
  // checkWordValidity()
}

function checkForNeighbors(curr) {

  if (ITEMS.length == 0) return true;

  let prev = ITEMS[ITEMS.length-1];
  if ( Math.abs(LETTERS[curr].rowIndex - LETTERS[prev].rowIndex) > 1 ||
    Math.abs(LETTERS[curr].colIndex - LETTERS[prev].colIndex) > 1  ) 
    return false;

  return true;
}

function addNewLetter(letter) {

  let selectedLetter = letter.firstChild.data;
  let index = parseInt(letter.id);

  LETTERS[ index ].isVisited = true;
  letter.classList.add("selected-letter");

  // Add the index of this letter to stack
  ITEMS.push(index);

  CURRENT_WORD += selectedLetter;
  SCORES.word += LETTERS[index].score;
  updateScoreBoard();
}

// TODO: removes the topmost letter from stack
function removePreviousLetter(){

  let numOfItems = ITEMS.length; 
  let index = ITEMS[numOfItems-1];
  console.log(index);
  LETTERS[index].isVisited = false;
  DISPLAY.children[index].classList.remove("selected-letter");

  ITEMS.pop();

  CURRENT_WORD = CURRENT_WORD.slice(0,-1);
  SCORES.word -= LETTERS[index].score;
  updateScoreBoard();
}  



// Generates a letter randomly. 
// TODO: Use frequency table for probability of generating letters
function getRandomLetter() {
  
  letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
  var index = Math.floor( Math.random()*letters.length );
  return letters[index];
}

// Generates the score depending on character 
function getLetterScore(character) {
  let value = Math.floor(69/FREQ[character]) +1;
  if (value>10) return 10;
  return value;
}

class Letter {
  constructor(rowIndex, colIndex) {
    this.rowIndex = rowIndex;
    this.colIndex = colIndex;
    this.id = (rowIndex*GRID.rows) + colIndex;

    this.letter = getRandomLetter();
    this.score = getLetterScore(this.letter);

    this.isVisited = false;
  }

  getElement() {
    var ltr = document.createElement('div');
    ltr.setAttribute("class", "letter-box");
    ltr.classList.add("show");
    ltr.setAttribute("id",this.id);
    ltr.style.textTransform = 'uppercase';
    ltr.innerHTML = '<div class="letter-offer"></div>'+this.letter + '<div class="letter-score">'+this.score+'</div>';

    return ltr;
  }
}