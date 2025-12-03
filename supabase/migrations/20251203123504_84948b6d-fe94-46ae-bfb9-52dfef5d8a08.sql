-- Create a secure view that excludes correct_answer and explanation
CREATE OR REPLACE VIEW public.questions_public AS
SELECT id, subject, question, type, options, created_at
FROM public.questions;

-- Grant access to the view
GRANT SELECT ON public.questions_public TO anon, authenticated;

-- Drop the existing policy that allows anyone to view all question data
DROP POLICY IF EXISTS "Anyone can view questions" ON public.questions;

-- Create a new restrictive policy - only service role can access full questions table
-- This effectively blocks direct client access to correct_answer
CREATE POLICY "Service role only" ON public.questions
FOR SELECT USING (false);

-- Create a function to validate answers securely
CREATE OR REPLACE FUNCTION public.validate_answer(
  question_id uuid,
  user_answer text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  correct text;
  expl text;
  is_correct boolean;
BEGIN
  SELECT correct_answer, explanation INTO correct, expl
  FROM public.questions
  WHERE id = question_id;
  
  IF correct IS NULL THEN
    RETURN jsonb_build_object('error', 'Question not found');
  END IF;
  
  is_correct := (user_answer = correct);
  
  RETURN jsonb_build_object(
    'isCorrect', is_correct,
    'correctAnswer', correct,
    'explanation', expl
  );
END;
$$;