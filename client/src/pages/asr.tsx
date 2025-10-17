import { QiblaCompass } from "@/components/QiblaCompass";
import { useState, useRef } from "react";
import { ArrowLeft, ArrowRight, Sun, Play, Pause } from "lucide-react";
import { useLocation } from "wouter";
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

const ASR_STEPS = [
  // First Rakah
  {
    arabic: "Allāhu Akbar",
    english: "Allāhu Akbar (God is the Greatest)",
    description:
      "Begin your prayer by raising your hands to your ears and declaring God's greatness. This marks the start of your sacred connection with Allah.",
    step: "Opening Takbīr",
  },
  {
    arabic:
      "Bismillāhi r-raḥmāni r-raḥīm. Al-ḥamdu lillāhi rabbi l-'ālamīn. Ar-raḥmāni r-raḥīm. Māliki yawmi d-dīn. Iyyāka na'budu wa iyyāka nasta'īn. Ihdinā ṣ-ṣirāṭa l-mustaqīm. Ṣirāṭa lladhīna an'amta 'alayhim ghayri l-maghḍūbi 'alayhim wa lā ḍ-ḍāllīn.",
    english:
      "In the name of Allah, the Most Gracious, the Most Merciful. All praise is due to Allah, Lord of all the worlds. The Most Gracious, the Most Merciful. Master of the Day of Judgment. You alone we worship, and You alone we ask for help. Guide us to the straight path. The path of those You have blessed, not of those who have incurred Your wrath, nor of those who have gone astray.",
    description:
      "Recite Al-Fātiḥa (The Opening) - the essential chapter that must be recited in every unit of prayer. This is your direct conversation with Allah.",
    step: "Al-Fātiḥa (1st Rakah)",
  },
  {
    arabic:
      "Qul huwa Allāhu aḥad. Allāhu ṣ-ṣamad. Lam yalid wa lam yūlad. Wa lam yakun lahu kufuwan aḥad.",
    english:
      "Say: He is Allah, the One! Allah, the Eternal, Absolute. He begets not, nor is He begotten. And there is none like unto Him.",
    description:
      "Recite an additional Surah after Al-Fātiḥa. Surah Al-Ikhlāṣ is a beautiful choice about Allah's absolute oneness.",
    step: "Additional Surah (1st Rakah)",
  },
  {
    arabic: "Allāhu Akbar",
    english: "Allāhu Akbar",
    description:
      'Raise your hands to your ears and say "Allahu Akbar" then move into Rukū\' (bowing position). Place your hands on your knees and bow with humility before Allah.',
    step: "Rukū' (1st Rakah)",
  },
  {
    arabic: "Subḥāna rabbiya l-'aẓīm",
    english: "Glory be to my Lord, the Most Great (3X)",
    description:
      "While in Rukū', glorify Allah with this phrase. Say it at least three times with contemplation and reverence.",
    step: "Rukū' Dhikr (1st Rakah)",
  },
  {
    arabic: "Sami' Allāhu liman ḥamidah. Rabbanā wa laka l-ḥamd",
    english:
      "Allah hears the one who praises Him. Our Lord, to You belongs all praise.",
    description:
      "Rise from Rukū' while saying this phrase, bringing your hands up to your ears and then down to a resting position.",
    step: "Rising from Rukū' (1st Rakah)",
  },
  {
    arabic: "Allāhu Akbar",
    english: "Allāhu Akbar",
    description:
      "Say Takbir while going down into Sujūd (prostration). This is the most humble position before Allah.",
    step: "Going to Sujūd (1st Rakah)",
  },
  {
    arabic: "Subḥāna rabbiya l-a'lā",
    english: "Glory be to my Lord, the Most High (3X)",
    description:
      "In Sujūd, glorify Allah with this phrase. Say it at least three times while your forehead touches the ground in ultimate humility.",
    step: "First Sujūd (1st Rakah)",
  },
  {
    arabic: "Rabbi ghfir lī",
    english: "My Lord, forgive me",
    description:
      "Sit briefly between the two prostrations and say this du'ā once or more. This sitting position is called Jalsa.",
    step: "Jalsa (1st Rakah)",
  },
  {
    arabic: "Subḥāna rabbiya l-a'lā",
    english: "Glory be to my Lord, the Most High (3X)",
    description:
      "Prostrate again and repeat the same dhikr three times. This completes the first rak'ah.",
    step: "Second Sujūd (1st Rakah)",
  },
  // Second Rakah
  {
    arabic:
      "Bismillāhi r-raḥmāni r-raḥīm. Al-ḥamdu lillāhi rabbi l-'ālamīn. Ar-raḥmāni r-raḥīm. Māliki yawmi d-dīn. Iyyāka na'budu wa iyyāka nasta'īn. Ihdinā ṣ-ṣirāṭa l-mustaqīm. Ṣirāṭa lladhīna an'amta 'alayhim ghayri l-maghḍūbi 'alayhim wa lā ḍ-ḍāllīn.",
    english: "Recite Al-Fātiḥa for the second rak'ah.",
    description:
      "Stand for the second rak'ah and recite Al-Fātiḥa again. In the first two rak'ahs of Asr, both Al-Fātiḥa and an additional Surah are recited.",
    step: "Al-Fātiḥa (2nd Rakah)",
  },
  {
    arabic:
      "Qul a'ūdhu bi rabbi l-falaq. Min sharri mā khalaq. Wa min sharri ghāsiqin idhā waqab. Wa min sharri n-naffāthāti fī l-'uqad. Wa min sharri ḥāsidin idhā ḥasad.",
    english:
      "Say: I seek refuge in the Lord of daybreak, from the evil of that which He created, and from the evil of darkness when it settles, and from the evil of the blowers in knots, and from the evil of an envier when he envies.",
    description:
      "Recite an additional Surah. Surah Al-Falaq offers protection and seeks refuge in Allah from all forms of evil.",
    step: "Additional Surah (2nd Rakah)",
  },
  {
    arabic: "Allāhu Akbar",
    english: "Allāhu Akbar",
    description: "Move into Rukū' for the second rak'ah.",
    step: "Rukū' (2nd Rakah)",
  },
  {
    arabic: "Subḥāna rabbiya l-'aẓīm",
    english: "Glory be to my Lord, the Most Great (3X)",
    description: "Glorify Allah while in Rukū' for the second rak'ah.",
    step: "Rukū' Dhikr (2nd Rakah)",
  },
  {
    arabic: "Sami' Allāhu liman ḥamidah. Rabbanā wa laka l-ḥamd",
    english:
      "Allah hears the one who praises Him. Our Lord, to You belongs all praise.",
    description: "Rise from Rukū' for the second rak'ah.",
    step: "Rising from Rukū' (2nd Rakah)",
  },
  {
    arabic: "Subḥāna rabbiya l-a'lā",
    english: "Glory be to my Lord, the Most High (3X)",
    description: "Prostrate for the first Sujūd of the second rak'ah.",
    step: "First Sujūd (2nd Rakah)",
  },
  {
    arabic: "Rabbi ghfir lī",
    english: "My Lord, forgive me",
    description: "Sit between prostrations for the second rak'ah.",
    step: "Jalsa (2nd Rakah)",
  },
  {
    arabic: "Subḥāna rabbiya l-a'lā",
    english: "Glory be to my Lord, the Most High (3X)",
    description: "Complete the second prostration of the second rak'ah.",
    step: "Second Sujūd (2nd Rakah)",
  },
  {
    arabic:
      "At-taḥiyyātu lillāhi wa ṣ-ṣalawātu wa ṭ-ṭayyibāt. As-salāmu 'alayka ayyuha n-nabiyyu wa raḥmatu llāhi wa barakātuh. As-salāmu 'alaynā wa 'alā 'ibādi llāhi ṣ-ṣāliḥīn. Ash-hadu an lā ilāha illa llāh, wa ash-hadu anna Muḥammadan 'abduhū wa rasūluh.",
    english:
      "All compliments, prayers and pure words are due to Allah. Peace be upon you, O Prophet, and Allah's mercy and blessings. Peace be upon us and upon all righteous servants of Allah. I bear witness that none has the right to be worshipped except Allah, and I bear witness that Muhammad is His servant and messenger.",
    description:
      "Sit and recite the first Tashahhud after completing two rak'ahs. Point your index finger during the testimony.",
    step: "First Tashahhud",
  },
  // Third Rakah
  {
    arabic:
      "Bismillāhi r-raḥmāni r-raḥīm. Al-ḥamdu lillāhi rabbi l-'ālamīn. Ar-raḥmāni r-raḥīm. Māliki yawmi d-dīn. Iyyāka na'budu wa iyyāka nasta'īn. Ihdinā ṣ-ṣirāṭa l-mustaqīm. Ṣirāṭa lladhīna an'amta 'alayhim ghayri l-maghḍūbi 'alayhim wa lā ḍ-ḍāllīn.",
    english: "Recite Al-Fātiḥa for the third rak'ah.",
    description:
      "Stand for the third rak'ah and recite Al-Fātiḥa. In the last two rak'ahs of Asr, only Al-Fātiḥa is recited (no additional Surah).",
    step: "Al-Fātiḥa (3rd Rakah)",
  },
  {
    arabic: "Allāhu Akbar",
    english: "Allāhu Akbar",
    description: "Move into Rukū' for the third rak'ah.",
    step: "Rukū' (3rd Rakah)",
  },
  {
    arabic: "Subḥāna rabbiya l-'aẓīm",
    english: "Glory be to my Lord, the Most Great (3X)",
    description: "Glorify Allah while in Rukū' for the third rak'ah.",
    step: "Rukū' Dhikr (3rd Rakah)",
  },
  {
    arabic: "Sami' Allāhu liman ḥamidah. Rabbanā wa laka l-ḥamd",
    english:
      "Allah hears the one who praises Him. Our Lord, to You belongs all praise.",
    description: "Rise from Rukū' for the third rak'ah.",
    step: "Rising from Rukū' (3rd Rakah)",
  },
  {
    arabic: "Subḥāna rabbiya l-a'lā",
    english: "Glory be to my Lord, the Most High (3X)",
    description: "Prostrate for the first Sujūd of the third rak'ah.",
    step: "First Sujūd (3rd Rakah)",
  },
  {
    arabic: "Rabbi ghfir lī",
    english: "My Lord, forgive me",
    description: "Sit between prostrations for the third rak'ah.",
    step: "Jalsa (3rd Rakah)",
  },
  {
    arabic: "Subḥāna rabbiya l-a'lā",
    english: "Glory be to my Lord, the Most High (3X)",
    description: "Complete the second prostration of the third rak'ah.",
    step: "Second Sujūd (3rd Rakah)",
  },
  // Fourth Rakah
  {
    arabic:
      "Bismillāhi r-raḥmāni r-raḥīm. Al-ḥamdu lillāhi rabbi l-'ālamīn. Ar-raḥmāni r-raḥīm. Māliki yawmi d-dīn. Iyyāka na'budu wa iyyāka nasta'īn. Ihdinā ṣ-ṣirāṭa l-mustaqīm. Ṣirāṭa lladhīna an'amta 'alayhim ghayri l-maghḍūbi 'alayhim wa lā ḍ-ḍāllīn.",
    english: "Recite Al-Fātiḥa for the fourth and final rak'ah.",
    description:
      "Stand for the fourth rak'ah and recite Al-Fātiḥa. This is the final rak'ah of Asr prayer.",
    step: "Al-Fātiḥa (4th Rakah)",
  },
  {
    arabic: "Allāhu Akbar",
    english: "Allāhu Akbar",
    description: "Move into Rukū' for the fourth and final rak'ah.",
    step: "Rukū' (4th Rakah)",
  },
  {
    arabic: "Subḥāna rabbiya l-'aẓīm",
    english: "Glory be to my Lord, the Most Great (3X)",
    description: "Glorify Allah while in Rukū' for the fourth rak'ah.",
    step: "Rukū' Dhikr (4th Rakah)",
  },
  {
    arabic: "Sami' Allāhu liman ḥamidah. Rabbanā wa laka l-ḥamd",
    english:
      "Allah hears the one who praises Him. Our Lord, to You belongs all praise.",
    description: "Rise from Rukū' for the fourth rak'ah.",
    step: "Rising from Rukū' (4th Rakah)",
  },
  {
    arabic: "Subḥāna rabbiya l-a'lā",
    english: "Glory be to my Lord, the Most High (3X)",
    description: "Prostrate for the first Sujūd of the fourth rak'ah.",
    step: "First Sujūd (4th Rakah)",
  },
  {
    arabic: "Rabbi ghfir lī",
    english: "My Lord, forgive me",
    description: "Sit between prostrations for the fourth rak'ah.",
    step: "Jalsa (4th Rakah)",
  },
  {
    arabic: "Subḥāna rabbiya l-a'lā",
    english: "Glory be to my Lord, the Most High (3X)",
    description: "Complete the second prostration of the fourth rak'ah.",
    step: "Second Sujūd (4th Rakah)",
  },
  {
    arabic:
      "At-taḥiyyātu lillāhi wa ṣ-ṣalawātu wa ṭ-ṭayyibāt. As-salāmu 'alayka ayyuha n-nabiyyu wa raḥmatu llāhi wa barakātuh. As-salāmu 'alaynā wa 'alā 'ibādi llāhi ṣ-ṣāliḥīn. Ash-hadu an lā ilāha illa llāh, wa ash-hadu anna Muḥammadan 'abduhū wa rasūluh.",
    english:
      "All compliments, prayers and pure words are due to Allah. Peace be upon you, O Prophet, and Allah's mercy and blessings. Peace be upon us and upon all righteous servants of Allah. I bear witness that none has the right to be worshipped except Allah, and I bear witness that Muhammad is His servant and messenger.",
    description:
      "Sit calmly and recite the complete Tashahhud after completing all four rak'ahs. Point your index finger during the testimony of faith.",
    step: "Final Tashahhud",
  },
  {
    arabic:
      "Allāhumma ṣalli 'alā Muḥammadin wa 'alā āli Muḥammad, kamā ṣallayta 'alā Ibrāhīma wa 'alā āli Ibrāhīm, innaka ḥamīdun majīd. Allāhumma bārik 'alā Muḥammadin wa 'alā āli Muḥammad, kamā bārakta 'alā Ibrāhīma wa 'alā āli Ibrāhīm, innaka ḥamīdun majīd.",
    english:
      "O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and upon the family of Ibrahim. Indeed, You are Praiseworthy and Glorious. O Allah, send blessings upon Muhammad and upon the family of Muhammad, as You sent blessings upon Ibrahim and upon the family of Ibrahim. Indeed, You are Praiseworthy and Glorious.",
    description:
      "Continue sitting and recite the Salawat (Durood Ibrahim) - sending prayers and blessings upon Prophet Muhammad ﷺ. This beautiful prayer connects your worship to all the prophets before him.",
    step: "Salawat (Salat upon the Prophet)",
  },
  {
    arabic: "As-salāmu 'alaykum wa raḥmatullāh",
    english: "As-salāmu 'alaykum wa raḥmatullāh",
    description:
      "Turn your head to the RIGHT and say: 'As-salāmu 'alaykum wa raḥmatullāh' (Peace and mercy of Allah be upon you). Then turn your head to the LEFT and repeat the same greeting. This completes your Asr prayer.",
    step: "Tasleem (Final Salutations)",
  },
];

function AsrIntro({ onBegin }: { onBegin: () => void }) {
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
        <ArrowLeft className="w-5 h-5 text-amber-400" />
      </button>

      <div className="text-center max-w-3xl mx-auto">
        <div className="mb-8 animate-scale-in">
          <div className="w-32 h-32 mx-auto rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 animate-pulse"></div>
            <div className="absolute inset-[2px] bg-slate-900 rounded-3xl flex items-center justify-center">
              <div
                className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-orange-500"
                style={{ fontFamily: "serif" }}
              >
                العصر
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 animate-slide-up">
          <h1 className="text-6xl md:text-7xl font-black mb-4 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-600">
              Asr
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-light mb-2">
            Afternoon Prayer • 4 Rak'ahs
          </p>
          <p className="text-slate-400 text-sm md:text-base">
            The blessed afternoon prayer as shadows lengthen
          </p>
        </div>

        {/* Qibla Compass */}
        <div
          className="mb-8 animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <QiblaCompass theme="orange" />
        </div>

        <div
          className="space-y-6 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <button
            onClick={onBegin}
            className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 rounded-2xl font-semibold text-slate-900 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-3">
              Begin Asr Prayer
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AsrPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [, setLocation] = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentAudioFile, setCurrentAudioFile] = useState<string | null>(null);

  if (showIntro) {
    return <AsrIntro onBegin={() => setShowIntro(false)} />;
  }

  const current = ASR_STEPS[currentStep];
  const progress = ((currentStep + 1) / ASR_STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < ASR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setLocation("/pray");
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAudioToggle = () => {
    let audioFile = allahuAkbarAudio; // default

    // Select appropriate audio based on current step
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
    } else if (current.step.includes("Sujūd") && current.step.includes("First")) {
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
    } else if (current.step.includes("Rukū'") && !current.step.includes("Dhikr") && !current.step.includes("Rising")) {
      audioFile = allahuAkbarAudio;
    } else if (current.step.includes("Going to Sujūd")) {
      audioFile = allahuAkbarAudio;
    }
    
    if (!audioRef.current || currentAudioFile !== audioFile) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(audioFile);
      setCurrentAudioFile(audioFile);
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
    } else {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        audioRef.current.onended = () => setIsPlaying(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 relative overflow-hidden">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-800/50 z-30">
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              currentStep === 0 ? setShowIntro(true) : handlePrev()
            }
            className="p-3 rounded-full bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-amber-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              Asr Prayer
            </h1>
            <p className="text-slate-400 text-sm">
              Step {currentStep + 1} of {ASR_STEPS.length}
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto w-full">
        {/* Visual Guide Section */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">
              {current.step}
            </h3>

            <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center mb-4">
              {current.step.includes("Takbīr") ||
              current.step.includes("Going to Sujūd") ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl">
                  <img
                    src={allahuAkbarImage}
                    alt="Allahu Akbar Hand Position"
                    className="max-w-full max-h-full object-contain"
                    onLoad={() => console.log("Allahu Akbar image loaded")}
                    onError={() =>
                      console.log("Allahu Akbar image failed to load")
                    }
                  />
                </div>
              ) : current.step.includes("Al-Fātiḥa") ||
                current.step.includes("Additional Surah") ||
                current.step.includes("Standing") ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl">
                  <img
                    src={qiyamImage}
                    alt="Standing Position (Qiyam)"
                    className="max-w-full max-h-full object-contain"
                    onLoad={() => console.log("Qiyam standing image loaded")}
                    onError={() =>
                      console.log("Qiyam standing image failed to load")
                    }
                  />
                </div>
              ) : current.step.includes("Rukū'") &&
                !current.step.includes("Rising") ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl">
                  <img
                    src={rukuImage}
                    alt="Ruku Bowing Position"
                    className="max-w-full max-h-full object-contain"
                    onLoad={() => console.log("Ruku bowing image loaded")}
                    onError={() =>
                      console.log("Ruku bowing image failed to load")
                    }
                  />
                </div>
              ) : current.step.includes("Rising from Rukū'") ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl">
                  <img
                    src={risingImage}
                    alt="Rising from Ruku Position"
                    className="max-w-full max-h-full object-contain"
                    onLoad={() => console.log("Rising from Ruku image loaded")}
                    onError={() =>
                      console.log("Rising from Ruku image failed to load")
                    }
                  />
                </div>
              ) : current.step.includes("Sujūd") ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl">
                  <img
                    src={sujoodImage}
                    alt="Sujud Prostration Position"
                    className="max-w-full max-h-full object-contain"
                    onLoad={() => console.log("Sujud prostration image loaded")}
                    onError={() =>
                      console.log("Sujud prostration image failed to load")
                    }
                  />
                </div>
              ) : current.step.includes("Jalsa") ||
                current.step.includes("Tashahhud") ||
                current.step.includes("Salawat") ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl">
                  <img
                    src={
                      current.step.includes("Salawat")
                        ? salawatImage
                        : jalsaImage
                    }
                    alt={
                      current.step.includes("Salawat")
                        ? "Salawat - Sitting Position"
                        : "Jalsa/Tashahhud Sitting Position"
                    }
                    className="max-w-full max-h-full object-contain"
                    onLoad={() =>
                      console.log(
                        current.step.includes("Salawat")
                          ? "Salawat sitting image loaded"
                          : "Jalsa sitting image loaded",
                      )
                    }
                    onError={() =>
                      console.log(
                        current.step.includes("Salawat")
                          ? "Salawat sitting image failed to load"
                          : "Jalsa sitting image failed to load",
                      )
                    }
                  />
                </div>
              ) : current.step.includes("Tasleem") ||
                current.step.includes("Final Salutations") ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl">
                  <img
                    src={assalamImage}
                    alt="Tasleem - Final Salutations (Right and Left)"
                    className="max-w-full max-h-full object-contain"
                    onLoad={() =>
                      console.log("Tasleem salutations image loaded")
                    }
                    onError={() =>
                      console.log("Tasleem salutations image failed to load")
                    }
                  />
                </div>
              ) : (
                <div className="text-slate-500 text-center">
                  <p className="text-lg mb-2">Visual guidance</p>
                  <p className="text-sm">Position demonstration</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/50">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-600">
                  {current.arabic}
                </span>
              </h2>

              {/* Audio player */}
              <div className="mb-6">
                <div className="bg-slate-700/50 rounded-xl p-4 inline-flex items-center gap-3">
                  {(current.step.includes("Opening Takbīr") || current.step.includes("Al-Fātiḥa") || current.step.includes("Additional Surah") || current.step.includes("Rukū'") || current.step.includes("Rising from Rukū'") || current.step.includes("Sujūd") || current.step.includes("Jalsa") || current.step.includes("Tashahhud") || current.step.includes("Salawat") || current.step.includes("Tasleem")) ? (
                    <>
                      <button 
                        onClick={handleAudioToggle}
                        className="p-2 rounded-full bg-amber-400/20 hover:bg-amber-400/30 transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 text-amber-400" />
                        ) : (
                          <Play className="w-5 h-5 text-amber-400" />
                        )}
                      </button>
                      <span className="text-slate-400 text-sm">
                        {isPlaying ? 
                          (current.step.includes("Opening Takbīr") ? "Playing Allahu Akbar..." : 
                           current.step.includes("Al-Fātiḥa") ? "Playing Al-Fatiha..." :
                           current.step.includes("Additional Surah") ? "Playing Additional Surah..." :
                           current.step.includes("Rukū'") && !current.step.includes("Dhikr") && !current.step.includes("Rising") ? "Playing Allahu Akbar..." :
                           current.step.includes("Rukū' Dhikr") ? "Playing Rukū' Dhikr..." :
                           current.step.includes("Rising from Rukū'") ? "Playing Sami'..." :
                           current.step.includes("Sujūd") && current.step.includes("First") ? "Playing Sujūd Dhikr..." :
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
                      <button className="p-2 rounded-full bg-amber-400/20 hover:bg-amber-400/30 transition-colors opacity-50 cursor-not-allowed">
                        <Play className="w-5 h-5 text-amber-400" />
                      </button>
                      <span className="text-slate-400 text-sm">Audio recitation (coming soon)</span>
                    </>
                  )}
                </div>
              </div>
              <p className="text-slate-300 text-lg leading-relaxed mb-4">
                {current.english}
              </p>
              <p className="text-slate-400 leading-relaxed">
                {current.description}
              </p>
            </div>



            <div className="flex gap-4">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 text-white rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:via-orange-400 hover:to-red-500 text-slate-900 font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                {currentStep === ASR_STEPS.length - 1
                  ? "Complete Prayer"
                  : "Next Step"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
