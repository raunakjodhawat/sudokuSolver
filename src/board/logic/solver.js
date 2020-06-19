class Stack {
    constructor(){ 
        this.items = []; 
    }
    push(element){ 
        this.items.push(element); 
    } 
    pop(){
        return this.items.pop();
    }
    peek() { 
        return this.items[this.items.length - 1]; 
    } 
}

class StackTrace {
    constructor(index, choice){
        this.index = index;
        this.choice = choice;
    }
}

export function solve(input){
    const board = convertInputToMatrix(input);
    const solvedBoard = solveSudoku(board);
    return convertOutputToSingleArray(solvedBoard);
}
function convertInputToMatrix(input){
    let board = new Array(9);
    let k = 0;
    for(let i=0; i<9; i++){
        board[i] = new Array(9);
        for(let j=0; j<9; j++){
            board[i][j] = input[k++];
        }
    }
    return board;
}

function convertOutputToSingleArray(board){
    let solvedBoard = [];
    for(let i=0; i<9; i++){
        for(let j=0; j<9; j++){
            solvedBoard.push(board[i][j]);
        }
    }
    return solvedBoard; 
}
function solveSudoku(board) {
    let possibilityMap = getPossibilityMap(board);
    let indexesToFill = [];
    possibilityMap.forEach((v,k) => indexesToFill.push(k));
    let st = new Stack();
    for(let i=0; i<indexesToFill.length; i++){
        let index = indexesToFill[i];
        let iIndex = Math.floor(index / 9);
        let jIndex = index % 9;
        let choices = possibilityMap.get(index);
        let choice = choices[0];
        if(board[iIndex][jIndex] === 0){
            board[iIndex][jIndex] = choice;
            let s = new StackTrace(index, board[iIndex][jIndex]);
            st.push(s);
            // console.log(index + " added to stack with value " + board[iIndex][jIndex]);
        }
        if (board[iIndex][jIndex] !== 0 && !isSudokuSolvable(board)){
            st.pop();
            let isResultFound = false;
            for(let j=choices.indexOf(choice) + 1; j <choices.length; j++){
                board[iIndex][jIndex] = choices[j];
                if(isSudokuSolvable(board)){
                    let s = new StackTrace(index, board[iIndex][jIndex]);
                    st.push(s);
                    //console.log(newIndex + " added to stack with value " + board[newIIndex][newJIndex]);
                    isResultFound = true;
                    break;
                }
            }
            if(!isResultFound){
                board[iIndex][jIndex] = 0;
                //console.log("not found" + " " + newIndex + " " + board[newIIndex][newJIndex]);
                while(!isResultFound){
                    let poppedElement = st.pop();
                    //console.log(poppedElement.index + " popped stack with value " + poppedElement.choice);
                    let currentElement = poppedElement.choice;
                    let newIndex = poppedElement.index;
                    let newChoices = possibilityMap.get(newIndex);
                    let newIIndex = Math.floor(newIndex / 9);
                    let newJIndex = newIndex % 9;
                    board[newIIndex][newJIndex] = 0;
                     for(let j=newChoices.indexOf(currentElement) + 1; j <newChoices.length; j++){
                        board[newIIndex][newJIndex] = newChoices[j];
                        //console.log("trying "+ newChoices[j] + " at " + newIndex);
                        if(isSudokuSolvable(board)){
                            let s = new StackTrace(newIndex, board[newIIndex][newJIndex]);
                            st.push(s);
                            //console.log(newIndex + " added to stack with value " + board[newIIndex][newJIndex]);
                            isResultFound = true;
                            break;
                        }
                    }
                    if(!isResultFound){
                        board[newIIndex][newJIndex] = 0;
                    }
                    i = indexesToFill.indexOf(st.peek().index);
                }
            }
        }
    }
    return board;
}


function getPossibilityMap(board){
    let possibilityMap = new Map();
    // Horizontal check
    for(let i=0; i<9; i++){
        for(let j=0; j<9; j++){
            if(board[i][j] === 0){
                
                let allPosibility = getValidSet();
                reducePossibility(board[i], allPosibility);
                possibilityMap.set(i*9 + j, allPosibility);
            }
        }
    }
    
        
    // vertical check
    for(let i=0; i<9; i++){
        let horizontal = [];
        for(let j=0; j<9; j++){
            horizontal.push(board[j][i]);
        }
        for(let k=0; k<9; k++){
            if(possibilityMap.has(k*9+i)){
                let allPosibility = possibilityMap.get(k*9+i);
                reducePossibility(horizontal, allPosibility);
                possibilityMap.set(k*9+i, allPosibility);
            }
        }
    }
        
    // matrix check
    let boundryIndexes = [0, 3, 6];
    boundryIndexes.forEach((outerStart) => {
        boundryIndexes.forEach((innerStart) => {
            let indexes = [];
            let matrix = [];
            for(let i=outerStart; i<outerStart+3; i++){
                for(let j=innerStart; j<innerStart+3; j++){
                    matrix.push(board[i][j]);
                    indexes.push(i*9 + j);
                }
            }
            indexes.forEach((index) => {
                if(possibilityMap.has(index)){
                    let allPosibility = possibilityMap.get(index);
                    reducePossibility(matrix, allPosibility);
                    possibilityMap.set(index, allPosibility);
                }
            });
        });
    });
        
    
    let returnMap = new Map();
    possibilityMap.forEach((v, k) => {
        let elements = [...v];
        returnMap.set(k, elements);
    });        
    return returnMap;
}

function reducePossibility(segment, possibilities){
    segment.forEach((c) => {
        if(possibilities.has(c))
            possibilities.delete(c);
    });
    return possibilities;
}

function isSudokuSolvable(board){
    let squareBoxes = new Map();
        
    for(let i=0; i<9; i++){
        let vertical = board[i];
        if(!isValidSegment(vertical))
            return false;
        let horizontal = [];
        for(let j=0; j< 9; j++){
            horizontal.push(board[j][i]);
            let mapLevel = Math.floor(i/3) * 3 + Math.floor(j/3);
            let boxContent = squareBoxes.get(mapLevel) ? squareBoxes.get(mapLevel): [];
            boxContent.push(board[i][j]);
            squareBoxes.set(mapLevel, boxContent);
            if(boxContent.length === 9){
                let boxes = boxContent.map(c => c);
                squareBoxes.delete(mapLevel);
                if(!isValidSegment(boxes))
                    return false;
            }
        }
        if(!isValidSegment(horizontal))
            return false;
    }
    return true;
}

function getValidSet(){
    let validSet = new Set();
    for(let i=1; i<10; i++)
        validSet.add(i);
    return validSet;
}

function isValidSegment(segment){
    let validSet = getValidSet();
    for(let i=0; i<9; i++){
        let c = segment[i];
        if(c !== 0 && validSet.has(c)){
            validSet.delete(c);
        } else if(c !== 0) {
            return false;
        }
    }
    return true;
}
