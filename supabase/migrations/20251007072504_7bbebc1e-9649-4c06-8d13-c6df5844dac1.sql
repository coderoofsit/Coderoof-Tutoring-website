-- Create enum for session status
CREATE TYPE session_status AS ENUM ('Pending', 'Approved', 'Rejected');

-- Create subjects table
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create teachers table
CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create teacher_subjects junction table
CREATE TABLE teacher_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  UNIQUE(teacher_id, subject_id)
);

-- Create session_requests table
CREATE TABLE session_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  student_name TEXT NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
  topic TEXT NOT NULL,
  session_date DATE NOT NULL,
  session_time TIME NOT NULL,
  status session_status DEFAULT 'Pending' NOT NULL,
  teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subjects (readable by all authenticated users)
CREATE POLICY "Anyone can view subjects"
  ON subjects FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for teachers (readable by all authenticated users)
CREATE POLICY "Anyone can view teachers"
  ON teachers FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for teacher_subjects (readable by all authenticated users)
CREATE POLICY "Anyone can view teacher subjects"
  ON teacher_subjects FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for session_requests
CREATE POLICY "Users can view their own requests"
  ON session_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own requests"
  ON session_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own requests"
  ON session_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Enable realtime for session_requests
ALTER PUBLICATION supabase_realtime ADD TABLE session_requests;

-- Insert mock subjects
INSERT INTO subjects (name) VALUES 
  ('Computer Science'),
  ('Mathematics'),
  ('Physics'),
  ('Chemistry'),
  ('Biology');

-- Insert mock teachers
INSERT INTO teachers (name) VALUES 
  ('Dr. Sarah Johnson'),
  ('Prof. Michael Chen'),
  ('Dr. Emily Rodriguez'),
  ('Prof. David Kumar'),
  ('Dr. Lisa Anderson');

-- Assign subjects to teachers
INSERT INTO teacher_subjects (teacher_id, subject_id)
SELECT t.id, s.id FROM teachers t, subjects s
WHERE (t.name = 'Dr. Sarah Johnson' AND s.name IN ('Computer Science', 'Mathematics'))
   OR (t.name = 'Prof. Michael Chen' AND s.name IN ('Mathematics', 'Physics'))
   OR (t.name = 'Dr. Emily Rodriguez' AND s.name IN ('Chemistry', 'Biology'))
   OR (t.name = 'Prof. David Kumar' AND s.name IN ('Physics', 'Computer Science'))
   OR (t.name = 'Dr. Lisa Anderson' AND s.name IN ('Biology', 'Chemistry'));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for session_requests
CREATE TRIGGER update_session_requests_updated_at
  BEFORE UPDATE ON session_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();