// Admin Quiz Management Mock Data

export interface AdminCourse {
  id: string;
  title: string;
  category: string;
}

export interface AdminQuizQuestion {
  id: string;
  questionText: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
}

export interface AdminQuiz {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  timeLimit: number | null; // minutes
  passingScore: number; // percentage
  shuffleQuestions: boolean;
  status: 'draft' | 'published';
  questions: AdminQuizQuestion[];
  createdAt: string;
  updatedAt: string;
}

// Mock Courses
export const mockCourses: AdminCourse[] = [
  { id: 'course_1', title: 'Web Development Fundamentals', category: 'Development' },
  { id: 'course_2', title: 'React & TypeScript Mastery', category: 'Development' },
  { id: 'course_3', title: 'UI/UX Design Principles', category: 'Design' },
  { id: 'course_4', title: 'Data Science with Python', category: 'Data Science' },
  { id: 'course_5', title: 'Digital Marketing Essentials', category: 'Marketing' },
  { id: 'course_6', title: 'Cloud Computing with AWS', category: 'Cloud' },
];

// Mock Quizzes with Questions
export const mockAdminQuizzes: AdminQuiz[] = [
  {
    id: 'quiz_1',
    title: 'HTML & CSS Basics',
    description: 'Test your knowledge of fundamental HTML and CSS concepts.',
    courseId: 'course_1',
    courseName: 'Web Development Fundamentals',
    timeLimit: 15,
    passingScore: 70,
    shuffleQuestions: true,
    status: 'published',
    questions: [
      {
        id: 'q1_1',
        questionText: 'What does HTML stand for?',
        options: [
          { id: 'a', text: 'Hyper Text Markup Language' },
          { id: 'b', text: 'High Tech Modern Language' },
          { id: 'c', text: 'Hyper Transfer Markup Language' },
          { id: 'd', text: 'Home Tool Markup Language' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'q1_2',
        questionText: 'Which CSS property is used to change text color?',
        options: [
          { id: 'a', text: 'text-color' },
          { id: 'b', text: 'font-color' },
          { id: 'c', text: 'color' },
          { id: 'd', text: 'foreground' },
        ],
        correctOptionId: 'c',
      },
      {
        id: 'q1_3',
        questionText: 'Which tag is used for the largest heading?',
        options: [
          { id: 'a', text: '<heading>' },
          { id: 'b', text: '<h6>' },
          { id: 'c', text: '<h1>' },
          { id: 'd', text: '<head>' },
        ],
        correctOptionId: 'c',
      },
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: 'quiz_2',
    title: 'React Hooks Deep Dive',
    description: 'Advanced quiz on React hooks including useState, useEffect, and custom hooks.',
    courseId: 'course_2',
    courseName: 'React & TypeScript Mastery',
    timeLimit: 20,
    passingScore: 75,
    shuffleQuestions: false,
    status: 'published',
    questions: [
      {
        id: 'q2_1',
        questionText: 'Which hook is used for managing component state?',
        options: [
          { id: 'a', text: 'useEffect' },
          { id: 'b', text: 'useState' },
          { id: 'c', text: 'useContext' },
          { id: 'd', text: 'useReducer' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q2_2',
        questionText: 'When does useEffect run by default?',
        options: [
          { id: 'a', text: 'Only on mount' },
          { id: 'b', text: 'Only on unmount' },
          { id: 'c', text: 'After every render' },
          { id: 'd', text: 'Never' },
        ],
        correctOptionId: 'c',
      },
    ],
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-22T11:45:00Z',
  },
  {
    id: 'quiz_3',
    title: 'Design Principles Assessment',
    description: 'Evaluate your understanding of core UI/UX design principles.',
    courseId: 'course_3',
    courseName: 'UI/UX Design Principles',
    timeLimit: null,
    passingScore: 60,
    shuffleQuestions: true,
    status: 'draft',
    questions: [
      {
        id: 'q3_1',
        questionText: 'What is the primary goal of UX design?',
        options: [
          { id: 'a', text: 'Make things pretty' },
          { id: 'b', text: 'Improve user satisfaction' },
          { id: 'c', text: 'Add more features' },
          { id: 'd', text: 'Use latest trends' },
        ],
        correctOptionId: 'b',
      },
    ],
    createdAt: '2024-01-20T15:00:00Z',
    updatedAt: '2024-01-20T15:00:00Z',
  },
  {
    id: 'quiz_4',
    title: 'Python Data Structures',
    description: 'Test your knowledge of Python lists, dictionaries, and more.',
    courseId: 'course_4',
    courseName: 'Data Science with Python',
    timeLimit: 25,
    passingScore: 70,
    shuffleQuestions: true,
    status: 'published',
    questions: [
      {
        id: 'q4_1',
        questionText: 'Which is mutable in Python?',
        options: [
          { id: 'a', text: 'Tuple' },
          { id: 'b', text: 'String' },
          { id: 'c', text: 'List' },
          { id: 'd', text: 'Integer' },
        ],
        correctOptionId: 'c',
      },
      {
        id: 'q4_2',
        questionText: 'How do you create a dictionary?',
        options: [
          { id: 'a', text: '[]' },
          { id: 'b', text: '{}' },
          { id: 'c', text: '()' },
          { id: 'd', text: '<>' },
        ],
        correctOptionId: 'b',
      },
    ],
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-25T16:00:00Z',
  },
  {
    id: 'quiz_5',
    title: 'SEO Fundamentals',
    description: 'Basic concepts of search engine optimization.',
    courseId: 'course_5',
    courseName: 'Digital Marketing Essentials',
    timeLimit: 10,
    passingScore: 65,
    shuffleQuestions: false,
    status: 'draft',
    questions: [],
    createdAt: '2024-01-22T12:00:00Z',
    updatedAt: '2024-01-22T12:00:00Z',
  },
];

// Helper to generate unique IDs
export const generateQuestionId = () => `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
export const generateQuizId = () => `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
export const generateOptionId = () => `opt_${Math.random().toString(36).substr(2, 4)}`;
