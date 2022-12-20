
const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");

let cards;
let interval;
let firstCard = false;
let secondCard = false;

//Items array
const items = [
    {name:"laughing", image:"laughing.jpg" },
    {name:"love", image:"love.jpg" },
    {name:"smiling", image:"smiling.jpg" },
    {name:"stars", image:"stars.jpg" },
    {name:"serious", image:"serious.jpg" },
    {name:"thinking", image:"thinking.jpg" },
    {name:"angry", image:"angry.jpg" },
    {name:"crying", image:"crying.jpg" },
    {name:"Bored", image:"Bored.jpg" },
    {name:"frozen", image:"frozen.jpg" },
    {name:"quartz", image:"quartz.jpg" },
    {name:"confused", image:"confused.jpg" },
];


//Initial Time
let seconds = 0,
  minutes = 0;
  

  //Initial moves and win count
let movesCount = 0,
  winCount = 0;

  //For timer
const timeGenerator = () => {
  seconds += 1;

  //minutes logic
  if (seconds == 30) {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
    result.innerHTML=  "<h2>You lose</h2>"
  }
  
  //format time before displaying
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

//For calculating moves
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

//Pick random objects from the items array
const generateRandom = (size = 4) => {
  //temporary array
  let tempArray = [...items];
  let cardValues = [];

  //size should be double
  size = (size * size) / 2;

  //Random object selection
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  //simple shuffle
  cardValues.sort(()=> Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    
    /*Create Cards */
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-front">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
    }
  
  //Grid
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  
  //Cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      seconds = 0;

      // // If not choose any card for 30 seconds the game will stop
      
        //If selected card is not matched yet then only run
      if (!card.classList.contains("matched")) {
        
        //flip the cliked card
        card.classList.add("flipped");
        
        //if it is the firstcard
        if (!firstCard) {
          firstCard = card;
          
          //current cards value becomes firstCardValue
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          //increment moves since user selected second card
          movesCounter();
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            firstCard = false;
            
            //winCount increment as user found a correct match
            winCount += 1;
            //check if winCount ==half of cardValues
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML=  `<h2>You Won</h2> 
            <h4>Moves: ${movesCount}</h4>`;
              stopGame();
            }
          } else {
           
            //if the cards dont match and flip the cards back to normal
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

//Start game
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  //controls amd buttons visibility
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
 

  //Start timer
  interval = setInterval(timeGenerator, 1000);
 
  //initial moves
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
});

//Stop game
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);

//Initialize values
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};