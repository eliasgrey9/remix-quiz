import React, { useState, useEffect } from "react";
import style from "./styles/homepage.module.css";
import axios from "axios";

// export const meta = () => {
//   return [{ title: "App Dashboard" }];
// };

export default function Quiz() {
  interface QuestionStructure {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
  }

  //Assigning key value pairs for which screen i'd like to display by plugging keys into the quizStatus only allow 1 status to ever be true.
  const quizStatuses = {
    BEGINNING_OF_QUIZ: "BEGINNING_QUIZ",
    QUIZ_QUESTION: "QUIZ_QUESTION",
    END_OF_QUIZ: "END_OF_QUIZ",
  };
  const [questionsArray, setQuestionsArray] = useState<QuestionStructure[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndexArray] = useState(0);
  const [quizStatus, setQuizStatus] = useState(quizStatuses.BEGINNING_OF_QUIZ);

  //I will use these booleans to give my ternary operators the decision to 'display or not display'
  const isBeginningOfQuizActive: boolean =
    quizStatus === quizStatuses.BEGINNING_OF_QUIZ;
  const isQuizQuestionActive: boolean =
    quizStatus === quizStatuses.QUIZ_QUESTION;
  const isEndOfQuizActive: boolean = quizStatus === quizStatuses.END_OF_QUIZ;

  //fetch the questions once the user begins the quiz

  useEffect(() => {
    const fetchTriviaQuestions = async () => {
      const url =
        "https://opentdb.com/api.php?amount=10&difficulty=hard&type=boolean";

      try {
        const response = await axios.get(url);
        setQuestionsArray(response.data.results);
      } catch (error) {
        console.error("Error fetching trivia questions:", error);
        setQuestionsArray([]);
      }
    };

    fetchTriviaQuestions();
  }, []);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questionsArray.length - 1) {
      setCurrentQuestionIndexArray(currentQuestionIndex + 1);
    } else {
      setQuizStatus(quizStatuses.END_OF_QUIZ);
    }
  };

  const endQuiz = () => {
    setQuizStatus(quizStatuses.BEGINNING_OF_QUIZ);
    setCurrentQuestionIndexArray(0);
  };

  return (
    <div className={style.body}>
      <div className={style.quizContainer}>
        {isBeginningOfQuizActive ? (
          <div>
            Welcome to quiz app
            <button
              onClick={() => {
                setQuizStatus(quizStatuses.QUIZ_QUESTION);
              }}
            >
              Begin
            </button>
          </div>
        ) : null}
        {isQuizQuestionActive ? (
          <div>
            <h2>{questionsArray[currentQuestionIndex]?.category}</h2>
            <p>{questionsArray[currentQuestionIndex]?.question}</p>
            Render buttons for True/False answers and handle user input
            <button onClick={handleNextQuestion}>Next Question</button>
          </div>
        ) : null}

        {isEndOfQuizActive ? (
          <div>
            END OF QUIZ
            <button
              onClick={() => {
                endQuiz();
              }}
            >
              Restart?
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
