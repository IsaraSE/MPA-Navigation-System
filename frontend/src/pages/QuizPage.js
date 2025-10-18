// src/pages/QuizPage.js
import React, { useState } from 'react';
import { ArrowLeft, Award, CheckCircle2, XCircle, Fish, Leaf, Waves, Anchor, AlertTriangle, Trophy, RefreshCcw } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const categories = [
  { id: 1, name: 'Biodiversity', description: 'Test your knowledge about marine species and ecosystems', icon: Fish, color: 'blue', questionCount: 6 },
  { id: 2, name: 'Conservation', description: 'Learn about marine protection and sustainability', icon: Leaf, color: 'green', questionCount: 6 },
  { id: 3, name: 'Ocean Pollution', description: 'Understand pollution threats and prevention', icon: Waves, color: 'cyan', questionCount: 5 },
  { id: 4, name: 'Sustainable Fishing', description: 'Explore responsible fishing practices', icon: Anchor, color: 'yellow', questionCount: 5 },
  { id: 5, name: 'Climate Change', description: 'Discover climate impacts on oceans', icon: AlertTriangle, color: 'red', questionCount: 5 },
];

const questions = [
  // Biodiversity (Category 1)
  { id: 1, categoryId: 1, question: 'How many species of marine life are estimated to exist in the ocean?', options: ['50,000','250,000','1 million','Over 2 million'], correctAnswer: 3, explanation: 'Scientists estimate over 2 million species.' },
  { id: 2, categoryId: 1, question: 'Which marine animal has three hearts?', options: ['Dolphin','Octopus','Whale','Shark'], correctAnswer: 1, explanation: 'Octopuses have three hearts.' },
  { id: 3, categoryId: 1, question: 'Which ocean zone has the most sunlight?', options: ['Abyssal','Sunlight','Twilight','Midnight'], correctAnswer: 1, explanation: 'The Sunlight Zone has the most light.' },
  { id: 4, categoryId: 1, question: 'What is the largest animal on Earth?', options: ['Great White Shark','Blue Whale','Elephant','Giant Squid'], correctAnswer: 1, explanation: 'The Blue Whale is the largest animal on Earth.' },
  { id: 5, categoryId: 1, question: 'Which marine creature is known as the "forest of the sea"?', options: ['Kelp','Seagrass','Coral','Mangrove'], correctAnswer: 0, explanation: 'Kelp forests provide shelter and food for many marine species.' },
  { id: 6, categoryId: 1, question: 'Which tiny marine organism produces oxygen?', options: ['Phytoplankton','Jellyfish','Starfish','Crab'], correctAnswer: 0, explanation: 'Phytoplankton produces at least 50% of the Earth’s oxygen.' },
  { id: 7, categoryId: 1, question: 'Sea turtles can hold their breath for how long?', options: ['30 mins','2 hours','5 hours','10 hours'], correctAnswer: 2, explanation: 'They can hold their breath for up to 5 hours.' },

  // Conservation (Category 2)
  { id: 8, categoryId: 2, question: 'What does MPA stand for?', options: ['Marine Protection Area','Marine Protected Area','Marine Preservation Area','Marine Public Area'], correctAnswer: 1, explanation: 'MPA stands for Marine Protected Area.' },
  { id: 9, categoryId: 2, question: 'Which species is protected by conservation efforts?', options: ['Dodo','Octopus','Whale','Shark'], correctAnswer: 2, explanation: 'Many whales are protected to prevent extinction.' },
  { id: 10, categoryId: 2, question: 'Who can participate in community conservation?', options: ['Only scientists','Local communities','Only governments','Tourists'], correctAnswer: 1, explanation: 'Local communities help in conservation efforts.' },
  { id: 11, categoryId: 2, question: 'Why protect coral reefs?', options: ['For tourism','To support marine life','For fishing','For oil extraction'], correctAnswer: 1, explanation: 'Coral reefs support thousands of marine species.' },
  { id: 12, categoryId: 2, question: 'What is “ghost fishing”?', options: ['Fishing at night','Abandoned fishing gear trapping fish','Deep sea fishing','Underwater fishing'], correctAnswer: 1, explanation: 'Ghost fishing happens when lost fishing gear traps marine life.' },
  { id: 13, categoryId: 2, question: 'Why create marine protected areas?', options: ['For fun','To protect ecosystems','For mining','For shipping routes'], correctAnswer: 1, explanation: 'MPAs are created to protect marine ecosystems.' },

  // Ocean Pollution (Category 3)
  { id: 14, categoryId: 3, question: 'How much plastic enters the ocean yearly?', options: ['1M tons','5M tons','8M tons','15M tons'], correctAnswer: 2, explanation: 'About 8 million tons of plastic enter the ocean every year.' },
  { id: 15, categoryId: 3, question: 'What takes 450 years to decompose?', options: ['Glass bottle','Plastic bottle','Paper bag','Aluminum can'], correctAnswer: 1, explanation: 'Plastic bottles take ~450 years to break down.' },
  { id: 16, categoryId: 3, question: 'Which is a major microplastic source?', options: ['Glass','Synthetic clothes','Paper','Metal'], correctAnswer: 1, explanation: 'Synthetic clothes release microplastics when washed.' },
  { id: 17, categoryId: 3, question: 'Dead zones in the ocean are caused by?', options: ['Too much salt','Nutrient pollution','Cold water','Oil spills'], correctAnswer: 1, explanation: 'Excess nutrients cause oxygen depletion creating dead zones.' },
  { id: 18, categoryId: 3, question: 'What is the Great Pacific Garbage Patch?', options: ['Garbage island','Floating debris','Beach trash','Ocean trench waste'], correctAnswer: 1, explanation: 'It is a floating mass of plastic debris in the ocean.' },
  { id: 19, categoryId: 3, question: 'How can we reduce ocean pollution?', options: ['Recycling','Fishing more','Deforestation','Boating'], correctAnswer: 0, explanation: 'Recycling helps reduce plastic pollution in oceans.' },

  // Sustainable Fishing (Category 4)
  { id: 20, categoryId: 4, question: 'What is overfishing?', options: ['Fishing too little','Fishing too much','Fishing responsibly','Illegal fishing'], correctAnswer: 1, explanation: 'Overfishing reduces fish populations drastically.' },
  { id: 21, categoryId: 4, question: 'What does MSC certification indicate?', options: ['Maximum safety','Marine Stewardship Council','Most sustainable catch','Marine science'], correctAnswer: 1, explanation: 'MSC certifies sustainable fisheries.' },
  { id: 22, categoryId: 4, question: 'Which fishing method damages the seabed?', options: ['Line fishing','Bottom trawling','Spear fishing','Net fishing'], correctAnswer: 1, explanation: 'Bottom trawling destroys habitats like coral reefs.' },
  { id: 23, categoryId: 4, question: 'Bycatch means?', options: ['Accidental catch of non-target species','Fishing by hand','Deep sea fishing','Illegal fishing'], correctAnswer: 0, explanation: 'Bycatch is unintentional catch of other species.' },
  { id: 24, categoryId: 4, question: 'Why have fishing quotas?', options: ['More profit','Prevent overfishing','Reduce taxes','Competition'], correctAnswer: 1, explanation: 'Quotas help fish populations recover.' },
  { id: 25, categoryId: 4, question: 'Sustainable fishing helps?', options: ['Ecosystem health','Pollution','Oil spills','Coral bleaching'], correctAnswer: 0, explanation: 'It protects ecosystems and maintains fish stocks.' },

  // Climate Change (Category 5)
  { id: 26, categoryId: 5, question: 'What is ocean acidification?', options: ['Dirty water','Decreased pH from CO2','Increased pH','Salt change'], correctAnswer: 1, explanation: 'Ocean absorbs CO2, lowering pH.' },
  { id: 27, categoryId: 5, question: 'Rising sea levels are caused by?', options: ['Melting ice','Volcanoes','Fishing','Shipping'], correctAnswer: 0, explanation: 'Melting ice due to warming raises sea levels.' },
  { id: 28, categoryId: 5, question: 'What are blue carbon ecosystems?', options: ['Arctic','Mangroves & seagrass','Deep ocean','Cold currents'], correctAnswer: 1, explanation: 'These ecosystems store carbon efficiently.' },
  { id: 29, categoryId: 5, question: 'Coral bleaching occurs due to?', options: ['Sunlight','Temperature stress','Lack of food','Currents'], correctAnswer: 1, explanation: 'High temperatures stress corals causing bleaching.' },
  { id: 30, categoryId: 5, question: 'Oceans absorb how much CO2 from humans?', options: ['10%','20%','30%','50%'], correctAnswer: 2, explanation: 'Oceans have absorbed about 30% of human-produced CO2.' },
  { id: 31, categoryId: 5, question: 'Climate change mainly affects?', options: ['Oceans','Mountains','Deserts','Cities'], correctAnswer: 0, explanation: 'Oceans are heavily impacted by climate change.' }
];


const colorClasses = {
  blue: { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', light: 'bg-blue-100', text: 'text-blue-500' },
  green: { bg: 'bg-green-500', hover: 'hover:bg-green-600', light: 'bg-green-100', text: 'text-green-500' },
  cyan: { bg: 'bg-cyan-500', hover: 'hover:bg-cyan-600', light: 'bg-cyan-100', text: 'text-cyan-500' },
  yellow: { bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600', light: 'bg-yellow-100', text: 'text-yellow-500' },
  red: { bg: 'bg-red-500', hover: 'hover:bg-red-600', light: 'bg-red-100', text: 'text-red-500' },
};

// ... Questions array (same as your code, omitted for brevity)

function QuizPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const categoryQuestions = selectedCategory
    ? questions.filter(q => q.categoryId === selectedCategory.id)
    : [];

  const currentQuestion = selectedCategory ? categoryQuestions[currentQuestionIndex] : null;

  const selectedColor = selectedCategory ? colorClasses[selectedCategory.color] : colorClasses.blue;

  const handleCategorySelect = (category) => {
    if (!category) {
      setSelectedCategory(null);
      return;
    }
    setSelectedCategory(category);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedOption(null);
    setHasAnswered(false);
    setShowCompletionModal(false);
  };

  const handleAnswerSelect = (index) => {
    if (hasAnswered) return;
    setSelectedOption(index);
    setHasAnswered(true);

    const isCorrect = index === currentQuestion.correctAnswer;
    setAnswers([...answers, { questionId: currentQuestion.id, isCorrect }]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < categoryQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      setShowCompletionModal(true);
    }
  };

  const handleRestartQuiz = () => {
    setSelectedCategory(null);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setHasAnswered(false);
    setShowCompletionModal(false);
  };

  const getScore = () => {
    const correct = answers.filter(a => a.isCorrect).length;
    const total = answers.length;
    return { correct, total, percentage: total > 0 ? Math.round((correct / total) * 100) : 0 };
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 p-6 md:p-12">
        {!selectedCategory && (
          <div>
            <div className="text-center mb-10">
              <Award size={48} className="mx-auto text-blue-500" />
              <h1 className="text-3xl font-bold text-gray-800 mt-4">Marine Knowledge Quiz</h1>
              <p className="text-gray-500 mt-2">Test your knowledge and learn about marine conservation</p>
            </div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Choose a Category</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(cat => {
                const Icon = cat.icon;
                const color = colorClasses[cat.color];
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat)}
                    className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition flex items-start gap-4 w-full"
                  >
                    <div className={`${color.light} p-4 rounded-lg flex items-center justify-center`}>
                      <Icon size={28} className={color.text} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-gray-800">{cat.name}</h3>
                      <p className="text-gray-500 text-sm">{cat.description}</p>
                      <p className="mt-2 text-xs font-medium text-gray-400">{cat.questionCount} Questions</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {selectedCategory && currentQuestion && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`${selectedColor.bg} h-2 rounded-full`}
                  style={{ width: ((currentQuestionIndex + 1) / categoryQuestions.length) * 100 + '%' }}
                />
              </div>
              <p className="text-center text-gray-500 text-sm mt-2">
                Question {currentQuestionIndex + 1} of {categoryQuestions.length}
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h4 className="text-gray-500 text-sm mb-2">Question {currentQuestionIndex + 1}</h4>
              <p className="text-gray-800 text-lg font-semibold mb-4">{currentQuestion.question}</p>
              <div className="flex flex-col gap-3">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQuestion.correctAnswer;
                  const classes = `flex justify-between items-center p-4 rounded-lg border transition
                    ${isSelected ? 'border-blue-500 bg-blue-100' : 'border-transparent bg-gray-50'}
                    ${hasAnswered && isCorrect ? 'border-green-500 bg-green-100' : ''}
                    ${hasAnswered && isSelected && !isCorrect ? 'border-red-500 bg-red-100' : ''}`;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(idx)}
                      disabled={hasAnswered}
                      className={classes}
                    >
                      <span>{opt}</span>
                      {hasAnswered && isCorrect && <CheckCircle2 className="text-green-600" />}
                      {hasAnswered && isSelected && !isCorrect && <XCircle className="text-red-600" />}
                    </button>
                  );
                })}
              </div>

              {hasAnswered && (
                <div className={`mt-4 p-4 rounded-lg ${selectedOption === currentQuestion.correctAnswer ? 'bg-green-100' : 'bg-red-100'}`}>
                  {selectedOption === currentQuestion.correctAnswer ? (
                    <p className="text-green-700 font-semibold">{currentQuestion.explanation}</p>
                  ) : (
                    <p className="text-red-700">
                      Correct: {currentQuestion.options[currentQuestion.correctAnswer]} - {currentQuestion.explanation}
                    </p>
                  )}
                </div>
              )}

              {hasAnswered && (
                <button
                  onClick={handleNextQuestion}
                  className={`mt-4 w-full py-3 rounded-lg font-semibold text-white ${selectedColor.bg} ${selectedColor.hover} transition`}
                >
                  {currentQuestionIndex < categoryQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />

      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-96 flex flex-col items-center shadow-xl">
            <Trophy size={64} className="text-yellow-400" />
            <h2 className="text-2xl font-bold mt-4">Quiz Complete! 🎊</h2>
            <p className="text-gray-500 mt-2">
              You scored {getScore().correct} / {getScore().total}
            </p>
            <p className="text-4xl font-bold text-blue-500 mt-1">{getScore().percentage}%</p>
            <div className="flex flex-col gap-3 mt-6 w-full">
              <button
                onClick={handleRestartQuiz}
                className="flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              >
                <RefreshCcw size={20} /> Try Again
              </button>
              <button
                onClick={() => handleCategorySelect(null)}
                className="bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                Choose Another Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizPage;
