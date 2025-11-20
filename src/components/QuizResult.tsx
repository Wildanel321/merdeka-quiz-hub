import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, Clock, CheckCircle, XCircle, Home } from "lucide-react";
import { QuizResult as QuizResultType, QuizSettings } from "@/types/quiz";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface QuizResultProps {
  result: QuizResultType;
  settings: QuizSettings;
  onBackToHome: () => void;
}

const QuizResult = ({ result, settings, onBackToHome }: QuizResultProps) => {
  const [playerName, setPlayerName] = useState("");
  const [saved, setSaved] = useState(false);

  const percentage = (result.correctAnswers / result.totalQuestions) * 100;
  const grade = percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : percentage >= 60 ? 'D' : 'E';
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleSaveToLeaderboard = async () => {
    if (!playerName.trim()) {
      toast.error("Silakan masukkan nama Anda");
      return;
    }

    try {
      const { error } = await supabase
        .from('leaderboard')
        .insert({
          player_name: playerName,
          subject: settings.subject,
          score: result.score,
          total_questions: result.totalQuestions,
          time_taken: result.timeTaken,
          mode: settings.mode
        });

      if (error) throw error;

      toast.success("Skor berhasil disimpan ke leaderboard!");
      setSaved(true);
    } catch (error) {
      console.error("Error saving to leaderboard:", error);
      toast.error("Gagal menyimpan ke leaderboard");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Result Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-2 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <div className="flex items-center justify-center gap-3">
              <Trophy className="w-8 h-8" />
              <CardTitle className="text-3xl">Quiz Selesai!</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div>
                <div className="text-7xl font-bold text-primary mb-2">{result.score}</div>
                <div className="text-2xl text-muted-foreground">Grade: {grade}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-success/10 rounded-lg border-2 border-success/30">
                  <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                  <div className="text-2xl font-bold text-success">{result.correctAnswers}</div>
                  <div className="text-sm text-muted-foreground">Benar</div>
                </div>

                <div className="p-4 bg-destructive/10 rounded-lg border-2 border-destructive/30">
                  <XCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                  <div className="text-2xl font-bold text-destructive">
                    {result.totalQuestions - result.correctAnswers}
                  </div>
                  <div className="text-sm text-muted-foreground">Salah</div>
                </div>

                <div className="p-4 bg-info/10 rounded-lg border-2 border-info/30">
                  <Clock className="w-8 h-8 text-info mx-auto mb-2" />
                  <div className="text-2xl font-bold text-info">{formatTime(result.timeTaken)}</div>
                  <div className="text-sm text-muted-foreground">Waktu</div>
                </div>
              </div>

              <div className="pt-4">
                <div className="inline-block px-6 py-2 bg-muted rounded-full">
                  <span className="text-sm text-muted-foreground">Mata Pelajaran: </span>
                  <span className="font-semibold">{settings.subject}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save to Leaderboard */}
      {!saved && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-2">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Simpan ke Leaderboard</h3>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="playerName" className="sr-only">Nama</Label>
                  <Input
                    id="playerName"
                    placeholder="Masukkan nama Anda"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveToLeaderboard()}
                  />
                </div>
                <Button onClick={handleSaveToLeaderboard}>
                  Simpan
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex justify-center">
        <Button onClick={onBackToHome} size="lg" variant="outline">
          <Home className="w-5 h-5 mr-2" />
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
};

export default QuizResult;
