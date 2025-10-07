import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Story Builder Bot (Year 1–2, Malaysia)
 * ------------------------------------------------------------
 * Educational chatbot for Malaysian Year 1-4 students learning English reading comprehension.
 * Uses modern UI Design System with gradients, animations, and accessibility features.
 * Deployed on Vercel with serverless API for Gemini integration.
 */

// ---------------- Interaction Steps ----------------
const STEPS = [
  {
    "type": "bot",
    "text": "Hello! I'm your Story Builder Bot! 👩‍🏫 We're going to make a fun story together! I will ask you to choose special words.\n\nRemember: naming words name people, animals, or things. Action words tell what someone does. Describing words tell what something is like.\n\nAre you ready to build our story?",
    "buttonText": "Let's Go! ✨"
  },
  {
    "type": "category_question",
    "categoryId": 1,
    "category": "naming word",
    "text": "Choose a naming word (names an animal):",
    "visual": "🐾",
    "correct": {
      "text": "A: cat",
      "feedback": "Yes! 'Cat' is a naming word. It names an animal. Well done! 🐱"
    },
    "wrong": {
      "text": "B: jump",
      "feedback": "Not quite! 'Jump' is an action word. It tells what someone does. Let's find a naming word that names an animal. Try again! 💪"
    }
  },
  {
    "type": "category_question",
    "categoryId": 2,
    "category": "describing word",
    "text": "Choose a describing word (tells what the cat is like):",
    "visual": "✨",
    "correct": {
      "text": "A: fluffy",
      "feedback": "Excellent! 'Fluffy' is a describing word. It tells us what the cat is like. Great choice! 👏"
    },
    "wrong": {
      "text": "B: run",
      "feedback": "Good try! 'Run' is an action word. It tells what someone does. Let's find a describing word that tells what something is like. You can do it! 🌟"
    }
  },
  {
    "type": "category_question",
    "categoryId": 3,
    "category": "naming word",
    "text": "Choose a naming word (names a place in school):",
    "visual": "🏫",
    "correct": {
      "text": "A: classroom",
      "feedback": "Perfect! 'Classroom' is a naming word. It names a place. You're doing great! 🎯"
    },
    "wrong": {
      "text": "B: happy",
      "feedback": "Almost! 'Happy' is a describing word. It tells what someone is like. Let's find a naming word that names a place in school. Try again! ✨"
    }
  },
  {
    "type": "category_question",
    "categoryId": 4,
    "category": "action word",
    "text": "Choose an action word (tells what the cat does):",
    "visual": "🏃",
    "correct": {
      "text": "A: jumps",
      "feedback": "Wonderful! 'Jumps' is an action word. It tells what the cat does. Amazing work! 🌈"
    },
    "wrong": {
      "text": "B: small",
      "feedback": "Not this time! 'Small' is a describing word. It tells what something is like. Let's find an action word that tells what someone does. Keep going! 💫"
    }
  },
  {
    "type": "category_question",
    "categoryId": 5,
    "category": "naming word",
    "text": "Choose a naming word (names a thing you can play with):",
    "visual": "🎾",
    "correct": {
      "text": "A: ball",
      "feedback": "Yes! 'Ball' is a naming word. It names a thing. You're a word expert! 🏆"
    },
    "wrong": {
      "text": "B: play",
      "feedback": "Good thinking! 'Play' is an action word. It tells what someone does. Let's find a naming word that names a thing. Try once more! 🎯"
    }
  },
  {
    "type": "category_question",
    "categoryId": 6,
    "category": "describing word",
    "text": "Choose a describing word (tells what the ball is like):",
    "visual": "🌟",
    "correct": {
      "text": "A: round",
      "feedback": "Super! 'Round' is a describing word. It tells us what the ball is like. Fantastic! 🎉"
    },
    "wrong": {
      "text": "B: throw",
      "feedback": "Nice try! 'Throw' is an action word. It tells what someone does. Let's find a describing word that tells what something is like. You're almost there! 💪"
    }
  },
  {
    "type": "category_question",
    "categoryId": 7,
    "category": "action word",
    "text": "Choose an action word (tells what happens to the ball):",
    "visual": "⚡",
    "correct": {
      "text": "A: rolls",
      "feedback": "Brilliant! 'Rolls' is an action word. It tells what happens. You know your words! ⭐"
    },
    "wrong": {
      "text": "B: big",
      "feedback": "Not quite! 'Big' is a describing word. It tells what something is like. Let's find an action word that tells what happens. You've got this! 🚀"
    }
  },
  {
    "type": "category_question",
    "categoryId": 8,
    "category": "naming word",
    "text": "Choose a naming word (names a person who helps):",
    "visual": "👋",
    "correct": {
      "text": "A: friend",
      "feedback": "Perfect! 'Friend' is a naming word. It names a person. You're amazing! 💝"
    },
    "wrong": {
      "text": "B: kind",
      "feedback": "Good effort! 'Kind' is a describing word. It tells what someone is like. Let's find a naming word that names a person. One more try! 🌈"
    }
  },
  {
    "type": "category_question",
    "categoryId": 9,
    "category": "describing word",
    "text": "Choose a describing word (tells how everyone feels):",
    "visual": "😊",
    "correct": {
      "text": "A: happy",
      "feedback": "Excellent choice! 'Happy' is a describing word. It tells how everyone feels. You did it! 🎊"
    },
    "wrong": {
      "text": "B: laugh",
      "feedback": "Almost there! 'Laugh' is an action word. It tells what someone does. Let's find a describing word that tells how someone feels. Last one! 🌟"
    }
  },
  {
    "type": "story_reveal",
    "prompt_template": "You are an expert storyteller for 7-year-old children in Malaysia. Your absolute top priorities are following instructions precisely.\n\nYou will be given a list of 9 words. You must create a short, happy, 3-4 sentence story that uses **every single word from the list exactly once**.\n\n**CRITICAL RULES - NO EXCEPTIONS:**\n1. **PRESENT TENSE ONLY:** Use simple present tense (e.g., 'the dog runs', 'she is happy'). Do NOT use past tense (e.g., 'ran', 'was happy').\n2. **USE EACH WORD ONCE:** Every word in the list must appear in the story one time. No more, no less. Do not repeat words.\n3. **FORMATTING:** When you use one of the words from the list, you MUST wrap it in double asterisks. For example, if 'cat' is a word, write it as **cat**.\n\nHere is the list of words: {words}\n\nCreate the story now.\n\nAfter the story, add a new line and then this exact sentence: (The words you chose are now in our story!)",
    "buttonText": "✨ Make Another Story ✨"
  },
  {
    "type": "bot",
    "text": "That was fun! 🎉 Would you like to create another story with different words? Every story is special and magical!",
    "buttonText": "🚀 Yes, Let's Go Again!"
  }
];

// ---------------- API Call Function ----------------
async function generateStory(prompt, words) {
  try {
    const response = await fetch('/api/generate-story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    if (result.story) {
      return result.story.trim();
    } else {
      throw new Error("Invalid response structure from API.");
    }
  } catch (error) {
    console.warn("AI story generation failed, falling back to placeholder.", error);
    return generateStoryPlaceholder(words);
  }
}

function generateStoryPlaceholder(words) {
  const [w1, w2, w3, w4, w5, w6, w7, w8, w9] = words;
  return `A **${w2}** **${w1}** in the **${w3}** **${w4}** over a **${w6}** **${w5}**. It **${w7}** toward a **${w8}**. Everyone is **${w9}**.\n\n(The words you chose are now in our story!)`;
}

// ---------------- UI Components ----------------

function FormattedStory({ text }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="text-indigo-600 font-black">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      })}
    </>
  );
}

function RemixView({ originalWords, originalStory, onRestart }) {
  const [remixWords, setRemixWords] = useState(originalWords);
  const [remixedStory, setRemixedStory] = useState(originalStory);

  function handleWordChange(categoryId, newText) {
    const newWords = remixWords.map(word => 
      word.categoryId === categoryId ? { ...word, text: newText } : word
    );
    setRemixWords(newWords);

    const replacementMap = new Map();
    originalWords.forEach((originalWord, index) => {
      replacementMap.set(originalWord.text, newWords[index].text);
    });

    const updatedStory = originalStory.replace(/\*\*(.*?)\*\*/g, (match, word) => {
      const newWord = replacementMap.get(word);
      return newWord ? `**${newWord}**` : match;
    });

    setRemixedStory(updatedStory);
  }

  const wordsByCategory = useMemo(() => {
    const groups = {
      'naming word': [],
      'describing word': [],
      'action word': [],
    };
    remixWords.forEach(word => {
      if (groups[word.category]) {
        groups[word.category].push(word);
      }
    });
    return groups;
  }, [remixWords]);

  const categoryTitles = {
    'naming word': 'Naming Words (Nouns) 🐾',
    'describing word': 'Describing Words (Adjectives) ✨',
    'action word': 'Action Words (Verbs) 🏃',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 font-sans p-4 sm:p-6 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-br from-white to-indigo-100 p-6 shadow-2xl border-4 border-indigo-300">
          <h1 className="text-2xl font-black text-indigo-900 mb-2 leading-tight">🎨 Remix Your Story</h1>
          <p className="text-lg font-semibold text-indigo-700 mb-6 leading-relaxed">Change any word below to create a new version of your story!</p>

          <div className="space-y-6">
            {Object.entries(wordsByCategory).map(([category, words]) => (
              <div key={category}>
                <h2 className="text-xl font-black text-purple-800 mb-3">{categoryTitles[category]}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {words.map((word) => (
                    <div key={word.categoryId} className="flex items-center gap-2 bg-white/80 p-3 rounded-2xl border-2 border-purple-200 shadow-lg">
                      <span className="text-slate-600 font-bold w-28 truncate">{word.text}</span>
                      <input
                        type="text"
                        defaultValue={word.text}
                        onChange={(e) => handleWordChange(word.categoryId, e.target.value)}
                        className="flex-grow p-2 border-2 border-purple-300 rounded-xl focus:ring-4 focus:ring-yellow-400 focus:border-purple-400 transition-all text-lg font-semibold"
                        aria-label={`Replace word ${word.text}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-black text-purple-800 mb-3">📖 Your New Story</h2>
            <div className="rounded-3xl bg-gradient-to-br from-green-100 to-emerald-200 p-6 shadow-2xl border-4 border-green-300 min-h-[150px]">
              <p className="text-lg font-semibold leading-relaxed whitespace-pre-wrap text-slate-900">
                <FormattedStory text={remixedStory} />
              </p>
            </div>
          </div>

          <div className="mt-8">
            <BigButton
              label="🚀 Let's Create a New Story"
              onClick={onRestart}
              tone="danger"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Header({ step, totalQuestions }) {
  return (
    <div className="sticky top-0 z-20 backdrop-blur-md bg-gradient-to-r from-purple-500/90 via-pink-500/90 to-orange-500/90 border-b-4 border-white shadow-xl">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/95 grid place-items-center text-3xl shadow-lg animate-bounce-slow border-3 border-white">
            🦉
          </div>
          <div>
            <p className="text-2xl font-black leading-tight text-white">Mia Kids Story Builder</p>
            <p className="text-xs font-bold tracking-wide text-white/90 uppercase">Year 1–4 Students (Malaysia)</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5" aria-label="Progress">
          <span className="text-xs font-bold text-white mr-2">Progress</span>
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
              key={i}
              className={
                "w-4 h-4 rounded-full transition-all duration-300 shadow-lg border-2 border-white " + 
                (i < step ? "bg-green-400 scale-125" : "bg-white/40")
              }
              title={`Word ${i + 1} ${i < step ? 'chosen' : 'not chosen yet'}`}
            />
          ))}
          <span className="text-2xl font-black text-white ml-2">{step}/{totalQuestions}</span>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ role, children }) {
  const isBot = role === "bot";
  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"} animate-fade-in`}>
      {isBot && (
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 border-3 border-white shadow-lg grid place-items-center text-2xl flex-shrink-0">
          👩‍🏫
        </div>
      )}
      <div
        className={
          "max-w-[90%] sm:max-w-[72%] rounded-3xl px-6 py-5 shadow-2xl text-lg font-semibold leading-relaxed " +
          (isBot 
            ? "bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 ml-3 rounded-tl-none" 
            : "bg-gradient-to-br from-green-100 to-emerald-200 border-2 border-green-300 mr-3 rounded-br-none text-slate-900"
          )
        }
      >
        {children}
      </div>
      {!isBot && (
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-300 to-emerald-400 border-3 border-white shadow-lg grid place-items-center text-2xl flex-shrink-0">
          👧
        </div>
      )}
    </div>
  );
}

function BigButton({
  label,
  onClick,
  ariaLabel,
  tone = "primary",
  disabled = false,
}) {
  const toneClass =
    tone === "primary"
      ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-blue-400"
      : tone === "danger"
      ? "bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white border-rose-400"
      : "bg-gradient-to-r from-slate-200 to-slate-300 hover:from-slate-300 hover:to-slate-400 text-slate-900 border-slate-400";
      
  const disabledClass = disabled ? "opacity-60 cursor-not-allowed" : "";

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel || label}
      disabled={disabled}
      className={`w-full rounded-2xl px-7 py-5 min-h-[72px] text-xl font-black transition-all duration-200 transform shadow-xl border-4 ${toneClass} ${disabledClass} hover:scale-[1.03] active:scale-[0.97] focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-yellow-400`}
    >
      {label}
    </button>
  );
}

function StoryLoader() {
  return (
    <div className="mt-2 p-4">
      <div className="flex flex-col items-center justify-center h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl border-4 border-purple-300">
        <svg className="w-12 h-12 text-purple-500 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <p className="text-base font-black text-purple-700 mt-2">🎨 Creating your picture-perfect story...</p>
      </div>
    </div>
  );
}

/**
 * Main Story Builder Chatbot Component
 */
export default function StoryBuilderChatbot() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0); 
  const [chatHistory, setChatHistory] = useState([]); 
  const [selectedWords, setSelectedWords] = useState([]);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [wrongAnswer, setWrongAnswer] = useState(false);
  const [isRemixMode, setIsRemixMode] = useState(false);

  const totalQuestions = useMemo(() => STEPS.filter((s) => s.type === "category_question").length, []);
  const currentStep = STEPS[currentStepIndex];

  const randomizedChoices = useMemo(() => {
    if (currentStep?.type !== 'category_question') return [];
    
    const choices = [
        { text: currentStep.correct.text, isCorrect: true },
        { text: currentStep.wrong.text, isCorrect: false },
    ];

    if (Math.random() > 0.5) {
        return choices.reverse();
    }
    return choices;
  }, [currentStep]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatHistory.length, isGeneratingStory]);

  useEffect(() => {
    if (chatHistory.length === 0 && STEPS.length > 0) {
      setChatHistory([{
        type: 'bot', 
        content: STEPS[0].text, 
        key: Date.now(),
      }]);
    }
  }, [chatHistory.length]);

  function advanceStep() {
    setWrongAnswer(false);
    setCurrentStepIndex(i => i + 1);
  }

  function restart() {
    setChatHistory([]);
    setCurrentStepIndex(0);
    setSelectedWords([]);
    setIsGeneratingStory(false);
    setWrongAnswer(false);
    setIsRemixMode(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleWordSelection(isCorrectChoice) {
    if (!currentStep || currentStep.type !== "category_question" || isGeneratingStory) return;

    const q = currentStep;
    const picked = isCorrectChoice ? q.correct : q.wrong; 
    const pickedText = picked.text.substring(3); // Remove "A: " or "B: "

    setChatHistory(history => [...history, { 
        type: 'user', 
        content: picked.text, 
        key: Date.now() 
    }]);

    setChatHistory(history => [...history, {
        type: 'bot',
        content: picked.feedback,
        key: Date.now() + 1
    }]);

    if (isCorrectChoice) {
      setSelectedWords(words => [...words, {
          text: pickedText,
          category: q.category,
          categoryId: q.categoryId,
      }]);
      setCurrentStepIndex(i => i + 1);
    } else {
      setWrongAnswer(true);
    }
  }

  async function handleStoryReveal() {
    const storyStep = currentStep;
    if (storyStep.type !== 'story_reveal' || isGeneratingStory) return;

    setIsGeneratingStory(true);

    const wordTexts = selectedWords.map(w => w.text);
    const prompt = storyStep.prompt_template.replace('{words}', wordTexts.join(', '));
    const storyText = await generateStory(prompt, wordTexts);

    setIsGeneratingStory(false);

    setChatHistory(history => [...history, {
        type: 'bot',
        content: storyText,
        key: Date.now(),
        isStory: true,
    }]);
    
    setCurrentStepIndex(i => i + 1);
  }

  const renderChatHistory = () => chatHistory.map((msg) => (
    <ChatBubble key={msg.key} role={msg.type === 'user' ? 'user' : 'bot'}>
      <p className="text-lg leading-relaxed whitespace-pre-wrap">
        {msg.isStory ? <FormattedStory text={msg.content} /> : msg.content}
      </p>
    </ChatBubble>
  ));

  const ActiveInteraction = () => {
    if (isGeneratingStory) {
      return (
        <div className="flex justify-start animate-fade-in"> 
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 border-3 border-white shadow-lg grid place-items-center text-2xl flex-shrink-0">
              👩‍🏫
            </div>
            <div className="max-w-[90%] sm:max-w-[72%] rounded-3xl px-6 py-5 shadow-2xl bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 ml-3 rounded-tl-none">
                <StoryLoader />
            </div>
        </div>
      );
    }

    if (wrongAnswer) {
        return (
            <div className="mx-auto max-w-[90%] sm:max-w-[72%] mt-6 animate-fade-in">
                <BigButton
                    label="🔁 Try Again 💪"
                    onClick={() => setWrongAnswer(false)}
                    tone="primary"
                />
            </div>
        );
    }

    if (currentStep?.type === "category_question") {
      return (
        <div className="mx-auto max-w-[90%] sm:max-w-[72%] mt-6 animate-fade-in">
            <div className="rounded-3xl bg-gradient-to-br from-white to-indigo-100 p-6 shadow-2xl border-4 border-indigo-300">
                <p className="text-indigo-900 font-black mb-2 text-2xl">❓ {currentStep.text}</p>
                <p className="text-indigo-700 font-semibold mb-5 text-lg">Choose the best <span className="font-black text-purple-600">{currentStep.category}</span>.</p>
                <div className="grid grid-cols-1 gap-4">
                    {randomizedChoices.map((choice) => (
                        <BigButton 
                            key={choice.text}
                            label={choice.text} 
                            onClick={() => handleWordSelection(choice.isCorrect)} 
                        />
                    ))}
                </div>
            </div>
        </div>
      );
    }
    
    if (currentStep?.type === "story_reveal") {
        return (
            <div className="mx-auto max-w-[90%] sm:max-w-[72%] mt-6 animate-fade-in">
                <BigButton
                  label="✨ Let's See Our Amazing Story! ✨"
                  onClick={handleStoryReveal}
                  tone="primary"
                />
            </div>
        );
    }

    if (currentStep?.buttonText) {
      const isFinal = currentStep.buttonText.includes("Again");
      if (isFinal) {
        return (
            <div className="mx-auto max-w-[90%] sm:max-w-[72%] mt-6 space-y-4 animate-fade-in">
                <BigButton
                    label="🎨 Remix My Story"
                    onClick={() => setIsRemixMode(true)}
                    tone="primary"
                />
                <BigButton
                    label={currentStep.buttonText}
                    onClick={restart}
                    tone="danger"
                />
            </div>
        );
      }
      return (
        <div className="mx-auto max-w-[90%] sm:max-w-[72%] mt-6 animate-fade-in">
            <BigButton
              label={currentStep.buttonText}
              onClick={isFinal ? restart : advanceStep}
              tone={isFinal ? "danger" : "primary"}
            />
        </div>
      );
    }

    return null;
  };

  if (isRemixMode) {
    const originalStory = chatHistory.findLast(msg => msg.content.includes('(The words you chose are now in our story!)'))?.content || '';
    return <RemixView originalWords={selectedWords} originalStory={originalStory} onRestart={restart} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 font-sans">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full opacity-60 animate-float"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full opacity-60 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full opacity-60 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <Header step={selectedWords.length} totalQuestions={totalQuestions} />

      <main className="max-w-3xl mx-auto px-4 pt-6 pb-8 relative z-10"> 
        <div className="space-y-6">
          {renderChatHistory()}
          <ActiveInteraction />
          <div ref={chatEndRef} /> 
        </div>
      </main>
    </div>
  );
}