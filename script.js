// Define the size of each grid space
const gridSpace = 30;

//Declare variables
let fallingPiece;
let gridPieces =[];
let lineFades = [];
let gridWorkers = [];

let currentScore = 0;
let currentLevel = 0;
let linesCleared = 0;

let ticks  = 0;
let updateEvery =15;
let updateEveryCurrent = 15;
let fallSpeed = gridSpace * 0.5;
let pauseGame = false;
let gameOver = false;

//Define the edges of game area
const gameEdgeLeft = 150;
const gameEdgeRight = 450;

//Define the colors for the pieces

const colors = [
    '#dca3ff',
    '#ff90a0',
    '#80ffb4',
    '#ff7666',
    '#70b3f5',
    '#b2e77d',
    '#ffd700',
];

// Setup function called once at beginning

function setup(){
    createCanvas(600,540);

    //Create a new falling piece
    fallingPiece = new PlayPiece();
    fallingPiece.resetPiece();

    //set the font for the text
    textFont('Ubuntu');

}

// Draw function called repeatedely
function draw(){
    //Define colors used in the game
    const colorDark = '#0d0d0d';
    const colorLight = '#304550';
    const colorBackground = '#e1eeb0'
}