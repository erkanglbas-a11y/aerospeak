// ==========================================
// AEROSPEAK - ANA JAVASCRIPT DOSYASI
// ==========================================

// ==========================================
// 1. SEKME (TAB) GEÇİŞ MANTIĞI
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');

            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            tabContents.forEach(content => content.classList.remove('active'));
            const targetContent = document.getElementById(targetId);
            if(targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    loadWords();
});

// ==========================================
// 2. KELİME KARTLARI (FLASHCARDS) MANTIĞI
// ==========================================
let allFlashcardsData = []; 
let flashcardsData = [];    
let currentCardIndex = 0;

const flashcard = document.getElementById('flashcard');
const wordEl = document.getElementById('card-word');
const meaningEl = document.getElementById('card-meaning');
const exEnEl = document.getElementById('card-ex-en');
const exTrEl = document.getElementById('card-ex-tr');
const wordCountEl = document.getElementById('word-count');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const listenBtn = document.getElementById('listen-btn');
const listenExBtn = document.getElementById('listen-ex-btn');
const searchInput = document.getElementById('search-input');
const categorySelect = document.getElementById('category-select');

function loadWords() {
    fetch('words.json')
        .then(response => {
            if (!response.ok) throw new Error("JSON okunamadı. Live Server kullanın.");
            return response.json();
        })
        .then(data => {
            allFlashcardsData = data; 
            flashcardsData = [...allFlashcardsData]; 
            updateCard(); 
        })
        .catch(error => {
            console.error("Hata:", error);
            if(wordEl) wordEl.textContent = "Hata: Live Server Gerekli!";
        });
}

function filterCards() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categorySelect.value;

    flashcardsData = allFlashcardsData.filter(card => {
        const matchesSearch = card.word.toLowerCase().includes(searchTerm) || 
                              card.meaning.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || card.category === category;
        return matchesSearch && matchesCategory;
    });

    currentCardIndex = 0; 
    updateCard();
}

if(searchInput) searchInput.addEventListener('input', filterCards);
if(categorySelect) categorySelect.addEventListener('change', filterCards);

function updateCard() {
    if(!wordEl) return; 

    if(flashcardsData.length === 0) {
        wordEl.textContent = "Sonuç Bulunamadı 🧐";
        meaningEl.textContent = "Farklı bir arama yapın.";
        exEnEl.textContent = "";
        exTrEl.textContent = "";
        wordCountEl.textContent = "0 / 0";
        if (flashcard.classList.contains('is-flipped')) flashcard.classList.remove('is-flipped');
        return;
    }
    
    const card = flashcardsData[currentCardIndex];
    wordEl.textContent = card.word;
    meaningEl.textContent = card.meaning;
    exEnEl.textContent = `"${card.exampleEn}"`;
    exTrEl.textContent = `"${card.exampleTr}"`;
    wordCountEl.textContent = `${currentCardIndex + 1} / ${flashcardsData.length}`;
    
    if (flashcard.classList.contains('is-flipped')) flashcard.classList.remove('is-flipped');
}

if(flashcard) {
    flashcard.addEventListener('click', (e) => {
        if(flashcardsData.length === 0) return; 
        if(!e.target.closest('#listen-btn') && !e.target.closest('#listen-ex-btn')) {
            flashcard.classList.toggle('is-flipped');
        }
    });
}

if(prevBtn) {
    prevBtn.addEventListener('click', () => {
        if(flashcardsData.length === 0) return;
        currentCardIndex--;
        if (currentCardIndex < 0) currentCardIndex = flashcardsData.length - 1;
        updateCard();
    });
}

if(nextBtn) {
    nextBtn.addEventListener('click', () => {
        if(flashcardsData.length === 0) return;
        currentCardIndex++;
        if (currentCardIndex >= flashcardsData.length) currentCardIndex = 0;
        updateCard();
    });
}

if(listenBtn) {
    listenBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        if(flashcardsData.length === 0) return;
        const utterance = new SpeechSynthesisUtterance(flashcardsData[currentCardIndex].word);
        utterance.lang = 'en-US'; 
        utterance.rate = 0.9; 
        window.speechSynthesis.speak(utterance);
    });
}

if(listenExBtn) {
    listenExBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        if(flashcardsData.length === 0) return;
        const utterance = new SpeechSynthesisUtterance(flashcardsData[currentCardIndex].exampleEn);
        utterance.lang = 'en-US'; 
        utterance.rate = 0.85; 
        window.speechSynthesis.speak(utterance);
    });
}

// ==========================================
// 3. ANONS SİMÜLATÖRÜ MANTIĞI
// ==========================================
const announcementsData = [
    {
        title: "Hoş Geldiniz (Boarding)",
        text: "Ladies and gentlemen, / welcome onboard Flight 4B72 / to London. / Please ensure your cabin baggage / is safely stowed in the overhead bins / or under the seat in front of you.",
        speakText: "Ladies and gentlemen, welcome onboard Flight 4 B 7 2 to London. Please ensure your cabin baggage is safely stowed in the overhead bins, or under the seat in front of you."
    },
    {
        title: "Türbülans (Turbulence)",
        text: "Ladies and gentlemen, / the Captain has turned on the Fasten Seatbelt sign. / Please return to your seats / and ensure your seatbelts are securely fastened. / Thank you.",
        speakText: "Ladies and gentlemen, the Captain has turned on the Fasten Seatbelt sign. Please return to your seats, and ensure your seatbelts are securely fastened. Thank you."
    },
    {
        title: "Doktor Çağrısı (Medical Emergency)",
        text: "Ladies and gentlemen, / if there is a medical doctor / or a qualified nurse onboard, / please make yourself known / to the cabin crew / immediately. / Thank you.",
        speakText: "Ladies and gentlemen, if there is a medical doctor or a qualified nurse onboard, please make yourself known to the cabin crew immediately. Thank you."
    },
    {
        title: "Gecikme/Rötar (Delay)",
        text: "Ladies and gentlemen, / we apologize for the delay in our departure. / This is due to / heavy air traffic. / We will update you / as soon as we have more information.",
        speakText: "Ladies and gentlemen, we apologize for the delay in our departure. This is due to heavy air traffic. We will update you as soon as we have more information."
    },
    {
        title: "Alçalma ve İniş (Descent)",
        text: "Cabin crew, / prepare the cabin / for landing.",
        speakText: "Cabin crew, prepare the cabin for landing."
    }
];

const annSelect = document.getElementById('announcement-type');
const annTitle = document.getElementById('ann-title');
const annText = document.getElementById('ann-text');
const listenNativeBtn = document.getElementById('listen-native-btn');
const recordBtn = document.getElementById('record-btn');
const recordText = document.getElementById('record-text');
const playbackContainer = document.getElementById('playback-container');
const userAudio = document.getElementById('user-audio');
const chimeBtn = document.getElementById('chime-btn');

function playCabinChime() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime); 
    gain1.gain.setValueAtTime(1, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 1);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(523.25, ctx.currentTime + 0.5); 
    gain2.gain.setValueAtTime(1, ctx.currentTime + 0.5);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.5);
    osc2.stop(ctx.currentTime + 1.5);
}

if(chimeBtn) chimeBtn.addEventListener('click', playCabinChime);

if(annSelect) {
    annSelect.innerHTML = '';
    announcementsData.forEach((ann, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = ann.title;
        annSelect.appendChild(option);
    });
    annSelect.addEventListener('change', loadAnnouncement);
}

function loadAnnouncement() {
    const selectedAnn = announcementsData[annSelect.value];
    annTitle.textContent = selectedAnn.title;
    const formattedText = selectedAnn.text.replace(/\//g, '<span class="pause-mark">/</span>');
    annText.innerHTML = formattedText;
    playbackContainer.classList.add('hidden');
}

loadAnnouncement();

if(listenNativeBtn) {
    listenNativeBtn.addEventListener('click', () => {
        playCabinChime(); 
        setTimeout(() => { 
            const textToSpeak = announcementsData[annSelect.value].speakText;
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = 'en-GB'; 
            utterance.rate = 0.85; 
            utterance.pitch = 1.1; 
            window.speechSynthesis.speak(utterance);
        }, 1200);
    });
}

let mediaRecorder;
let audioChunks = [];
let isRecording = false;

if(recordBtn) {
    recordBtn.addEventListener('click', async () => {
        if (!isRecording) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = event => audioChunks.push(event.data);
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
                    userAudio.src = URL.createObjectURL(audioBlob);
                    playbackContainer.classList.remove('hidden');
                    audioChunks = []; 
                    stream.getTracks().forEach(track => track.stop());
                };
                mediaRecorder.start();
                isRecording = true;
                recordBtn.classList.add('recording');
                recordText.textContent = "Kaydı Durdur";
                recordBtn.innerHTML = '<i class="fa-solid fa-stop"></i> <span id="record-text">Kaydı Durdur</span>';
            } catch (err) {
                alert("Mikrofona erişilemedi!");
            }
        } else {
            mediaRecorder.stop();
            isRecording = false;
            recordBtn.classList.remove('recording');
            recordBtn.innerHTML = '<i class="fa-solid fa-microphone"></i> <span id="record-text">Kaydet (Sıra Sende)</span>';
        }
    });
}

// ==========================================
// 4. MÜLAKAT HAZIRLIK & YAPAY ZEKA (MOCK) MANTIĞI
// ==========================================
const interviewQuestions = [
    {
        title: "Motivasyon: Neden Kabin Memuru?",
        question: "Why do you want to be a cabin crew member?",
        answers: []
    },
    {
        title: "Kural İhlali: Kemer Bağlamayan Yolcu",
        question: "How would you handle a passenger who refuses to fasten their seatbelt?",
        answers: []
    },
    {
        title: "Kriz Yönetimi: Sinirli Yolcu",
        question: "How do you deal with an angry and complaining passenger?",
        answers: []
    },
    {
        title: "Takım Çalışması: Anlaşmazlık",
        question: "Tell me about a time you had a disagreement with a coworker.",
        answers: []
    },
    {
        title: "Zorlu Durum: Acil Müdahale",
        question: "Can you describe a highly stressful situation and how you handled it?",
        answers: []
    }
];

const intQSelect = document.getElementById('interview-q-select');
const intQText = document.getElementById('int-q-text');
const listenQBtn = document.getElementById('listen-q-btn');
const showAnswerBtn = document.getElementById('show-answer-btn');
const sampleAnswerBox = document.getElementById('sample-answer-box');
const intAEn = document.getElementById('int-a-en');
const intATr = document.getElementById('int-a-tr');
const listenABtn = document.getElementById('listen-a-btn');
const starList = document.getElementById('star-list');

const prevAnswerBtn = document.getElementById('prev-answer-btn');
const nextAnswerBtn = document.getElementById('next-answer-btn');
const answerCounter = document.getElementById('answer-counter');
let currentAnswerIndex = 0;

const aiGenerateBtn = document.getElementById('ai-generate-btn');
const aiLoading = document.getElementById('ai-loading');
const intRecordBtn = document.getElementById('int-record-btn');
const intRecordText = document.getElementById('int-record-text');
const liveVideo = document.getElementById('int-live-video');
const userVideo = document.getElementById('int-user-video');
const timerBadge = document.getElementById('int-timer');
const timeDisplay = document.getElementById('time-display');

if(intQSelect) {
    interviewQuestions.forEach((item, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = item.title;
        intQSelect.appendChild(option);
    });
    intQSelect.addEventListener('change', () => {
        currentAnswerIndex = 0; 
        loadInterviewQuestion();
    });
}

function loadInterviewQuestion() {
    const selectedQ = interviewQuestions[intQSelect.value];
    intQText.textContent = selectedQ.question;
    
    sampleAnswerBox.classList.add('hidden');
    showAnswerBtn.style.display = 'inline-block';
    userVideo.classList.add('hidden');
    liveVideo.classList.add('hidden');
    userVideo.src = "";
    
    // Eğer cevap havuzu boşsa ilk başta tetiklemesi için AI simülasyonuna tıkla
    if(selectedQ.answers.length === 0 && aiGenerateBtn) {
        aiGenerateBtn.click();
    } else {
        loadAnswerContent(); 
    }
}

function loadAnswerContent() {
    const selectedQ = interviewQuestions[intQSelect.value];
    if(selectedQ.answers.length === 0) return;

    const currentAns = selectedQ.answers[currentAnswerIndex];
    intAEn.textContent = `"${currentAns.answerEn}"`;
    intATr.textContent = currentAns.answerTr;
    answerCounter.textContent = `Alternatif ${currentAnswerIndex + 1} / ${selectedQ.answers.length}`;
    
    if (selectedQ.answers.length <= 1) {
        prevAnswerBtn.style.visibility = 'hidden';
        nextAnswerBtn.style.visibility = 'hidden';
    } else {
        prevAnswerBtn.style.visibility = 'visible';
        nextAnswerBtn.style.visibility = 'visible';
    }

    starList.innerHTML = '';
    currentAns.star.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = item;
        starList.appendChild(li);
    });
}

if (prevAnswerBtn) {
    prevAnswerBtn.addEventListener('click', () => {
        const selectedQ = interviewQuestions[intQSelect.value];
        currentAnswerIndex--;
        if (currentAnswerIndex < 0) currentAnswerIndex = selectedQ.answers.length - 1;
        loadAnswerContent();
    });
}

if (nextAnswerBtn) {
    nextAnswerBtn.addEventListener('click', () => {
        const selectedQ = interviewQuestions[intQSelect.value];
        currentAnswerIndex++;
        if (currentAnswerIndex >= selectedQ.answers.length) currentAnswerIndex = 0;
        loadAnswerContent();
    });
}

// Sayfa ilk yüklendiğinde mülakatları başlat
setTimeout(loadInterviewQuestion, 500);

if(showAnswerBtn) {
    showAnswerBtn.addEventListener('click', () => {
        sampleAnswerBox.classList.remove('hidden');
        showAnswerBtn.style.display = 'none';
    });
}

if(listenQBtn) {
    listenQBtn.addEventListener('click', () => {
        const utterance = new SpeechSynthesisUtterance(intQText.textContent);
        utterance.lang = 'en-GB'; 
        window.speechSynthesis.speak(utterance);
    });
}

if(listenABtn) {
    listenABtn.addEventListener('click', () => {
        const cleanText = intAEn.textContent.replace(/"/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'en-US'; 
        window.speechSynthesis.speak(utterance);
    });
}

// --- GERÇEK YAPAY ZEKA İLE MÜLAKAT CEVABI ÜRETME (OPENAI) ---
if(aiGenerateBtn) {
    aiGenerateBtn.addEventListener('click', async () => {
        const selectedIndex = parseInt(intQSelect.value); 
        const selectedQ = interviewQuestions[selectedIndex];
        const questionText = selectedQ.question; // Seçilen sorunun İngilizce metni

        // UI Güncellemesi: Yükleniyor durumunu göster
        aiGenerateBtn.classList.add('hidden');
        aiLoading.classList.remove('hidden');

        // Yapay Zekaya Gönderilecek Kesin Talimat (Prompt)
        const prompt = `Sen uzman bir havacılık İnsan Kaynakları (HR) mülakatçısısın. 
        Adaya şu soruyu sordun: "${questionText}". 
        Aday için daha önce verilmemiş, son derece profesyonel, yaratıcı ve etkileyici bir İNGİLİZCE mülakat cevabı yaz.
        Cevap, havacılık kurallarına (CRM, güvenlik, müşteri memnuniyeti) uygun olmalı.
        
        SADECE aşağıdaki JSON formatında cevap ver. Başka hiçbir açıklama yazma:
        {
          "answerEn": "İngilizce profesyonel cevap buraya",
          "answerTr": "İngilizce cevabın kusursuz Türkçe çevirisi buraya",
          "star": [
            "<strong>S/T (Durum/Görev):</strong> Durum analizi (Türkçe)",
            "<strong>A (Eylem):</strong> Yapılan eylem (Türkçe)",
            "<strong>R (Sonuç):</strong> Ulaşılan başarılı sonuç (Türkçe)"
          ]
        }`;

        try {
            // OpenAI API'ye İstek Atıyoruz
            // OpenAI API'ye İstek Atıyoruz YERİNE KENDİ API'MIZE ATIYORUZ
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                    // Authorization satırını sildik!
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: prompt }],
                    response_format: { type: "json_object" },
                    temperature: 0.85
                })
            });

            const data = await response.json();
            
            // Eğer API'den bir hata mesajı döndüyse (Örn: Geçersiz API Anahtarı, bakiye yok vs.)
            if (data.error) {
                throw new Error(data.error.message);
            }

            // Gelen saf JSON metnini objeye çeviriyoruz
            const aiResult = JSON.parse(data.choices[0].message.content);

            // Gelen yeni cevabı dizimize ekle ve ekrana bas
            selectedQ.answers.push(aiResult);
            currentAnswerIndex = selectedQ.answers.length - 1;
            loadAnswerContent(); 

        } catch (error) {
            console.error("Mülakat AI Hatası:", error);
            alert("Cevap üretilemedi! API anahtarını doğru girdiğinden veya internet bağlantından emin ol.\nDetay: " + error.message);
        } finally {
            // UI Güncellemesi: Butonu geri getir, yükleniyoru gizle
            aiGenerateBtn.classList.remove('hidden');
            aiLoading.classList.add('hidden');
        }
    });
}

let intMediaRecorder;
let intChunks = [];
let isIntRecording = false;
let mediaStream = null;
let timerInterval;
let timeLeft = 120; 

function updateTimerDisplay() {
    let m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    let s = (timeLeft % 60).toString().padStart(2, '0');
    timeDisplay.textContent = `${m}:${s}`;
}

function stopInterviewRecording() {
    if(intMediaRecorder && intMediaRecorder.state !== 'inactive') {
        intMediaRecorder.stop();
    }
    clearInterval(timerInterval);
    timerBadge.classList.add('hidden');
    isIntRecording = false;
    intRecordBtn.classList.remove('recording');
    intRecordBtn.innerHTML = '<i class="fa-solid fa-video"></i> <span id="int-record-text">Tekrar Dene</span>';
    liveVideo.classList.add('hidden'); 
}

if(intRecordBtn) {
    intRecordBtn.addEventListener('click', async () => {
        if (!isIntRecording) {
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                liveVideo.srcObject = mediaStream;
                liveVideo.classList.remove('hidden');
                userVideo.classList.add('hidden'); 

                intMediaRecorder = new MediaRecorder(mediaStream);
                intChunks = [];
                
                intMediaRecorder.ondataavailable = e => intChunks.push(e.data);
                intMediaRecorder.onstop = () => {
                    const videoBlob = new Blob(intChunks, { type: 'video/webm' });
                    userVideo.src = URL.createObjectURL(videoBlob);
                    userVideo.classList.remove('hidden'); 
                    mediaStream.getTracks().forEach(track => track.stop()); 
                };

                intMediaRecorder.start();
                isIntRecording = true;
                
                timeLeft = 120;
                updateTimerDisplay();
                timerBadge.classList.remove('hidden');
                timerInterval = setInterval(() => {
                    timeLeft--;
                    updateTimerDisplay();
                    if(timeLeft <= 0) stopInterviewRecording(); 
                }, 1000);

                intRecordBtn.classList.add('recording');
                intRecordBtn.innerHTML = '<i class="fa-solid fa-stop"></i> <span id="int-record-text">Kaydı Durdur</span>';
                
            } catch (err) {
                alert("Kamera veya Mikrofona erişilemedi! Lütfen tarayıcı izinlerini kontrol edin.");
                console.error(err);
            }
        } else {
            stopInterviewRecording();
        }
    });
}

// ==========================================
// 5. UÇUŞ GRAMERİ AKADEMİSİ (GPT & SES TANIMA & VİDEOLU TEORİ)
// ==========================================

// --- TEORİ EĞİTİMİ VERİTABANI VE VİDEOLAR (FULL MÜFREDAT) ---
const grammarLessonsDB = {
    "Verb To Be": {
        title: "Verb 'To Be' (Am/Is/Are)",
        videoUrl: "https://www.youtube.com/embed/kbxNZUJJMtY?si=vc8p4OFhTUHksslP",
        desc: "Yolcuların durumunu, hissini veya uçaktaki bir nesnenin durumunu belirtmek için kullanılır. Aksiyon (hareket) içermez.",
        formula: "Özne + Am/Is/Are + İsim/Sıfat",
        good: "The passenger IS sick. / We ARE ready for takeoff.",
        bad: "The passenger sick. (Durum bildiren cümlede 'to be' fiili eksik olamaz.)"
    },
    "Simple Present": {
        title: "Simple Present (Geniş Zaman)",
        videoUrl: "https://www.youtube.com/embed/oVy5AOtcyos?si=fGI5dmh4nL5LUIFj",
        desc: "Uçuş tarifelerini, rutin prosedürleri ve genel kuralları açıklarken kullanılır.",
        formula: "Özne + Fiil(s) + Nesne",
        good: "The flight DEPARTS at 10:00 AM every day.",
        bad: "The flight is depart at 10:00 AM. (Geniş zamanda 'is' ve yalın fiil yan yana gelmez.)"
    },
    "Present Continuous": {
        title: "Present Continuous (Şimdiki Zaman)",
        videoUrl: "https://www.youtube.com/embed/fsyZhwKiBD8?si=GUNm-LGv_VE-ac9k",
        desc: "Tam şu anda, uçuş sırasında gerçekleşen eylemleri, türbülansı veya yolcu hareketlerini raporlamak için kullanılır.",
        formula: "Özne + Am/Is/Are + Fiil(ing)",
        good: "We ARE EXPERIENCING severe turbulence right now.",
        bad: "We experiencing turbulence. (Yardımcı fiil 'are' unutulmamalıdır.)"
    },
    "Present Simple vs Present Continuous": {
        title: "Present Simple vs Present Continuous (Geniş Zaman) vs (Şu An Süregelen Olaylar)",
        videoUrl: "https://www.youtube.com/embed/Qgrfr_DxjrM?si=sRpOU4YSs9FGktMP",
        desc: "Genelde yapılanlar (Present) ile şu an olan (Continuous) istisnaları ayırmak için çok kritiktir.",
        formula: "Rutin (V1) vs Şu An (Am/Is/Are + V-ing)",
        good: "We normally FLY at 30,000 feet, but currently we ARE FLYING lower.",
        bad: "We normally flying at 30,000 feet. (Rutinler ING almaz.)"
    },
    "Past Simple": {
        title: "Past Simple (Geçmiş Zaman)",
        videoUrl: "https://www.youtube.com/embed/-GHaAQgUz7o?si=4yHrTRJ_zMafPj5l",
        desc: "Uçuşta yaşanıp bitmiş bir olayı (örneğin yolcunun bayılmasını veya ikaz ışığının yanmasını) raporlarken kullanılır.",
        formula: "Özne + V2 (Fiilin 2. Hali) / Fiil+ed",
        good: "The captain TURNED ON the seatbelt sign 5 minutes ago.",
        bad: "The captain has turned on the sign 5 minutes ago. (Geçmiş zaman belirtici 'ago' varsa Perfect Tense kullanılmaz.)"
    },
    "Past Continuous": {
        title: "Past Continuous (Geçmişte Süregelen Olaylar)",
        videoUrl: "https://www.youtube.com/embed/LEt3zbf_qlM?si=4-BiSvddflXDyWDq",
        desc: "Geçmişte bir olay olurken arka planda devam eden diğer eylemi anlatır. Rapor tutarken 'Ben şunu yapıyordum ki bu oldu' demek için şarttır.",
        formula: "Özne + Was/Were + Fiil(ing)",
        good: "I WAS SERVING coffee when the turbulence hit.",
        bad: "I served coffee when the turbulence hit. (Süreklilik hissi kaybolur.)"
    },
     "The difference between Past Simple and Past Continuous": {
        title: "Past Simple ve Past Continuous Arasındaki Fark",
        videoUrl: "https://www.youtube.com/embed/n4uxTRwSNdQ?si=oz69lDz0ZLvxyf1S",
        desc: "Sıkça karıştırılan iki zaman. Past Simple: Geçmişte tamamlanmış olaylar. Past Continuous: Geçmişte bir olay olurken devam eden diğer eylemi anlatır.",
        formula: "Past Simple: Özne + V2 / Past Continuous: Özne + Was/Were + Fiil(ing)",
        good: "I SERVED coffee before the turbulence started./I WAS SERVING coffee when the turbulence hit.",
        bad: "I served coffee when the turbulence hit. (Süreklilik hissi kaybolur.)"
    },
    "Future Tense": {
        title: "Future Tense (Will / Going To)",
        videoUrl: "https://www.youtube.com/embed/SD88PaHag88?si=rIbMgay35oRD9pt2",
        desc: "Will: Anlık kararlar veya tahminler için (Örn: Size battaniye getireceğim). Going to: Planlanmış iniş/kalkışlar için.",
        formula: "Will + V1 / Am-Is-Are + Going to + V1",
        good: "I WILL BRING you a glass of water right away.",
        bad: "I bring you water. (Gelecekteki aksiyon belirtilmemiş.)"
    },
    "Articles": {
        title: "Articles (A / An / The)",
        videoUrl: "https://www.youtube.com/embed/Y0mlDgYXga4?si=vKk6bpnq5IC-EEOl",
        desc: "The: Bilinen, belirli bir şey (Kaptan, o uçuş). A/An: Herhangi bir şey (Bir doktor, bir battaniye) anonslarında hayat kurtarır.",
        formula: "A/An (Belirsiz/Tekil) / The (Belirli)",
        good: "Is there A doctor on board? (Herhangi bir doktor)",
        bad: "Is there THE doctor on board? (Sanki uçakta belirli, tanıdık bir doktor aranıyor hissi verir.)"
    },
    "There is Are": {
        title: "There is / There are (Mevcudiyet)",
        videoUrl: "https://www.youtube.com/embed/0wiL8EFuTvM?si=l952gVe0qjDoNxKw",
        desc: "Kabin içinde bir acil durumun, eşyanın veya boş koltuğun varlığını haber vermek için kullanılır.",
        formula: "There is + Tekil İsim / There are + Çoğul İsim",
        good: "THERE IS a fire in the aft lavatory!",
        bad: "It has a fire in the lavatory. (Türkçedeki 'var' kelimesi 'has' ile çevrilmez.)"
    },
    "Countables Uncountables": {
        title: "Countable & Uncountable Nouns",
        videoUrl: "https://www.youtube.com/embed/9L_vb_NTdiQ?si=RAbVg-mgAyunao4M",
        desc: "İçecek (su, çay) veya sayılamayan konseptler (türbülans, bilgi) ile sayılabilen nesneleri (battaniye, koltuk) doğru miktarla sunmak.",
        formula: "Much/Little (Sayılamaz) / Many/Few (Sayılabilir)",
        good: "We don't have MUCH WATER left.",
        bad: "We don't have many waters left. (Su sayılamaz.)"
    },
    "Frequency Adverbs": {
        title: "Adverbs of Frequency (Sıklık Zarfları)",
        videoUrl: "https://www.youtube.com/embed/lCFGMBK9OUk?si=MipFqmtXaKS5PEUq",
        desc: "Güvenlik prosedürlerinin ne sıklıkla yapıldığını veya yolcu rutinlerini anlatmak için (Always, usually, never).",
        formula: "Özne + Sıklık Zarfı + Fiil (To be fiilinden sonra gelir)",
        good: "We ALWAYS check the cabin before landing.",
        bad: "We check always the cabin. (Zarfın yeri yanlıştır.)"
    },
    "Prepositions Place": {
        title: "In / On / At (Yer Edatları)",
        videoUrl: "https://www.youtube.com/embed/XlGeCh8_1zY?si=mg45EM7LfMWJjFbv",
        desc: "Acil çıkışların, can yeleklerinin veya yolcunun yerini net tarif etmek için. Hatalı edat acil durumda can güvenliğini tehlikeye atar!",
        formula: "IN (İçinde) / ON (Üstünde/Yüzeyde) / AT (Noktasal yer)",
        good: "Your life vest is located UNDER your seat.",
        bad: "Your life vest is in bottom of your seat."
    },
    "Prepositions Time": {
        title: "In / On / At (Zaman Edatları)",
        videoUrl: "https://www.youtube.com/embed/2iX1KxW54kI?si=F6Xz34zEGhAsjIUA",
        desc: "Gecikmeleri, uçuş saatlerini ve planlamaları anons ederken kullanılır.",
        formula: "IN (Ay/Yıl/Süre) / ON (Gün) / AT (Saat)",
        good: "We will land AT 5:00 PM ON Friday.",
        bad: "We will land in 5:00 PM in Friday."
    },
    "For To": {
        title: "For vs To (Amaç ve Yönelim)",
        videoUrl: "https://www.youtube.com/embed/M5MJjQWhYeo?si=I7WV478uzo1R3s1Q",
        desc: "For: Kimin için (fayda) olduğunu, To: Yönelimi belirtir. Servis sırasında en çok karıştırılan ikilidir.",
        formula: "For + İsim/Kişi | To + Fiil/Yön",
        good: "This vegetarian meal is FOR you.",
        bad: "This meal is to you."
    },
    "Phrasal Verbs": {
        title: "Phrasal Verbs (Havacılık Eylemleri)",
        videoUrl: "https://www.youtube.com/embed/epdKlh_oKLI?si=w3INPcpVBSAqREsH",
        desc: "Havacılık dilinin kalbidir. Put away (Kaldırmak), Take off (Kalkış yapmak), Turn off (Kapatmak) gibi fiiller emirlerde çok kullanılır.",
        formula: "Fiil + Preposition (Anlam değişir)",
        good: "Please PUT AWAY your tray tables.",
        bad: "Please close your tray tables. (Masa 'close' edilmez.)"
    },
    "Comparisons": {
        title: "Comparisons (Karşılaştırmalar)",
        videoUrl: "https://www.youtube.com/embed/VY7lUnTjjyM?si=A7OqmDlGTlt-eSKR",
        desc: "İki durumu veya seçeneği karşılaştırmak (Örn: Bu koltuk daha güvenli, türbülans daha kötüleşiyor) için kullanılır.",
        formula: "Sıfat+ER / More + Sıfat",
        good: "The turbulence is getting WORSE.",
        bad: "The turbulence is getting more bad."
    },
    "Modals": {
        title: "Modals (Zorunluluk ve Tavsiye)",
        videoUrl: "https://www.youtube.com/embed/rolRLZeXgvU?si=VJ3or3NalgFwgaFj",
        desc: "Havacılıkta 'Must' / 'Have to' kuralları ve kesin zorunlulukları belirtirken (Örn: Emniyet kemeri), 'Should' sadece tavsiye vermek için kullanılır. Emirlere uymayan yolculara 'Must' ile konuşulmalıdır.",
        formula: "Özne + Must/Should + Fiil (Yalın Hali) + Nesne",
        good: "Sir, for your safety, you MUST remain seated.",
        bad: "You must to remain seated. ('Must'tan sonra 'to' gelmez!)"
    },
    "Conditionals": {
        title: "Conditionals (If Clauses)",
        videoUrl: "https://www.youtube.com/embed/F93f-HRtEzk?si=i0aaPg4yAeHIYiQu",
        desc: "Havacılıkta yolcuları yönlendirmek (Bunu yapmazsanız bu olur) veya kriz anlarında şart koşmak için hayatidir.",
        formula: "If + Present, Will + V1",
        good: "If you don't return to your seat, I will inform the captain.",
        bad: "If you won't return to your seat, I inform the captain."
    },
    "Present Perfect": {
        title: "Present Perfect Tense",
        videoUrl: "https://www.youtube.com/embed/SCWuBbP19gk?si=Sepfry7PBnu8g5m4",
        desc: "Olay geçmişte olmuş ama etkisi (sonucu) şu an kabin içinde hala devam ediyorsa kullanılır.",
        formula: "Have/Has + V3",
        good: "The boarding HAS FINISHED. (Biniş bitti, sonuç: kapılar kapandı)",
        bad: "The boarding finished since 10 minutes. ('Since' kalıbı past simple ile kullanılmaz.)"
    },
    "Perfect Continuous": {
        title: "Present Perfect Continuous",
        videoUrl: "https://www.youtube.com/embed/WLm9N7zGltM?si=OuXLvuq_wOh8aTVj",
        desc: "Geçmişte başlamış ve şu an o saniyede HALA devam eden rahatsızlıkları/krizleri ifade eder.",
        formula: "Have/Has been + Fiil(ing)",
        good: "The passenger HAS BEEN COUGHING for an hour.",
        bad: "The passenger is coughing for an hour."
    },
    "Passive Voice": {
        title: "Passive Voice (Edilgen Yapı)",
        videoUrl: "https://www.youtube.com/embed/N1xQPXNGQaU?si=upjKGCnFqXxL_T8B",
        desc: "Kural ihlallerinde olayı kişiselleştirmeden resmi havacılık yasaklarını duyurmak için.",
        formula: "Am/Is/Are/Must be + V3",
        good: "Smoking IS STRICTLY PROHIBITED in the lavatories.",
        bad: "You must not smoke in the lavatories. (Fazla kaba algılanabilir.)"
    },
    "Yet Still Already": {
        title: "Yet / Still / Already",
        videoUrl: "https://www.youtube.com/embed/MADF2k6TOdQ?si=qGIjNwxqlWRT6fnr",
        desc: "Servis durumlarını (Henüz yemedim, zaten içtim) veya uçuş işlemlerinin zamanlamasını takip etmek için.",
        formula: "Yet (Sonda), Already/Still (Yardımcı fiilden sonra)",
        good: "Has the medical team arrived YET? / I have ALREADY checked the lavatory. / The passenger is STILL complaining.",
        bad: "Did the medical team arrive already? / I have checked the lavatory yet. (Zaman zarflarının yeri yanlış.)"
    },
    "Indirect Speech": {
        title: "Direct / Indirect Speech (Raporlama)",
        videoUrl: "https://www.youtube.com/embed/e56kNXlbttI?si=WMAUGCRU1K5ri1FZ",
        desc: "Kabin amirine veya kokpite yolcunun ne söylediğini aktarmak (raporlamak) için elzemdir.",
        formula: "He said that + Past Tense",
        good: "The passenger STATED THAT he HAD a severe pain in his chest.",
        bad: "The passenger said me he has a pain. (Said'den sonra kime söylendiği doğrudan yazılmaz.)"
    },
    "Irregular Verbs": {
        title: "Irregular Verbs (Düzensiz Fiiller)",
        videoUrl: "https://www.youtube.com/embed/e9kHcPQFkb8?si=P0rTSRib6LenEFWs",
        desc: "Havacılıkta çok kullanılan Speak->Spoke, Fly->Flew, Catch->Caught gibi düzensiz geçmiş zaman fiilleri.",
        formula: "V1 -> V2 -> V3 ezberi",
        good: "The bird FLEW into the engine.",
        bad: "The bird flyed into the engine."
    }
};

// Kariyer / Gamification
let userScore = 0;
let userRank = "Yer Hizmetleri";
const rankTextEl = document.getElementById('user-rank');

// Teori Elementleri
const learnTopicBtn = document.getElementById('learn-topic-btn');
const theoryBoard = document.getElementById('theory-board');
const closeTheoryBtn = document.getElementById('close-theory-btn');
const theoryTitle = document.getElementById('theory-title');
const theoryVideo = document.getElementById('theory-video');
const theoryDesc = document.getElementById('theory-desc');
const theoryFormula = document.getElementById('theory-formula');
const theoryGood = document.getElementById('theory-good');
const theoryBad = document.getElementById('theory-bad');

// Gramer Akademi Elementleri
const grammarTopicSelect = document.getElementById('grammar-topic-select');
const startAcademyBtn = document.getElementById('start-academy-btn');
const grammarLoading = document.getElementById('grammar-loading');
const grammarSetup = document.getElementById('grammar-setup');

const briefingArea = document.getElementById('briefing-area');
const briefingText = document.getElementById('briefing-text');
const targetGrammarText = document.getElementById('target-grammar-text');
const enterCabinBtn = document.getElementById('enter-cabin-btn');

const roleplayArea = document.getElementById('roleplay-area');
const passengerMsg = document.getElementById('passenger-msg');
const listenPassengerBtn = document.getElementById('listen-passenger-btn');
const crewMsgContainer = document.getElementById('crew-msg-container');
const crewMsgText = document.getElementById('crew-msg');

const inputArea = document.getElementById('grammar-input-area');
const crewInput = document.getElementById('crew-input');
const micBtn = document.getElementById('mic-btn');
const sendCrewBtn = document.getElementById('send-crew-btn');

const evaluationArea = document.getElementById('evaluation-area');
const evalTitle = document.getElementById('eval-title');
const evalContent = document.getElementById('eval-content');
const evalScore = document.getElementById('eval-score');
const evalFeedback = document.getElementById('eval-feedback');
const evalBetterVersion = document.getElementById('eval-better-version');
const nextScenarioBtn = document.getElementById('next-scenario-btn');
const backToSetupBtn = document.getElementById('back-to-setup-btn');

let currentExpectedGrammar = "";
let currentPassengerMsgEn = "";

// 0. AŞAMA: ÖNCE KONUYU ÖĞREN (TEORİ)
if(learnTopicBtn) {
    learnTopicBtn.addEventListener('click', () => {
        const topic = grammarTopicSelect.value;
        const lesson = grammarLessonsDB[topic];
        
        if(lesson) {
            theoryTitle.textContent = lesson.title;
            theoryDesc.textContent = lesson.desc;
            theoryFormula.textContent = lesson.formula;
            theoryGood.textContent = lesson.good;
            theoryBad.textContent = lesson.bad;
            theoryVideo.src = lesson.videoUrl;
            
            theoryBoard.classList.remove('hidden');
        }
    });
}

if(closeTheoryBtn) {
    closeTheoryBtn.addEventListener('click', () => {
        theoryBoard.classList.add('hidden');
        if(theoryVideo) theoryVideo.src = ""; // Videoyu durdur
    });
}

// 1. AŞAMA: YAPAY ZEKADAN SENARYO VE BRİFİNG İSTE
if(startAcademyBtn) {
    startAcademyBtn.addEventListener('click', generateBriefingAndScenario);
}

if(nextScenarioBtn) {
    nextScenarioBtn.addEventListener('click', () => {
        evaluationArea.classList.add('hidden');
        roleplayArea.classList.add('hidden');
        crewMsgContainer.classList.add('hidden');
        inputArea.classList.remove('hidden');
        crewInput.value = "";
        generateBriefingAndScenario();
    });
}

async function generateBriefingAndScenario() {
    const topic = grammarTopicSelect.value;
    
    startAcademyBtn.classList.add('hidden');
    grammarLoading.classList.remove('hidden');
    
    // Açık olan teori tahtası varsa kapat
    theoryBoard.classList.add('hidden');
    if(theoryVideo) theoryVideo.src = ""; 

    const prompt = `Sen Havacılık İngilizcesi (B2/C1) eğitim yapay zekasısın. Konu: "${topic}".
    Bana kabin memuru adayları için zorlayıcı bir roleplay senaryosu üret.
    SADECE aşağıdaki JSON formatında cevap ver:
    {
        "briefing": "Bu gramer kuralının uçakta (kriz, servis vb.) nasıl ve neden kullanıldığına dair Türkçe taktiksel brifing.",
        "passengerMsg": "[ENGLISH] Bir yolcunun ağzından uçakta yaşanabilecek bir kriz, şikayet veya istek cümlesi (İleri seviye olabilir).",
        "expectedGrammar": "Öğrencinin yolcuya cevap verirken kullanması beklenen İngilizce yapı (Örn: Type 2 Conditionals veya Must/Should)"
    }`;

    try {
        // OpenAI API'ye İstek Atıyoruz YERİNE KENDİ API'MIZE ATIYORUZ
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                    // Authorization satırını sildik!
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: prompt }],
                    response_format: { type: "json_object" },
                    temperature: 0.85
                })
            });

        const data = await response.json();
        if(data.error) throw new Error(data.error.message);

        const aiResult = JSON.parse(data.choices[0].message.content);

        briefingText.textContent = aiResult.briefing;
        targetGrammarText.textContent = aiResult.expectedGrammar;
        
        currentPassengerMsgEn = aiResult.passengerMsg;
        currentExpectedGrammar = aiResult.expectedGrammar;
        passengerMsg.textContent = `"${currentPassengerMsgEn}"`;

        grammarSetup.classList.add('hidden');
        briefingArea.classList.remove('hidden');
        if(backToSetupBtn) backToSetupBtn.classList.remove('hidden');

    } catch (error) {
        console.error(error);
        alert("Senaryo üretilemedi! Lütfen API anahtarını kontrol et.\nHata: " + error.message);
    } finally {
        grammarLoading.classList.add('hidden');
        startAcademyBtn.classList.remove('hidden');
    }
}

// 2. AŞAMA: KABİNE GEÇİŞ
if(enterCabinBtn) {
    enterCabinBtn.addEventListener('click', () => {
        briefingArea.classList.add('hidden');
        roleplayArea.classList.remove('hidden');
    });
}

// Yolcuyu Sesli Dinleme
if(listenPassengerBtn) {
    listenPassengerBtn.addEventListener('click', () => {
        const utterance = new SpeechSynthesisUtterance(currentPassengerMsgEn);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    });
}

// --- SES TANIMA (MİKROFONLA CEVAP VERME) MANTIĞI ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // İngilizce algıla
    recognition.continuous = false;
    
    recognition.onstart = () => {
        micBtn.classList.add('recording');
        crewInput.placeholder = "Seni dinliyorum, İngilizce konuş...";
    };
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        crewInput.value = transcript; 
    };
    
    recognition.onend = () => {
        micBtn.classList.remove('recording');
        crewInput.placeholder = "İngilizce cevabını yaz veya mikrofonla söyle...";
    };
}

if(micBtn) {
    micBtn.addEventListener('click', () => {
        if(recognition) {
            recognition.start();
        } else {
            alert("Tarayıcınız ses tanıma özelliğini desteklemiyor. Lütfen Chrome kullanın veya cevabınızı yazın.");
        }
    });
}

// 3. AŞAMA: CEVABI GÖNDER VE DEĞERLENDİR
if(sendCrewBtn) {
    sendCrewBtn.addEventListener('click', evaluateUserResponse);
}

// Enter tuşu ile gönderme desteği
if(crewInput) {
    crewInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            evaluateUserResponse();
        }
    });
}

async function evaluateUserResponse() {
    const userAnswer = crewInput.value.trim();
    if(!userAnswer) return;

    crewMsgText.textContent = `"${userAnswer}"`;
    crewMsgContainer.classList.remove('hidden');
    inputArea.classList.add('hidden');

    evaluationArea.classList.remove('hidden');
    evalContent.classList.add('hidden');
    evalTitle.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Eğitim Amiri Değerlendiriyor...';

    const prompt = `Sen acımasız ama adil bir Havacılık İngilizcesi denetmenisin. 
    Yolcunun söylediği cümle: "${currentPassengerMsgEn}". 
    Öğrencinin verdiği cevap: "${userAnswer}".
    Beklenen gramer yapısı: "${currentExpectedGrammar}".
    
    Öğrencinin cevabını:
    1) İngilizce gramer doğruluğuna,
    2) Havacılık nezaketine (CRM kuralları),
    3) Beklenen gramer yapısını kullanıp kullanmamasına göre değerlendir.
    
    SADECE JSON formatında dön:
    {
      "score": Puan (Sadece rakam, 0 ile 10 arası),
      "feedback": "Türkçe geri bildirim. Neden puan kırdığını veya neyi mükemmel yaptığını açıkla.",
      "betterVersion": "[ENGLISH] Öğrencinin cümlesinin kusursuz İngilizce havacılık versiyonu"
    }`;

    try {
        // OpenAI API'ye İstek Atıyoruz YERİNE KENDİ API'MIZE ATIYORUZ
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                    // Authorization satırını sildik!
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: prompt }],
                    response_format: { type: "json_object" },
                    temperature: 0.85
                })
            });

        const data = await response.json();
        const evalResult = JSON.parse(data.choices[0].message.content);

        // Skoru Güncelle
        const score = parseInt(evalResult.score);
        userScore += score;
        updateRank();

        // Sonucu Bas
        evalTitle.innerHTML = 'Değerlendirme Sonucu';
        evalScore.textContent = `${score} / 10`;
        evalScore.style.color = score >= 7 ? 'var(--success-green)' : 'var(--danger-red)';
        evalFeedback.textContent = evalResult.feedback;
        evalBetterVersion.textContent = evalResult.betterVersion;

        evalContent.classList.remove('hidden');

    } catch (error) {
        console.error(error);
        evalTitle.innerHTML = 'Değerlendirme Başarısız. API hatası.';
    }
}

function updateRank() {
    if(userScore >= 80) userRank = "Kabin Amiri (Purser)";
    else if(userScore >= 40) userRank = "Kıdemli Memur (Senior)";
    else if(userScore >= 15) userRank = "Kabin Memuru (Junior)";
    
    if(rankTextEl) {
        rankTextEl.textContent = `${userRank} (${userScore} Puan)`;
    }
}
// --- YENİ: KONU SEÇİMİNE GERİ DÖN MANTIĞI ---
if(backToSetupBtn) {
    backToSetupBtn.addEventListener('click', () => {
        // Tüm pratik ve değerlendirme ekranlarını gizle
        briefingArea.classList.add('hidden');
        roleplayArea.classList.add('hidden');
        evaluationArea.classList.add('hidden');
        crewMsgContainer.classList.add('hidden');
        
        // İnput alanını sıfırla ve göster
        crewInput.value = "";
        inputArea.classList.remove('hidden');
        
        // Geri dön butonunu gizle, Ana Konu seçimini göster
        backToSetupBtn.classList.add('hidden');
        grammarSetup.classList.remove('hidden');
    });
}
// ==========================================
// 6. PODCAST & DİNLEME AKADEMİSİ (CANLI YOUTUBE API)
// ==========================================

// Seviyelere Özel Canlı Arama Terimleri (Keywords)
const searchQueries = {
    "A2-B1": "English listening practice podcast A2 B1 conversation",
    "B1-B2": "English listening practice podcast intermediate B1 B2",
    "B2-C1": "English listening practice podcast advanced B2 C1"
};

// DOM Elementleri
const levelBtns = document.querySelectorAll('.level-btn');
const podcastGallery = document.getElementById('podcast-gallery');
const podcastPlayerContainer = document.getElementById('podcast-player-container');
const podcastTitle = document.getElementById('podcast-player-title');
const podcastIframe = document.getElementById('podcast-iframe');
const podcastDesc = document.getElementById('podcast-player-desc');
const closePodcastBtn = document.getElementById('close-podcast-btn');

// Seviye Butonlarına Tıklama (Canlı API İsteği)
levelBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
        levelBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        podcastPlayerContainer.classList.add('hidden');
        podcastIframe.src = "";

        const selectedLevel = btn.getAttribute('data-level');
        const searchQuery = searchQueries[selectedLevel];

        // Yükleniyor animasyonu göster
        podcastGallery.innerHTML = '<div style="text-align:center; width:100%; color:var(--primary-blue); padding: 40px;"><i class="fa-solid fa-spinner fa-spin fa-2x"></i><br><br>Canlı Sunucudan Videolar Çekiliyor...</div>';
        podcastGallery.classList.remove('hidden');

        try {
            // Kendi yazdığımız güvenli Vercel API'sine (youtube.js) istek atıyoruz
            const response = await fetch("/api/youtube", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: searchQuery })
            });

            const data = await response.json();

            if (data.error || !data.items) {
                throw new Error(data.error?.message || "YouTube API Kotası Doldu veya Hata Oluştu.");
            }

            // Galeriyi temizle ve API'den gelen canlı sonuçları ekrana bas
            podcastGallery.innerHTML = '';
            
            data.items.forEach(item => {
                const videoId = item.id.videoId;
                const snippet = item.snippet;
                
                const card = document.createElement('div');
                card.className = 'podcast-card';
                card.innerHTML = `
                    <img src="${snippet.thumbnails.medium.url}" alt="Thumbnail" style="width:100%; border-radius:8px; margin-bottom:10px;">
                    <h4>${snippet.title}</h4>
                    <p style="font-size: 0.8rem;">Kanal: ${snippet.channelTitle}</p>
                `;
                
                // Karta tıklanınca o videoyu embed formatında tahtada aç
                card.addEventListener('click', () => {
                    openPodcastPlayer(snippet.title, snippet.description, videoId);
                });

                podcastGallery.appendChild(card);
            });

        } catch (error) {
            console.error(error);
            podcastGallery.innerHTML = `<div style="color:var(--danger-red); text-align:center; width:100%;">🚨 Hata: ${error.message}</div>`;
        }
    });
});

// Videoyu Açma Fonksiyonu
function openPodcastPlayer(title, desc, videoId) {
    podcastGallery.classList.add('hidden');
    podcastPlayerContainer.classList.remove('hidden');
    
    podcastTitle.textContent = title;
    podcastDesc.textContent = desc;
    // Gelen Video ID'sini otomatik olarak Embed Linkine çevirir!
    podcastIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    
    podcastPlayerContainer.scrollIntoView({ behavior: 'smooth' });
}

// Videoyu Kapatma Fonksiyonu
if(closePodcastBtn) {
    closePodcastBtn.addEventListener('click', () => {
        podcastPlayerContainer.classList.add('hidden');
        podcastIframe.src = ""; 
        podcastGallery.classList.remove('hidden');
    });
}
