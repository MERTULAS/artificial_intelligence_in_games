let canvas = document.getElementById("canvas1");
let canvasBoundingRect = canvas.getBoundingClientRect()
canvas.width = canvasBoundingRect.width;
canvas.height = canvasBoundingRect.height;
let ctx = canvas.getContext("2d");
let botImg = new Image();
let mudImg = new Image();
botImg.src = "robot2.png";
mudImg.src = "mud.png";

let layout = [[1, 0, 0, 1, 0, 0, 0, 1],
              [1, 1, 0, 1, 0, 0, 1, 0],
              [1, 1, 1, 0, 0, 0, 0, 0],
              [1, 0, 1, 0, 0, 0, 1, 0],
              [1, 0, 1, 0, 0, 1, 0, 1],
              [1, 0, 1, 1, 1, 0, 0, 0],
              [1, 0, 0, 0, 1, 0, 1, 0], 
              [1, 0, 0, 1, 0, 0, 1, 0]];

class Board
{
    constructor(layout, canvasBoundingRect, bot)
    {
        this.layout = layout;
        this.mapLayoutX = canvasBoundingRect.x;
        this.mapLayoutY = canvasBoundingRect.y;
        this.row = this.layout.length;
        this.column = this.row;
        this.gridSize = canvasBoundingRect.width / this.row;
        this.botClass = bot;
        this.mostCloseIndexes = [];
    }

    create()
    {
        let min = 100;
        ctx.strokeStyle = "gray";
        ctx.fillStyle = "rgb(33, 33, 33)";
        ctx.fill();
        for(let i = 0; i < this.row; i++){
            for(let j = 0; j < this.column; j++){
                ctx.beginPath();
                if (this.layout[i][j] == 1)
                {
                    //ctx.rect(j * this.gridSize, i * this.gridSize, this.gridSize, this.gridSize);
                    ctx.drawImage(mudImg, j * this.gridSize, i * this.gridSize);
                    let distance = Math.abs(bot.row - i) + Math.abs(bot.column - j);
                    if (distance < min)
                    {
                        this.mostCloseIndexes = [i, j];
                        min = distance;
                    }
                }
                //ctx.rect(j * this.gridSize, i * this.gridSize, this.gridSize, this.gridSize);
                ctx.stroke();
            }
        }
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.rect(0, 0, 480, 480);
        ctx.stroke();
    }

    addDirt(mousePosition)
    {
        let x = mousePosition[0] - this.mapLayoutX;
        let y = mousePosition[1] - this.mapLayoutY;
        let iRow = parseInt(y / 60);
        let jColumn = parseInt(x / 60); 
        this.layout[iRow][jColumn] = this.layout[iRow][jColumn] == 0 ? 1 : 0;
        this.create();
        this.botClass.create();
    }
}

class Bot
{
    constructor(botImg, position, gridSize)
    {
        this.row = position[0];
        this.column = position[1];
        this.botImg = botImg;
        this.botSize = botImg.width;
        this.gridSize = gridSize;
    }
    
    create()
    {
        let x = ((this.gridSize - this.botSize) / 2) + this.column * this.gridSize;
        let y = ((this.gridSize - this.botSize) / 2) + this.row * this.gridSize;
        ctx.drawImage(this.botImg, x, y);
    }

    move(direction)
    {
        switch(direction)
        {
            case "UP":
                this.row--;
                break;
            case "DOWN":
                this.row++;
                break;
            case "LEFT":
                this.column--;
                break;
            case "RIGHT":
                this.column++;
                break;
        }
    }
}

let position = [Math.floor(Math.random() * 7), Math.floor(Math.random() * 7)];
let bot = new Bot(botImg, position, 60);
let board = new Board(layout, canvasBoundingRect, bot);

let cleanerBot = () => {
    if (board.mostCloseIndexes[0] < bot.row) bot.move("UP");
    if (board.mostCloseIndexes[0] > bot.row) bot.move("DOWN");
    if (board.mostCloseIndexes[1] > bot.column) bot.move("RIGHT");
    if (board.mostCloseIndexes[1] < bot.column) bot.move("LEFT");
    if (board.mostCloseIndexes[0] == bot.row && board.mostCloseIndexes[1] == 
        bot.column) board.layout[board.mostCloseIndexes[0]][board.mostCloseIndexes[1]] = 0;
    board.create();
    bot.create();
};

setInterval(cleanerBot, 100);

    botImg.onload = () => {
        board.create();
        bot.create();
        cleanerBot();
    };

canvas.addEventListener("click", (e) => {
    let mouse = [e.x, e.y];
    board.addDirt(mouse);
});
