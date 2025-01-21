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
  }
};

export default function TrainingPage() {
  const [email, setEmail] = useState<string>("");
  const [level, setLevel] = useState<Level | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
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
        setLevel(data.level as Level); // Type assertion since we know level should match Level
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
      }
    } else {
      setMessage("Some answers are incorrect. Please try again.");
    }
  };

  if (level === null) return <div>Loading...</div>;

  return (
    <>
      <Headingbar text="Training" />
      <div className="quiz">
        <h2>Welcome, {email}! Your Current Level: {level}</h2>
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
    </>
  );
}
