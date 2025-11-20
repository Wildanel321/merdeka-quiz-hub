import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Play } from "lucide-react";
import { QuizSettings as QuizSettingsType, QUESTION_OPTIONS, QuestionOption } from "@/types/quiz";

interface QuizSettingsProps {
  subject: string;
  onStart: (settings: QuizSettingsType) => void;
  onBack: () => void;
  totalAvailable: number;
}

const QuizSettings = ({ subject, onStart, onBack, totalAvailable }: QuizSettingsProps) => {
  const [numberOfQuestions, setNumberOfQuestions] = useState<QuestionOption>(10);
  const [mode, setMode] = useState<'practice' | 'exam'>('practice');
  const [timePerQuestion, setTimePerQuestion] = useState(30);

  const handleStart = () => {
    const finalQuestions = numberOfQuestions === 'FULL' ? totalAvailable : numberOfQuestions;
    onStart({
      subject,
      numberOfQuestions: finalQuestions,
      mode,
      timePerQuestion: mode === 'exam' ? timePerQuestion : undefined
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto"
    >
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali
      </Button>

      <Card className="border-2">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-2xl text-primary">{subject}</CardTitle>
          <p className="text-sm text-muted-foreground">Total soal tersedia: {totalAvailable}</p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Mode Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Pilih Mode</Label>
            <RadioGroup value={mode} onValueChange={(v) => setMode(v as 'practice' | 'exam')}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="practice" id="practice" />
                <Label htmlFor="practice" className="cursor-pointer flex-1">
                  <div>
                    <p className="font-medium">Mode Latihan</p>
                    <p className="text-sm text-muted-foreground">Tanpa timer, pembahasan langsung</p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="exam" id="exam" />
                <Label htmlFor="exam" className="cursor-pointer flex-1">
                  <div>
                    <p className="font-medium">Mode Ujian</p>
                    <p className="text-sm text-muted-foreground">Dengan timer, pembahasan di akhir</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Number of Questions */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Jumlah Soal</Label>
            <RadioGroup 
              value={numberOfQuestions.toString()} 
              onValueChange={(v) => setNumberOfQuestions(v === 'FULL' ? 'FULL' : parseInt(v) as QuestionOption)}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {QUESTION_OPTIONS.map((option) => {
                  const value = option === 'FULL' ? totalAvailable : option;
                  const disabled = typeof option === 'number' && option > totalAvailable;
                  
                  return (
                    <div 
                      key={option}
                      className={`flex items-center space-x-2 p-3 border rounded-lg ${
                        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted/50 cursor-pointer'
                      }`}
                    >
                      <RadioGroupItem 
                        value={option.toString()} 
                        id={option.toString()}
                        disabled={disabled}
                      />
                      <Label 
                        htmlFor={option.toString()} 
                        className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                      >
                        {option === 'FULL' ? `FULL (${totalAvailable})` : `${option} Soal`}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </div>

          {/* Timer Setting (only for exam mode) */}
          {mode === 'exam' && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">Waktu per Soal (detik)</Label>
              <RadioGroup value={timePerQuestion.toString()} onValueChange={(v) => setTimePerQuestion(parseInt(v))}>
                <div className="grid grid-cols-3 gap-3">
                  {[15, 30, 60].map((time) => (
                    <div key={time} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value={time.toString()} id={`time-${time}`} />
                      <Label htmlFor={`time-${time}`} className="cursor-pointer">
                        {time}s
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          <Button 
            onClick={handleStart}
            className="w-full"
            size="lg"
          >
            <Play className="w-5 h-5 mr-2" />
            Mulai Quiz
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuizSettings;
