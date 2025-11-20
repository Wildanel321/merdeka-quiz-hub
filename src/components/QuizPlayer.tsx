import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Question, QuizSettings } from "@/types/quiz";

interface QuizPlayerProps {
  questions: Question[];
  settings: QuizSettings;
  onComplete: (results: any) => void;
}

const QuizPlayer = ({ questions, settings, onComplete }: QuizPlayerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [answers, setAnswers] = useState<{ questionId: string; userAnswer: string; isCorrect: boolean }[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.timePerQuestion || 0);
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  useEffect(() => {
    if (settings.mode === 'exam' && settings.timePerQuestion && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleNext(true);
            return settings.timePerQuestion || 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, settings, currentIndex]);

  const handleNext = (timeOut: boolean = false) => {
    const userAnswer = timeOut ? "" : selectedAnswer;
    const isCorrect = userAnswer === currentQuestion.correct_answer;

    setAnswers([...answers, {
      questionId: currentQuestion.id,
      userAnswer,
      isCorrect
    }]);

    if (settings.mode === 'practice') {
      setShowExplanation(true);
    } else {
      moveToNext();
    }
  };

  const moveToNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer("");
      setShowExplanation(false);
      setTimeLeft(settings.timePerQuestion || 0);
      setQuestionStartTime(Date.now());
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const correctAnswers = answers.filter(a => a.isCorrect).length + (selectedAnswer === currentQuestion.correct_answer ? 1 : 0);
    const score = Math.round((correctAnswers / questions.length) * 100);

    onComplete({
      score,
      totalQuestions: questions.length,
      correctAnswers,
      timeTaken,
      answers: [...answers, {
        questionId: currentQuestion.id,
        userAnswer: selectedAnswer,
        isCorrect: selectedAnswer === currentQuestion.correct_answer
      }]
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Soal {currentIndex + 1} dari {questions.length}</span>
          {settings.mode === 'exam' && settings.timePerQuestion && (
            <span className="flex items-center gap-2 text-primary font-semibold">
              <Clock className="w-4 h-4" />
              {timeLeft}s
            </span>
          )}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2">
            <CardContent className="p-6 space-y-6">
              <div>
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                  {currentQuestion.type === 'multiple_choice' ? 'Pilihan Ganda' : 'Pilihan Ganda Kompleks'}
                </span>
                <h3 className="text-xl font-semibold mb-4">{currentQuestion.question}</h3>
              </div>

              {!showExplanation ? (
                <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex items-start space-x-3 p-4 border-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-all">
                          <RadioGroupItem value={option} id={`option-${index}`} className="mt-1" />
                          <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1 leading-relaxed">
                            {option}
                          </Label>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </RadioGroup>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className={`p-4 rounded-lg border-2 ${
                    selectedAnswer === currentQuestion.correct_answer 
                      ? 'bg-success/10 border-success' 
                      : 'bg-destructive/10 border-destructive'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {selectedAnswer === currentQuestion.correct_answer ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-success" />
                          <span className="font-semibold text-success">Jawaban Benar!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-destructive" />
                          <span className="font-semibold text-destructive">Jawaban Salah</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm">
                      <strong>Jawaban yang benar:</strong> {currentQuestion.correct_answer}
                    </p>
                  </div>

                  <div className="p-4 bg-info/10 border-2 border-info/30 rounded-lg">
                    <h4 className="font-semibold mb-2 text-info">📚 Pembahasan:</h4>
                    <p className="text-sm leading-relaxed">{currentQuestion.explanation}</p>
                  </div>
                </motion.div>
              )}

              <div className="flex justify-end pt-4">
                {!showExplanation ? (
                  <Button 
                    onClick={() => handleNext(false)}
                    disabled={!selectedAnswer}
                    size="lg"
                  >
                    {currentIndex === questions.length - 1 ? 'Selesai' : 'Selanjutnya'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={moveToNext} size="lg">
                    {currentIndex === questions.length - 1 ? 'Lihat Hasil' : 'Soal Berikutnya'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizPlayer;
