const soundStart = new Audio("sounds/Start.mp3");
const soundCorrect = new Audio("sounds/Correct.mp3");
const soundInCorrectAns = new Audio("sounds/InCorrectAns.mp3");
const soundTimeOut = new Audio("sounds/TimeOut.mp3");
const soundWinClapping = new Audio("sounds/WinClapping.mp3");
const soundLose = new Audio("sounds/Lose.mp3");

//Audio playback function with reset
function playSound(audio) {    
    audio.pause();
    audio.currentTime = 0;
    audio.play().catch(err => console.warn("Failed to play audio:", err));
}

const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector(".time_line");
const timeText = document.querySelector(".timer .time_left_text");
const timeCount = document.querySelector(".timer .timer_sec");

let timeValue = 15;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");
const next_btn = document.querySelector("footer .next_btn"); 
const bottom_ques_counter = document.querySelector("footer .total_que");


// Start Quiz
start_btn.onclick = () => {
    soundStart.currentTime = 0;
    playSound(soundStart);
    info_box.classList.add("activeInfo"); // Show info box
    console.log("Start button clicked");
};

// Exit Quiz
exit_btn.onclick = () => {
    info_box.classList.remove("activeInfo"); // Hide info box
};

// Continue Quiz
continue_btn.onclick = () => {
    soundStart.pause();
    soundStart.currentTime = 0;
    
    info_box.classList.remove("activeInfo"); // Hide info box
    quiz_box.classList.add("activeQuiz"); // Show quiz box
    showQuestions(0); // Call showQuestions function
    queCounter(1); // Pass 1 parameter to queCounter
    startTimer(15); // Call startTimer function
    startTimerLine(0); // Call startTimerLine function
};

// Restart Quiz
restart_quiz.onclick = () => {
    soundWinClapping.pause();
    soundWinClapping.currentTime = 0;
    soundLose.pause();
    soundLose.currentTime = 0;

    quiz_box.classList.add("activeQuiz"); // Show quiz
    result_box.classList.remove("activeResult"); // Hide result box
    timeValue = 15;
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    widthValue = 0;
    showQuestions(que_count); // Call showQuestions function
    queCounter(que_numb); // Pass que_numb value to queCounter
    clearInterval(counter); // Clear counter
    clearInterval(counterLine); // Clear counterLine
    startTimer(timeValue); // Call startTimer function
    startTimerLine(widthValue); // Call startTimerLine function
    timeText.textContent = "Time left"; // Change timer text
    next_btn.classList.remove("show"); // Hide next button
};

// Quit Quiz
quit_quiz.onclick = () => {
    soundWinClapping.pause();
    soundWinClapping.currentTime = 0;
    soundLose.pause();
    soundLose.currentTime = 0;

    window.location.reload(); // Reload the current window
};

// Next Question
next_btn.onclick = () => {
    if (que_count < questions.length - 1) { // If question count is less than total questions
        que_count++; // Increment the question value
        que_numb++; // Increment the question number value
        showQuestions(que_count); // Call showQuestions function
        queCounter(que_numb); // Pass que_numb value to queCounter
        clearInterval(counter); // Clear counter
        clearInterval(counterLine); // Clear counterLine
        startTimer(timeValue); // Call startTimer function
        startTimerLine(widthValue); // Call startTimerLine function
        timeText.textContent = "Time left"; // Change timer text
        next_btn.classList.remove("show"); // Hide next button
    } else {
        clearInterval(counter); // Clear counter
        clearInterval(counterLine); // Clear counterLine
        showResult(); // Call showResult function
    }
    console.log("Showing result box");
}

// Show Questions and Options
function showQuestions(index) {
    const que_text = document.querySelector(".que_text");
    let que_tag = '<span>' + questions[index].numb + ". " + questions[index].question + '</span>';
    let option_tag = '';
    questions[index].options.forEach((option, i) => {
        option_tag += '<div class="option"><span>' + option + '</span></div>';
    });
    que_text.innerHTML = que_tag; // Add new span tag
    option_list.innerHTML = option_tag; // Add new div tag

    const option = option_list.querySelectorAll(".option");
    option.forEach(opt => {
    opt.addEventListener("click", function () {
        optionSelected(this);
    });
});
}


// Icons for Correct and Incorrect Answers
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

// Option Selected
function optionSelected(answer) {
    clearInterval(counter); // Clear counter
    clearInterval(counterLine); // Clear counterLine
    let userAns = answer.textContent; // Get user selected option
    let correctAns = questions[que_count].answer; // Get correct answer
    const allOptions = option_list.children.length;

    if (userAns === correctAns) { // If selected option is correct
        userScore += 1; // Update score
        answer.classList.add("correct"); // Add green color to correct option
        playSound(soundCorrect);    //the sound for correct answer
        console.log("Correct Answer");
        console.log("Your correct answers = " + userScore);
    } else {
        answer.classList.add("incorrect"); // Add red color to incorrect option
        answer.insertAdjacentHTML("beforeend", crossIconTag); // Add cross icon
        playSound(soundInCorrectAns);   //the sound for not correct answer
        console.log("Wrong Answer");

        for (let i = 0; i < allOptions; i++) {
            if (option_list.children[i].textContent === correctAns) {
                option_list.children[i].setAttribute("class", "option correct"); // Add green color to correct option
                option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); // Add tick icon
                console.log("Auto selected correct answer.");
            }
        }
    }
    
    for (let i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled"); // Disable all options
    }
    next_btn.classList.add("show"); // Show next button
}

// Show Result
let resultShown = false;


function showResult() {
    info_box.classList.remove("activeInfo"); // Hide info box
    quiz_box.classList.remove("activeQuiz"); // Hide quiz box
    result_box.classList.add("activeResult"); // Show result box
    
    const scoreText = result_box.querySelector(".score_text");
    
    let scoreTag;
    
    if (userScore > 3) {
        scoreTag = '<span>  congrats! , you got ' + userScore + ' out of ' + questions.length + '</span>';
    } else if (userScore > 1) {
        scoreTag = '<span>  nice! , you got ' + userScore + ' out of ' + questions.length + '</span>';
    } else { scoreTag = '<span>  sorry! , you got only ' + userScore + ' out of ' + questions.length + '</span>';
    }   
    scoreText.innerHTML = scoreTag; // Add score message
    if(userScore >= questions.length / 2){
        playSound(soundWinClapping);    //winner sound
        result_box.classList.add('win');
        result_box.classList.remove('lose');
        result_box.querySelector('.icon').textContent = '🏆';
        result_box.querySelector('.complete_text').textContent = 'Congratulations! You have succeeded.🎉';
    } else {
        playSound(soundLose);     //loser sound
        result_box.classList.add('lose'); 
        result_box.classList.remove('win');
        result_box.querySelector('.icon').textContent = '😢';
        result_box.querySelector('.complete_text').textContent = 'Unfortunately, try again.😔';
    }
}

// Timer Function
function startTimer(time) {
    counter = setInterval(timer, 1000);
    function timer() {
        timeCount.textContent = time; // Update timer
        time--; // Decrement time
        if (time < 10 && time >= 0) {
        timeCount.textContent = "0" + time;
        } else {
        timeCount.textContent = time;
        }

        if (time < 0) {
        clearInterval(counter); // Clear counter
        playSound(soundTimeOut);    //the time is running out
        timeText.textContent = "Time Off"; // Change text to time off
        const allOptions = option_list.children.length;
        let correctAns = questions[que_count].answer;
        for (let i = 0; i < allOptions; i++) {
            if (option_list.children[i].textContent === correctAns) {
                option_list.children[i].setAttribute("class", "option correct");
                option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); // Add tick icon
                console.log("Time off: Auto selected Answer.");
            }
        }
            for (let i = 0; i < allOptions; i++) {
                option_list.children[i].classList.add("disabled"); // Disable all options
            }
            next_btn.classList.add("show"); // Show next button
        }
    }
}

// Timer Line Function
function startTimerLine(time) {
    counterLine = setInterval(timer, 29);
    function timer() {
        time += 1; // Increment time
        time_line.style.width = time + "px"; // Update width
        if (time > 549) {
            clearInterval(counterLine); // Clear counterLine
        }
    }
}

// Update Question Counter
function queCounter(index) {
    let totalQueCountTag = '<span>' + index + ' of ' + questions.length + ' Questions</span>';
    bottom_ques_counter.innerHTML = totalQueCountTag; // Update question count
}