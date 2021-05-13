const hsBtn = document.getElementById("highscores");
const timer = document.getElementById("timer");
const topSec = document.getElementById("top-section");
const stTop = document.getElementById("start-top");
const midSec = document.getElementById("middle-section");
const stMid = document.getElementById("start-middle");
const btmSec = document.getElementById("bottom-section");
const stBtn = document.getElementById("start-button");
const tmSec = document.getElementById("time-section");
let gameTimer;

hsBtn.addEventListener("click",viewHighscores);

const qAndA = [
    ['Commonly used data types DO NOT include:', 'strings','booleans','alerts','numbers'],['The condition in an if/else statement is enclosed within ______.','quotes','curly brackets','parenthesis','square brackets'],
    ['Arrays in JavaScript can be used to store ______.','numbers and strings','other arrays','booleans','all of the above'],['String values must be enclosed within _____ when being assigned to variables.','commas','curly brackets','quotes','parenthesis'],['A very useful tool used during development and debugging for printing content to the debugger is:','JavaScript','terminal/bash','for loops','console.log']
];
const answers = ['alerts','parenthesis','all of the above','quotes','console.log'];

let timeRemaining = 75; 
let btmTimeRemaining = 2;
let questionsRemaining = qAndA.length;
let currentQuestion = 0;

let globalAnsVal = true;
stBtn.addEventListener("click",startQuiz);

function startQuiz(){
    timer.innerText = timeRemaining;
    setTime();
    topSec.innerHTML='';
    midSec.innerHTML='';
    btmSec.innerHTML='';
    quizGame(currentQuestion);
} 

function setTime() {
    clearInterval(timerInterval);
    var timerInterval = setInterval(function() {
        timeRemaining--;
        timer.innerText = timeRemaining;
        if(timeRemaining===0){
            clearInterval(timerInterval);
            initialsPrompt();
        }
    },1000)
    gameTimer = timerInterval;
}

function quizGame(currQ) {
    if(currQ === qAndA.length){
    initialsPrompt();
        return;
    }
    topSec.innerHTML='';
    midSec.innerHTML='';
    btmElSetTime();
    let dispQ = document.createElement('h2');
    dispQ.innerText = qAndA[currQ][0];
    topSec.appendChild(dispQ);

    let ansArr = [];
    for (let i=1; i<qAndA[currQ].length; i++){
        ansArr.push(document.createElement('button'));
        ansArr[i-1].innerText=i + '. ' + qAndA[currQ][i];
        ansArr[i-1].id = 'ans-btn-'+i;
        ansArr[i-1].value = i;
        ansArr[i-1].type = 'button'


        midSec.appendChild(ansArr[i-1]);
    }

    let ansBtns = midSec.childNodes;
            for (let j=0; j<ansBtns.length;j++){
                ansBtns[j].addEventListener("click",checkAnswer);
            }


}

function checkAnswer(e) {
    btmSec.innerText='';
    let ansNum = e.target.value;
    let correct = (qAndA[currentQuestion][ansNum]===answers[currentQuestion]);
    displayResult(correct);
    if(!correct){
        timeRemaining-=15;
    }
    currentQuestion++;
    quizGame(currentQuestion);
}   

function clearMain() {
    topSec.innerHTML='';
    midSec.innerHTML='';
    btmSec.innerHTML='';
}



function displayAnswers(qAndAElement){
    let ansArr = [];
    for (let i=1; i<qAndAElement.length; i++){
        ansArr.push(document.createElement('button'));
        ansArr[i-1].innerText=i + '. ' + qAndAElement[i];
        ansArr[i-1].id = 'ans-btn-'+i;
        ansArr[i-1].value = i;
        ansArr[i-1].type = 'button'


        midSec.appendChild(ansArr[i-1]);
    }
}

function evaluateResult(){
    let ans = event.target.value;
    displayResult(qAndA[currentQuestion][ans]===answers[currentQuestion]);
    currentQuestion++;
    clearMain();
    displayQuestion();
    let ansListeners = displayAnswers();
}

function displayResult(result) {
    let lnBrk = document.createElement('hr');
    let dispResult = document.createElement('p');
    if (result){
        dispResult.innerText='Correct!';
        globalAnsVal=true;
    } else {
        dispResult.innerText = 'Wrong!';
        globalAnsVal=false;
    }

    btmSec.appendChild(lnBrk);
    btmSec.appendChild(dispResult);
}

function btmElSetTime() {
    clearInterval(btmTimerInterval);
    var btmTimerInterval = setInterval(function() {
        btmTimeRemaining--;
        if(btmTimeRemaining===0){
            btmSec.innerHTML='';
            clearInterval(btmTimerInterval);
        }
    },1000)
}

function initialsPrompt() {
    topSec.innerText='';
    midSec.innerText='';

    let allDone = document.createElement('h2');
    allDone.innerText = 'All done!'
    topSec.appendChild(allDone);
    
    let scorePrompt = document.createElement('p');
    scorePrompt.innerText = 'You score is ' + timeRemaining;
    clearInterval(gameTimer);
    timer.innerText= timeRemaining;
    midSec.appendChild(scorePrompt);


    let form = document.createElement('form');
    let label = document.createElement('label');
    let input = document.createElement('input');
    let submit = document.createElement('button');

    label.innerText='Enter initials: ';
    input.setAttribute('type','text');
    input.setAttribute('id','initials');
    submit.setAttribute('type','submit');
    submit.innerText='Submit';

    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(submit);

    midSec.appendChild(form);


    submit.addEventListener("click",submitInitials);
}

function submitInitials(e) {
    e.preventDefault();

    let initials = document.getElementById('initials').value;

    let scoreObj = {
        userInitials:initials,
        score:timeRemaining
    }


    let scoreArr = JSON.parse(localStorage.getItem('scores'));

    if(scoreArr===null){
        scoreArr = [scoreObj];
    } else {
        scoreArr.push(scoreObj);
    }

    localStorage.setItem('scores',JSON.stringify(scoreArr));

    viewHighscores();
}

function viewHighscores() {
    hsBtn.style.display = "none";
    tmSec.style.display = "none";
    topSec.innerText ='';
    midSec.innerText='';
    btmSec.innerText='';

    let hsHeader = document.createElement('h2');
    hsHeader.innerText = 'Highscores'
    topSec.appendChild(hsHeader);

    let scoreArray = JSON.parse(localStorage.getItem('scores'));
    if(scoreArray!==null){
        for(let i=0;i<scoreArray.length;i++){
            let scoreDiv = document.createElement('div');
            scoreDiv.setAttribute('style','width:50%; text-align:left; background-color:mediumorchid; margin:3px; padding: 2px');
            scoreDiv.innerText = (i+1) + '. ' + scoreArray[i].userInitials + ' - ' + scoreArray[i].score;
            midSec.appendChild(scoreDiv);
        }
    }

    let goBack = document.createElement('button');
    let clear = document.createElement('button');

    goBack.setAttribute('type','button');
    goBack.setAttribute('id','goBackBtn');

    clear.setAttribute('type','button');
    clear.setAttribute('id','clearBtn');

    goBack.innerText='Go Back';
    clear.innerText = 'Clear Highscores'

    btmSec.appendChild(goBack);
    btmSec.appendChild(clear);


    goBack.addEventListener("click",goBackAction);
    clear.addEventListener("click", function(){
        midSec.innerText='';
        localStorage.clear('scores');
    });

}

function goBackAction() {
    location.reload();
}