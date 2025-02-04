"use client";
import Headingbar from "@/components/employeeComponents/Headingbar";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { Button } from '@/components/ui/button'
import TrainingTracker from '@/components/trainingTracker'

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

const trainingMaterials: Record<Level, string[]> = {
  0: [
    "Welcome to Level 0 training! This is your starting point.",
    "Focus on understanding basic concepts.",
    "Prepare to demonstrate your knowledge in the upcoming quiz.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Vestibulum euismod, nisi vel consectetur sollicitudin, felis risus varius elit, et venenatis ligula nulla at turpis.",
    "Curabitur nec justo eget nulla fermentum volutpat at sit amet odio.",
    "Duis nec sapien et risus consectetur ultricies vel id turpis.",
    "Nullam ac lectus ut dolor dignissim efficitur non sed velit.",
    "Morbi auctor elit at sapien luctus, ac vulputate erat luctus.",
    "Praesent venenatis augue at felis luctus, sed gravida ligula dapibus.",
  ],
  1: [
    "Level 1 training focuses on intermediate concepts.",
    "Review the material carefully and ensure you understand the details.",
    "The quiz will assess your ability to apply these concepts.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Aliquam erat volutpat. Nullam ut metus a lorem condimentum hendrerit.",
    "Suspendisse potenti. Fusce facilisis urna nec justo condimentum, id interdum libero malesuada.",
    "Mauris vel elit ac orci dictum accumsan.",
    "Ut malesuada augue a nulla tincidunt, sed euismod eros scelerisque.",
    "Nunc at elit in justo consequat efficitur sit amet ut sapien.",
    "Pellentesque ut orci ut odio tristique auctor sed ac quam.",
    "Etiam fermentum quam sed lacus luctus, eu tincidunt dui suscipit.",
    "Vivamus malesuada dui ut nulla tempus, eget malesuada mi eleifend.",
  ],
  2: [
    "Level 2 training covers advanced topics.",
    "Think critically about the material, and don't hesitate to ask questions.",
    "Prepare to solve challenging problems in the quiz.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Quisque non nisi eget turpis sodales hendrerit nec ac tortor.",
    "Pellentesque id libero id erat posuere scelerisque. Phasellus vel sapien nec ipsum convallis ultricies.",
    "Donec eget magna et lacus tincidunt tempus. Duis id orci vel sem pharetra hendrerit.",
    "Sed imperdiet orci ac magna gravida, sed tincidunt purus ultrices.",
    "Aenean sodales lorem in felis dictum tristique.",
    "Integer euismod justo at mi elementum, in malesuada quam feugiat.",
    "Proin auctor ligula nec purus auctor, sit amet viverra lacus tristique.",
    "Suspendisse lacinia nisl at tortor vehicula, a dictum erat fermentum.",
    "Curabitur efficitur metus sed mi dictum, eu iaculis dui hendrerit.",
    "Nam eget dolor eget ex facilisis blandit ut et libero.",
  ],
};

export default function TrainingPage() {
  const [email, setEmail] = useState<string>("");
  const [level, setLevel] = useState<Level | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [view, setView] = useState<"training" | "quiz" | "success" | "failure">("training");
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
        setLevel(data.level as Level);

        if (data.level as Level <= 2) {
          setAnswers(new Array(quizzes[data.level as Level].questions.length).fill(""));
        }
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (level === null) return;

    const correctAnswers = quizzes[level].questions.map((q) => q.correctAnswer);
    const isPassed = answers.every((answer, index) => answer === correctAnswers[index]);

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
        setAnswers(new Array(quizzes[(level + 1) as Level]?.questions.length).fill(""));
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

  if (level === null) return <div>Loading...</div>;

  if (level === null || level > 2) return (
    <>
      <Headingbar text="Training" />
      <div className="text-center mt-16 mb-16 text-3xl text-white">Youre Max level!</div>
      
    </>
  );

  return (
    <>
      <Headingbar text="Training" />
      <div className="pt-4 space-y-4 text-black" >
      <div className="flex justify-center mb-4">
          <TrainingTracker active={level} />
        </div>
      
        {view === "training" && (
          <div>
            <div className="text-center text-3xl text-white">Training Material for Level {level}</div>
          <div className="space-y-4 rounded-3xl mt-4 p-4" style={{ backgroundColor: '#c9c7ce' }}>
            <h2>Welcome, {email}! Your Current Level: {level}</h2>
            
            <ul>
              {trainingMaterials[level]?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            
          </div>
          <div className="flex items-center justify-center mt-4 p-4">
          <Button variant="outline" onClick={() => setView("quiz")}>
              Start Quiz
            </Button>
          </div>
          </div>
        )}

        {view === "quiz" && (
          <div className="quiz ">
            <div className="text-center text-3xl text-white ">Quiz for Level {level}</div>
            <div className="space-y-4 rounded-3xl mt-4 p-4" style={{ backgroundColor: '#c9c7ce' }}>
            <form>
              {quizzes[level]?.questions.map((question, index) => (
                <div key={index}>
                  <p className="ml-4 mt-4">{question.question}</p>
                  {question.choices.map((choice, choiceIndex) => (
                    <label key={choiceIndex} style={{ display: "block" }}>
                      <input
                        className="ml-4"
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
            <div className="flex items-center justify-center mt-4 p-4">
            <Button variant="outline" onClick={handleSubmit}>
              Submit Quiz
            </Button>
            </div>
          </div>
        )}

        {view === "success" && (
          <div>
            <div className="text-center text-3xl text-white">Training Material for Level {level}</div>
            
          <div className="flex flex-col items-center justify-center bg-gray-100 rounded-xl shadow-lg mt-4 pt-4 p-8 w-full max-w-md mx-auto">
          {/* Congratulations Text */}
          <h2 className="mt-6 text-2xl font-semibold text-gray-800">
            Congratulations!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Review materials or move on to the next level
          </p>
        
          {/* Button */}
          
        </div>
        <div className="flex items-center justify-center mt-4 p-4">
        <Button variant="outline"
            onClick={() => setView("training")}
          >
            Continue
          </Button>
        </div>
        </div>
        )}

        {view === "failure" && (
          <div className="failure">
           <div className="flex flex-col items-center justify-center bg-gray-100 rounded-xl shadow-lg mt-4 pt-4 p-8 w-full max-w-md mx-auto">
          
          <h2 className="mt-6 text-2xl font-semibold text-gray-800">
            Try Again
          </h2>
          <p className="mt-10 mb-10 text-sm text-gray-600">
          {message}
          </p>
            <Button variant="outline"
            onClick={handleRetry}
            >
              Retry Quiz
            </Button>
          </div>
          </div>
        )}
      </div>
      
    </>
  );
}
