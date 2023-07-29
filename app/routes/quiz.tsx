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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizStatus, setQuizStatus] = useState(quizStatuses.BEGINNING_OF_QUIZ);
  const [correctAnswersIndexes, setCorrectAnswersIndexes] = useState<
    Array<Number>
  >([]);
  const [incorrectAnswersIndexes, setIncorrectAnswersIndexes] = useState<
    Array<Number>
  >([]);

  //I will use these booleans to give my ternary operators the decision to 'display or not display'
  const isBeginningOfQuizActive: boolean =
    quizStatus === quizStatuses.BEGINNING_OF_QUIZ;
  const isQuizQuestionActive: boolean =
    quizStatus === quizStatuses.QUIZ_QUESTION;
  const isEndOfQuizActive: boolean = quizStatus === quizStatuses.END_OF_QUIZ;

  //fetch the questions once the page loads
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

  const handleAnswer = (bool: string) => {
    if (questionsArray[currentQuestionIndex].correct_answer === bool) {
      setCorrectAnswersIndexes((arr) => [...arr, currentQuestionIndex]);
    } else {
      setIncorrectAnswersIndexes((arr) => [...arr, currentQuestionIndex]);
    }
    if (currentQuestionIndex < questionsArray.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizStatus(quizStatuses.END_OF_QUIZ);
    }
  };

  const endQuiz = () => {
    setQuizStatus(quizStatuses.BEGINNING_OF_QUIZ);
    setCurrentQuestionIndex(0);
    setCorrectAnswersIndexes([]);
    setIncorrectAnswersIndexes([]);
  };
  console.log("Correct IDX", correctAnswersIndexes);
  console.log("Incorrect IDX", incorrectAnswersIndexes);
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
            <button onClick={() => handleAnswer("True")}>True</button>
            <button onClick={() => handleAnswer("False")}>False</button>
          </div>
        ) : null}

        {isEndOfQuizActive ? (
          <div>
            {questionsArray.map((question, index) => (
              <div
                key={question.question}
                style={{
                  backgroundColor: correctAnswersIndexes.includes(index)
                    ? "green"
                    : incorrectAnswersIndexes.includes(index)
                    ? "red"
                    : "black",
                }}
              >
                {question.question}
              </div>
            ))}

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
