import { useState, useEffect } from "react";
import style from "./styles/homepage.module.css";
import axios from "axios";

export default function Quiz() {
  //Key value pairs will be used to determine what screen is rendered by conditionally plugging a single key/value into quizStatus useState.
  const quizStatuses = {
    BEGINNING_OF_QUIZ: "BEGINNING_QUIZ",
    QUIZ_QUESTION: "QUIZ_QUESTION",
    END_OF_QUIZ: "END_OF_QUIZ",
  };

  //UseState
  const [questionsArray, setQuestionsArray] = useState<QuestionStructure[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizStatus, setQuizStatus] = useState(quizStatuses.BEGINNING_OF_QUIZ);
  const [correctAnswersIndexes, setCorrectAnswersIndexes] = useState<
    Array<Number>
  >([]);

  //Assigns the types the the key value pairs for typescripts readability.
  interface QuestionStructure {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
  }

  //Booleans to give my ternary operators the decision to 'display or not display'.
  const isBeginningOfQuizActive: boolean =
    quizStatus === quizStatuses.BEGINNING_OF_QUIZ;
  const isQuizQuestionActive: boolean =
    quizStatus === quizStatuses.QUIZ_QUESTION;
  const isEndOfQuizActive: boolean = quizStatus === quizStatuses.END_OF_QUIZ;

  //fetches the questions once the page loads.
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

  //Checks user's answer, update state, and move to next question.
  const handleAnswer = (bool: string) => {
    //If user answer matches correct answer we save the index of the question.
    if (questionsArray[currentQuestionIndex].correct_answer === bool) {
      setCorrectAnswersIndexes((arr) => [...arr, currentQuestionIndex]);
    }

    //We move to the next question or end the quiz here depending on what index we are on.
    if (currentQuestionIndex < questionsArray.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizStatus(quizStatuses.END_OF_QUIZ);
    }
  };

  //Sends user back to beginning of quiz, clears old answers given in the useState,resets the question index to start from the beginning.
  const endQuiz = () => {
    setQuizStatus(quizStatuses.BEGINNING_OF_QUIZ);
    setCurrentQuestionIndex(0);
    setCorrectAnswersIndexes([]);
  };

  return (
    <div className={style.body}>
      <div className={style.quizContainer}>
        {isBeginningOfQuizActive ? (
          <div className={style.beginningContainer}>
            <div className={style.beginHeading}>
              Welcome to the Trivia Challenge!
            </div>
            <div className={style.beginSubHeading}>
              You will be presented with 10 True or False questions.
            </div>
            <div className={style.beginQuestion}>
              Can you get them all right?
            </div>
            <button
              onClick={() => {
                setQuizStatus(quizStatuses.QUIZ_QUESTION);
              }}
              className={style.beginBtn}
            >
              Begin
            </button>
          </div>
        ) : null}
        {isQuizQuestionActive ? (
          <div className={style.triviaCard}>
            <div className={style.questionsCategory}>
              <h2>{questionsArray[currentQuestionIndex]?.category}</h2>
            </div>
            <div className={style.questionAnswerContainer}>
              <div className={style.singleQuestion}>
                <p>{questionsArray[currentQuestionIndex]?.question}</p>
              </div>
              <div className={style.trueOrFalseBtnsContainer}>
                <button
                  className={style.trueOrFalseBtns}
                  onClick={() => handleAnswer("True")}
                >
                  True
                </button>
                <button
                  className={style.trueOrFalseBtns}
                  onClick={() => handleAnswer("False")}
                >
                  False
                </button>
              </div>
            </div>
            <div className={style.questionCounter}>
              Question {currentQuestionIndex + 1}/10
            </div>
          </div>
        ) : null}

        {isEndOfQuizActive ? (
          <div className={style.endQuizContainer}>
            <div className={style.endQuizHeading}>
              You correctly answered {correctAnswersIndexes.length}/10
            </div>
            <div className={style.legend}>
              Correct
              <div>
                <div className={style.greenLegendBox}></div>
              </div>
              Incorrect
              <div>
                <div className={style.redLegendBox}></div>
              </div>
            </div>
            <div className={style.endQuizQuestions}>
              {questionsArray.map((question, index) => (
                <div
                  key={question.question}
                  className={
                    correctAnswersIndexes.includes(index)
                      ? style.correctAnswers
                      : style.incorrectAnswers
                  }
                >
                  {question.question}
                </div>
              ))}
            </div>
            <div className={style.endQuizBtnContainer}>
              <button
                className={style.endBtn}
                onClick={() => {
                  endQuiz();
                }}
              >
                Restart Quiz?
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
