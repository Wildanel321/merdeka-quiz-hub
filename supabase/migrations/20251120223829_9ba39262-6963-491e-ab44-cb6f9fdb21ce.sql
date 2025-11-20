-- Create questions table for quiz
CREATE TABLE public.questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  question TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('multiple_choice', 'complex_multiple_choice')),
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leaderboard table
CREATE TABLE public.leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  time_taken INTEGER NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('practice', 'exam')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- RLS Policies for questions (public read access for quiz)
CREATE POLICY "Anyone can view questions"
ON public.questions FOR SELECT
USING (true);

-- RLS Policies for leaderboard (public read and insert)
CREATE POLICY "Anyone can view leaderboard"
ON public.leaderboard FOR SELECT
USING (true);

CREATE POLICY "Anyone can add to leaderboard"
ON public.leaderboard FOR INSERT
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_questions_subject ON public.questions(subject);
CREATE INDEX idx_leaderboard_score ON public.leaderboard(score DESC);
CREATE INDEX idx_leaderboard_created_at ON public.leaderboard(created_at DESC);