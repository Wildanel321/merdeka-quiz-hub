import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Banner from "@/components/Banner";
import SubjectCard from "@/components/SubjectCard";
import QuizSettings from "@/components/QuizSettings";
import QuizPlayer from "@/components/QuizPlayer";
import QuizResult from "@/components/QuizResult";
import Leaderboard from "@/components/Leaderboard";
import { SUBJECTS, Question, QuizSettings as QuizSettingsType } from "@/types/quiz";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Screen = 'home' | 'settings' | 'quiz' | 'result';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [quizSettings, setQuizSettings] = useState<QuizSettingsType | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<any>(null);
  const [availableQuestions, setAvailableQuestions] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchQuestionCounts();
  }, []);

  const fetchQuestionCounts = async () => {
    try {
      const counts: Record<string, number> = {};
      
      for (const subject of SUBJECTS) {
        const { count, error } = await supabase
          .from('questions')
          .select('*', { count: 'exact', head: true })
          .eq('subject', subject);

        if (error) throw error;
        counts[subject] = count || 0;
      }
      
      setAvailableQuestions(counts);
    } catch (error) {
      console.error("Error fetching question counts:", error);
    }
  };

  const handleSubjectSelect = (subject: string) => {
    const available = availableQuestions[subject] || 0;
    
    if (available === 0) {
      toast.error(`Belum ada soal tersedia untuk ${subject}`);
      return;
    }
    
    setSelectedSubject(subject);
    setScreen('settings');
  };

  const handleStartQuiz = async (settings: QuizSettingsType) => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('subject', settings.subject)
        .limit(settings.numberOfQuestions);

      if (error) throw error;

      if (!data || data.length === 0) {
        toast.error("Tidak ada soal yang tersedia");
        return;
      }

      // Shuffle questions and map to proper type
      const mappedQuestions: Question[] = data.map(q => ({
        id: q.id,
        subject: q.subject,
        question: q.question,
        type: q.type as 'multiple_choice' | 'complex_multiple_choice',
        options: Array.isArray(q.options) ? q.options as string[] : [],
        correct_answer: q.correct_answer,
        explanation: q.explanation
      }));
      
      const shuffled = mappedQuestions.sort(() => Math.random() - 0.5);
      
      setQuestions(shuffled);
      setQuizSettings(settings);
      setScreen('quiz');
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Gagal memuat soal");
    }
  };

  const handleQuizComplete = (quizResult: any) => {
    setResult(quizResult);
    setScreen('result');
  };

  const handleBackToHome = () => {
    setScreen('home');
    setSelectedSubject("");
    setQuizSettings(null);
    setQuestions([]);
    setResult(null);
    fetchQuestionCounts(); // Refresh counts
  };

  return (
    <div className="min-h-screen bg-background">
      <Banner />
      
      <div className="container mx-auto px-4 py-8">
        {screen === 'home' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <Tabs defaultValue="subjects" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="subjects">Mata Pelajaran</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              </TabsList>
              
              <TabsContent value="subjects" className="mt-8">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold text-center mb-6">Pilih Mata Pelajaran</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SUBJECTS.map((subject, index) => (
                      <SubjectCard
                        key={subject}
                        subject={subject}
                        index={index}
                        onClick={() => handleSubjectSelect(subject)}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="leaderboard" className="mt-8">
                <div className="max-w-5xl mx-auto">
                  <Leaderboard />
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}

        {screen === 'settings' && (
          <QuizSettings
            subject={selectedSubject}
            onStart={handleStartQuiz}
            onBack={handleBackToHome}
            totalAvailable={availableQuestions[selectedSubject] || 0}
          />
        )}

        {screen === 'quiz' && quizSettings && (
          <QuizPlayer
            questions={questions}
            settings={quizSettings}
            onComplete={handleQuizComplete}
          />
        )}

        {screen === 'result' && result && quizSettings && (
          <QuizResult
            result={result}
            settings={quizSettings}
            onBackToHome={handleBackToHome}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
