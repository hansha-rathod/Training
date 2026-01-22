$(document).ready(function () {

    // -------------------------
    // Quiz Data
    // -------------------------
    const quizData = [
      {
        question: "What is 2 + 2?",
        type: "radio",
        options: ["3", "4", "5"],
        answer: "4"
      },
      {
        question: "What is the capital of India?",
        type: "text",
        answer: "new elhi"
      },
      {
        question: "Which language runs in the browser?",
        type: "radio",
        options: ["Python", "Java", "JavaScript"],
        answer: "JavaScript"
      }
      
    ];
    
  
    // -------------------------
    // State Variables
    // -------------------------
    let currentQuestionIndex = 0;
    let score = 0;
  
    // -------------------------
    // Initial Load
    // -------------------------
    loadQuestion();
  
    // -------------------------
    // Event Listeners
    // -------------------------
    $("#next-btn").on("click", function () {
      handleNext();
    });
  
    // -------------------------
    // Functions
    // -------------------------
  
    function loadQuestion() {
      // 1. Update question number
      $("#question-number").text(`Question ${currentQuestionIndex + 1}`)
      
      // 2. Update question text
      const currentQuestion = quizData[currentQuestionIndex];
      $("#question-text").text(currentQuestion.question);

      $("#answer-area").empty();
      $("#feedback").hide();

      // 3. Render input type (radio / text)
      if(currentQuestion.type === "radio"){
          renderRadioOptions(currentQuestion);
        
      } else if (currentQuestion.type === "text"){
          renderTextInput();
      }

    }

    function renderRadioOptions(q) {
      q.options.forEach((option, index) => {
        const radioHTML = `
          <div class="form-check">
            <input 
              class="form-check-input"
              type="radio"
              name="quizOption"
              id="option${index}"
              value="${option}"
            >
            <label class="form-check-label" for="option${index}">
              ${option}
            </label>
          </div>
        `;
    
        $("#answer-area").append(radioHTML);
      });
    }

    function renderTextInput() {
      const textHTML = `
        <input 
          type="text"
          id="text-answer"
          class="form-control"
          placeholder="Type your answer here"
        >
      `;
    
      $("#answer-area").html(textHTML);
    }
    
    
  
    function validateAnswer() {
      // Return true / false
      const q = quizData[currentQuestionIndex];

      if(q.type === "radio"){
        if($("input[name= 'quizOption']:checked").length === 0){
          showError("select an option");
          return false;
        }
      }
      if (q.type === "text") {
        if ($("#text-answer").val().trim().toLowerCase() === "") {
          showError("Please enter an answer");
          return false;
        }
      }
    
      $("#feedback").hide();
      return true;

    }
  
    function getUserAnswer() {
      // Read value using jQuery
      const q = quizData[currentQuestionIndex];

      if(q.type === "radio"){
        return $("input[name='quizOption']:checked").val();
      }

      if(q.type === "text"){
        return $("#text-answer").val().trim().toLowerCase();
      }
    }
  
    function checkAnswer(userAnswer) {
      // Compare with correct answer
      const correctAnswer = quizData[currentQuestionIndex].answer;
      return userAnswer === correctAnswer;
    }
  
    function showFeedback(isCorrect) {
      // Correct / Incorrect animation
      if (isCorrect) {
        $("#feedback")
          .removeClass("text-danger")
          .addClass("text-success")
          .text("Correct!")
          .fadeIn();
      } else {
        $("#feedback")
          .removeClass("text-success")
          .addClass("text-danger")
          .text("Incorrect!")
          .fadeIn();
      }
    }
  
    function handleNext() {
      // 1. Validate
      if (!validateAnswer()) return;

      // 2. Check correctness
      const userAnswer = getUserAnswer();
      const isCorrect = checkAnswer(userAnswer);

      showFeedback(isCorrect);

      // 3. Update score
      if(isCorrect){
        score++;
        $("#score").text(score);
      }
      // 4. Move to next question
      setTimeout(() => {
        currentQuestionIndex++;

        if(currentQuestionIndex < quizData.length){
          loadQuestion();
        } else{
          showFinalScore();
        }
      }, 800);
    }

    function showFinalScore(){
      $("#question-text").text("Quiz Completed!");
      $("#answer-area").html(
        `<h5>Your Score: ${score} / ${quizData.length}</h5>`
      );
      $("#feedback").hide();
      $("#next-btn").text("Restart");
      $("#next-btn").off("click").on("click", resetQuiz);
    }
  
    function resetQuiz() {
      // Reset everything
      currentQuestionIndex = 0;
      score = 0;
      $("#score").text(score);
      $("#next-btn").text("Next");
      $("#next-btn").off("click").on("click", handleNext);
      loadQuestion();
    }

    function showError(message) {
      $("#feedback")
        .removeClass("text-success")
        .addClass("text-danger")
        .text(message)
        .fadeIn();
    }
  
  });
  