/*
Javascript example using an html <canvas> as the main
app client area.
The application illustrates:
-handling mouse dragging and release
to drag a strings around on the html canvas
-Keyboard arrow keys are used to move a moving box around

Here we are doing all the work with javascript.
(none of the words are HTML, or DOM, elements.
The only DOM element is just the canvas on which
where are drawing and a text field and button where the
user can type data

Mouse event handlers are being added and removed.

Keyboard keyDown handler is being used to move a "moving box" around
Keyboard keyUP handler is used to trigger communication with the
server via POST message sending JSON data

*/


let timer //used for the motion animation

const canvas = document.getElementById('canvas1') //our drawing canvas


function getRandomColor() {
  //source: https://stackoverflow.com/questions/1484506/random-color-generator
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}



//DATA MODELS
//Use javascript array of objects to represent words and their locations
let words = []


let wordTall = 0
let wordWide = 0


// Gets word at location
function getWordAtLocation(aCanvasX, aCanvasY) {

  for (let i = 0; i < words.length; i++) {
    for (let i = 0; i < words.length; i++) {
      
      let word = words[i];
      let context = canvas.getContext('2d');
  
     
      let letter = context.measureText(word.word);
      let wordWidth = letter.width;
      let wordHeight = parseInt(context.font); 
      wordTall = wordHeight
      wordWide = wordWidth

      if (
        aCanvasX >= word.x &&
        aCanvasX <= word.x + wordWidth &&
        aCanvasY >= word.y - wordHeight && 
        aCanvasY <= word.y
      ) {
        return word; 
      }
    }
  
    return null; 
  }
}


//Setting bounds for Y
function getRandomNumberY(){
  let min = 0
  let max = canvas.height-wordTall
  console.log("Canvas Height: " + canvas.height)
  let number = Math.random() * (max - min) + min;
  return number;
}

//Setting bounds for X

function getRandomNumberX(){
  let min = 0
  let max = canvas.width-wordWide
  console.log("Canvas Width: " + canvas.width)
  let number = Math.random() * (max - min) + min;
  return number;
}


function drawCanvas() {
  /*
  Call this function whenever the canvas needs to be redrawn.
  */

  const context = canvas.getContext('2d')

  context.fillStyle = 'white'
  context.fillRect(0, 0, canvas.width, canvas.height) //erase canvas

  context.font = '20pt Arial'
  context.fillStyle = 'cornflowerblue'
  context.strokeStyle = 'blue'

  for (let i = 0; i < words.length; i++) {

    let data = words[i]
    if(data.colour){
      context.fillStyle = data.colour
      context.strokeStyle = data.colour

    }

    context.fillText(data.word, data.x, data.y)
    context.strokeText(data.word, data.x, data.y)

  }
  //reset fill colour for text
  context.fillStyle = 'cornflowerblue'
  context.strokeStyle = 'blue'

}
