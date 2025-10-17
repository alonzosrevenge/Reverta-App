import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Sun, Play, Pause, SkipForward } from "lucide-react";
import { QiblaCompass } from "@/components/QiblaCompass";
// Image paths (served from public/assets/)
const qiyamImage = "/assets/qiyam__1755315764811.png";
const allahuAkbarImage = "/assets/allahu akbar__1755315606428.png";
const rukuImage = "/assets/ruku_2_1755380083378.png";
const risingImage = "/assets/rise_fix_1755385046929.png";
const sujoodImage = "/assets/sujood__1755315716775.png";
const jalsaImage = "/assets/jasla_1755387306718.png";
const salawatImage = "/assets/jasla_1755387788514.png";
const assalamImage = "/assets/as-salam__1755387462887.png";

// Audio paths (served from public/assets/)
const allahuAkbarAudio = "/assets/Allahu Akbar_updt.mp3";
const alFatihaAudio = "/assets/Al Fatiha.mp3";
const additionalSurahAudio = "/assets/Additional Surah.mp3";
const rukuDhikrAudio = "/assets/Subhana rabbiya l-azim.mp3";
const samiAudio = "/assets/sami.mp3";
const sujudDhikrAudio = "/assets/subhana ala.mp3";
const jalsaAudio = "/assets/Rabbighfir li.mp3";
const tashahhudAudio = "/assets/Tashahhud.mp3";
const salawatAudio = "/assets/Salawat.mp3";
const tasleemAudio = "/assets/Tasleem.mp3";

const FAJR_STEPS = [
  {
    arabic: "Allāhu Akbar",
    english: "Allāhu Akbar (God is the Greatest)",
    description: "Begin your prayer by raising your hands to your ears and declaring God's greatness. This marks the start of your sacred connection with Allah.",
    step: "Opening Takbīr"
  },
  {
    arabic: "Bismillāhi r-raḥmāni r-raḥīm. Al-ḥamdu lillāhi rabbi l-'ālamīn. Ar-raḥmāni r-raḥīm. Māliki yawmi d-dīn. Iyyāka na'budu wa iyyāka nasta'īn. Ihdinā ṣ-ṣirāṭa l-mustaqīm. Ṣirāṭa lladhīna an'amta 'alayhim ghayri l-maghḍūbi 'alayhim wa lā ḍ-ḍāllīn.",
    english: "In the name of Allah, the Most Gracious, the Most Merciful. All praise is due to Allah, Lord of all the worlds. The Most Gracious, the Most Merciful. Master of the Day of Judgment. You alone we worship, and You alone we ask for help. Guide us to the straight path. The path of those You have blessed, not of those who have incurred Your wrath, nor of those who have gone astray.",
    description: "Recite Al-Fātiḥa (The Opening) - the essential chapter that must be recited in every unit of prayer. This is your direct conversation with Allah.",
    step: "Al-Fātiḥa"
  },
  {
    arabic: "Qul huwa Allāhu aḥad. Allāhu ṣ-ṣamad. Lam yalid wa lam yūlad. Wa lam yakun lahu kufuwan aḥad.",
    english: "Say: He is Allah, the One! Allah, the Eternal, Absolute. He begets not, nor is He begotten. And there is none like unto Him.",
    description: "Recite an additional Surah after Al-Fātiḥa. Surah Al-Ikhlāṣ is a beautiful choice about Allah's absolute oneness.",
    step: "Additional Surah"
  },
  {
    arabic: "Allāhu Akbar",
    english: "Allāhu Akbar",
    description: "Raise your hands to your ears and say \"Allahu Akbar\" then move into Rukū' (bowing position). Place your hands on your knees and bow with humility before Allah.",
    step: "Rukū' (Bowing)"
  },
  {
    arabic: "Subḥāna rabbiya l-'aẓīm",
    english: "Glory be to my Lord, the Most Great (3X)",
    description: "While in Rukū', glorify Allah with this phrase. Say it at least three times with contemplation and reverence.",
    step: "Rukū' Dhikr"
  },
  {
    arabic: "Sami' Allāhu liman ḥamidah. Rabbanā wa laka l-ḥamd",
    english: "Allah hears the one who praises Him. Our Lord, to You belongs all praise.",
    description: "Rise from Rukū' while saying this phrase, bringing your hands up to your ears and then down to a resting position.",
    step: "Rising from Rukū'"
  },
  {
    arabic: "Allāhu Akbar",
    english: "Allāhu Akbar",
    description: "Say Takbir while going down into Sujūd (prostration). This is the most humble position before Allah.",
    step: "Going to Sujūd"
  },
  {
    arabic: "Subḥāna rabbiya l-a'lā",
    english: "Glory be to my Lord, the Most High (3X)",
    description: "In Sujūd, glorify Allah with this phrase. Say it at least three times while your forehead touches the ground in ultimate humility.",
    step: "First Sujūd (Prostration)"
  },
  {
    arabic: "Rabbi ghfir lī",
    english: "My Lord, forgive me",
    description: "Sit briefly between the two prostrations and say this du'ā once or more. This sitting position is called Jalsa.",
    step: "Jalsa (Sitting Between Sujūd)"
  },
  {
    arabic: "Subḥāna rabbiya l-a'lā",
    english: "Glory be to my Lord, the Most High (3X)",
    description: "Prostrate again and repeat the same dhikr three times. This completes the first rak'ah.",
    step: "Second Sujūd (Prostration)"
  },
  {
    arabic: "At-taḥiyyātu lillāhi wa ṣ-ṣalawātu wa ṭ-ṭayyibāt. As-salāmu 'alayka ayyuha n-nabiyyu wa raḥmatu llāhi wa barakātuh. As-salāmu 'alaynā wa 'alā 'ibādi llāhi ṣ-ṣāliḥīn. Ash-hadu an lā ilāha illa llāh, wa ash-hadu anna Muḥammadan 'abduhū wa rasūluh.",
    english: "All compliments, prayers and pure words are due to Allah. Peace be upon you, O Prophet, and Allah's mercy and blessings. Peace be upon us and upon all righteous servants of Allah. I bear witness that none has the right to be worshipped except Allah, and I bear witness that Muhammad is His servant and messenger.",
    description: "Sit calmly and recite the complete Tashahhud. Point your index finger during the testimony of faith.",
    step: "Tashahhud (Final Sitting)"
  },
  {
    arabic: "Allāhumma ṣalli 'alā Muḥammadin wa 'alā āli Muḥammad, kamā ṣallayta 'alā Ibrāhīma wa 'alā āli Ibrāhīm, innaka ḥamīdun majīd. Allāhumma bārik 'alā Muḥammadin wa 'alā āli Muḥammad, kamā bārakta 'alā Ibrāhīma wa 'alā āli Ibrāhīm, innaka ḥamīdun majīd.",
    english: "O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and upon the family of Ibrahim. Indeed, You are Praiseworthy and Glorious. O Allah, send blessings upon Muhammad and upon the family of Muhammad, as You sent blessings upon Ibrahim and upon the family of Ibrahim. Indeed, You are Praiseworthy and Glorious.",
    description: "Continue sitting and recite the Salawat (Durood Ibrahim) - sending prayers and blessings upon Prophet Muhammad ﷺ. This beautiful prayer connects your worship to all the prophets before him.",
    step: "Salawat (Salat upon the Prophet)"
  },
  {
    arabic: "As-salāmu 'alaykum wa raḥmatullāh",
    english: "As-salāmu 'alaykum wa raḥmatullāh",
    description: "Turn your head to the RIGHT and say: 'As-salāmu 'alaykum wa raḥmatullāh' (Peace and mercy of Allah be upon you). Then turn your head to the LEFT and repeat the same greeting. This completes your Salah.",
    step: "Tasleem (Final Salutations)"
  }
];

function FajrIntro({ onBegin }: { onBegin: () => void }) {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    setLocation("/pray");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden animate-fade-in">
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 p-3 rounded-full bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm transition-all duration-300 z-20"
      >
        <ArrowLeft className="w-5 h-5 text-purple-400" />
      </button>

      <div className="text-center max-w-3xl mx-auto">
        <div className="mb-8 animate-scale-in">
          <div className="w-32 h-32 mx-auto rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-yellow-500 to-pink-500 animate-pulse"></div>
            <div className="absolute inset-[2px] bg-slate-900 rounded-3xl flex items-center justify-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-yellow-400" style={{ fontFamily: 'serif' }}>
                الفجر
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 animate-slide-up">
          <h1 className="text-6xl md:text-7xl font-black mb-4 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-400 to-pink-400">
              Fajr
            </span>
          </h1>
          <h2 className="text-2xl md:text-3xl text-slate-300 font-light mb-4">Dawn Salah • 2 Rakahs</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
            Begin your day with gratitude and connection to Allah. The blessed dawn prayer that brings light to your soul and sets the spiritual tone for your entire day.
          </p>
        </div>

        <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 animate-slide-up mb-8">
          <h3 className="text-xl font-bold text-slate-200 mb-4">Salah Guidance</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            This guided prayer will take you through each step of Fajr salah, starting with the opening Takbīr "Allāhu Akbar" followed by the essential Al-Fātiḥa. 
            Each step includes Arabic text, English translation, and detailed guidance.
          </p>
          <p className="text-slate-400 text-sm">
            Take your time with each step. Focus on the meaning and let your heart connect with Allah during this sacred time.
          </p>
        </div>

        {/* Qibla Compass */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <QiblaCompass theme="orange" />
        </div>

        <button 
          onClick={onBegin}
          className="btn-primary text-black px-12 py-4 rounded-full text-xl font-bold shadow-2xl inline-flex items-center gap-3 backdrop-blur-sm hover:scale-105 transition-transform duration-300"
        >
          <Play className="w-6 h-6" />
          Begin Fajr Prayer
        </button>
      </div>

      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-yellow-400/20 rounded-full blur-3xl animate-pulse -z-10"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-yellow-400/15 to-pink-400/15 rounded-full blur-3xl animate-pulse -z-10"></div>
    </div>
  );
}

export default function FajrPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [, setLocation] = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [currentAudioFile, setCurrentAudioFile] = useState<string | null>(null);

  const handleBegin = () => setShowIntro(false);

  const handleNext = () => {
    if (stepIndex < FAJR_STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  };

  const handleBack = () => {
    setLocation("/pray");
  };

  const handleComplete = () => {
    setLocation("/my-journey");
  };

  const handleAudioToggle = () => {
    // Determine which audio file to use based on current step
    let audioFile: string | undefined;
    if (current.step.includes("Opening Takbīr")) {
      audioFile = allahuAkbarAudio;
    } else if (current.step.includes("Al-Fātiḥa")) {
      audioFile = alFatihaAudio;
    } else if (current.step.includes("Additional Surah")) {
      audioFile = additionalSurahAudio;
    } else if (current.step.includes("Rukū' Dhikr")) {
      audioFile = rukuDhikrAudio;
    } else if (current.step.includes("Rising from Rukū'")) {
      audioFile = samiAudio;
    } else if (current.step.includes("Sujūd Dhikr")) {
      audioFile = sujudDhikrAudio;
    } else if (current.step.includes("Jalsa")) {
      audioFile = jalsaAudio;
    } else if (current.step.includes("Tashahhud")) {
      audioFile = tashahhudAudio;
    } else if (current.step.includes("Salawat")) {
      audioFile = salawatAudio;
    } else if (current.step.includes("Second Sujūd")) {
      audioFile = sujudDhikrAudio;
    } else if (current.step.includes("Tasleem")) {
      audioFile = tasleemAudio;
    } else if (current.step.includes("Rukū' (Bowing)") || current.step.includes("Going to Sujūd")) {
      audioFile = allahuAkbarAudio;
    }
    
    if (!audioFile) return;
    
    if (!audioRef || currentAudioFile !== audioFile) {
      // Create new audio instance if none exists or if audio file changed
      if (audioRef) {
        audioRef.pause();
      }
      const audio = new Audio(audioFile);
      setAudioRef(audio);
      setCurrentAudioFile(audioFile);
      audio.play();
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
    } else {
      if (isPlaying) {
        audioRef.pause();
        setIsPlaying(false);
      } else {
        audioRef.play();
        setIsPlaying(true);
        audioRef.onended = () => setIsPlaying(false);
      }
    }
  };

  if (showIntro) {
    return <FajrIntro onBegin={handleBegin} />;
  }

  const current = FAJR_STEPS[stepIndex];
  const isLastStep = stepIndex === FAJR_STEPS.length - 1;
  


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden animate-fade-in">
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 p-3 rounded-full bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm transition-all duration-300 z-20"
      >
        <ArrowLeft className="w-5 h-5 text-purple-400" />
      </button>

      {/* Progress indicator */}
      <div className="absolute top-6 right-6 text-slate-400 z-20">
        <span className="text-sm font-medium">
          {stepIndex + 1} of {FAJR_STEPS.length}
        </span>
      </div>

      <div className="text-center max-w-4xl mx-auto">
        {/* Step content */}
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-slate-700/50 shadow-2xl animate-scale-in">
          


          {/* Media section for prayer pose illustration */}
          <div className="mb-8">
            <div className="relative w-full max-w-lg mx-auto h-64 bg-slate-700/30 rounded-2xl border border-slate-600/50 overflow-hidden">
              {(stepIndex === 5 || current.step.includes("Rising")) ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl">
                  <div className="w-full h-full flex items-center justify-center">
                    <img 
                      src={risingImage}
                      alt="Rising from Ruku - Hand Positions"
                      className="max-w-full max-h-full object-contain"
                      onLoad={() => console.log('Rising from Ruku image loaded')}
                      onError={() => console.log('Rising from Ruku image failed to load')}
                    />
                  </div>
                </div>
              ) : (current.step.includes("Jalsa") || current.step.includes("Tashahhud") || current.step.includes("Salawat")) ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl">
                  <img 
                    src={current.step.includes("Salawat") ? salawatImage : jalsaImage}
                    alt={current.step.includes("Salawat") ? "Salawat - Sitting Position" : "Jalsa/Tashahhud Sitting Position"}
                    className="max-w-full max-h-full object-contain"
                    onLoad={() => console.log(current.step.includes("Salawat") ? 'Salawat sitting image loaded' : 'Jalsa sitting image loaded')}
                    onError={() => console.log(current.step.includes("Salawat") ? 'Salawat sitting image failed to load' : 'Jalsa sitting image failed to load')}
                  />
                </div>
              ) : (current.step.includes("Sujūd") || current.step.includes("Going to Sujūd")) ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl">
                  <img 
                    src={sujoodImage} 
                    alt="Sujood (Prostration) Position"
                    className="max-w-full max-h-full object-contain"
                    onLoad={() => console.log('Sujood image loaded')}
                    onError={() => console.log('Sujood image failed to load')}
                  />
                </div>
              ) : (current.step.includes("Opening Takbīr")) ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl">
                  <img 
                    src={allahuAkbarImage} 
                    alt="Allahu Akbar Hand Position"
                    className="max-w-full max-h-full object-contain"
                    onLoad={() => console.log('Allahu Akbar image loaded')}
                    onError={() => console.log('Allahu Akbar image failed to load')}
                  />
                </div>
              ) : (current.step.includes("Rukū' Dhikr")) ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
  <img
    src="/assets/ruku_2_1755380083378.png"
    alt="Ruku Dhikr Position"
    className="max-w-full max-h-full object-contain"
    onLoad={() => console.log('Ruku Dhikr image loaded')}
    onError={() => console.log('Ruku Dhikr image failed to load')}
  />
</div>

              ) : (current.step.includes("Rukū'")) ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl">
                  <img 
                    src={rukuImage} 
                    alt="Ruku (Bowing) Position"
                    className="max-w-full max-h-full object-contain"
                    onLoad={() => console.log('Ruku image loaded')}
                    onError={() => console.log('Ruku image failed to load')}
                  />
                </div>
              ) : (current.step.includes("Tasleem") || current.step.includes("Final Salutations")) ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl">
                  <img 
                    src={assalamImage} 
                    alt="Tasleem - Final Salutations (Right and Left)"
                    className="max-w-full max-h-full object-contain"
                    onLoad={() => console.log('Tasleem salutations image loaded')}
                    onError={() => console.log('Tasleem salutations image failed to load')}
                  />
                </div>
              ) : (current.step === "Al-Fātiḥa" || current.step === "Additional Surah" || current.step.includes("Standing")) ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl">
                  <img 
                    src={qiyamImage} 
                    alt="Qiyam (Standing) Position"
                    className="max-w-full max-h-full object-contain"
                    onLoad={() => console.log('Qiyam image loaded')}
                    onError={() => console.log('Qiyam image failed to load')}
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-400/20 flex items-center justify-center">
                      <svg className="w-8 h-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-slate-400 text-sm">Prayer pose guidance</p>
                    <p className="text-slate-500 text-xs mt-1">Visual aid for proper prayer position</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Step title */}
          <div className="mb-6">
            <h3 className="text-lg text-orange-400 font-semibold uppercase tracking-wide">
              {current.step}
            </h3>
          </div>

          {/* Arabic text */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-400 to-pink-400 mb-4 leading-relaxed" 
                style={{ fontFamily: 'serif', direction: 'rtl', lineHeight: '1.8' }}>
              {current.arabic}
            </h2>
          </div>

          {/* Audio player */}
          <div className="mb-8">
            <div className="bg-slate-700/50 rounded-xl p-4 inline-flex items-center gap-3">
              {(current.step.includes("Opening Takbīr") || current.step.includes("Al-Fātiḥa") || current.step.includes("Additional Surah") || current.step.includes("Rukū' (Bowing)") || current.step.includes("Rukū' Dhikr") || current.step.includes("Rising from Rukū'") || current.step.includes("Going to Sujūd") || current.step.includes("Sujūd Dhikr") || current.step.includes("Jalsa") || current.step.includes("Tashahhud") || current.step.includes("Salawat") || current.step.includes("Second Sujūd") || current.step.includes("Tasleem")) ? (
                <>
                  <button 
                    onClick={handleAudioToggle}
                    className="p-2 rounded-full bg-orange-400/20 hover:bg-orange-400/30 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-orange-400" />
                    ) : (
                      <Play className="w-5 h-5 text-orange-400" />
                    )}
                  </button>
                  <span className="text-slate-400 text-sm">
                    {isPlaying ? 
                      (current.step.includes("Opening Takbīr") ? "Playing Allahu Akbar..." : 
                       current.step.includes("Al-Fātiḥa") ? "Playing Al-Fatiha..." :
                       current.step.includes("Additional Surah") ? "Playing Additional Surah..." :
                       current.step.includes("Rukū' (Bowing)") || current.step.includes("Going to Sujūd") ? "Playing Allahu Akbar..." :
                       current.step.includes("Rukū' Dhikr") ? "Playing Rukū' Dhikr..." :
                       current.step.includes("Rising from Rukū'") ? "Playing Sami'..." :
                       current.step.includes("Sujūd Dhikr") ? "Playing Sujūd Dhikr..." :
                       current.step.includes("Jalsa") ? "Playing Jalsa Du'a..." :
                       current.step.includes("Tashahhud") ? "Playing Tashahhud..." :
                       current.step.includes("Salawat") ? "Playing Salawat..." :
                       current.step.includes("Second Sujūd") ? "Playing Second Sujūd..." :
                       current.step.includes("Tasleem") ? "Playing Tasleem..." : "Playing recitation...") : 
                      "Listen to recitation"
                    }
                  </span>
                </>
              ) : (
                <>
                  <button className="p-2 rounded-full bg-orange-400/20 hover:bg-orange-400/30 transition-colors opacity-50 cursor-not-allowed">
                    <Play className="w-5 h-5 text-orange-400" />
                  </button>
                  <span className="text-slate-400 text-sm">Audio recitation (coming soon)</span>
                </>
              )}
            </div>
          </div>

          {/* English translation */}
          <div className="mb-8">
            <p className="text-xl md:text-2xl text-slate-200 font-medium leading-relaxed">
              {current.english}
            </p>
          </div>

          {/* Description */}
          <div className="mb-8">
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              {current.description}
            </p>
          </div>

          {/* Navigation buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!isLastStep ? (
              <button 
                onClick={handleNext}
                className="btn-primary text-black px-8 py-3 rounded-full text-lg font-bold shadow-xl inline-flex items-center gap-3 backdrop-blur-sm hover:scale-105 transition-transform duration-300"
              >
                Next Step
                <SkipForward className="w-5 h-5" />
              </button>
            ) : (
              <button 
                onClick={handleComplete}
                className="btn-primary text-black px-8 py-3 rounded-full text-lg font-bold shadow-xl inline-flex items-center gap-3 backdrop-blur-sm hover:scale-105 transition-transform duration-300"
              >
                Complete Prayer
                <Sun className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-yellow-400/20 rounded-full blur-3xl animate-pulse -z-10"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-yellow-400/15 to-pink-400/15 rounded-full blur-3xl animate-pulse -z-10"></div>
      
      {/* Progress background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {Array.from({ length: stepIndex + 1 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-400/30 rounded-full animate-ping"
            style={{
              top: `${20 + (i * 10)}%`,
              left: `${10 + (i * 15)}%`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}