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

    // Set the background color
    colorBackground(colorBackground);

    // Draw the right side info panel
    fill(25);
    noStroke();
    rect(gameEdgeRight, 0, 150, height);

    //Draw the score rectangle
    fill(colorBackground)
    rect(450,80,150,70);

    // Draw the next piece rectangle
    rect(460,405,130,130,5,5);

    //draw the level rectangle
    rect(460,210,130,60,5,5);

    // Deraw the lines rectangle

    rect(460,280,130,60,5,5);

    // Draw the score lines

    fill(colorLight)
    rect(450, 85,150,20);
    rect(450,110,150,4)
    rect(450, 140, 150, 4)

    // Draw the score banner
    fill(colorBackground);
    rect(460, 60, 130, 5, 5)

    // Draw the score banner inner rectangle

    strokeWeight(3);
    noFill();
    stroke(colorLight);
    rect(465,65,120,25,5,5);

    //Draw the next piece inner rectangle
    stroke(colorLight);
    rect(465,410,120,120,5,5);

    //Draw the level inner rectangle

    rect(465,215,120,50,5,5);

    //Draw the lines inner rectangle
    rect(465,285,120,50,5,5);

    // Draw the info labels
    fill(25);
    noStroke();
    textSize(24);
    textAlign(CENTER);
    text("Score", 525, 85);
    text("Level", 525, 238);
    text("Lines", 525, 308)

    //Draw tje actual info
    textSize(24)
    textAlign(RIGHT);
    text(currentScore, 560,135);
    text(currentLevel, 560, 260);
    text(linesCleared, 560, 330);

    // Draw the game border
    stroke(colorDark)
    lineFades(gameEdgeRight,0, gameEdgeRight, height)

    // Speed up the falling piece if the down arrrow pressed

    if(keyIsDown(DOWN_ARROW)){
        updateEvery = 2;
    } else{
        updateEvery = updateEveryCurrent;
    }

    // Update game stats
    if(!pauseGame){
        ticks++;
        if (ticks >=  updateEvery){
            ticks = 0;
            fallingPiece.fall(fallSpeed);
        }
    }

    // Show the grid pieces
    for(let i = 0; i < gridPieces.length; i++ ){
        gridPieces[i].show();
    }

    //Show the fading lines
    for(let i = 0; i < lineFades.length; i++){
        lineFades[i].show();
    }
    // Process the grid workers

    if(gridWorkers.length > 0){
        gridWorkers[0].work();
    }
    

     // Explain the controls
     textAlign(CENTER);
     fill(255);
     noStroke();
     textSize(14);
     text("Controls:\n↑\n← ↓ →\n", 75, 155);
     text("Left and Right:\nmove side to side", 75, 230);
     text("Up:\nrotate", 75, 280);
     text("Down:\nfall faster", 75, 330);
     text("R:\nreset game", 75, 380);


     // Show the game over text
     if(gameOver){
        fill(colorDark);
        textSize(54);
        textAlign(CENTER)
        text("Game Over!", 300, 270);
     }

     //Draw the game border
     strokeWeight(3)
     stroke('#304550');
     noFill();
     rect(0,0, width,height);


}

// Function called when a key is pressed

function keyPressed(){
    if(keyCode === 82){
        // 'R' key
        resetGame();
    }
    if(!pauseGame){
        if(keyCode === LEFT_ARROW){
            fallingPiece.input(LEFT_ARROW);          
            
        }else if (keyCode === RIGHT_ARROW){
            fallingPiece.input(RIGHT_ARROW);
        }
        if(keyCode === UP_ARROW){
            fallingPiece.input(UP_ARROW);
        }
    }
}


// Class for the falling piece
class PlayPiece{
    constructor(){
        this.pos = createVector(0,0);
        this.rotation = 0;
        this.nextPieceType = Math.floor(Math.random() * 7);
        this.nextPieces = [];
        this.pieceType = 0;
        this.pieces = [];
        this.orientation = [];
        this.fallen = false
    }

    // Generate the next piece
    nextPiece(){
        this.nextPieceType = pseudoRandom(this.pieceType);
        this.nextPieces = [];

        const points = orientPoints(this.nextPieceType, 0);
        let xx = 525, yy = 490;

        if(this.nextPieceType !== 0 && this.nextPieceType !== 3 && this.nextPieceType !== 5){
            xx += (gridSpace * 0.5);
        }

        if(this.nextPieceType == 5){
            xx -= (gridSpace * 0.5);
        }

        for(let i = 0; i < 4; i++){
            this.nextPieces.push(new Square(xx + points[i][0] * gridSpace, yy + points[1] * gridSpace, this.nextPieceType));
        }
    }

    // Make piece fall

    fall(amount){
        if(!this.futureCollision(0, amount, this.rotation)){
            this.addPos(0, amount);
            this.fallen = true;

        }else{
            if(!this.fallen){
                pauseGame = true;
                gameOver = true;
            }else{
                this.commitShape();
            }
        }
    }

    // Reset the current piece

    resetPiece(){
        this.rotation = 0;
        this.fallen = false;
        this.pos.x = 330;
        this.pos.y = -60;

        this.pieceType = this.nextPieceType;

        this.nextPiece();
        this.newPoints();
    }

    // Generate the pointts for current piece

    newPoints(){
        const points = orientPoints(this.pieceType, this.rotation);
        this.orientation = points;
        this.pieces = [];

        for(let i = 0; i < points.length; i++){
            this.pieces.push(new Square(this.pos.x + points[i][0]* gridSpace, this.pos.y + points[i][1] * gridSpace, this.pieceType));

        }

    }
    // Update the position of the current piece
    updatePoints(){
        if(this.pieces){
            const points = orientPoints(this.pieceType, this.rotation);
            this.orientation = points;
            for (let i = 0; i < 4; i++){
                this.pieces[i].pos.x = this.pos.x + points[i][0] * gridSpace;
                this.pieces[i].pos.y = this.pos.y + points[i][1] * gridSpace;
            }
        }
    }

    // Add an offset to the position of current piece

    addPos(x, y){

        this.pos.x +=x;
        this.pos.y += y

        if( this.pieces){
            for(let i = 0; i < 4; i++){
                this.pieces[i].pos.x += x;
                this.pieces[i].pos.y += y;
            }
        }
    }

    // Check if there will be a collision in the future

    futureCollision(x,y, rotation){
        let xx, yy, points = 0;
        if(rotation !== this.rotation){
            points = orientPoints(this.pieceType, rotation)
        }

        for (let i = 0; i < this.length; i++){
            if(points){
                xx = this.pos.x + points[i][0] * gridSpace;
                yy = this.pos.y + points[i][1] * gridSpace;

            }else{
                xx = this.points[i].pos.x +x;
                yy = this.points[i].pos.y +y;
            }
            if(xx < gameEdgeLeft || xx + gridSpace > gameEdgeRight || yy + gridSpace > height){
                return true;
            }
            for( let j = 0; j < gridPieces.length; j++){
                if (xx === gridPieces[j].pos.x){
                    if(yy >= gridPieces[j].pos.y && yy < gridPieces[j].pos.y + gridSpace)
                        return true;
                }
                if(yy + gridSpace > gridPieces[j].pos.y && yy + gridPieces[j].pos.y && yy + gridSpace <= gridPieces[j].pos.y + gridSpace){
                    return true;
                }
            }
        }

    }

    //Handle user input

    input(key){
        switch(key){
            case LEFT_ARROW:
                if(!this.futureCollision(-gridPieces, 0, this.rotation)){
                    this.addPos(-gridSpace, 0)                      
                    
                }
                break;
            case RIGHT_ARROW:
                if(!this.futureCollision(gridSpace, 0, this.rotation)){
                    this.addPos(gridSpace,0);
                }
                break;
            case UP_ARROW:
                let newRotation = this.rotation + 1;
                if(newRotation > 3){
                    newRotation = 0;
                }
                if(!this.futureCollision(0,0,newRotation)){
                    this.rotation = newRotation;
                    this.updatePoints();

                }
                break;
        }
    }

    // Rotate the current piece

    rotate(){
        this.rotation +=1;
        if(this.rotation > 3){
            this.rotation=0;
        }
        this.updatePoints();


    }

    // Show current piece

    show(){
        for(let i = 0; i < this.pieces.length; i++){
            this.pieces[i].show()
        }
        for(let i = 0; i < this.nextPiece.length; i++){
            this.nextPieces[i].show();
        }
    }
    // Commit the current shape to the grid

    commitShape(){
        for (let i = 0; i < this.pieces.length; i++){
            gridPieces.push(this.pieces[i])
        }
    }



}