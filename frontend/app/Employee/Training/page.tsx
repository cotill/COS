"use client";
import Headingbar from "@/components/employeeComponents/Headingbar";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import TrainingTracker from "@/components/trainingTracker";

type Level = 0 | 1 | 2;

const quizzes: Record<
  Level,
  {
    questions: { question: string; choices: string[]; correctAnswer: string }[];
  }
> = {
  0: {
    questions: [
      {
        question: "What is 2 + 2?",
        choices: ["3", "4", "5", "6"],
        correctAnswer: "4",
      },
      {
        question: "What is the capital of France?",
        choices: ["Berlin", "Madrid", "Paris", "Rome"],
        correctAnswer: "Paris",
      },
    ],
  },
  1: {
    questions: [
      {
        question: "What is 5 + 3?",
        choices: ["6", "7", "8", "9"],
        correctAnswer: "8",
      },
      {
        question: "What is the square root of 16?",
        choices: ["2", "4", "6", "8"],
        correctAnswer: "4",
      },
    ],
  },
  2: {
    questions: [
      {
        question: "Who developed the theory of relativity?",
        choices: ["Newton", "Einstein", "Tesla", "Bohr"],
        correctAnswer: "Einstein",
      },
      {
        question: "What is the chemical symbol for water?",
        choices: ["O2", "H2O", "CO2", "N2"],
        correctAnswer: "H2O",
      },
    ],
  },
};

export default function TrainingPage() {
  const [email, setEmail] = useState<string>("");
  const [level, setLevel] = useState<Level | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [view, setView] = useState<"training" | "quiz" | "success" | "failure">(
    "training"
  );
  const [trainingContent, setTrainingContent] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          console.error("Error fetching session:", sessionError);
          return;
        }

        const userId = session.user.id;
        console.log("Current user ID:", userId);
        
        const { data, error } = await supabase
          .from("Employees")
          .select("email, level")
          .eq("employee_id", userId)
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
          return;
        }

        console.log("Employee data:", data);
        setEmail(data.email);
        const userLevel = data.level as Level;
        setLevel(userLevel);

        if (userLevel <= 2) {
          setAnswers(new Array(quizzes[userLevel].questions.length).fill(""));
        }

        // Fetch training content from TrainingData table
        console.log("Fetching ALL training data from table");
        
        const { data: trainingData, error: trainingError } = await supabase
          .from("TrainingData")
          .select("*");

        console.log("Training data response:", { trainingData, trainingError });

        // Use the training data result and filter by user level
        if (trainingError) {
          console.error("Error fetching training content:", trainingError);
          setTrainingContent([`Failed to load training content: ${trainingError.message}`]);
        } else if (!trainingData || trainingData.length === 0) {
          console.log("No training data found in table");
          setTrainingContent(["No training content available."]);
        } else {
          // Filter the data for the specific user level
          const levelData = trainingData.find(item => item.level === userLevel);
          console.log("Level data for", userLevel, ":", levelData);
          
          if (levelData && levelData.Content) {
            const parsed = levelData.Content
              .split("\n")
              .filter((line: string) => line.trim() !== "");
            setTrainingContent(parsed);
          } else {
            setTrainingContent([`No training content available for level ${userLevel}.`]);
          }
        }
        

        setLoading(false);
      } catch (err) {
        console.error("Unexpected error in fetchData:", err);
        setTrainingContent(["An unexpected error occurred while loading training content."]);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (level === null) return;

    const correctAnswers = quizzes[level].questions.map((q) => q.correctAnswer);
    const isPassed = answers.every(
      (answer, index) => answer === correctAnswers[index]
    );

    if (isPassed) {
      const { error } = await supabase
        .from("Employees")
        .update({ level: (level + 1) as Level })
        .eq("email", email);

      if (error) {
        console.error("Failed to update level:", error);
        setMessage("Failed to update level. Please try again.");
      } else {
        const newLevel = (level + 1) as Level;
        setLevel(newLevel);
        setMessage("Congratulations! You've advanced to the next level.");
        setAnswers(
          new Array(quizzes[newLevel]?.questions.length || 0).fill("")
        );
        setView("success");
      }
    } else {
      setMessage("Some answers are incorrect. Please try again.");
      setView("failure");
    }
  };

  const handleRetry = () => {
    setAnswers(new Array(quizzes[level!]?.questions.length).fill(""));
    setMessage("");
    setView("quiz");
  };

  if (loading || level === null) return <div>Loading...</div>;

  if (level > 2)
    return (
      <>
        <Headingbar text="Training" />
        <div className="bg-gray-300 p-6 m-8 rounded-lg">
          <div className="mb-4 flex justify-center">
            <TrainingTracker active={level} />
          </div>
          <div className="bg-gray-100 p-8 rounded-lg shadow-lg mt-4 max-w-md mx-auto text-center">
            <h2 className="text-2xl font-semibold text-gray-800">Congratulations!</h2>
            <p className="mt-2 text-sm text-gray-600">
              You have reached the max level.
            </p>
          </div>
        </div>
      </>
    );

  return (
    <>
      <Headingbar text="Training" />
      <div className="bg-gray-300 p-6 m-8 rounded-lg">
        <div className="mb-4 flex justify-center">
          <TrainingTracker active={level} />
        </div>

        {view === "training" && (
          <div>
            <div className="text-center text-3xl text-black font-bold">
              Training Material for Level {level}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg mt-4">
              <h2 className="text-xl font-semibold text-black">
                Welcome, {email}! <br />Your Current Level: {level}
              </h2>
              <ul className="mt-2 text-black text-sm space-y-2">
                {trainingContent.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center mt-4">
              <Button variant="outline" onClick={() => setView("quiz")}>
                Start Quiz
              </Button>
            </div>
          </div>
        )}

        {view === "quiz" && (
          <div>
            <div className="text-center text-3xl text-black font-bold">
              Quiz for Level {level}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg mt-4">
              <form>
                {quizzes[level]?.questions.map((question, index) => (
                  <div key={index} className="mb-4">
                    <p className="text-black font-medium">{question.question}</p>
                    {question.choices.map((choice, choiceIndex) => (
                      <label key={choiceIndex} className="block text-black text-sm mt-2">
                        <input
                          className="mr-2"
                          type="radio"
                          name={`question-${index}`}
                          value={choice}
                          checked={answers[index] === choice}
                          onChange={(e) => {
                            const newAnswers = [...answers];
                            newAnswers[index] = e.target.value;
                            setAnswers(newAnswers);
                          }}
                        />
                        {choice}
                      </label>
                    ))}
                  </div>
                ))}
              </form>
            </div>
            <div className="flex items-center justify-center mt-4">
              <Button variant="outline" onClick={handleSubmit}>
                Submit Quiz
              </Button>
            </div>
          </div>
        )}

        {view === "success" && (
          <div>
            <div className="text-center text-3xl text-black font-bold">
              Training Material for Level {level}
            </div>
            <div className="bg-gray-100 p-8 rounded-lg shadow-lg mt-4 max-w-md mx-auto text-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                Congratulations!
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Review materials or move on to the next level
              </p>
            </div>
            <div className="flex items-center justify-center mt-4">
              <Button variant="outline" onClick={() => setView("training")}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {view === "failure" && (
          <div>
            <div className="bg-gray-100 p-8 rounded-lg shadow-lg mt-4 max-w-md mx-auto text-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                Try Again
              </h2>
              <p className="mt-2 mb-4 text-sm text-gray-600">{message}</p>
              <div className="flex items-center justify-center">
                <Button variant="outline" onClick={handleRetry}>
                  Retry Quiz
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
