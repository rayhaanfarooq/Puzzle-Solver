//KEY CODES
//should clean up these hard-coded key codes
const ENTER = 13
const RIGHT_ARROW = 39
const LEFT_ARROW = 37
const UP_ARROW = 38
const DOWN_ARROW = 40


function handleKeyDown(e) {

  //console.log("keydown code = " + e.which)

  let dXY = 5; //amount to move in both X and Y direction
  if (e.which == UP_ARROW && movingBox.y >= dXY)
    movingBox.y -= dXY //up arrow
  if (e.which == RIGHT_ARROW && movingBox.x + movingBox.width + dXY <= canvas.width)
    movingBox.x += dXY //right arrow
  if (e.which == LEFT_ARROW && movingBox.x >= dXY)
    movingBox.x -= dXY //left arrow
  if (e.which == DOWN_ARROW && movingBox.y + movingBox.height + dXY <= canvas.height)
    movingBox.y += dXY //down arrow

  let keyCode = e.which
  if (keyCode == UP_ARROW | keyCode == DOWN_ARROW) {
    //prevent browser from using these with text input drop downs
    e.stopPropagation()
    e.preventDefault()
  }

}

function handleKeyUp(e) {
//  console.log("key UP: " + e.which)
  if (e.which == RIGHT_ARROW | e.which == LEFT_ARROW | e.which == UP_ARROW | e.which == DOWN_ARROW) {
    let dataObj = {
      x: movingBox.x,
      y: movingBox.y
    }
    //create a JSON string representation of the data object
    let jsonString = JSON.stringify(dataObj)
    //DO NOTHING WITH THIS DATA FOR NOW


  }
  if (e.which == ENTER) {
    handleSubmitButton() //treat ENTER key like you would a submit
    document.getElementById('userTextField').value = ''

  }

  e.stopPropagation()
  e.preventDefault()

}



let userInput = "" 

function handleGetPuzzle() {

  let userText = document.getElementById('userTextField').value
  
  if (userText && userText != '') {
    let textDiv = document.getElementById("text-area")
    textDiv.innerHTML = textDiv.innerHTML + `<p> ${userText}</p>`
    userInput = userText

    let userRequestObj = {text: userText}
    let userRequestJSON = JSON.stringify(userRequestObj)
    document.getElementById('userTextField').value = ''
    //alert ("You typed: " + userText);

    //Request words from server
    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log("data: " + this.responseText)
        console.log("typeof: " + typeof this.responseText)
        //we are expecting the response text to be a JSON string

        //Setting up puzzle words
        let responseObj = JSON.parse(this.responseText)
      

        let puzzleWords = responseObj.puzzleLines

        // Go through puzzle words 

        if(puzzleWords){
         
          let wordsArray = puzzleWords

          words = [];

          //get a colour and assign each colour to each word, each line has unique colour

          for(let i = 0; i < wordsArray.length; i++){
            let wordsplit = wordsArray[i].split(" ");
            let wordcolour = getRandomColor();


            for(let j = 0; j < wordsplit.length; j++){
              words.push({word: wordsplit[j], x: getRandomNumberX(), y: getRandomNumberY(), colour: wordcolour});
            }

          }
          
        }

        // If puzzlewords isnt a thing, send an empty array of words

        else{
          words = [];
          
        }
      
        drawCanvas()
      }

    }
    xhttp.open("POST", "userText") //API .open(METHOD, URL)
    xhttp.send(userRequestJSON) //API .send(BODY)
  }
}

//The slack provided for the words to be on the same line or not. This tended to be the best in my eyes.

function withinBounds(y1, y2){
  if(Math.abs(y1 - y2) < 10){
    return true;
  }
  else{
    return false;
  }
}

function areListsEqual(words1, words2) {
  // Check if the lengths of the lists are equal
  if (words1.length !== words2.length) {
      return false;
  }

  // Compare each element in the lists
  for (let i = 0; i < words1.length; i++) {
      if (words1[i] !== words2[i]) {
          // If any corresponding elements are not equal, return false
          return false;
      }
  }
  // If all elements are equal, return true
  return true;
}





function handleSolvePuzzle() {

  let userText = userInput
  if (userText && userText != '') {
   

    let userRequestObj = {text: userText}
    let userRequestJSON = JSON.stringify(userRequestObj)
    document.getElementById('userTextField').value = ''
    //alert ("You typed: " + userText);

    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log("data: " + this.responseText)
        console.log("typeof: " + typeof this.responseText)
        //we are expecting the response text to be a JSON string
        let responseObj = JSON.parse(this.responseText)
      

        let puzzleWords = responseObj.puzzleLines



        //Words are pushed to the screen in the order they are found, PROBLEM: Sort the words by their x and y position and everything else will be taken care of
        
        function sortWords(word1, word2){

          if(withinBounds(word1.y, word2.y)){

            if(word1.x < word2.x){
              return -1;
            }

            else{
              return 1;
            }
          }

          else{

            // since words arent on the same line the word that is higherup has the smaller y. No need to check x since they arent on the same line
            if(word1.y < word2.y){
              return -1;
            }

            else{
              return 1;
            }


          }
        }


       //Sort words in order they appear on screen
        words.sort(sortWords);
      
       
        
        
        // Nope, sort words array, all the code below this line is functional.

       
        //Adding words to the wordDictionary
         let wordDictionary = {}

          for(let i = 0; i < words.length; i++){
            let word = words[i].word;
            let ypos = words[i].y;
            let added = false

            for(let keyypos in wordDictionary){
              if(withinBounds(ypos, keyypos)){
                wordDictionary[keyypos].push(word);
                added = true
                break;
              }
            }

            if(added == false){
              wordDictionary[ypos] = [word];
            }
          }


          console.log("-----------wordDictionary-----------")
          console.log(wordDictionary);
          console.log("-----------puzzleWords-----------")
          console.log(puzzleWords);


        
        
          // create a gigantic list of strings and compare each elt to the other list

          wordString = ""
          puzzleString = ""

          for(let i = 0; i < Object.keys(wordDictionary).length; i++){
            wordString += wordDictionary[Object.keys(wordDictionary)[i]];
          }

          for(let i = 0; i < puzzleWords.length; i++){
            puzzleString += puzzleWords[i];
          }

          let color = '';

          let shrunkwords = wordString.replace(/[\s,]+/g, '')
          let shrunkpuzzle = puzzleString.replace(/[\s,]+/g, '')

          console.log(shrunkwords);
          console.log(shrunkpuzzle);

          if(shrunkwords === shrunkpuzzle){
            color = '#006400'
          }

          else{
            color = '#ff0000';
          }

          //Adding to the text is which is below the buttons
        
          let textDiv = document.getElementById("text-area")

          for(let key in wordDictionary){
            wordin = ""

            for(let i = 0; i < wordDictionary[key].length; i++){
              wordin += wordDictionary[key][i] + " ";
            }

            textDiv.innerHTML += `<p style="color: ${color};">${wordin}</p>`;
          }

      }

    }
    xhttp.open("POST", "userText") //API .open(METHOD, URL)
    xhttp.send(userRequestJSON) //API .send(BODY)
  }

  

    


}

