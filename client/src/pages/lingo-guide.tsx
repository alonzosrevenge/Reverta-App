import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Search, BookOpen, Volume2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Import audio files
const adhanAudio = "/assets/Adhan.mp3" as const;
const alhamdulillahAudio = "/assets/Alhamdulillah.mp3" as const;
const allahAudio = "/assets/Allah.mp3" as const;
const allahuAkbarAudio = "/assets/Allahu Akbar.mp3" as const;
const ameenAudio = "/assets/Ameen.mp3" as const;
const asrAudio = "/assets/Asr.mp3" as const;
const assalamuAlaikumAudio = "/assets/Assalamu Alaikum.mp3" as const;
const ayahAudio = "/assets/Ayah.mp3" as const;
const barakallahufeekirAudio = "/assets/Barakallahu feeki.mp3" as const;
const bismillahAudio = "/assets/Bismillah.mp3" as const;
const dhikrAudio = "/assets/dhikr.mp3" as const;
const dhuhrAudio = "/assets/Dhuhr.mp3" as const;
const duaAudio = "/assets/Du'a .mp3" as const;
const fajrAudio = "/assets/Fajr.mp3" as const;
const hadithAudio = "/assets/Hadith.mp3" as const;
const hajjAudio = "/assets/Hajj .mp3" as const;
const halalAudio = "/assets/Halal .mp3" as const;
const haramAudio = "/assets/Haram.mp3" as const;
const imamAudio = "/assets/Imam.mp3" as const;
const imanAudio = "/assets/Iman.mp3" as const;
const inshaAllahAudio = "/assets/Insha'Allah.mp3" as const;
const ishaAudio = "/assets/Isha.mp3" as const;
const islamAudio = "/assets/Islam.mp3" as const;
const istighfarAudio = "/assets/Istighfar.mp3" as const;
const jibreelAudio = "/assets/Jibreel.mp3" as const;
const jihadAudio = "/assets/Jihad.mp3" as const;
const jummahAudio = "/assets/Jummah.mp3" as const;
const kaabaAudio = "/assets/Kaaba.mp3" as const;
const khutbahAudio = "/assets/Khutbah.mp3" as const;
const laIlahaIllaAllahAudio = "/assets/La ilaha illa Allah.mp3" as const;
const maghribAudio = "/assets/Maghrib .mp3" as const;
const mashaAllahAudio = "/assets/Masha'Allah.mp3" as const;
const masjidAudio = "/assets/Masjid.mp3" as const;
const meccaAudio = "/assets/Mecca.mp3" as const;
const medinaAudio = "/assets/Medina.mp3" as const;
const muslimAudio = "/assets/Muslim.mp3" as const;
const prophetMuhammadAudio = "/assets/Prophet Muhammad.mp3" as const;
const qiblaAudio = "/assets/Qibla.mp3" as const;
const quranAudio = "/assets/Quran.mp3" as const;
const rakahAudio = "/assets/Rak'ah.mp3" as const;
const ramadanAudio = "/assets/Ramadan.mp3" as const;
const sabrAudio = "/assets/Sabr.mp3" as const;
const sadaqahAudio = "/assets/Sadaqah.mp3" as const;
const salahAudio = "/assets/Salah.mp3" as const;
const sawmAudio = "/assets/Sawm.mp3" as const;
const shahadaAudio = "/assets/Shahada.mp3" as const;
const subhanAllahAudio = "/assets/SubhanAllah.mp3" as const;
const sujudAudio = "/assets/Sujud.mp3" as const;
const sunnahAudio = "/assets/Sunnah.mp3" as const;
const surahAudio = "/assets/Surah.mp3" as const;
const taqwaAudio = "/assets/Taqwa.mp3" as const;
const tasbeehAudio = "/assets/Tasbeeh.mp3" as const;
const tawakkulAudio = "/assets/Tawakkul.mp3" as const;
const ummahAudio = "/assets/Ummah.mp3" as const;
const wuduAudio = "/assets/Wudu.mp3" as const;
const zakatAudio = "/assets/Zakat.mp3" as const;

interface Term {
  title: string;
  definition: string;
  audio?: string;
}

const lingoTerms: Term[] = [
  // A
  {
    title: "Adhan (أذان)",
    definition: "The call to prayer, recited from the mosque to invite believers to join the salah. It serves as a spiritual reminder throughout the day.",
    audio: adhanAudio,
  },
  {
    title: "Alhamdulillah (الحمد لله)",
    definition: "Meaning 'All praise is due to Allah.' Said to express gratitude for Allah's blessings and mentioned in daily prayers.",
    audio: alhamdulillahAudio,
  },
  {
    title: "Allah (الله)",
    definition: "The Arabic word for God in Islam. Muslims believe Allah is the one and only God, the Creator and Sustainer of all existence.",
    audio: allahAudio,
  },
  {
    title: "Allahu Akbar (الله أكبر)",
    definition: "Meaning 'Allah is the Greatest.' Used during prayer, celebrations, and to express that Allah is greater than anything.",
    audio: allahuAkbarAudio,
  },
  {
    title: "Ameen (آمين)",
    definition: "Meaning 'so be it' or 'may it be so.' Said after du'as (prayers) to affirm and hope that Allah accepts the supplication.",
    audio: ameenAudio,
  },
  {
    title: "Asr (عصر)",
    definition: "The afternoon prayer performed in the late afternoon. It consists of 4 rak'at and comes before sunset.",
    audio: asrAudio,
  },
  {
    title: "Assalamu Alaikum (السلام عليكم)",
    definition: "Islamic greeting meaning 'Peace be upon you.' The response is 'Wa alaikum assalam' (And upon you peace).",
    audio: assalamuAlaikumAudio,
  },
  {
    title: "Ayah (آية)",
    definition: "A verse of the Qur'an. Each ayah contains divine guidance and wisdom. The word also means 'sign' or 'miracle.'",
    audio: ayahAudio,
  },

  // B
  {
    title: "Barakallahu feeki/feek (بارك الله فيك)",
    definition: "Meaning 'May Allah bless you.' A beautiful way to express gratitude or give blessings to someone.",
    audio: barakallahufeekirAudio,
  },
  {
    title: "Bismillah (بسم الله)",
    definition: "Meaning 'In the name of Allah.' Muslims say this before starting any task to seek Allah's blessing and guidance.",
    audio: bismillahAudio,
  },

  // D
  {
    title: "Dhikr (ذكر)",
    definition: "Remembrance of Allah through recitation of His names, Quranic verses, or prayers. It can be done silently or aloud.",
    audio: dhikrAudio,
  },
  {
    title: "Dhuhr (ظهر)",
    definition: "The midday prayer performed after the sun reaches its highest point. It consists of 4 rak'at (units of prayer).",
    audio: dhuhrAudio,
  },
  {
    title: "Du'a (دعاء)",
    definition: "A personal prayer or supplication where a Muslim speaks directly to Allah, asking for guidance, help, forgiveness, or expressing gratitude.",
    audio: duaAudio,
  },

  // F
  {
    title: "Fajr (فجر)",
    definition: "The dawn prayer — the first of the five daily prayers, performed before sunrise. It marks the spiritual start of the day.",
    audio: fajrAudio,
  },

  // H
  {
    title: "Hadith (حديث)",
    definition: "Recorded sayings, actions, and approvals of Prophet Muhammad ﷺ. They help explain and elaborate on the Qur'an.",
    audio: hadithAudio,
  },
  {
    title: "Hajj (حج)",
    definition: "The pilgrimage to Mecca that every Muslim should perform at least once in their lifetime if physically and financially able.",
    audio: hajjAudio,
  },
  {
    title: "Halal (حلال)",
    definition: "Permissible or lawful according to Islamic law. This applies to food, actions, business practices, and all aspects of life.",
    audio: halalAudio,
  },
  {
    title: "Haram (حرام)",
    definition: "Forbidden or unlawful according to Islamic law. Muslims avoid haram acts to maintain spiritual purity and please Allah.",
    audio: haramAudio,
  },

  // I
  {
    title: "Imam (إمام)",
    definition: "A leader who guides the prayer in congregation. Also refers to Islamic scholars and community leaders.",
    audio: imamAudio,
  },
  {
    title: "Iman (إيمان)",
    definition: "Faith and belief in Allah, His angels, books, messengers, the Day of Judgment, and divine decree. It grows stronger through good deeds and worship.",
    audio: imanAudio,
  },
  {
    title: "Insha'Allah (إن شاء الله)",
    definition: "Meaning 'If Allah wills.' Said when speaking about future plans, acknowledging that all things happen by Allah's will.",
    audio: inshaAllahAudio,
  },
  {
    title: "Isha (عشاء)",
    definition: "The night prayer performed after twilight has disappeared. It consists of 4 rak'at and is the last prayer of the day.",
    audio: ishaAudio,
  },
  {
    title: "Islam (إسلام)",
    definition: "Literally means 'submission' or 'peace.' It is the monotheistic religion revealed through the Prophet Muhammad ﷺ.",
    audio: islamAudio,
  },
  {
    title: "Istighfar (استغفار)",
    definition: "Seeking forgiveness from Allah. The common phrase is 'Astaghfirullah' meaning 'I seek forgiveness from Allah.'",
    audio: istighfarAudio,
  },

  // J
  {
    title: "Jibreel (جبريل)",
    definition: "The angel Gabriel in Islam, who brought Allah's messages to the prophets, including the Qur'an to Prophet Muhammad ﷺ.",
    audio: jibreelAudio,
  },
  {
    title: "Jihad (جهاد)",
    definition: "Literally means 'struggle' or 'effort.' It refers to the spiritual struggle against one's ego and the effort to improve oneself and society.",
    audio: jihadAudio,
  },
  {
    title: "Jummah (جمعة)",
    definition: "Friday, the day of congregational prayer. Muslims gather at mosques for a special prayer and sermon (khutbah) at midday.",
    audio: jummahAudio,
  },

  // K
  {
    title: "Kaaba (كعبة)",
    definition: "The sacred black cube-shaped building in Mecca that Muslims face during prayer. It was built by Prophet Ibrahim and his son Ismail.",
    audio: kaabaAudio,
  },
  {
    title: "Khutbah (خطبة)",
    definition: "The sermon delivered during Friday prayers and on special occasions. It provides spiritual guidance and addresses community issues.",
    audio: khutbahAudio,
  },

  // L
  {
    title: "La ilaha illa Allah (لا إله إلا الله)",
    definition: "Meaning 'There is no god but Allah.' The core declaration of Islamic monotheism and part of the Shahada.",
    audio: laIlahaIllaAllahAudio,
  },

  // M
  {
    title: "Maghrib (مغرب)",
    definition: "The sunset prayer performed just after sunset. It consists of 3 rak'at and marks the end of the day.",
    audio: maghribAudio,
  },
  {
    title: "Masha'Allah (ما شاء الله)",
    definition: "Meaning 'What Allah has willed.' Said to express appreciation and to ward off the evil eye when admiring something.",
    audio: mashaAllahAudio,
  },
  {
    title: "Masjid (مسجد)",
    definition: "A mosque, the place where Muslims gather for prayer and worship. It serves as a community center for spiritual and social activities.",
    audio: masjidAudio,
  },
  {
    title: "Mecca (مكة)",
    definition: "The holiest city in Islam, birthplace of Prophet Muhammad ﷺ and home to the Kaaba. Muslims perform Hajj pilgrimage here.",
    audio: meccaAudio,
  },
  {
    title: "Medina (المدينة)",
    definition: "The second holiest city in Islam, where Prophet Muhammad ﷺ migrated and established the first Muslim community.",
    audio: medinaAudio,
  },
  {
    title: "Muslim (مسلم)",
    definition: "A person who practices Islam, meaning 'one who submits to Allah.' Both men and women are called Muslims.",
    audio: muslimAudio,
  },

  // P
  {
    title: "Prophet Muhammad ﷺ",
    definition: "The final messenger of Allah, who received the Qur'an. Muslims follow his example (Sunnah) in worship and daily life.",
    audio: prophetMuhammadAudio,
  },

  // Q
  {
    title: "Qibla (قبلة)",
    definition: "The direction Muslims face during prayer — towards the Kaaba in Mecca. It symbolizes unity in worship.",
    audio: qiblaAudio,
  },
  {
    title: "Quran (قرآن)",
    definition: "The holy book of Islam, believed to be the direct word of Allah revealed to Prophet Muhammad ﷺ through the angel Jibreel (Gabriel).",
    audio: quranAudio,
  },

  // R
  {
    title: "Rak'ah (ركعة)",
    definition: "A unit of Islamic prayer that includes specific physical and spiritual actions. Each salah consists of a set number of rak'at.",
    audio: rakahAudio,
  },
  {
    title: "Ramadan (رمضان)",
    definition: "The ninth month of the Islamic calendar, during which Muslims fast from dawn to sunset. It's a time of spiritual reflection and increased devotion.",
    audio: ramadanAudio,
  },

  // S
  {
    title: "Sabr (صبر)",
    definition: "Patience and perseverance in the face of trials. It's considered a virtue that brings one closer to Allah and leads to spiritual growth.",
    audio: sabrAudio,
  },
  {
    title: "Sadaqah (صدقة)",
    definition: "Voluntary charity given out of kindness and love for Allah. It can be money, goods, or even a kind word or smile.",
    audio: sadaqahAudio,
  },
  {
    title: "Salah (صلاة)",
    definition: "The Islamic ritual prayer performed five times daily. It is one of the Five Pillars of Islam and a direct link between the worshipper and Allah.",
    audio: salahAudio,
  },
  {
    title: "Sawm (صوم)",
    definition: "Fasting during the month of Ramadan, one of the Five Pillars. Muslims abstain from food, drink, and intimacy from dawn to sunset.",
    audio: sawmAudio,
  },
  {
    title: "Shahada (شهادة)",
    definition: "The declaration of faith: 'There is no god but Allah, and Muhammad is the Messenger of Allah.' It is the first of the Five Pillars and the entry point into Islam.",
    audio: shahadaAudio,
  },
  {
    title: "SubhanAllah (سبحان الله)",
    definition: "Meaning 'Glory be to Allah' or 'Allah is free from imperfection.' Used to glorify Allah and express amazement at His creation.",
    audio: subhanAllahAudio,
  },
  {
    title: "Sujud (سجود)",
    definition: "Prostration in prayer where the forehead, nose, palms, knees, and toes touch the ground. It represents complete submission to Allah.",
    audio: sujudAudio,
  },
  {
    title: "Sunnah (سنة)",
    definition: "The teachings and practices of the Prophet Muhammad ﷺ. Following the Sunnah helps Muslims live in accordance with the Prophet's example.",
    audio: sunnahAudio,
  },
  {
    title: "Surah (سورة)",
    definition: "A chapter of the Qur'an. Each surah carries unique guidance, stories, and lessons. There are 114 surahs in total.",
    audio: surahAudio,
  },

  // T
  {
    title: "Taqwa (تقوى)",
    definition: "God-consciousness or piety. It means being mindful of Allah in all actions and striving to please Him while avoiding sin.",
    audio: taqwaAudio,
  },
  {
    title: "Tasbeeh (تسبيح)",
    definition: "Glorifying Allah by repeating phrases like 'SubhanAllah' (Glory be to God). It can be done with prayer beads or on the fingers.",
    audio: tasbeehAudio,
  },
  {
    title: "Tawakkul (توكل)",
    definition: "Reliance and trust in Allah. It means taking necessary actions while placing complete trust in Allah for the outcome.",
    audio: tawakkulAudio,
  },

  // U
  {
    title: "Ummah (أمة)",
    definition: "The global Muslim community. It represents the unity and brotherhood/sisterhood of all Muslims regardless of nationality or race.",
    audio: ummahAudio,
  },

  // W
  {
    title: "Wudu (وضوء)",
    definition: "The ritual washing performed before prayer. It includes washing the hands, face, arms, and feet, and is required for purity before salah.",
    audio: wuduAudio,
  },

  // Z
  {
    title: "Zakat (زكاة)",
    definition: "Obligatory charity, one of the Five Pillars. Muslims give 2.5% of their wealth annually to help the poor and needy.",
    audio: zakatAudio,
  },
];

export default function LingoGuide() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const handleBackClick = () => {
    setLocation("/cards");
  };

  const filteredTerms = lingoTerms.filter(term =>
    term.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group terms by first letter for organized display
  const groupedTerms = filteredTerms.reduce((acc, term) => {
    const firstLetter = term.title.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(term);
    return acc;
  }, {} as Record<string, Term[]>);

  const sortedLetters = Object.keys(groupedTerms).sort();

  const handleAudioPlay = (audioPath: string) => {
    const audio = new Audio(audioPath);
    audio.play().catch(error => {
      console.error('Error playing audio:', error);
    });
  };

  return (
    <div className="min-h-screen py-8 px-4 animate-fade-in relative overflow-hidden">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <button 
          onClick={handleBackClick}
          className="mb-8 text-slate-400 hover:text-purple-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 rounded-xl p-3 inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-purple-400/50 hover:bg-slate-800/70"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Journey
        </button>
        
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center shadow-2xl mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-400 animate-pulse"></div>
            <div className="absolute inset-[2px] bg-slate-900 rounded-3xl flex items-center justify-center">
              <BookOpen className="text-purple-400 w-8 h-8" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 animate-slide-up leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400">
              Lingo Guide
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-light animate-slide-up max-w-3xl mx-auto leading-relaxed" style={{ animationDelay: '0.1s' }}>
            Learn <span className="text-purple-400 font-medium">spiritual terminology</span> and deepen your understanding of faith concepts 📖
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-lg mx-auto animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            placeholder="Search spiritual terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 py-4 text-center bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 rounded-2xl text-slate-200 placeholder:text-slate-400 text-lg"
          />
        </div>
      </div>

      {/* Terms organized by letter */}
      <div className="max-w-7xl mx-auto">
        {sortedLetters.length > 0 ? (
          <div className="space-y-16">
            {sortedLetters.map((letter, letterIndex) => (
              <div key={letter} className="animate-scale-in" style={{ animationDelay: `${0.3 + (letterIndex * 0.1)}s` }}>
                {/* Letter heading */}
                <div className="mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                      <span className="text-3xl font-black text-white">{letter}</span>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-purple-400/50 via-pink-400/30 to-transparent"></div>
                  </div>
                </div>

                {/* Terms grid for this letter */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {groupedTerms[letter].map((term, index) => (
                    <Card 
                      key={term.title}
                      className="group card-hover bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 shadow-2xl animate-scale-in rounded-3xl hover:border-purple-400/50 transition-all duration-300 relative overflow-hidden"
                      style={{ animationDelay: `${0.4 + (letterIndex * 0.1) + (index * 0.05)}s` }}
                    >
                      {/* Subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <CardHeader className="pb-4 relative z-10">
                        <CardTitle className="text-xl font-bold text-slate-100 flex items-center justify-between group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                          <span>{term.title}</span>
                          {term.audio && (
                            <button
                              onClick={() => handleAudioPlay(term.audio!)}
                              className="text-purple-400 hover:text-yellow-400 transition-colors p-2 rounded-lg hover:bg-slate-700/50 backdrop-blur-sm"
                              title="Play pronunciation"
                            >
                              <Volume2 className="w-5 h-5" />
                            </button>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <p className="text-slate-300 leading-relaxed text-sm group-hover:text-slate-200 transition-colors duration-300">
                          {term.definition}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto bg-slate-800/50 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-6 border border-slate-700/50">
              <Search className="text-purple-400 w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-200 mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                No terms found
              </span>
            </h3>
            <p className="text-slate-400 text-lg">
              Try adjusting your search or browse all available terms
            </p>
          </div>
        )}
      </div>

      {/* Enhanced Decorative Elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-pink-500/20 to-yellow-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-purple-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
}