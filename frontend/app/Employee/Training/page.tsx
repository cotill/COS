"use client"; // Marks the component as a client component  
import Headingbar from "@/components/employeeComponents/Headingbar";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

type Level = 0 | 1 | 2;

const quizzes: Record<Level, { questions: string[]; answers: string[] }> = {
  0: {
    questions: ["What is 2 + 2?", "What is the capital of France?"],
    answers: ["4", "Paris"],
  },
  1: {
    questions: ["What is 5 + 3?", "What is the square root of 16?"],
    answers: ["8", "4"],
  },
  2: {
    questions: ["Who developed the theory of relativity?", "What is the chemical symbol for water?"],
    answers: ["Einstein", "H2O"],
  },
};

const trainingMaterials: Record<Level, string[]> = {
  0: [
    "Welcome to Level 0 training! This is your starting point.",
    "Focus on understanding basic concepts.",
    "Prepare to demonstrate your knowledge in the upcoming quiz.",
  ],
  1: [
    "Level 1 training focuses on intermediate concepts.",
    "Review the material carefully and ensure you understand the details.",
    "The quiz will assess your ability to apply these concepts.",
  ],
  2: [
    "Level 2 training covers advanced topics.",
    "Think critically about the material, and don't hesitate to ask questions.",
    "Prepare to solve challenging problems in the quiz.",
  ],
};

export default function TrainingPage() {
  const [email, setEmail] = useState<string>("");
  const [level, setLevel] = useState<Level | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [view, setView] = useState<"training" | "quiz">("training"); // State for view
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error("Error fetching session:", sessionError);
        return;
      }

      const userId = session.user.id;
      const { data, error } = await supabase
        .from("Employees")
        .select("email, level")
        .eq("employee_id", userId)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
      } else {
        setEmail(data.email);
        setLevel(data.level as Level); // Type assertion since we know level matches Level
        setAnswers(new Array(quizzes[data.level as Level].questions.length).fill(""));
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (level === null) return;

    const correctAnswers = quizzes[level].answers;
    const isPassed = answers.every((answer, index) => answer.trim() === correctAnswers[index]);

    if (isPassed) {
      const { error } = await supabase
        .from("Employees")
        .update({ level: (level + 1) as Level })
        .eq("email", email);

      if (error) {
        console.error("Failed to update level:", error);
        setMessage("Failed to update level. Please try again.");
      } else {
        setLevel((level + 1) as Level);
        setMessage("Congratulations! You've advanced to the next level.");
        setAnswers(new Array(quizzes[level + 1]?.questions.length).fill(""));
        setView("training"); // Reset view to training for the new level
      }
    } else {
      setMessage("Some answers are incorrect. Please try again.");
    }
  };

  if (level === null) return <div>Loading...</div>;

  return (
    <>
      <Headingbar text="Training" />
      <div className="training-container">
        {view === "training" && (
          <div>
            <h2>Welcome, {email}! Your Current Level: {level}</h2>
            <h3>Training Material for Level {level}</h3>
            <ul>
              {trainingMaterials[level]?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <button type="button" onClick={() => setView("quiz")}>
              Start Quiz
            </button>
          </div>
        )}

        {view === "quiz" && (
          <div className="quiz">
            <h3>Quiz for Level {level}</h3>
            <form>
              {quizzes[level]?.questions.map((question, index) => (
                <div key={index}>
                  <p>{question}</p>
                  <input
                    type="text"
                    value={answers[index] || ""}
                    onChange={(e) => {
                      const newAnswers = [...answers];
                      newAnswers[index] = e.target.value;
                      setAnswers(newAnswers);
                    }}
                  />
                </div>
              ))}
            </form>
            <button type="button" onClick={handleSubmit}>
              Submit Quiz
            </button>
            {message && <p>{message}</p>}
          </div>
        )}
      </div>
    </>
  );
}
