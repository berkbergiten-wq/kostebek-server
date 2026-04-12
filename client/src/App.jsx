import { useEffect, useState, useRef } from "react";
import { socket } from "./socket";

<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800&family=Poppins:wght@700&display=swap" rel="stylesheet"></link>


const clickSound = new Audio(`${import.meta.env.BASE_URL}click.mp3`);
const swipeSound = new Audio(`${import.meta.env.BASE_URL}swipe.mp3`);
const tickSound = new Audio(`${import.meta.env.BASE_URL}tick.mp3`);
const goSound = new Audio(`${import.meta.env.BASE_URL}go.mp3`);
goSound.volume = 1;

const playTick = () => {
  tickSound.currentTime = 0;
  tickSound.play().catch(() => {});
};

const playClick = () => {
  clickSound.currentTime = 0;
  clickSound.play();
};

const playSwipe = () => {
  swipeSound.currentTime = 0;
  swipeSound.play();
};

const homeButtonStyle = {
  width: "100%",
  maxWidth: 360,
  height: 76,
  borderRadius: 24,
  fontSize: 24,
  border: "4px solid #111",
  background: "linear-gradient(180deg, #ffb347, #ff7a00)",
  color: "white",
  fontWeight: 900,
  cursor: "pointer",
  boxShadow: "0 6px 0 #111",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 14,
  textTransform: "uppercase",
};

const homeSmallButtonStyle = {
  height: 42,
  minWidth: 180,
  borderRadius: 12,
  border: "3px solid #111",
  color: "white",
  fontSize: 18,
  fontWeight: 900,
  cursor: "pointer",
  boxShadow: "0 4px 0 #111",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 18px",
};

function App() {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef(null);
  const musicRef = useRef(new Audio(`${import.meta.env.BASE_URL}home-music.mp3`));
  const [mode, setMode] = useState("");
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const [roomCode, setRoomCode] = useState("");
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [question, setQuestion] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showSelections, setShowSelections] = useState(false);
  const [isMole, setIsMole] = useState(false);
  const [gamePhase, setGamePhase] = useState("question");
  const [moleVoteTarget, setMoleVoteTarget] = useState(null);
  const [showMoleVoting, setShowMoleVoting] = useState(false);
  const [showMoleResults, setShowMoleResults] = useState(false);

  const [moleId, setMoleId] = useState(null);

  const [phase, setPhase] = useState("LOBBY");
  const [timeLeft, setTimeLeft] = useState(null);
  const [round, setRound] = useState(0);
  const [maxRounds, setMaxRounds] = useState(5);
  const [roomMaxRounds, setRoomMaxRounds] = useState(5);

  const [gameCategory, setGameCategory] = useState("karisik");
  const [roomCategory, setRoomCategory] = useState("karisik");

  const [questionType, setQuestionType] = useState("");
  const [yesNoAnswer, setYesNoAnswer] = useState(null);

  const [numberAnswer, setNumberAnswer] = useState("");

  const [joinError, setJoinError] = useState("");
  const [wordHunt, setWordHunt] = useState(null);
  const [wordInput, setWordInput] = useState("");

  const [isHovered, setIsHovered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [avatarIndex, setAvatarIndex] = useState(0);

  const [popupMessage, setPopupMessage] = useState("");

  const [selectionPop, setSelectionPop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const avatarColorMap = {
  "avatar1.png": "linear-gradient(180deg, #4ade80, #22c55e)",
  "avatar2.png": "linear-gradient(180deg, #ef4444, #dc2626)",
  "avatar3.png": "linear-gradient(180deg, #3b82f6, #2563eb)",
  "avatar4.png": "linear-gradient(180deg, #a855f7, #7c3aed)",
  "avatar5.png": "linear-gradient(180deg, #facc15, #eab308)",
  "avatar6.png": "linear-gradient(180deg, #ec4899, #db2777)",
  "avatar7.png": "linear-gradient(180deg, #6b7280, #4b5563)",
  "avatar8.png": "linear-gradient(180deg, #f97316, #ea580c)",
};

const getAvatarSrc = (avatarKey) => {
  if (!avatarKey) return "";
  return `${import.meta.env.BASE_URL}avatars/${avatarKey}.png`;
};

const getAvatarFileName = (avatarKey) => {
  if (!avatarKey) return "";
  return `${avatarKey}.png`;
};

const getAvatarBg = (avatarKey) => {
  return (
    avatarColorMap[getAvatarFileName(avatarKey)] ||
    "linear-gradient(180deg, #6b7280, #4b5563)"
  );
};
  

  const leaveRoom = () => {
    if (!roomCode) return;
  
    socket.emit("leave_room", { roomCode });
  
    setRoomCode("");
    setPlayers([]);
    setIsHost(false);
    setGameStarted(false);
    setQuestion("");
    setSelectedPlayer(null);
    setShowSelections(false);
    setIsMole(false);
    setGamePhase("question");
    setMoleVoteTarget(null);
    setShowMoleVoting(false);
    setShowMoleResults(false);
    setMoleId(null);
    setPhase("LOBBY");
    setTimeLeft(null);
    setRound(0);
    setRoomMaxRounds(5);
    setRoomCategory("karisik");
    setQuestionType("");
    setYesNoAnswer(null);
    setNumberAnswer("");
    setWordHunt(null);
    setWordInput("");
    setJoinCode("");
    setJoinError("");
    setMode("");
  };
  

  const categoryLabels = {
    gosteri_zamani: "Gösteri Zamanı",
    eller_yukari: "Eller Yukarı",
    parmak_say: "Parmak Say",
    kelime_avi: "Kelime Avı",
    karisik: "Karışık",
  };


  const avatars = [
  "avatar1",
  "avatar2",
  "avatar3",
  "avatar4",
  "avatar5",
  "avatar6",
  "avatar7",
  "avatar8",
];
  
  const allReady =
    players.length >= 3 && players.every((player) => player.ready);
    const categories = [
      {
        id: "karisik",
        name: "ORTAYA KARIŞIK",
        image: isMobile ? `${import.meta.env.BASE_URL}ortaya-karisik-mobile.png` : `${import.meta.env.BASE_URL}ortaya-karisik.png`,
        bg: isMobile ? `${import.meta.env.BASE_URL}bg-orange-mobile.png` : `${import.meta.env.BASE_URL}bg-orange.png`,
      },
      {
        id: "eller_yukari",
        name: "ELLER YUKARI",
        image: isMobile ? `${import.meta.env.BASE_URL}eller-yukari-mobile.png` : `${import.meta.env.BASE_URL}eller-yukari.png`,
        bg: isMobile ? `${import.meta.env.BASE_URL}bg-green-mobile.png` : `${import.meta.env.BASE_URL}bg-green.png`,
      },
      {
        id: "kelime_avi",
        name: "KELİME AVI",
        image: isMobile ? `${import.meta.env.BASE_URL}kelime-avi-mobile.png` : `${import.meta.env.BASE_URL}kelime-avi.png`,
        bg: isMobile ? `${import.meta.env.BASE_URL}bg-purple-mobile.png` : `${import.meta.env.BASE_URL}bg-purple.png`,
      },
      {
        id: "gosteri_zamani",
        name: "GÖSTERİ ZAMANI",
        image: isMobile ? `${import.meta.env.BASE_URL}gosteri-zamani-mobile.png` : `${import.meta.env.BASE_URL}gosteri-zamani.png`,
        bg: isMobile ? `${import.meta.env.BASE_URL}bg-yellow-mobile.png` : `${import.meta.env.BASE_URL}bg-yellow.png`,
      },
      {
        id: "parmak_say",
        name: "PARMAK SAY",
        image: isMobile ? `${import.meta.env.BASE_URL}parmak-say-mobile.png` : `${import.meta.env.BASE_URL}parmak-say.png`,
        bg: isMobile ? `${import.meta.env.BASE_URL}bg-blue-mobile.png` : `${import.meta.env.BASE_URL}bg-blue.png`,
      },
    ];
    const currentCategory = categories.find(
      (c) => c.id === question?.category
    );
    const currentQuestionBg = currentCategory?.bg || `${import.meta.env.BASE_URL}bg-orange.png`;
    const selectedCategory = categories[selectedIndex];
    const prevCategory = () => {
      setSelectedIndex((prev) =>
        prev === 0 ? categories.length - 1 : prev - 1
      );
    };
    
    const nextCategory = () => {
      setSelectedIndex((prev) =>
        prev === categories.length - 1 ? 0 : prev + 1
      );
    };

    const [showGo, setShowGo] = useState(false);

    useEffect(() => {
      const startMusicOnce = () => {
        if (!gameStarted && musicRef.current) {
          musicRef.current.pause();
          musicRef.current.currentTime = 0;
          musicRef.current.loop = true;
          musicRef.current.volume = volume;
          musicRef.current.play().catch(() => {});
          setIsMuted(false);
        }
    
        window.removeEventListener("click", startMusicOnce);
      };
    
      if (!gameStarted) {
        window.addEventListener("click", startMusicOnce);
      }
    
      if (!gameStarted && musicRef.current) {
        musicRef.current.loop = true;
        musicRef.current.volume = volume;
        musicRef.current.play().catch(() => {});
        setIsMuted(false);
      }
    
      return () => {
        window.removeEventListener("click", startMusicOnce);
      };
    }, [gameStarted, volume]);

    useEffect(() => {
      const updateMobile = () => {
        setIsMobile(window.matchMedia("(max-width: 768px)").matches);
      };

      updateMobile();
      window.addEventListener("resize", updateMobile);
      return () => window.removeEventListener("resize", updateMobile);
    }, []);

    useEffect(() => {
      console.log("App isMobile:", isMobile);
    }, [isMobile]);
    
    useEffect(() => {
      if (gameStarted && phase === "RESULT" && musicRef.current) {
        musicRef.current.pause();
        musicRef.current.currentTime = 0;
        musicRef.current.loop = true;
        musicRef.current.volume = volume;
        musicRef.current.play().catch(() => {});
        setIsMuted(false);
      }
    }, [gameStarted, phase, volume]);
    
    useEffect(() => {
      if (
        phase === "RESULT" &&
        players.length > 0 &&
        players.every((p) => p.ready) &&
        musicRef.current
      ) {
        musicRef.current.pause();
        musicRef.current.currentTime = 0;
        setIsMuted(true);
      }
    }, [players, phase]);
    
    useEffect(() => {
      if (phase === "GAME_OVER" && musicRef.current) {
        musicRef.current.pause();
        musicRef.current.currentTime = 0;
        musicRef.current.loop = true;
        musicRef.current.volume = volume;
        musicRef.current.play().catch(() => {});
        setIsMuted(false);
      }
    }, [phase, volume]);
    
    useEffect(() => {
      if (
        gameStarted &&
        phase !== "RESULT" &&
        phase !== "GAME_OVER" &&
        musicRef.current
      ) {
        musicRef.current.pause();
      }
    }, [gameStarted, phase]);

    useEffect(() => {
      if (phase === "START_COUNTDOWN" && timeLeft === 1) {
        const goTimer = setTimeout(() => {
          setShowGo(true);
    
          setTimeout(() => {
            setShowGo(false);
          }, 1000);
        }, 1000);
    
        return () => clearTimeout(goTimer);
      }
    }, [phase, timeLeft]);

    useEffect(() => {
      if (phase === "START_COUNTDOWN" && timeLeft >= 0) {
        playTick();
      }
    }, [timeLeft]);

    useEffect(() => {
      if (
        (phase === "QUESTION" ||
          phase === "SHOW_SELECTIONS" ||
          phase === "MOLE_VOTING") &&
        timeLeft > 0 &&
        timeLeft <= 5
      ) {
        playTick();
      }
    }, [phase, timeLeft]);
   

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    

    socket.on("room_created", (data) => {
      setRoomCode(data.roomCode);
    });
    socket.on("join_success", (data) => {
      setRoomCode(data.roomCode);
    });

    socket.on("room_update", (room) => {
      setPlayers(room.players || []);
      setIsHost(room.host === socket.id);
      setPhase(room.phase || "LOBBY");
      setTimeLeft(room.timeLeft ?? null);
      setRound(room.round || 0);
      setRoomMaxRounds(room.maxRounds || 5);
      setRoomCategory(room.gameCategory || "karisik");
      setQuestionType(room.currentQuestionType || "");
      setQuestion(room.currentQuestion || null);
      setIsMole(room.moleId === socket.id);
      setWordHunt(room.wordHunt || null);
    
      if (room.gameState === "STARTED") {
        setGameStarted(true);
      }
    });

    socket.on("join_error", (data) => {
      setJoinError(data.message || "Odaya katılamadın.");
    });

    socket.on("host_left", () => {
      setPopupMessage("Host oyundan ayrıldı.");
    
      setRoomCode("");
      setPlayers([]);
      setIsHost(false);
      setGameStarted(false);
      setQuestion("");
      setSelectedPlayer(null);
      setShowSelections(false);
      setIsMole(false);
      setGamePhase("question");
      setMoleVoteTarget(null);
      setShowMoleVoting(false);
      setShowMoleResults(false);
      setMoleId(null);
      setPhase("LOBBY");
      setTimeLeft(null);
      setRound(0);
      setRoomMaxRounds(5);
      setRoomCategory("karisik");
      setQuestionType("");
      setYesNoAnswer(null);
      setNumberAnswer("");
      setWordHunt(null);
      setWordInput("");
      setJoinCode("");
      setJoinError("");
      setMode("");
    
      setTimeout(() => {
        setPopupMessage("");
      }, 4000);
    });
    socket.on("kicked_from_room", () => {
      setPopupMessage("Odadan atıldın.");
    
      setRoomCode("");
      setPlayers([]);
      setIsHost(false);
      setGameStarted(false);
      setQuestion("");
      setSelectedPlayer(null);
      setShowSelections(false);
      setIsMole(false);
      setGamePhase("question");
      setMoleVoteTarget(null);
      setShowMoleVoting(false);
      setShowMoleResults(false);
      setMoleId(null);
      setPhase("LOBBY");
      setTimeLeft(null);
      setRound(0);
      setRoomMaxRounds(5);
      setRoomCategory("karisik");
      setQuestionType("");
      setYesNoAnswer(null);
      setNumberAnswer("");
      setWordHunt(null);
      setWordInput("");
      setJoinCode("");
      setJoinError("");
      setMode("");
    
      setTimeout(() => {
        setPopupMessage("");
      }, 4000);
    });
    socket.on("game_started", (room) => {
      setGameStarted(true);
      setIsMole(room.moleId === socket.id);
      setQuestion(room.currentQuestion || "");
      setSelectedPlayer(null);
      setShowSelections(false);
      setMoleVoteTarget(null);
      setShowMoleVoting(false);
      setShowMoleResults(false);
      setGamePhase("question");
      setPhase(room.phase || "LOBBY");
      setTimeLeft(room.timeLeft ?? null);
      setRound(room.round || 0);
      setRoomMaxRounds(room.maxRounds || 5);
      setRoomCategory(room.gameCategory || "karisik");
      setQuestionType(room.currentQuestionType || "");
      setYesNoAnswer(null);
      setNumberAnswer("");
      setWordHunt(room.wordHunt || null);
      setWordInput("");
    });
    socket.on("all_players_selected", (room) => {
      setPlayers(room.players || []);
      setShowSelections(true);
    });
    socket.on("mole_voting_started", (room) => {
      setPlayers(room.players || []);
      setShowSelections(false);
      setShowMoleVoting(true);
      setShowMoleResults(false);
      setGamePhase("moleVoting");
    });
    
    socket.on("mole_vote_update", (room) => {
      setPlayers(room.players || []);
    });
    
    socket.on("all_mole_votes_completed", (room) => {
      setPlayers(room.players || []);
      setShowMoleVoting(false);
      setShowMoleResults(true);
      setGamePhase("moleResults");
      setPlayers(room.players || []);
      setMoleId(room.moleId);
    });
    
    
    const nextCategory = () => {
      setSelectedIndex((prev) =>
        prev === categories.length - 1 ? 0 : prev + 1
      );
    };
    return () => {
      socket.off("connect");
      socket.off("room_created");
      socket.off("room_update");
      socket.off("game_started");
      socket.off("all_players_selected");
      socket.off("mole_voting_started");
      socket.off("mole_vote_update");
      socket.off("all_mole_votes_completed");
      socket.off("join_success");
      socket.off("join_error");
      socket.off("host_left");
      socket.off("kicked_from_room");
    };
  }, []);
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (roomCode) {
        socket.emit("leave_room", { roomCode });
      }
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
  
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [roomCode]);

  

  const createRoom = () => {
    if (!name) return;
  
    
    socket.emit("create_room", {
      name,
      avatar: avatars[avatarIndex],
      maxRounds,
      gameCategory: selectedCategory.id,
    });
  };

  const joinRoom = () => {
    if (!name || !joinCode) return;
    setJoinError("");
    
    socket.emit("join_room", {
      roomCode: joinCode.toUpperCase(),
      name,
      avatar: avatars[avatarIndex],
    });
  };

  const toggleReady = () => {
    socket.emit("toggle_ready", { roomCode });
  };

  const startGame = () => {
    socket.emit("start_game", { roomCode });
  };

  const selectPlayer = (playerId) => {
    setSelectedPlayer(playerId);
    setSelectionPop(true);
  
    setTimeout(() => {
      setSelectionPop(false);
    }, 120);
  
    socket.emit("select_player", {
      roomCode,
      targetId: playerId,
    });
  };

  const startMoleVoting = () => {
    socket.emit("start_mole_voting", { roomCode });
  };
  
  const voteMole = (playerId) => {
    setMoleVoteTarget(playerId);
  
    socket.emit("vote_mole", {
      roomCode,
      targetId: playerId,
    });
  };
  const submitYesNoAnswer = (answer) => {
    setYesNoAnswer(answer);
  
    socket.emit("submit_yes_no_answer", {
      roomCode,
      answer,
    });
  };

  const submitNumberAnswer = (answer) => {
    setNumberAnswer(answer);
  
    socket.emit("submit_number_answer", {
      roomCode,
      answer,
    });
  };

  const submitWordHuntWord = () => {
    socket.emit("submit_word_hunt_word", {
      roomCode,
      word: wordInput,
    });
  
    setWordInput("");
  };

  const popupElement = popupMessage ? (
    <div
      style={{
        position: "fixed",
        top: 40,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#ef4444", // 🔴 kırmızı
        color: "#fff",
        padding: "18px 32px", // 🔥 büyüdü
        borderRadius: 16,
        fontWeight: 900,
        fontSize: 22, // 🔥 büyüdü
        zIndex: 9999,
        boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
        border: "3px solid #111",
        textTransform: "uppercase",
        letterSpacing: 1,
      }}
    >
      {popupMessage}
    </div>
  ) : null;

  if (gameStarted && showSelections) {
    return (
      <div
  style={{
    padding: 50,
    fontFamily: "Arial",
    backgroundImage: `url(${currentQuestionBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
  }}
>
        <h1>Seçimler</h1>
  
        {players.map((player) => {
          const votedName =
            players.find((p) => p.id === player.vote)?.name || "Seçmedi";
  
          return (
            <div key={player.id}>
              {player.name} → {votedName}
            </div>
          );
        })}
  
        <div style={{ marginTop: 20 }}>
          <button onClick={startMoleVoting}>Köstebek Oylamasına Geç</button>
        </div>
      </div>
    );
  }
  if (!mode) {
    return (
      <div
        style={{
          width: "100vw",
          minHeight: "100vh",
          backgroundImage: `url("${isMobile ? `${import.meta.env.BASE_URL}home-bg-mobile.png` : `${import.meta.env.BASE_URL}home-bg.png`}")`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          display: "flex",
          justifyContent: "center",          
          alignItems: "center",
          paddingTop: isMobile ? 28 : 0,
          paddingBottom: isMobile ? 28 : 0,
          position: "relative",
          overflow: "auto",
        }}
      >
        {popupElement}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.08,
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.8) 0px, rgba(255,255,255,0.8) 20px, transparent 20px, transparent 80px)",
            backgroundSize: "200px 200px",
            animation: "stripeMove 4s linear infinite",
          }}
        />
  
        <div
          style={{
            width: isMobile ? "calc(100vw - 20px)" : "min(620px, 82vw)",
            maxWidth: isMobile ? 340 : "unset",
            minHeight: isMobile ? 260 : 320,
            maxHeight: isMobile ? "calc(100vh - 64px)" : undefined,
            background: "#ffffff",
            padding: isMobile ? "16px 12px" : "36px 40px",
            borderRadius: 24,
            boxShadow:
              "0 30px 60px rgba(0,0,0,0.35), inset 0 3px 6px rgba(255,255,255,0.7), inset 0 -6px 12px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: isMobile ? 12 : 24,
            zIndex: 2,
            margin: isMobile ? "0 auto" : undefined,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
              width: "100%",
            }}
          >
            <button
              onClick={() => {
                playClick();
                setMode("create");
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 8px 0 #111";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 6px 0 #111";
              }}
              style={{
                ...homeButtonStyle,
                transition: "0.15s ease",
                height: isMobile ? 54 : 76,
                fontSize: isMobile ? 18 : 24,
                borderRadius: isMobile ? 18 : 24,
                padding: isMobile ? "0 14px" : "0 18px",
              }}
            >
              OYUN KUR
            </button>
  
            <button
            
              onClick={() => {
                playClick();
                setMode("join");
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 8px 0 #111";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 6px 0 #111";
              }}
              style={{
                ...homeButtonStyle,
                transition: "0.15s ease",
                height: isMobile ? 54 : 76,
                fontSize: isMobile ? 18 : 24,
                borderRadius: isMobile ? 18 : 24,
                padding: isMobile ? "0 14px" : "0 18px",
              }}
            >
              OYUNA KATIL
            </button>
          </div>
  
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "center",
              gap: isMobile ? 12 : 18,
              marginTop: 10,
              width: "100%",
              alignItems: "center",
            }}
          >
            <div
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.background = "#f5f5f5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = "#fff";
              }}
              onClick={() =>{
                playClick();
                window.open("https://www.instagram.com/skalacrafttr/", "_blank");
              }
              }
              style={{
                width: isMobile ? "100%" : 170,
                maxWidth: isMobile ? 320 : 260,
                height: 52,
                borderRadius: 16,
                background: "#F2F2F2",
                boxShadow:
                  "0 10px 20px rgba(0,0,0,0.18), inset 0 2px 4px rgba(255,255,255,0.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                cursor: "pointer",
              }}
            >
              <img src={`${import.meta.env.BASE_URL}instagram-logo.png`} alt="Instagram" style={{ width: 26 }} />
              <span style={{ fontSize: 14, fontWeight: "bold" }}>Instagram</span>
            </div>
  
            <div
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.background = "#f5f5f5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = "#fff";
              }}
              onClick={() =>{
                playClick(); 
                window.open("https://skalacraft.com/", "_blank");
              }}
              style={{
                width: isMobile ? "100%" : 170,
                maxWidth: isMobile ? 320 : 260,
                height: 52,
                borderRadius: 16,
                background: "#F2F2F2",
                boxShadow:
                  "0 10px 20px rgba(0,0,0,0.18), inset 0 2px 4px rgba(255,255,255,0.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                cursor: "pointer",
              }}
            >
              <img src={`${import.meta.env.BASE_URL}skala-logo.png`} alt="SkalaCraft" style={{ width: 28 }} />
              <span style={{ fontSize: 14, fontWeight: "bold" }}>
                skalacraft.com
              </span>
            </div>
          </div>
        </div>
  
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              position: "fixed",
              right: isMobile ? 16 : 20,
              bottom: isMobile ? 16 : 20,
              zIndex: 9999,
              width: isMobile ? 58 : 90,
              height: isMobile ? 58 : 90,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "visible",
            }}
          >
          <div
            style={{
              position: "relative",
              width: isMobile ? 56 : 68,
              height: isMobile ? 56 : 68,
              borderRadius: isMobile ? 14 : 18,
              background: "#F2F2F2",
              boxShadow: isMuted
                ? "0 10px 24px rgba(0,0,0,0.22), inset 0 2px 4px rgba(255,255,255,0.7)"
                : "0 0 20px rgba(0,200,255,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: isMobile ? 68 : 80,
                left: "50%",
                transform: "translateX(-50%)",
                width: isMobile ? 70 : 100,
                height: isMobile ? 98 : 120,
                borderRadius: 14,
                background: "#ffffff",
                boxShadow:
                  "0 8px 18px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: isHovered ? 1 : 0,
                pointerEvents: isHovered ? "auto" : "none",
                transition: "0.2s ease",
              }}
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setVolume(v);
                  if (musicRef.current) {
                    musicRef.current.volume = v;
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: isMobile ? 70 : 100,
                  transform: "rotate(-90deg)",
                  cursor: "pointer",
                }}
              />
            </div>
  
            <button
  onClick={async () => {
    try {
      const music = musicRef.current;
      if (!music) return;

      if (isMuted) {
        music.loop = true;
        music.volume = volume;
        await music.play();
        setIsMuted(false);
      } else {
        music.pause();
        setIsMuted(true);
      }
    } catch (err) {
      console.log(err);
    }
  }}
  style={{
    width: "100%",
    height: "100%",
    border: "none",
    background: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: isMobile ? 22 : 30,
    userSelect: "none",
    padding: 0,
  }}
>
  {isMuted ? "🔇" : "🔊"}
</button>
          </div>
        </div>
  
        
      </div>
    );
  }
 
 if (mode === "create" && !roomCode) {
  const createMobile = isMobile
    ? {
        outerPadding: "12px 10px 20px",
        cardWidth: "calc(100vw - 20px)",
        cardMaxWidth: 360,

        infoButtonSize: 42,
        topButtonScale: 0.88,

        sectionGap: 12,
        sectionPadding: "12px 12px 14px",
        sectionRadius: 18,

        sectionTitleFont: 12,

        categoryCardMaxWidth: 230,
        categoryCardHeight: 104,

        avatarBox: 86,
        avatarImageMax: 74,

        arrowSize: 34,
        arrowFont: 20,

        inputHeight: 50,
        inputFont: 15,

        sliderMaxWidth: 260,

        createButtonHeight: 56,
        createButtonFont: 14,
      }
    : null;

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        backgroundImage: `url("${import.meta.env.BASE_URL}bg-bej2.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: isMobile ? createMobile.outerPadding : "28px 0",
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.08,
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.8) 0px, rgba(255,255,255,0.8) 20px, transparent 20px, transparent 80px)",
          backgroundSize: "200px 200px",
        }}
      />

      <div
        style={{
          width: isMobile ? createMobile.cardWidth : "100%",
          maxWidth: isMobile ? createMobile.cardMaxWidth : 820,
          minHeight: 320,
          background: "#F2F2F2",
          padding: isMobile ? "14px 12px 18px" : "36px 40px",
          borderRadius: isMobile ? 22 : 26,
          border: isMobile ? "4px solid #111" : "none",
          boxShadow: isMobile
            ? "0 8px 0 #111"
            : "0 30px 60px rgba(0,0,0,0.35), inset 0 3px 6px rgba(255,255,255,0.7), inset 0 -6px 12px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: isMobile ? 12 : 24,
          zIndex: 2,
          position: "relative",
          boxSizing: "border-box",
          margin: "0 auto",
        }}
      >
        <button
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
              e.currentTarget.style.boxShadow = "0 6px 0 #111";
            }
          }}
          onMouseLeave={(e) => {
            if (!isMobile) {
              e.currentTarget.style.transform = "translateY(0px) scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 0 #111";
            }
          }}
          onClick={() => {
            playClick();
            setMode("howToPlay");
          }}
          style={{
            position: "absolute",
            top: isMobile ? 10 : 18,
            right: isMobile ? 10 : 18,
            width: isMobile ? createMobile.infoButtonSize : 50,
            height: isMobile ? createMobile.infoButtonSize : 50,
            borderRadius: "50%",
            border: "3px solid #111",
            background: "linear-gradient(180deg, #4db2ff, #1e6fe8)",
            color: "#fff",
            fontWeight: "bold",
            fontSize: isMobile ? 22 : 24,
            cursor: "pointer",
             transform: isMobile ? "scale(0.8)" : "none",
            boxShadow: "0 4px 0 #111",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            zIndex: 3,
          }}
        >
          i
        </button>

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-start",
            paddingRight: isMobile ? 48 : 0,
            boxSizing: "border-box",
          }}
        >
          <button
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 6px 0 #111";
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = "0 3px 0 #111";
              }
            }}
            onClick={() => {
              playClick();
              setMode("");
            }}
            style={{
              minWidth: isMobile ? 100 : 180,
              height: isMobile ? 34 : 42,
              fontSize: isMobile ? 11 : 18,
              padding: isMobile ? "0 10px" : "0 18px",
              transform: isMobile ? "scale(0.8)" : "none",
              ...homeSmallButtonStyle,
              background: "#ef4444",
              boxShadow: "0 4px 0 #111",
            }}
          >
            ← Ana Sayfa
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: isMobile ? createMobile.sectionGap : 18,
            width: "100%",
            marginTop: 2,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: isMobile ? "100%" : 720,
              background: "#F2F2F2",
              border: "4px solid #111",
              borderRadius: isMobile ? createMobile.sectionRadius : 20,
              boxShadow: "0 6px 0 #111",
              padding: isMobile ? createMobile.sectionPadding : "18px 24px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: isMobile ? 10 : 18,
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                fontSize: isMobile ? 18: 24,
                textAlign: "center",
                textTransform: "uppercase",
                color: "#6b6375",
                letterSpacing: 0.3,
              }}
            >
              KATEGORİLER
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "40px minmax(0, 1fr) 40px" : "56px minmax(0, 1fr) 56px",
                alignItems: "center",
                justifyContent: "center",
                columnGap: isMobile ? 12 : 28,
                width: "100%",
              }}
>
              <button
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.style.background = "#f5f5f5";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.background = "#fff";
                  }
                }}
                onClick={() => {
                  playSwipe();
                  prevCategory();
                }}
                style={{
                  width: isMobile ? createMobile.arrowSize : 56,
                  height: isMobile ? createMobile.arrowSize : 56,
                  borderRadius: 14,
                  border: "4px solid #111",
                  justifySelf: "center",
                  background: "#F2F2F2",
                  fontSize: isMobile ? createMobile.arrowFont : 28,
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 4px 0 #111",
                  flexShrink: 0,
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                ‹
              </button>

              <div
                style={{
                  width: "100%",
                  maxWidth: isMobile ? createMobile.categoryCardMaxWidth : 420,
                  height: isMobile ? createMobile.categoryCardHeight : 240,
                  backgroundImage: selectedCategory.bg
                    ? `url(${selectedCategory.bg})`
                    : "linear-gradient(180deg, #f59e0b, #ea580c)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  border: "4px solid #111",
                  boxShadow: "0 8px 0 #111",
                  overflow: "hidden",
                  margin: "0 auto",
                }}
              >
                <img
                  src={selectedCategory.image}
                  alt={selectedCategory.name}
                  style={{
                    width: isMobile ? "120%":"100%",
                    height: isMobile ? "120%":"100%",
                    objectFit: isMobile ?"cover": "contain",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              </div>

              <button
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.style.background = "#f5f5f5";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.background = "#fff";
                  }
                }}
                onClick={() => {
                  playSwipe();
                  nextCategory();
                }}
                style={{
                  width: isMobile ? createMobile.arrowSize : 56,
                  height: isMobile ? createMobile.arrowSize : 56,
                  borderRadius: 14,
                  border: "4px solid #111",
                  background: "#F2F2F2",
                  fontSize: isMobile ? createMobile.arrowFont : 28,
                  fontWeight: "bold",
                  
                  cursor: "pointer",
                  boxShadow: "0 4px 0 #111",
                  flexShrink: 0,
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                ›
              </button>
            </div>
          </div>

          <div
            style={{
              width: "100%",
              maxWidth: isMobile ? "100%" : 720,
              background: "#F2F2F2",
              border: "4px solid #111",
              borderRadius: isMobile ? createMobile.sectionRadius : 20,
              boxShadow: "0 6px 0 #111",
              padding: isMobile ? createMobile.sectionPadding : "18px 24px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: isMobile ? 10 : 18,
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                fontSize: isMobile ? 18 : 24,
                textAlign: "center",
                textTransform: "uppercase",
                color: "#6b6375",
                letterSpacing: 0.3,
              }}
            >
              KÖSTEBEĞİNİ SEÇ
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "34px auto 34px" : "56px auto 56px",
                alignItems: "center",
                justifyContent: "center",
                gap: isMobile ? 10 : 24,
                width: "100%",
              }}
            >
              <button
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.style.background = "#f5f5f5";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.background = "#fff";
                  }
                }}
                onClick={() => {
                  playClick();
                  setAvatarIndex((prev) =>
                    prev === 0 ? avatars.length - 1 : prev - 1
                  );
                }}
                style={{
                  width: isMobile ? createMobile.arrowSize : 56,
                  height: isMobile ? createMobile.arrowSize : 56,
                  borderRadius: 14,
                  border: "4px solid #111",
                  background: "#F2F2F2",
                  fontSize: isMobile ? createMobile.arrowFont : 24,
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 4px 0 #111",
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                ‹
              </button>

              <div
                style={{
                  width: isMobile ? createMobile.avatarBox : 180,
                  height: isMobile ? createMobile.avatarBox : 180,
                  border: "4px solid #111",
                  borderRadius: 16,
                  boxShadow: "0 6px 0 #111",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  background: getAvatarBg(avatars[avatarIndex]),
                  margin: "0 auto",
                }}
              >
                <img
                   src={getAvatarSrc(avatars[avatarIndex])}
                   alt="avatar"
                  style={{
                    //maxHeight: isMobile ? createMobile.avatarImageMax : 250,
                    //maxWidth: isMobile ? createMobile.avatarImageMax : 250,
                    width: isMobile ? "100%":"170%",
                    height: isMobile ? "100%":"170%",
                    objectFit: isMobile ? "cover": "contain",
                    transform: isMobile ? "none" : "scale(1.02) translateY(10px)",
                  }}
                />
              </div>

              <button
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.style.background = "#f5f5f5";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.background = "#fff";
                  }
                }}
                onClick={() => {
                  playClick();
                  setAvatarIndex((prev) =>
                    prev === avatars.length - 1 ? 0 : prev + 1
                  );
                }}
                style={{
                  width: isMobile ? createMobile.arrowSize : 56,
                  height: isMobile ? createMobile.arrowSize : 56,
                  borderRadius: 14,
                  border: "4px solid #111",
                  background: "#F2F2F2",
                  fontSize: isMobile ? createMobile.arrowFont : 24,
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 4px 0 #111",
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                ›
              </button>
            </div>
          </div>

          <div
            style={{
              width: "100%",
              maxWidth: isMobile ? "100%" : 720,
              background: "#F2F2F2",
              border: "4px solid #111",
              borderRadius: isMobile ? createMobile.sectionRadius : 20,
              boxShadow: "0 6px 0 #111",
              padding: isMobile ? "14px 12px 16px" : "22px 24px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: isMobile ? 12 : 16,
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                fontSize: isMobile ? 18: 24,
                textAlign: "center",
                color: "#6b6375",
              }}
            >
              Kullanıcı Adı
            </div>

            <input
              placeholder="İsmini gir"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                maxWidth: isMobile ? 280 : 320,
                height: isMobile ? createMobile.inputHeight : 56,
                borderRadius: 16,
                border: "4px solid #111",
                textAlign: "center",
                fontSize: isMobile ? createMobile.inputFont : 22,
                fontWeight: "bold",
                outline: "none",
                boxShadow: "0 4px 0 #111",
                boxSizing: "border-box",
                padding: "0 12px",
                color: "#555",
              }}
            />

            <div
              style={{
                width: "100%",
                maxWidth: isMobile ? createMobile.sliderMaxWidth : 320,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: isMobile ? 8 : 10,
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: isMobile ? 18: 24,
                  color: "#6b6375",
                }}
              >
                Tur Sayısı: {maxRounds}
              </div>

              <input
                type="range"
                min="3"
                max="10"
                step="1"
                value={maxRounds}
                onChange={(e) => setMaxRounds(Number(e.target.value))}
                style={{
                  width: "100%",
                  cursor: "pointer",
                }}
              />
            </div>

            <button
              type="button"
              onTouchEnd={(e) => {
                e.preventDefault();
                createRoom();
              }}
              onClick={(e) => {
                e.preventDefault();
                createRoom();
              }}
              style={{
                width: "100%",
                maxWidth: isMobile ? 280 : 320,
                height: isMobile ? createMobile.createButtonHeight : 68,
                borderRadius: 20,
                border: "4px solid #111",
                background: "linear-gradient(180deg, #4cd964, #28a745)",
                color: "white",
                fontSize: isMobile ? createMobile.createButtonFont : 24,
                fontWeight: 900,
                cursor: "pointer",
                boxShadow: "0 6px 0 #111",
                marginTop: 2,
                textTransform: "uppercase",
                letterSpacing: 0.4,
                position: "relative",
                zIndex: 50,
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              ODAYI OLUŞTUR
            </button>
          </div>
        </div>
      </div>

      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: "fixed",
          right: isMobile ? 12 : 20,
          bottom: isMobile ? 12 : 20,
          zIndex: 20,
          width: isMobile ? 62 : 90,
          height: isMobile ? 62 : 220,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: isMobile ? 56 : 68,
            height: isMobile ? 56 : 68,
            borderRadius: isMobile ? 16 : 18,
            background: "#F2F2F2",
            boxShadow: isMuted
              ? "0 10px 24px rgba(0,0,0,0.22), inset 0 2px 4px rgba(255,255,255,0.7)"
              : "0 0 20px rgba(0,200,255,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: isMobile ? 66 : 80,
              left: "50%",
              transform: "translateX(-50%)",
              width: isMobile ? 36 : 40,
              height: isMobile ? 96 : 120,
              borderRadius: 14,
              background: "#ffffff",
              boxShadow:
                "0 8px 18px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: isHovered ? 1 : 0,
              pointerEvents: isHovered ? "auto" : "none",
              transition: "0.2s ease",
            }}
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setVolume(v);
                if (musicRef.current) {
                  musicRef.current.volume = v;
                }
              }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: isMobile ? 78 : 100,
                transform: "rotate(-90deg)",
                cursor: "pointer",
              }}
            />
          </div>

          <div
            onClick={async () => {
              try {
                const music = musicRef.current;
                if (!music) return;

                if (isMuted) {
                  music.loop = true;
                  music.volume = volume;
                  await music.play();
                  setIsMuted(false);
                } else {
                  music.pause();
                  setIsMuted(true);
                }
              } catch (err) {
                console.log(err);
              }
            }}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: isMobile ? 24 : 30,
              userSelect: "none",
            }}
          >
            {isMuted ? "🔇" : "🔊"}
          </div>
        </div>
      </div>
    </div>
  );
}

  if (mode === "howToPlay") {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundImage: `url('${import.meta.env.BASE_URL}bg-bej2.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "auto",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.08,
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.8) 0px, rgba(255,255,255,0.8) 20px, transparent 20px, transparent 80px)",
            backgroundSize: "200px 200px",
          }}
        />
  
        <div
          style={{
            width: "min(900px, 92vw)",
            height: "min(760px, 88vh)",
            background: "#ffffff",
            padding: "32px 36px",
            borderRadius: 26,
            boxShadow:
              "0 30px 60px rgba(0,0,0,0.35), inset 0 3px 6px rgba(255,255,255,0.7), inset 0 -6px 12px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            zIndex: 2,
            position: "relative",
            overflow: "auto",
          }}
        >
          <button
            
            onClick={() => {
              playClick();
              setMode("")
            }}
            style={{
              ...homeSmallButtonStyle,
              background: "#ef4444",
              transition: "all 0.15s ease",
              alignSelf: "flex-start",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 6px 0 #111";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.boxShadow = "0 4px 0 #111";
            }}
          >
            ← Ana Sayfa
          </button>
  
          <div
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 360,
              height: 64,
              padding: "0 36px",
              background: "linear-gradient(180deg, #ffb347, #ff7a00)",
              border: "4px solid #111",
              borderRadius: 20,
              boxShadow: "0 6px 0 #111",
              alignSelf: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: -18,
                top: 12,
                width: 28,
                height: 40,
                background: "#ff7a00",
                border: "4px solid #111",
                borderRight: "none",
                borderRadius: "12px 0 0 12px",
                transform: "skewY(-12deg)",
                boxShadow: "-2px 4px 0 #111",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: -18,
                top: 12,
                width: 28,
                height: 40,
                background: "#ff7a00",
                border: "4px solid #111",
                borderLeft: "none",
                borderRadius: "0 12px 12px 0",
                transform: "skewY(12deg)",
                boxShadow: "2px 4px 0 #111",
              }}
            />
  
            <div
              style={{
                position: "relative",
                zIndex: 1,
                fontSize: 28,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "#fff",
                fontFamily: "'Nunito', 'Poppins', sans-serif",
              }}
            >
              NASIL OYNANIR?
            </div>
          </div>
  
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              paddingRight: 10,
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <div
              style={{
                background: "#f7f7f7",
                borderRadius: 18,
                padding: "18px 20px",
                border: "3px solid #111",
                boxShadow: "0 4px 0 #111",
              }}
            >
              <h2 style={{ margin: "0 0 10px 0" }}>Eller Yukarı</h2>
              <p style={{ margin: 0 }}>
              Bu kategoride oyunculara "Evet" - "Hayır" şeklinde cevap verilebilecek bir soru gelir. Köstebek dışındaki herkes soruyu görür ve kendi cevabını verir. Köstebek ise soruyu görmeden, diğer oyuncuların vereceği cevaplara uyum sağlamaya çalışır. Cevaplar açıldığında herkes köstebeğin kim olduğunu tahmin eder.
              </p>
            </div>
  
            <div
              style={{
                background: "#f7f7f7",
                borderRadius: 18,
                padding: "18px 20px",
                border: "3px solid #111",
                boxShadow: "0 4px 0 #111",
              }}
            >
              <h2 style={{ margin: "0 0 10px 0" }}>Parmak Say</h2>
              <p style={{ margin: 0 }}>
              Bu kategoride oyuncular bir sayı sorusuna cevap verir. Sorular genelde oyuncuların hayatı, alışkanlıkları ya da deneyimleriyle ilgilidir. Herkes kendi sayısını girer. Köstebek soruyu görmediği için mantıklı bir sayı tahmin etmeye çalışır. Sonuçlar açıldığında çok alakasız ya da ortama uymayan cevaplar köstebeği ele verebilir.
              </p>
            </div>
  
            <div
              style={{
                background: "#f7f7f7",
                borderRadius: 18,
                padding: "18px 20px",
                border: "3px solid #111",
                boxShadow: "0 4px 0 #111",
              }}
            >
              <h2 style={{ margin: "0 0 10px 0" }}>Kelime Avı</h2>
              <p style={{ margin: 0 }}>
              Bu kategoride tüm oyunculara bir kelime verilir, fakat köstebek bu kelimeyi göremez. Oyuncular sırayla bu kelimeyle ilişkili tek kelimelik ipuçları yazar. Her oyuncu iki kez kelime girer. Amaç, gerçek kelimeyi fazla açık etmeden diğer oyunculara anlaşılır ipuçları vermektir. Köstebek ise kelimeyi bilmeden uyum sağlamaya çalışır. Tur sonunda yazılan tüm kelimeler açılır ve herkes köstebeği tahmin eder.
              </p>
            </div>
  
            <div
              style={{
                background: "#f7f7f7",
                borderRadius: 18,
                padding: "18px 20px",
                border: "3px solid #111",
                boxShadow: "0 4px 0 #111",
              }}
            >
              <h2 style={{ margin: "0 0 10px 0" }}>Gösteri Zamanı</h2>
              <p style={{ margin: 0 }}>
              Bu kategoride oyunculara gruptan bir kişiyi seçmeleri gereken bir soru gelir. Örneğin “Aranızdaki en komik kişi kim?” gibi. Köstebek dışındaki herkes soruyu görüp bir oyuncu seçer. Köstebek ise soruyu bilmeden grubun genel eğilimini tahmin etmeye çalışır. Sonuçlar açıldığında en uyumsuz seçim yapan kişi dikkat çeker.
              </p>
            </div>
            <div
              style={{
                background: "#f7f7f7",
                borderRadius: 18,
                padding: "18px 20px",
                border: "3px solid #111",
                boxShadow: "0 4px 0 #111",
              }}
            >
              <h2 style={{ margin: "0 0 10px 0" }}>Ortaya Karışık</h2>
              <p style={{ margin: 0 }}>
              Bu modda oyun tek bir kategoriye bağlı kalmaz. Her turda sistem, kategoriler arasından birini rastgele seçer. Oyuncular bir tur sayı sorusuyla, bir sonraki tur evet-hayır ya da kelime ipucu turuyla karşılaşabilir. Bu yüzden en sürprizli ve en karışık moddur. Köstebek de hangi tarz sorunun geleceğini önceden bilemez.
              </p>
            </div>
            <div
              style={{
                background: "#f7f7f7",
                borderRadius: 18,
                padding: "18px 20px",
                border: "3px solid #111",
                boxShadow: "0 4px 0 #111",
              }}
            >
              <h2 style={{ margin: "0 0 10px 0" }}>Puanlama</h2>
              <p style={{ margin: 0 }}>
              Her turun sonunda tüm oyuncular köstebeğin kim olduğunu oylayarak tahmin eder. Köstebek doğru tahmin edilemezse, yani oyuncular yanlış kişilere oy verirse, köstebek puan kazanır. Köstebek; kendisine oy vermeyen her oyuncu için 1 puan alır. Köstebek olmayan oyuncular ise köstebeği doğru tahmin ettiklerinde 1 puan kazanır.

Yani:

Köstebeksen, seni ne kadar az kişi bulursa o kadar çok puan alırsın.
Normal oyuncuysan, köstebeği doğru tahmin ederek puan alırsın.              </p>
            </div>
            <div
              style={{
                background: "#f7f7f7",
                borderRadius: 18,
                padding: "18px 20px",
                border: "3px solid #111",
                boxShadow: "0 4px 0 #111",
              }}
            >
              <h2 style={{ margin: "0 0 10px 0" }}>Oyun Nasıl Kazanılır?</h2>
              <p style={{ margin: 0 }}>
              Oyun seçilen tur sayısı boyunca devam eder. Son tur bittikten sonra tüm puanlar toplanır. En yüksek puana sahip oyuncu oyunun kazananı olur. Eğer köstebek iyi saklanırsa hızla öne geçebilir; ama oyuncular köstebeği sürekli doğru bulursa normal oyuncular avantaj kazanır.              </p>
            </div>
          </div>
        </div>
        {/* 🔊 MÜZİK */}
<div
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  style={{
    position: "absolute",
    right: 20,
    bottom: 20,
    zIndex: 20,
    width: 90,
    height: 220,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
  }}
>
  <div
    style={{
      position: "relative",
      width: 68,
      height: 68,
      borderRadius: 18,
      background: "#F2F2F2",
      boxShadow: isMuted
        ? "0 10px 24px rgba(0,0,0,0.22), inset 0 2px 4px rgba(255,255,255,0.7)"
        : "0 0 20px rgba(0,200,255,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: "50%",
        transform: "translateX(-50%)",
        width: 40,
        height: 120,
        borderRadius: 14,
        background: "#ffffff",
        boxShadow:
          "0 8px 18px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: isHovered ? 1 : 0,
        pointerEvents: isHovered ? "auto" : "none",
        transition: "0.2s ease",
      }}
    >
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => {
          const v = parseFloat(e.target.value);
          setVolume(v);
          if (musicRef.current) {
            musicRef.current.volume = v;
          }
        }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 100,
          transform: "rotate(-90deg)",
          cursor: "pointer",
        }}
      />
    </div>

    <div
      onClick={async () => {
        try {
          const music = musicRef.current;
          if (!music) return;
      
          if (isMuted) {
            music.loop = true;
            music.volume = volume;
            await music.play();
            setIsMuted(false);
          } else {
            music.pause();
            setIsMuted(true);
          }
        } catch (err) {
          console.log(err);
        }
      }}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: 30,
        userSelect: "none",
      }}
    >
      {isMuted ? "🔇" : "🔊"}
    </div>
  </div>
</div>


      </div>
    );
  }
  
if (mode === "join" && !roomCode) {
  const joinMobile = isMobile
    ? {
        outerPadding: "12px 10px 20px",
        cardWidth: "calc(100vw - 20px)",
        cardMaxWidth: 360,

        infoButtonSize: 42,

        topButtonMinWidth: 122,
        topButtonHeight: 38,
        topButtonFont: 12,

        titleHeight: 56,
        titleFont: 17,
        titleRadius: 18,

        sectionRadius: 20,
        sectionPadding: "16px 14px 18px",
        sectionGap: 12,

        labelFont: 10,
        inputHeight: 50,
        inputFont: 15,

        buttonHeight: 56,
        buttonFont: 14,
      }
    : null;

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        backgroundImage: `url('${import.meta.env.BASE_URL}bg-bej2.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: isMobile ? joinMobile.outerPadding : "28px 0",
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.08,
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.8) 0px, rgba(255,255,255,0.8) 20px, transparent 20px, transparent 80px)",
          backgroundSize: "200px 200px",
        }}
      />

      <div
        style={{
          width: isMobile ? joinMobile.cardWidth : "min(820px, 90vw)",
          maxWidth: isMobile ? joinMobile.cardMaxWidth : 820,
          minHeight: 320,
          background: "#fff",
          padding: isMobile ? "14px 12px 18px" : "36px 40px",
          borderRadius: isMobile ? 22 : 26,
          border: isMobile ? "4px solid #111" : "none",
          boxShadow: isMobile
            ? "0 8px 0 #111"
            : "0 30px 60px rgba(0,0,0,0.35), inset 0 3px 6px rgba(255,255,255,0.7), inset 0 -6px 12px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: isMobile ? 14 : 24,
          zIndex: 2,
          position: "relative",
          boxSizing: "border-box",
          margin: "0 auto",
        }}
      >
        <button
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
              e.currentTarget.style.boxShadow = "0 6px 0 #111";
            }
          }}
          onMouseLeave={(e) => {
            if (!isMobile) {
              e.currentTarget.style.transform = "translateY(0px) scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 0 #111";
            }
          }}
          onClick={() => {
            playClick();
            setMode("howToPlay");
          }}
          style={{
            position: "absolute",
            top: isMobile ? 10 : 20,
            right: isMobile ? 10 : 20,
            width: isMobile ? joinMobile.infoButtonSize : 50,
            height: isMobile ? joinMobile.infoButtonSize : 50,
            borderRadius: "50%",
            border: "3px solid #111",
            transform: isMobile ? "scale(0.8)" : "none",
            background: "linear-gradient(180deg, #4db2ff, #1e6fe8)",
            color: "#fff",
            fontWeight: "bold",
            fontSize: isMobile ? 22 : 24,
            cursor: "pointer",
            boxShadow: "0 4px 0 #111",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 5,
            padding: 0,
          }}
        >
          i
        </button>

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-start",
            paddingRight: isMobile ? 48 : 0,
            boxSizing: "border-box",
          }}
        >
          <button
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 6px 0 #111";
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = "0 3px 0 #111";
              }
            }}
            onClick={() => {
              playClick();
              setMode("");
            }}
            style={{
              minWidth: isMobile ? joinMobile.topButtonMinWidth : 180,
              height: isMobile ? joinMobile.topButtonHeight : 42,
              fontSize: isMobile ? joinMobile.topButtonFont : 18,
              padding: isMobile ? "0 12px" : "0 18px",
              transform: isMobile ? "scale(0.8)" : "none",
              ...homeSmallButtonStyle,
              background: "#ef4444",
              transition: "all 0.15s ease",
              boxShadow: "0 4px 0 #111",
            }}
          >
            ← Ana Sayfa
          </button>
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: 2,
            marginBottom: isMobile ? 4 : 12,
          }}
        >
          <div
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: isMobile ? "100%" : "auto",
              minWidth: isMobile ? "unset" : 360,
              maxWidth: isMobile ? "100%" : "unset",
              height: isMobile ? joinMobile.titleHeight : 64,
              padding: isMobile ? "0 20px" : "0 36px",
              background: "linear-gradient(180deg, #ffb347, #ff7a00)",
              border: "4px solid #111",
              borderRadius: isMobile ? joinMobile.titleRadius : 20,
              boxShadow: "0 6px 0 #111",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                position: "relative",
                zIndex: 1,
                fontSize: isMobile ? joinMobile.titleFont : 28,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "#fff",
                fontFamily: "'Nunito', 'Poppins', sans-serif",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              OYUNA KATIL
            </div>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: isMobile ? "100%" : 720,
            background: "#fff",
            border: "4px solid #111",
            borderRadius: isMobile ? joinMobile.sectionRadius : 20,
            boxShadow: "0 6px 0 #111",
            padding: isMobile ? joinMobile.sectionPadding : "24px 24px 26px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: isMobile ? joinMobile.sectionGap : 16,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: isMobile ? 300 : 320,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                fontSize: isMobile ? 18 : 24,
                textAlign: "center",
                color: "#6b6375",
              }}
            >
              Kullanıcı Adı
            </div>

            <input
              placeholder="İSMİNİZİ GİRİN"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                height: isMobile ? joinMobile.inputHeight : 56,
                borderRadius: 16,
                border: "4px solid #111",
                textAlign: "center",
                fontSize: isMobile ? joinMobile.inputFont : 22,
                fontWeight: "bold",
                outline: "none",
                boxShadow: "0 4px 0 #111",
                boxSizing: "border-box",
                color: "#666",
                padding: "0 12px",
              }}
            />
          </div>

          <div
            style={{
              width: "100%",
              maxWidth: isMobile ? 300 : 320,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                fontSize: isMobile ? 18 : 24,
                textAlign: "center",
                color: "#6b6375",
              }}
            >
              Oda Kodu
            </div>

            <input
              placeholder="ODA KODUNU GİRİN"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              style={{
                width: "100%",
                height: isMobile ? joinMobile.inputHeight : 56,
                borderRadius: 16,
                border: "4px solid #111",
                textAlign: "center",
                fontSize: isMobile ? joinMobile.inputFont : 22,
                fontWeight: "bold",
                outline: "none",
                boxShadow: "0 4px 0 #111",
                textTransform: "uppercase",
                boxSizing: "border-box",
                color: "#666",
                padding: "0 12px",
              }}
            />
          </div>

          {joinError && (
            <div
              style={{
                color: "#dc2626",
                fontWeight: 700,
                fontSize: isMobile ? 13 : 16,
                textAlign: "center",
                maxWidth: 300,
              }}
            >
              {joinError}
            </div>
          )}

          <button
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = "translateY(-4px) scale(1.03)";
                e.currentTarget.style.boxShadow = "0 8px 0 #111";
                e.currentTarget.style.filter = "brightness(1.1)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = "translateY(0px) scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 0 #111";
                e.currentTarget.style.filter = "brightness(1)";
              }
            }}
            onClick={() => {
              playClick();
              joinRoom();
            }}
            style={{
              width: isMobile ? "100%" : 300,
              maxWidth: isMobile ? 300 : 300,
              height: isMobile ? joinMobile.buttonHeight : 68,
              borderRadius: 20,
              border: "4px solid #111",
              background: "linear-gradient(180deg, #4cd964, #28a745)",
              color: "white",
              fontSize: isMobile ? joinMobile.buttonFont : 24,
              fontWeight: 900,
              cursor: "pointer",
              boxShadow: "0 6px 0 #111",
              marginTop: 4,
              transition: "all 0.15s ease",
              textTransform: "uppercase",
              letterSpacing: 0.4,
            }}
          >
            ODAYA KATIL
          </button>
        </div>
      </div>

      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: "fixed",
          right: isMobile ? 12 : 20,
          bottom: isMobile ? 12 : 20,
          zIndex: 20,
          width: isMobile ? 62 : 90,
          height: isMobile ? 62 : 220,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: isMobile ? 56 : 68,
            height: isMobile ? 56 : 68,
            borderRadius: isMobile ? 16 : 18,
            background: "#F2F2F2",
            boxShadow: isMuted
              ? "0 10px 24px rgba(0,0,0,0.22), inset 0 2px 4px rgba(255,255,255,0.7)"
              : "0 0 20px rgba(0,200,255,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: isMobile ? 66 : 80,
              left: "50%",
              transform: "translateX(-50%)",
              width: isMobile ? 36 : 40,
              height: isMobile ? 96 : 120,
              borderRadius: 14,
              background: "#ffffff",
              boxShadow:
                "0 8px 18px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: isHovered ? 1 : 0,
              pointerEvents: isHovered ? "auto" : "none",
              transition: "0.2s ease",
            }}
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setVolume(v);
                if (musicRef.current) {
                  musicRef.current.volume = v;
                }
              }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: isMobile ? 78 : 100,
                transform: "rotate(-90deg)",
                cursor: "pointer",
              }}
            />
          </div>

          <div
            onClick={async () => {
              try {
                const music = musicRef.current;
                if (!music) return;

                if (isMuted) {
                  music.loop = true;
                  music.volume = volume;
                  await music.play();
                  setIsMuted(false);
                } else {
                  music.pause();
                  setIsMuted(true);
                }
              } catch (err) {
                console.log(err);
              }
            }}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: isMobile ? 24 : 30,
              userSelect: "none",
            }}
          >
            {isMuted ? "🔇" : "🔊"}
          </div>
        </div>
      </div>
    </div>
  );
}

  if (roomCode && (phase === "START_COUNTDOWN" || showGo)) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundImage: `url(${currentQuestionBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "auto",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
          }}
        />
  
        <div
          style={{
            position: "relative",
            background: "#fff",
            padding: isMobile ? "24px 24px" : "40px 60px",
            borderRadius: 20,
            textAlign: "center",
            border: "4px solid #111",
            boxShadow: "0 10px 0 #111",
            zIndex: 2,
          }}
        >
          <div
            style={{
              fontSize: isMobile ? 38 : 58,
              fontWeight: 900,
              color: "#111",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            TUR BAŞLIYOR
          </div>
  
          <div
            style={{
              fontSize: isMobile ? 60 : 90,
              fontWeight: 900,
              marginTop: 12,
              color: showGo ? "#28a745" : "#111",
              lineHeight: 1,
            }}
          >
            {showGo ? "GO!" : timeLeft}
          </div>
        </div>
      </div>
    );
  }
  if (roomCode && !gameStarted && mode !== "howToPlay" && phase !== "START_COUNTDOWN" && !showGo) {
    return (   
  <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundImage: `url('${import.meta.env.BASE_URL}bg-bej2.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflowY: "auto",
          overflowX: "hidden",
          paddingTop: 16,
          paddingBottom: 80,
          boxSizing: "border-box",
        }}
      >
        {popupElement}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.08,
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.8) 0px, rgba(255,255,255,0.8) 20px, transparent 20px, transparent 80px)",
            backgroundSize: "200px 200px",
          }}
        />
  
        <div
          style={{
            width: "min(820px, 94vw)",
            background: "#ffffff",
            padding: isMobile ? "20px 16px" : "36px 40px",
            borderRadius: 26,
            boxShadow:
              "0 30px 60px rgba(0,0,0,0.35), inset 0 3px 6px rgba(255,255,255,0.7), inset 0 -6px 12px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: isMobile ? 16 : 24,
            zIndex: 2,
            position: "relative",
            boxSizing: "border-box",
            margin: "0 auto",
          }}
        >
          {/* Top bar */}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              //transform: isMobile? "scale(0.92)": undefined,
            }}
          >
            <button
              onClick={() => {
                playClick();
                leaveRoom();
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 6px 0 #111";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = "0 4px 0 #111";
              }}
              style={{
                ...homeSmallButtonStyle,
                background: "#ef4444",
                transition: "all 0.15s ease",
                fontSize: isMobile ? 18 : undefined,
                padding: isMobile ? "0 12px" : undefined,
                transform: isMobile? "scale(0.8)": undefined,
              }}
            >
              ← Ana Sayfa
            </button>
  
            <button
              onClick={() => {
                playClick();
                setMode("howToPlay");
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
                e.currentTarget.style.boxShadow = "0 6px 0 #111";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px) scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 0 #111";
              }}
              style={{
                width: isMobile ? 42 : 50,
                height: isMobile ? 42 : 50,
                borderRadius: "50%",
                border: "3px solid #111",
                background: "linear-gradient(180deg, #4db2ff, #1e6fe8)",
                color: "#fff",
                fontWeight: "bold",
                fontSize: isMobile ? 20 : 24,
                cursor: "pointer",
                boxShadow: "0 4px 0 #111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s ease",
                flexShrink: 0,
              }}
            >
              i
            </button>
          </div>
  
          {/* Başlık banner */}
          <div
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: isMobile ? "70vw" : 360,
              maxWidth: "90%",
              height: isMobile ? 52 : 64,
              padding: "0 36px",
              background: "linear-gradient(180deg, #ffb347, #ff7a00)",
              border: "4px solid #111",
              borderRadius: 20,
              boxShadow: "0 6px 0 #111",
              marginTop: -6,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: -18,
                top: isMobile ? 8 : 12,
                width: 28,
                height: isMobile ? 34 : 40,
                background: "#ff7a00",
                border: "4px solid #111",
                borderRight: "none",
                borderRadius: "12px 0 0 12px",
                transform: "skewY(-12deg)",
                boxShadow: "-2px 4px 0 #111",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: -18,
                top: isMobile ? 8 : 12,
                width: 28,
                height: isMobile ? 34 : 40,
                background: "#ff7a00",
                border: "4px solid #111",
                borderLeft: "none",
                borderRadius: "0 12px 12px 0",
                transform: "skewY(12deg)",
                boxShadow: "2px 4px 0 #111",
              }}
            />
  
            <div
              style={{
                position: "relative",
                zIndex: 1,
                fontSize: isMobile ? 20 : 28,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "#fff",
                fontFamily: "'Nunito', 'Poppins', sans-serif",
              }}
            >
              ODA LOBİSİ
            </div>
          </div>
  
          {/* Kategori + Oda Kodu */}
          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: isMobile ? 10 : 18,
              marginTop: 6,
            }}
          >
            <div
              style={{
                background: "#f7f7f7",
                borderRadius: 18,
                padding: isMobile ? "12px 14px" : "18px 20px",
                border: "3px solid #111",
                boxShadow: "0 4px 0 #111",
              }}
            >
              <div style={{ fontSize: isMobile ? 13 : 16, fontWeight: 700, marginBottom: 6 }}>
                Kategori
              </div>
              <div style={{ fontSize: isMobile ? 16 : 24, fontWeight: 900, wordBreak: "break-word" }}>
                {categoryLabels[roomCategory]}
              </div>
            </div>
  
            <div
              style={{
                background: "#f7f7f7",
                borderRadius: 18,
                padding: isMobile ? "12px 14px" : "18px 20px",
                border: "3px solid #111",
                boxShadow: "0 4px 0 #111",
              }}
            >
              <div style={{ fontSize: isMobile ? 13 : 16, fontWeight: 700, marginBottom: 6 }}>
                Oda Kodu
              </div>
              <div style={{ fontSize: isMobile ? 20 : 30, fontWeight: 900, letterSpacing: 2 }}>
                {roomCode}
              </div>
            </div>
          </div>
  
          {/* Oyuncular */}
          <div
            style={{
              width: "100%",
              background: "#f7f7f7",
              borderRadius: 18,
              padding: isMobile ? "14px 12px" : "20px 22px",
              border: "3px solid #111",
              boxShadow: "0 4px 0 #111",
              boxSizing: "border-box",
            }}
          >
            <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 900, marginBottom: 14 }}>
              Oyuncular
            </div>
  
            <div
  style={{
    width: "100%",
    display: "grid",
    gridTemplateColumns: isMobile
      ? "repeat(3, 1fr)"
      : "repeat(4, 1fr)",
    gap: isMobile ? 8 : 18,
    justifyItems: "center",
    alignItems: "start",
  }}
>
  {players.map((player) => {
    const isMe = player.id === socket.id;
    const showKick = isHost && !isMe;    
    const avatarSize = isMobile ? 54 : 96;
    return (
      <div
        key={player.id}
        style={{
          width: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: isMobile ? 4 : 6,
        }}
      >
        {showKick && (
          <button
            onClick={() => {
              playClick();
              socket.emit("kick_player", {
                roomCode,
                targetId: player.id,
              });
            }}
            style={{
              position: "absolute",
              top: -6,
              right: 0,
              width: isMobile ? 22 : 28,
              height: isMobile ? 22 : 28,
              borderRadius: "50%",
              border: "3px solid #111",
              background: "#ef4444",
              color: "#fff",
              fontWeight: 900,
              fontSize: isMobile ? 12 : 16,
              cursor: "pointer",
              boxShadow: "0 4px 0 #111",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 5,
            }}
          >
            ×
          </button>
        )}

        {isMe ? (
          <div
            style={{
              display: "flex",
              gap: isMobile ? 4 : 8,
              justifyContent: "center",
              marginBottom: 2,
            }}
          >
            <button
              onClick={() => {
                playSwipe();
                socket.emit("change_avatar", {
                  roomCode,
                  direction: "prev",
                });
              }}
              style={{
                width: isMobile ? 24 : 38,
                height: isMobile ? 24 : 38,
                borderRadius: isMobile ? 8 : 12,
                border: "3px solid #111",
                background: "#F2F2F2",
                fontSize: isMobile ? 13 : 20,
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 0 #111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
            >
              ‹
            </button>

            <button
              onClick={() => {
                playSwipe();
                socket.emit("change_avatar", {
                  roomCode,
                  direction: "next",
                });
              }}
              style={{
                width: isMobile ? 24 : 38,
                height: isMobile ? 24 : 38,
                borderRadius: isMobile ? 8 : 12,
                border: "3px solid #111",
                background: "#F2F2F2",
                fontSize: isMobile ? 13 : 20,
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 0 #111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
            >
              ›
            </button>
          </div>
        ) : (
          <div style={{ height: isMobile ? 24 : 38 }} />
        )}

        <div
          style={{
            width: avatarSize,
            height: avatarSize,
            border: "4px solid #111",
            borderRadius: isMobile ? 10 : 16,
            overflow: "hidden",
            background: getAvatarBg(player.avatar),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 0 #111",
            flexShrink: 0,
          }}
        >
          <img
            src={getAvatarSrc(player.avatar)}            
            alt={player.name}
            style={{
              height: avatarSize,
              objectFit: "contain",
              transform: "scale(1.05) translateY(6px)",
            }}
          />
        </div>

        <div
          style={{
            fontSize: isMobile ? 11 : 16,
            fontWeight: 900,
            textAlign: "center",
            color: "#5b5b6e",
            lineHeight: 1.1,
            minHeight: isMobile ? 14 : 20,
            wordBreak: "break-word",
            width: "100%",
          }}
        >
          {player.name}
        </div>

        <div
            style={{
              maxWidth: "100%",
              height: isMobile ? 18 : 32,
              padding: isMobile ? "0 4px" : "0 12px",
              borderRadius: isMobile ? 6 : 12,
              border: isMobile ? "2px solid #111" : "3px solid #111",
              background: player.ready ? "#42d657" : "#ff5a5a",
              color: "#fff",
              fontSize: isMobile ? 7.5 : 13,
              fontWeight: 900,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: isMobile ? "0 2px 0 #111" : "0 4px 0 #111",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              overflow: "hidden",
              alignSelf: "center",
            }}
          >
            {player.ready ? "Hazır" : "Hazır Değil"}
          </div>
      </div>
    );
  })}
</div>
          </div>
  
          {/* Butonlar */}
          <div
            style={{
              display: "flex",
              gap: isMobile ? 10 : 16,
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            <button
              onClick={() => {
                playClick();
                toggleReady();
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px) scale(1.03)";
                e.currentTarget.style.boxShadow = "0 8px 0 #111";
                e.currentTarget.style.filter = "brightness(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px) scale(1)";
                e.currentTarget.style.boxShadow = "0 6px 0 #111";
                e.currentTarget.style.filter = "brightness(1)";
              }}
              style={{
                width: isMobile ? "44vw" : 220,
                maxWidth: 220,
                height: isMobile ? 52 : 64,
                borderRadius: 20,
                border: "4px solid #111",
                background: "linear-gradient(180deg, #4cd964, #28a745)",
                color: "white",
                fontSize: isMobile ? 17 : 22,
                fontWeight: 900,
                cursor: "pointer",
                boxShadow: "0 6px 0 #111",
                transition: "all 0.15s ease",
              }}
            >
              HAZIR
            </button>
  
            {isHost && (
              <button
                onClick={() => {
                  playClick();
                  startGame();
                }}
                disabled={!allReady}
                onMouseEnter={(e) => {
                  if (!allReady) return;
                  e.currentTarget.style.transform = "translateY(-4px) scale(1.03)";
                  e.currentTarget.style.boxShadow = "0 8px 0 #111";
                  e.currentTarget.style.filter = "brightness(1.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px) scale(1)";
                  e.currentTarget.style.boxShadow = allReady ? "0 6px 0 #111" : "0 6px 0 #666";
                  e.currentTarget.style.filter = "brightness(1)";
                }}
                style={{
                  width: isMobile ? "44vw" : 220,
                  maxWidth: 220,
                  height: isMobile ? 52 : 64,
                  borderRadius: 20,
                  border: "4px solid #111",
                  background: allReady
                    ? "linear-gradient(180deg, #ffb347, #ff7a00)"
                    : "linear-gradient(180deg, #999, #777)",
                  color: "white",
                  fontSize: isMobile ? 17 : 22,
                  fontWeight: 900,
                  cursor: allReady ? "pointer" : "not-allowed",
                  boxShadow: allReady ? "0 6px 0 #111" : "0 6px 0 #666",
                  transition: "all 0.15s ease",
                }}
              >
                START
              </button>
            )}
          </div>
        </div>

        {/* 🔊 SES KONTROL */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setTimeout(() => setIsHovered(false), 2000)}
          style={{
            position: "fixed",
            right: isMobile ? 12 : 20,
            bottom: isMobile ? 12 : 20,
            zIndex: 20,
            width: isMobile ? 70 : 90,
            height: isMobile ? 180 : 220,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              width: isMobile ? 54 : 68,
              height: isMobile ? 54 : 68,
              borderRadius: 18,
              background: "#F2F2F2",
              boxShadow: isMuted
                ? "0 10px 24px rgba(0,0,0,0.22), inset 0 2px 4px rgba(255,255,255,0.7)"
                : "0 0 20px rgba(0,200,255,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: isMobile ? 62 : 80,
                left: "50%",
                transform: "translateX(-50%)",
                width: isMobile ? 34 : 40,
                height: isMobile ? 100 : 120,
                borderRadius: 14,
                background: "#ffffff",
                boxShadow:
                  "0 8px 18px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: isHovered ? 1 : 0,
                pointerEvents: isHovered ? "auto" : "none",
                transition: "0.2s ease",
              }}
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setVolume(v);
                  if (musicRef.current) {
                    musicRef.current.volume = v;
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: isMobile ? 80 : 100,
                  transform: "rotate(-90deg)",
                  cursor: "pointer",
                }}
              />
            </div>

            <div
              onClick={async () => {
                try {
                  const music = musicRef.current;
                  if (!music) return;
              
                  if (isMuted) {
                    music.loop = true;
                    music.volume = volume;
                    await music.play();
                    setIsMuted(false);
                  } else {
                    music.pause();
                    setIsMuted(true);
                  }
                } catch (err) {
                  console.log(err);
                }
              }}
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: isMobile ? 24 : 30,
                userSelect: "none",
              }}
            >
              {isMuted ? "🔇" : "🔊"}
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (gameStarted && showMoleVoting) {
    const selectedMoleName =
      players.find((player) => player.id === moleVoteTarget)?.name || "";
  
    return (
      <div style={{ padding: 50, fontFamily: "Arial" }}>
        <h1>Köstebek Kim?</h1>
        <p>{categoryLabels[roomCategory]}</p>
        
  
        {players.map((player) => (
          <div key={player.id}>
            <button onClick={() => voteMole(player.id)}>
              {player.name}
            </button>
          </div>
        ))}
  
        {moleVoteTarget && <p>Oyun: {selectedMoleName}</p>}
  
        <div style={{ marginTop: 20 }}>
         <h3>Canlı Oy Durumu</h3>
          {players.map((player) => {
             const votedName =
               players.find((p) => p.id === player.moleVote)?.name || null;

             return (
              <div key={player.id}>
                {player.moleVote
                  ? `${player.name} → ${votedName}'ye oy verdi`
                  : `${player.name} → bekleniyor`}
              </div>
    );
  })}
</div>
      </div>
    );
  }
  
 if (gameStarted && phase === "RESULT") {
  if (!players || players.length === 0) return null;

  const currentPlayer =
    players.find((player) => player.id === socket.id) || null;

  const currentPlayerColor = getAvatarBg(currentPlayer?.avatar);

const playerColorMap = {};

players.forEach((p) => {
  playerColorMap[p.id] = getAvatarBg(p.avatar);
});

  const mole = moleId ? players.find((p) => p.id === moleId) || null : null;

  const moleColor = mole
    ? playerColorMap[mole.id] ||
      "linear-gradient(180deg, #6b7280, #4b5563)"
    : "linear-gradient(180deg, #6b7280, #4b5563)";

  const sortedPlayers = [...players].sort((a, b) => {
    const scoreDiff = (b.score || 0) - (a.score || 0);
    if (scoreDiff !== 0) return scoreDiff;
    return (b.roundPoints || 0) - (a.roundPoints || 0);
  });

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100dvh",
        height: "auto",
        fontFamily: "Arial",
        backgroundImage: `url(${currentQuestionBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        position: "relative",
        backgroundRepeat: "no-repeat",
        padding: isMobile ? "12px 10px" : "24px 28px",
        boxSizing: "border-box",
        overflowX: "hidden",
        overflowY: isMobile ? "auto" : "hidden",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {currentPlayer && (
        <div
          style={{
            position: "absolute",
            left: isMobile ? 10 : 24,
            top: isMobile ? 92 : 150,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: isMobile ? 8 : 14,
            zIndex: 3,
          }}
        >
          <div
            style={{
              width: isMobile ? 70 : 140,
              height: isMobile ? 70 : 140,
              borderRadius: 14,
              background: currentPlayerColor,
              border: "3px solid #111",
              boxShadow: "0 4px 0 #111",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
  src={getAvatarSrc(currentPlayer.avatar)}
  alt={currentPlayer.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          <div
            style={{
              fontSize: isMobile ? 14 : 22,
              fontWeight: 900,
              color: "#fff",
              textTransform: "uppercase",
              padding: isMobile ? "6px 10px" : "10px 18px",
              borderRadius: 10,
              background: currentPlayerColor,
              border: "3px solid #111",
              boxShadow: "0 4px 0 #111",
              letterSpacing: 1,
            }}
          >
            {currentPlayer.name}
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: isMobile ? 46 : 34,
          left: "50%",
          transform: "translateX(-50%)",
          padding: isMobile ? "8px 16px" : "14px 40px",
          borderRadius: 14,
          background: currentPlayerColor,
          color: "#fff",
          fontSize: isMobile ? 16 : 32,
          fontWeight: 900,
          letterSpacing: isMobile ? 1 : 6,
          textTransform: "uppercase",
          border: "3px solid #111",
          boxShadow: "0 4px 0 #111",
          zIndex: 3,
        }}
      >
        {roomCode}
      </div>

      <div
        style={{
          position: "absolute",
          top: isMobile ? 108 : 188,
          right: isMobile ? 10 : 28,
          minWidth: isMobile ? 98 : 150,
          height: isMobile ? 40 : 56,
          padding: "0 12px",
          borderRadius: 12,
          background: currentPlayerColor,
          border: "3px solid #111",
          boxShadow: "0 4px 0 #111",
          color: "#fff",
          fontSize: isMobile ? 14 : 22,
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textTransform: "uppercase",
          zIndex: 3,
        }}
      >
        TUR: {round}/{roomMaxRounds}
      </div>

      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: isMobile ? 180 : 220,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: isMobile ? "100%" : "min(760px, 92vw)",
            maxWidth: isMobile ? 420 : "unset",
            minHeight: isMobile ? "unset" : 700,
            background: "#ECECEC",
            borderRadius: 20,
            padding: isMobile ? "12px 10px 16px" : "18px 22px 20px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: `
              0 6px 0 #111,
              0 10px 18px rgba(0,0,0,0.25),
              inset 0 3px 6px rgba(255,255,255,0.9),
              inset 0 -4px 8px rgba(0,0,0,0.15)
            `,
          }}
        >
          <div
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: isMobile ? 150 : 280,
              height: isMobile ? 44 : 64,
              padding: isMobile ? "0 18px" : "0 36px",
              background: moleColor,
              border: "3px solid #111",
              borderRadius: 14,
              boxShadow: "0 4px 0 #111",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: isMobile ? -10 : -18,
                top: isMobile ? 8 : 12,
                width: isMobile ? 14 : 28,
                height: isMobile ? 22 : 40,
                background: moleColor,
                border: "3px solid #111",
                borderRight: "none",
                borderRadius: "8px 0 0 8px",
                transform: "skewY(-12deg)",
                boxShadow: "-2px 4px 0 #111",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: isMobile ? -10 : -18,
                top: isMobile ? 8 : 12,
                width: isMobile ? 14 : 28,
                height: isMobile ? 22 : 40,
                background: moleColor,
                border: "3px solid #111",
                borderLeft: "none",
                borderRadius: "0 8px 8px 0",
                transform: "skewY(12deg)",
                boxShadow: "2px 4px 0 #111",
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 1,
                fontSize: isMobile ? 18 : 28,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "#fff",
              }}
            >
              KÖSTEBEK
            </div>
          </div>

          {mole && (
            <>
              <div
                style={{
                  width: isMobile ? 64 : 132,
                  height: isMobile ? 64 : 132,
                  borderRadius: 14,
                  background: moleColor,
                  border: "3px solid #111",
                  boxShadow: "0 4px 0 #111",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 0,
                }}
              >
                <img
                  src={getAvatarSrc(mole.avatar)}
                  alt={mole.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              <div
                style={{
                  marginTop: 8,
                  fontSize: isMobile ? 12 : 28,
                  fontWeight: 900,
                  color: "#fff",
                  textTransform: "uppercase",
                  padding: isMobile ? "4px 10px" : "8px 18px",
                  borderRadius: 10,
                  background: moleColor,
                  border: "3px solid #111",
                  boxShadow: "0 4px 0 #111",
                  letterSpacing: 1,
                  textAlign: "center",
                  lineHeight: 1,
                }}
              >
                {mole.name}
              </div>
            </>
          )}

          <div
            style={{
              width: "100%",
              height: 3,
              background: "#111",
              borderRadius: 999,
              marginTop: 14,
              marginBottom: 10,
            }}
          />

          <div
            style={{
              fontSize: isMobile ? 18 : 34,
              fontWeight: 900,
              color: "#555",
              textAlign: "center",
              marginBottom: 10,
              textTransform: "uppercase",
            }}
          >
            TUR PUANLARI
          </div>

          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: isMobile
                ? "repeat(3, minmax(0, 1fr))"
                : "repeat(3, 1fr)",
              gap: isMobile ? 8 : 22,
              justifyItems: "center",
              marginBottom: 16,
            }}
          >
            {sortedPlayers.map((player) => {
              const playerColor =
                playerColorMap[player.id] ||
                "linear-gradient(180deg, #6b7280, #4b5563)";
              const roundPoint = player.roundPoints || 0;
              const isReadyNow = !!player.ready;

              return (
                <div
                  key={player.id}
                  style={{
                    width: "100%",
                    maxWidth: isMobile ? 100 : 180,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: isMobile ? 5 : 8,
                  }}
                >
                  <div
                    style={{
                      width: isMobile ? 38 : 58,
                      height: isMobile ? 38 : 58,
                      borderRadius: 10,
                      background: playerColor,
                      border: "3px solid #111",
                      boxShadow: "0 4px 0 #111",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {player.avatar ? (
                      <img
                        src={getAvatarSrc(player.avatar)}
                        alt={player.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : null}
                  </div>

                  <div
                    style={{
                      minWidth: isMobile ? 38 : 54,
                      maxWidth: "100%",
                      textAlign: "center",
                      fontSize: isMobile ? 10 : 18,
                      fontWeight: 900,
                      color: "#fff",
                      textTransform: "uppercase",
                      padding: isMobile ? "2px 5px" : "2px 10px",
                      borderRadius: 9,
                      background: playerColor,
                      border: "3px solid #111",
                      boxShadow: "0 4px 0 #111",
                      lineHeight: 1.05,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {player.name}
                  </div>

                  {round < roomMaxRounds && (
                    <div
                      style={{
                        minWidth: isMobile ? 58 : 92,
                        maxWidth: "100%",
                        height: isMobile ? 22 : 36,
                        padding: isMobile ? "0 5px" : "0 12px",
                        borderRadius: 8,
                        background: isReadyNow
                          ? "linear-gradient(180deg, #59d66f, #38c95c)"
                          : "linear-gradient(180deg, #ff5b57, #ef4444)",
                        border: "3px solid #111",
                        boxShadow: "0 4px 0 #111",
                        color: "#fff",
                        fontSize: isMobile ? 8 : 16,
                        fontWeight: 900,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textTransform: "uppercase",
                        textAlign: "center",
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {isReadyNow ? "Hazır" : "Hazır Değil"}
                    </div>
                  )}

                  <div
                    style={{
                      minWidth: isMobile ? 38 : 58,
                      height: isMobile ? 30 : 52,
                      padding: isMobile ? "0 6px" : "0 12px",
                      borderRadius: 10,
                      background: "#fff",
                      border: "3px solid #111",
                      boxShadow: "0 4px 0 #111",
                      color: "#555",
                      fontSize: isMobile ? 12 : 22,
                      fontWeight: 900,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {roundPoint > 0 ? `+${roundPoint}` : roundPoint}
                  </div>
                </div>
              );
            })}
          </div>

          {round < roomMaxRounds ? (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginTop: "auto",
              }}
            >
              <button
                onClick={() => {
                  playClick();
                  socket.emit("toggle_result_ready", { roomCode });
                }}
                style={{
                  minWidth: isMobile ? 130 : 160,
                  height: isMobile ? 44 : 54,
                  padding: isMobile ? "0 18px" : "0 24px",
                  borderRadius: 14,
                  border: "3px solid #111",
                  background: "linear-gradient(180deg, #59d66f, #38c95c)",
                  color: "#fff",
                  fontSize: isMobile ? 20 : 28,
                  fontWeight: 900,
                  cursor: "pointer",
                  boxShadow: "0 4px 0 #111",
                  textTransform: "uppercase",
                }}
              >
                HAZIR
              </button>
            </div>
          ) : (
            <div
              style={{
                marginTop: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  fontSize: isMobile ? 16 : 28,
                  fontWeight: 900,
                  color: "#555",
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
              >
                PUANLAR YÜKLENİYOR
              </div>
              <div
                style={{
                  minWidth: isMobile ? 84 : 120,
                  height: isMobile ? 34 : 48,
                  padding: "0 14px",
                  borderRadius: 12,
                  background: "#fff",
                  border: "3px solid #111",
                  boxShadow: "0 4px 0 #111",
                  color: "#555",
                  fontSize: isMobile ? 16 : 24,
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {timeLeft}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
  
  if (gameStarted && phase === "SHOW_SELECTIONS") {
  const currentPlayer =
    players.find((player) => player.id === socket.id) || null;

  const currentPlayerColor = getAvatarBg(currentPlayer?.avatar);

  const playerColorMap = {};

players.forEach((p) => {
  playerColorMap[p.id] = getAvatarBg(p.avatar);
});

  const selectionPlayers =
    questionType === "select_player"
      ? players.filter((player) => player.vote)
      : [];

  const isWordHuntSelections = questionType === "text_input" && !!wordHunt;

  if (isWordHuntSelections) {
    return (
      <div
  style={{
    width: "100vw",
    minHeight: "100dvh",
    height: "auto",
    fontFamily: "Arial",
    backgroundImage: `url(${currentQuestionBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center top",
    position: "relative",
    backgroundRepeat: "no-repeat",
    padding: isMobile ? "12px 10px" : "24px 28px",
    boxSizing: "border-box",
    overflowX: "hidden",
    overflowY: isMobile ? "auto" : "hidden",
    WebkitOverflowScrolling: "touch",
  }}
>
        {currentPlayer && (
          <div
            style={{
              position: "absolute",
              left: isMobile ? 10 : 24,
              top: isMobile ? 92 : 150,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: isMobile ? 8 : 14,
              zIndex: 3,
            }}
          >
            <div
              style={{
                width: isMobile ? 70 : 104,
                height: isMobile ? 70 : 104,
                borderRadius: 14,
                background: currentPlayerColor,
                border: "3px solid #111",
                boxShadow: "0 4px 0 #111",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <img
                src={getAvatarSrc(currentPlayer.avatar)}
                alt={currentPlayer.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            <div
              style={{
                minWidth: isMobile ? 72 : 92,
                height: isMobile ? 38 : 42,
                padding: isMobile ? "0 10px" : "0 16px",
                borderRadius: 10,
                border: "3px solid #111",
                background: currentPlayerColor,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: isMobile ? 14 : 20,
                fontWeight: 900,
                textTransform: "uppercase",
                boxShadow: "0 4px 0 #111",
              }}
            >
              {currentPlayer.name}
            </div>
          </div>
        )}

        <div
          style={{
            position: "absolute",
            top: isMobile ? 56 : 24,
            left: "50%",
            transform: "translateX(-50%)",
            padding: isMobile ? "8px 16px" : "14px 40px",
            borderRadius: 14,
            background: currentPlayerColor,
            color: "#fff",
            fontSize: isMobile ? 16 : 32,
            fontWeight: 900,
            letterSpacing: isMobile ? 1 : 6,
            textTransform: "uppercase",
            border: "3px solid #111",
            boxShadow: "0 4px 0 #111",
            zIndex: 3,
          }}
        >
          {roomCode}
        </div>

        <div
          style={{
            position: "absolute",
            top: isMobile ? 108 : 208,
            right: isMobile ? 10 : 28,
            minWidth: isMobile ? 98 : 150,
            height: isMobile ? 40 : 56,
            padding: "0 12px",
            borderRadius: 12,
            background: currentPlayerColor,
            border: "3px solid #111",
            boxShadow: "0 4px 0 #111",
            color: "#fff",
            fontSize: isMobile ? 14 : 22,
            fontWeight: 900,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textTransform: "uppercase",
            zIndex: 3,
          }}
        >
          TUR: {round}/{roomMaxRounds}
        </div>

        <div
          style={{
            position: "absolute",
            top: isMobile ? 170 : 180,
            left: "50%",
            transform: "translateX(-50%)",
            height: isMobile ? 40 : 56,
            padding: isMobile ? "0 14px" : "0 18px",
            borderRadius: 12,
            background: "#f9162a",
            border: "3px solid #111",
            color: "#fff",
            fontSize: isMobile ? 16 : 22,
            fontWeight: 900,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            whiteSpace: "nowrap",
            zIndex: 3,
            boxShadow: "0 4px 0 #111",
            width: "auto",
            minWidth: "unset",
            maxWidth: "unset",
          }}
        >
          SÜRE: {timeLeft}
        </div>

        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingTop: isMobile ? 250 : 180,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: isMobile ? "100%" : "min(760px, 72vw)",
              top: isMobile ? 1 : 180,
              maxWidth: isMobile ? 420 : "unset",
              minHeight: isMobile ? "unset" : 640,
              background: "#ECECEC",
              borderRadius: 20,
              padding: isMobile ? "16px 12px 18px" : "22px 26px 26px",
              position: "relative",
              zIndex: 2,
              boxShadow: `
                0 6px 0 #111,
                0 10px 18px rgba(0,0,0,0.25),
                inset 0 3px 6px rgba(255,255,255,0.9),
                inset 0 -4px 8px rgba(0,0,0,0.15)
              `,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontSize: isMobile ? 28 : 30,
                fontWeight: 900,
                color: "#4b5563",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              KELİME
            </div>

            <div
              style={{
                backgroundImage: `url(${currentQuestionBg})`,
                color: "#fff",
                borderRadius: 10,
                minHeight: 58,
                padding: isMobile ? "8px 10px" : "10px 22px",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                fontWeight: 900,
                fontSize: isMobile ? 16 : 26,
                lineHeight: 1.1,
                marginBottom: 18,
                boxShadow: `
                  0 3px 0 #111,
                  0 1px 28px rgba(0,0,0,0.25),
                  inset 0 3px 6px rgba(255,255,255,0.9),
                  inset 0 -4px 8px rgba(0,0,0,0.155)
                `,
              }}
            >
              {question?.text}
            </div>

            <div
              style={{
                textAlign: "center",
                fontSize: isMobile ? 16 : 22,
                fontWeight: 900,
                color: "#4b5563",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              YAZILAN KELİMELER
            </div>

            <div
              style={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "repeat(3, minmax(0, 1fr))"
                  : "repeat(3, minmax(0, 1fr))",
                gap: isMobile ? 10 : 22,
                justifyItems: "center",
                marginBottom: 10,
              }}
            >
              {players.map((player) => {
                const submission = wordHunt?.submissions?.find(
                  (s) => s.playerId === player.id
                );

                const playerBg = playerColorMap[player.id];

                return (
                  <div
                    key={player.id}
                    style={{
                      width: "100%",
                      maxWidth: isMobile ? 110 : 170,
                      minHeight: isMobile ? 112 : 150,
                      background: "#f6efef",
                      borderRadius: 16,
                      boxShadow: "0 6px 0 #111",
                      padding: isMobile ? "10px 8px 10px" : "14px 12px 14px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      boxSizing: "border-box",
                    }}
                  >
                    <div
                      style={{
                        background: playerBg,
                        color: "#fff",
                        borderRadius: 10,
                        padding: isMobile ? "5px 8px" : "6px 10px",
                        fontSize: isMobile ? 11 : 13,
                        fontWeight: 900,
                        textTransform: "uppercase",
                        marginBottom: 12,
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        boxShadow: "0 4px 0 #111",
                      }}
                    >
                      {player.name}
                    </div>

                    {[0, 1].map((index) => {
                      const value = submission?.words?.[index];

                      return (
                        <div
                          key={index}
                          style={{
                            width: "100%",
                            minHeight: isMobile ? 26 : 30,
                            padding: isMobile ? "0 6px" : "0 12px",
                            borderRadius: 999,
                            background: playerBg,
                            color: "#fff",
                            fontSize: isMobile ? 11 : 14,
                            fontWeight: 900,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textTransform: "uppercase",
                            marginBottom: 8,
                            boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.12)",
                            textAlign: "center",
                            wordBreak: "break-word",
                            boxSizing: "border-box",
                          }}
                        >
                          {value && value !== "" ? value : "—"}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
  style={{
    width: "100vw",
    minHeight: "100dvh",
    height: "auto",
    fontFamily: "Arial",
    backgroundImage: `url(${currentQuestionBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center top",
    position: "relative",
    backgroundRepeat: "no-repeat",
    padding: isMobile ? "12px 10px" : "24px 28px",
    boxSizing: "border-box",
    overflowX: "hidden",
    overflowY: isMobile ? "auto" : "hidden",
    WebkitOverflowScrolling: "touch",
  }}
>
      {currentPlayer && (
        <div
          style={{
            position: "absolute",
            left: isMobile ? 10 : 24,
            top: isMobile ? 92 : 150,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: isMobile ? 8 : 14,
            zIndex: 3,
          }}
        >
          <div
            style={{
              width: isMobile ? 70 : 140,
              height: isMobile ? 70 : 140,
              borderRadius: 14,
              background: currentPlayerColor,
              border: "3px solid #111",
              boxShadow: "0 4px 0 #111",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={getAvatarSrc(currentPlayer.avatar)}
              alt={currentPlayer.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div
            style={{
              fontSize: isMobile ? 14 : 22,
              fontWeight: 900,
              color: "#fff",
              textTransform: "uppercase",
              padding: isMobile ? "6px 10px" : "10px 18px",
              borderRadius: 10,
              background: currentPlayerColor,
              border: "3px solid #111",
              boxShadow: "0 4px 0 #111",
              letterSpacing: 1,
            }}
          >
            {currentPlayer.name}
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: isMobile ? 56 : 24,
          left: "50%",
          transform: "translateX(-50%)",
          padding: isMobile ? "8px 16px" : "14px 40px",
          borderRadius: 14,
          background: currentPlayerColor,
          color: "#fff",
          fontSize: isMobile ? 16 : 32,
          fontWeight: 900,
          letterSpacing: isMobile ? 1 : 6,
          textTransform: "uppercase",
          border: "3px solid #111",
          boxShadow: "0 4px 0 #111",
          zIndex: 3,
        }}
      >
        {roomCode}
      </div>

      <div
        style={{
          position: "absolute",
          top: isMobile ? 108 : 198,
          right: isMobile ? 10 : 28,
          minWidth: isMobile ? 98 : 150,
          height: isMobile ? 40 : 56,
          padding: "0 12px",
          borderRadius: 12,
          background: currentPlayerColor,
          border: "3px solid #111",
          boxShadow: "0 4px 0 #111",
          color: "#fff",
          fontSize: isMobile ? 14 : 22,
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textTransform: "uppercase",
          zIndex: 3,
        }}
      >
        TUR: {round}/{roomMaxRounds}
      </div>

      <div
        style={{
          position: "absolute",
          top: isMobile ? 170 : 180,
          left: "50%",
          transform: "translateX(-50%)",
          height: isMobile ? 40 : 56,
          padding: isMobile ? "0 14px" : "0 18px",
          borderRadius: 12,
          background: "#f9162a",
          border: "3px solid #111",
          color: "#fff",
          fontSize: isMobile ? 16 : 22,
          fontWeight: 900,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          whiteSpace: "nowrap",
          zIndex: 3,
          boxShadow: "0 4px 0 #111",
          width: "auto",
          minWidth: "unset",
          maxWidth: "unset",
        }}
      >
        SÜRE: {timeLeft}
      </div>

      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: isMobile ? 290 : 320,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: isMobile ? "100%" : "min(760px, 92vw)",
            maxWidth: isMobile ? 420 : "unset",
            minHeight: isMobile ? "unset" : 560,
            background: "#ECECEC",
            borderRadius: 20,
            padding: isMobile ? "16px 12px 18px" : "24px 34px 30px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: `
              0 6px 0 #111,
              0 10px 18px rgba(0,0,0,0.25),
              inset 0 3px 6px rgba(255,255,255,0.9),
              inset 0 -4px 8px rgba(0,0,0,0.15)
            `,
          }}
        >
          <h1
            style={{
              margin: "0 0 12px 0",
              fontSize: isMobile ? 28 : 58,
              lineHeight: 1,
              fontWeight: 900,
              color: "#555",
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            SORU
          </h1>

          <div
            style={{
              backgroundImage: `url(${currentQuestionBg})`,
              color: "#fff",
              borderRadius: 10,
              minHeight: 58,
              padding: isMobile ? "8px 10px" : "10px 22px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontWeight: 900,
              fontSize: isMobile ? 16 : 26,
              lineHeight: 1.1,
              marginBottom: 18,
              boxShadow: `
                0 3px 0 #111,
                0 1px 28px rgba(0,0,0,0.25),
                inset 0 3px 6px rgba(255,255,255,0.9),
                inset 0 -4px 8px rgba(0,0,0,0.155)
              `,
            }}
          >
            {question?.text}
          </div>

          {questionType === "select_player" ? (
            <>
              <div
                style={{
                  marginBottom: 18,
                  fontSize: isMobile ? 18 : 30,
                  fontWeight: 900,
                  color: "#555",
                  textTransform: "uppercase",
                  textAlign: "center",
                }}
              >
                YAPILAN SEÇİMLER
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "repeat(3, 1fr)"
                    : "repeat(2, 1fr)",
                  gap: isMobile ? 12 : 18,
                  width: "100%",
                  maxWidth: 620,
                }}
              >
                {selectionPlayers.map((player) => {
                  const votedPlayer = players.find((p) => p.id === player.vote);
                  if (!votedPlayer) return null;

                  return (
                    <div
                      key={player.id}
                      style={{
                        background: "#F6EEEE",
                        border: "3px solid #111",
                        borderRadius: 16,
                        minHeight: isMobile ? 96 : 108,
                        padding: isMobile ? "10px 8px" : "12px 14px",
                        boxSizing: "border-box",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        boxShadow: "0 6px 0 #111",
                      }}
                    >
                      <div
                        style={{
                          padding: isMobile ? "4px 8px" : "6px 12px",
                          borderRadius: 10,
                          background: playerColorMap[player.id],
                          color: "#fff",
                          fontSize: isMobile ? 11 : 14,
                          fontWeight: 900,
                          textTransform: "uppercase",
                          textAlign: "center",
                          maxWidth: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          boxShadow: "0 4px 0 #111",
                        }}
                      >
                        {player.name}
                      </div>

                      <div
                        style={{
                          fontSize: isMobile ? 20 : 32,
                          fontWeight: 900,
                          color: "#f59e0b",
                          lineHeight: 1,
                        }}
                      >
                        {isMobile ? "↓" : "→"}
                      </div>

                      <div
                        style={{
                          padding: isMobile ? "4px 8px" : "6px 12px",
                          borderRadius: 10,
                          background: playerColorMap[votedPlayer.id],
                          color: "#fff",
                          fontSize: isMobile ? 11 : 14,
                          fontWeight: 900,
                          textTransform: "uppercase",
                          textAlign: "center",
                          maxWidth: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          boxShadow: "0 4px 0 #111",
                        }}
                      >
                        {votedPlayer.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : questionType === "number_input" ? (
            <>
              <div
                style={{
                  marginBottom: 18,
                  fontSize: isMobile ? 18 : 30,
                  fontWeight: 900,
                  color: "#555",
                  textTransform: "uppercase",
                  textAlign: "center",
                }}
              >
                YAPILAN SEÇİMLER
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "repeat(2, 1fr)"
                    : "repeat(2, 1fr)",
                  gap: isMobile ? 12 : 18,
                  width: "100%",
                  maxWidth: 620,
                }}
              >
                {players.map((player) => {
                  const answer =
                    player.numberAnswer !== null &&
                    player.numberAnswer !== undefined &&
                    player.numberAnswer !== ""
                      ? player.numberAnswer
                      : "—";

                  return (
                    <div
                      key={player.id}
                      style={{
                        background: "#F6EEEE",
                        border: "3px solid #111",
                        borderRadius: 16,
                        minHeight: isMobile ? 70 : 108,
                        padding: isMobile ? "8px 10px" : "12px 14px",
                        boxSizing: "border-box",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        boxShadow: "0 6px 0 #111",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          fontSize: isMobile ? 14 : 18,
                          fontWeight: 900,
                          color: "#555",
                          textTransform: "uppercase",
                          lineHeight: 1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          flex: 1,
                        }}
                      >
                        {player.name}
                      </div>

                      <div
                        style={{
                          minWidth: isMobile ? 56 : 88,
                          height: isMobile ? 38 : 62,
                          padding: isMobile ? "0 10px" : "0 14px",
                          borderRadius: 12,
                          background: "linear-gradient(180deg, #1678ff, #0a5bd3)",
                          border: "3px solid #111",
                          boxShadow: "0 4px 0 #111",
                          color: "#fff",
                          fontSize: isMobile ? 18 : 30,
                          fontWeight: 900,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textTransform: "uppercase",
                          lineHeight: 1,
                          flexShrink: 0,
                        }}
                      >
                        {answer}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : questionType === "yes_no" ? (
  <>
    <div
      style={{
        marginBottom: 18,
        fontSize: isMobile ? 18 : 30,
        fontWeight: 900,
        color: "#555",
        textTransform: "uppercase",
        textAlign: "center",
      }}
    >
      YAPILAN SEÇİMLER
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: isMobile ? 10 : 18,
        width: "100%",
        maxWidth: 620,
      }}
    >
      {players.map((player) => {
        const answer = player.yesNoAnswer || "—";

        const answerBg =
          answer === "Evet"
            ? "linear-gradient(180deg, #4cd964, #28a745)"
            : answer === "Hayır"
            ? "linear-gradient(180deg, #ef4444, #dc2626)"
            : "linear-gradient(180deg, #9ca3af, #6b7280)";

        return (
          <div
            key={player.id}
            style={{
              background: "#F6EEEE",
              border: "3px solid #111",
              borderRadius: 16,
              minHeight: isMobile ? 62 : 108,
              padding: isMobile ? "8px 8px" : "12px 14px",
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 6px 0 #111",
              gap: isMobile ? 6 : 8,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                fontSize: isMobile ? 13 : 18,
                fontWeight: 900,
                color: "#555",
                textTransform: "uppercase",
                lineHeight: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                flex: 1,
                minWidth: 0,
              }}
            >
              {player.name}
            </div>

            <div
              style={{
                minWidth: isMobile ? 58 : 120,
                height: isMobile ? 34 : 62,
                padding: isMobile ? "0 8px" : "0 18px",
                borderRadius: 10,
                background: answerBg,
                border: "3px solid #111",
                boxShadow: "0 4px 0 #111",
                color: "#fff",
                fontSize: isMobile ? 13 : 28,
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textTransform: "uppercase",
                lineHeight: 1,
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              {answer}
            </div>
          </div>
        );
      })}
    </div>
  </>
)  : (
            <div
              style={{
                width: "100%",
                marginTop: 10,
                textAlign: "center",
              }}
            >
              {players.map((player) => {
                let display = "Seçmedi";

                if (questionType === "yes_no") {
                  display = player.yesNoAnswer || "Seçmedi";
                }

                if (questionType === "text_input") {
                  const submission = wordHunt?.submissions?.find(
                    (s) => s.playerId === player.id
                  );

                  display =
                    submission?.words && submission.words.length > 0
                      ? submission.words.join(" , ")
                      : "Seçmedi";
                }

                return (
                  <div
                    key={player.id}
                    style={{
                      fontSize: isMobile ? 16 : 24,
                      fontWeight: 700,
                      color: "#555",
                      marginBottom: 10,
                    }}
                  >
                    {player.name} → {display}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
  
if (gameStarted && phase === "MOLE_VOTING") {
  const currentPlayer =
    players.find((player) => player.id === socket.id) || null;

  const currentPlayerColor = getAvatarBg(currentPlayer?.avatar);

  const playerColorMap = {};

  players.forEach((p) => {
    playerColorMap[p.id] = getAvatarBg(p.avatar);
  });

  const voteMap = {};

  players.forEach((p) => {
    if (!p.moleVote) return;

    if (!voteMap[p.moleVote]) {
      voteMap[p.moleVote] = [];
    }

    voteMap[p.moleVote].push(p);
  });

  return (
    <div
  style={{
    width: "100vw",
    minHeight: "100dvh",
    height: "auto",
    fontFamily: "Arial",
    backgroundImage: `url(${currentQuestionBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center top",
    position: "relative",
    backgroundRepeat: "no-repeat",
    padding: isMobile ? "12px 10px" : "24px 28px",
    boxSizing: "border-box",
    overflowX: "hidden",
    overflowY: isMobile ? "auto" : "hidden",
    WebkitOverflowScrolling: "touch",
  }}
>
      {currentPlayer && (
        <div
          style={{
            position: "absolute",
            left: isMobile ? 10 : 24,
            top: isMobile ? 92 : 150,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: isMobile ? 8 : 14,
            zIndex: 3,
          }}
        >
          <div
            style={{
              width: isMobile ? 70 : 140,
              height: isMobile ? 70 : 140,
              borderRadius: 14,
              background: currentPlayerColor,
              border: "3px solid #111",
              boxShadow: "0 4px 0 #111",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={getAvatarSrc(currentPlayer.avatar)}
              alt={currentPlayer.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          <div
            style={{
              fontSize: isMobile ? 14 : 22,
              fontWeight: 900,
              color: "#fff",
              textTransform: "uppercase",
              padding: isMobile ? "6px 10px" : "10px 18px",
              borderRadius: 10,
              background: currentPlayerColor,
              border: "3px solid #111",
              boxShadow: "0 4px 0 #111",
              letterSpacing: 1,
            }}
          >
            {currentPlayer.name}
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: isMobile ? 56 : 24,
          left: "50%",
          transform: "translateX(-50%)",
          padding: isMobile ? "8px 16px" : "14px 40px",
          borderRadius: 14,
          background: currentPlayerColor,
          color: "#fff",
          fontSize: isMobile ? 16 : 32,
          fontWeight: 900,
          letterSpacing: isMobile ? 1 : 6,
          textTransform: "uppercase",
          border: "3px solid #111",
              boxShadow: "0 4px 0 #111",
          zIndex: 3,
        }}
      >
        {roomCode}
      </div>

      <div
        style={{
          position: "absolute",
          top: isMobile ? 108 : 208,
          right: isMobile ? 10 : 28,
          minWidth: isMobile ? 98 : 150,
          height: isMobile ? 40 : 56,
          padding: "0 12px",
          borderRadius: 12,
          background: currentPlayerColor,
          border: "3px solid #111",
          boxShadow: "0 4px 0 #111",
          color: "#fff",
          fontSize: isMobile ? 14 : 22,
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textTransform: "uppercase",
          zIndex: 3,
        }}
      >
        TUR: {round}/{roomMaxRounds}
      </div>

      <div
        style={{
          position: "absolute",
          top: isMobile ? 170 : 110,
          left: "50%",
          transform: "translateX(-50%)",
          height: isMobile ? 40 : 56,
          padding: isMobile ? "0 14px" : "0 18px",
          borderRadius: 12,
          background: "#f9162a",
          border: "3px solid #111",
          color: "#fff",
          fontSize: isMobile ? 16 : 22,
          fontWeight: 900,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          whiteSpace: "nowrap",
          zIndex: 3,
          boxShadow: "0 4px 0 #111",
          width: "auto",
        }}
      >
        SÜRE: {timeLeft}
      </div>

      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: isMobile ? 230 : 270,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: isMobile ? "100%" : "min(860px, 92vw)",
            maxWidth: isMobile ? 420 : "unset",
            background: "#ECECEC",
            borderRadius: 20,
            padding: isMobile ? "16px 10px 18px" : "24px 28px 28px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: `
              0 6px 0 #111,
              0 10px 18px rgba(0,0,0,0.25),
              inset 0 3px 6px rgba(255,255,255,0.9),
              inset 0 -4px 8px rgba(0,0,0,0.15)
            `,
            marginTop: isMobile ? 0 : 30,
          }}
        >
          <h1
            style={{
              margin: "0 0 18px 0",
              fontSize: isMobile ? 28 : 58,
              lineHeight: 1,
              fontWeight: 900,
              color: "#555",
              textAlign: "center",
            }}
          >
            KÖSTEBEĞİ BUL!
          </h1>

          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            {players.map((player, index) => {
              const voters = voteMap[player.id] || [];
              const isSelected = moleVoteTarget === player.id;
              const tagBg = playerColorMap[player.id];

              return (
                <div
                  key={player.id}
                  style={{
                    width: "100%",
                    padding: isMobile ? "12px 2px" : "16px 10px",
                    boxSizing: "border-box",
                    borderBottom:
                      index !== players.length - 1 ? "3px solid #111" : "none",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: isMobile ? 8 : 16,
                  }}
                >
                  <button
                    onClick={() => {
                      playClick();
                      voteMole(player.id);
                    }}
                    style={{
                      minWidth: isMobile ? 100 : 150,
                      maxWidth: isMobile ? 136 : 180,
                      height: isMobile ? 44 : 54,
                      padding: isMobile ? "0 10px" : "0 18px",
                      borderRadius: 14,
                      background: tagBg,
                      border: "3px solid #111",
                      boxShadow: isSelected
                        ? "0 4px 0 #111, 0 0 0 6px rgba(34,197,94,0.18), 0 10px 16px rgba(0,0,0,0.18)"
                        : "0 4px 0 #111",
                      color: "#fff",
                      fontSize: isMobile ? 14 : 22,
                      fontWeight: 900,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      flexShrink: 0,
                      cursor: "pointer",
                    }}
                  >
                    {player.name}
                  </button>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: isMobile ? 6 : 14,
                      flexWrap: "wrap",
                      flex: 1,
                      minHeight: isMobile ? 44 : 62,
                      alignContent: "flex-start",
                    }}
                  >
                    {voters.length > 0 ? (
                      voters.map((voter) => (
                        <div
                          key={voter.id}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            width: isMobile ? 48 : 72,
                            flexShrink: 0,
                          }}
                        >
                          <div
                            style={{
                              width: isMobile ? 40 : 54,
                              height: isMobile ? 40 : 54,
                              borderRadius: 10,
                              background:
                                playerColorMap[voter.id] ||
                                "linear-gradient(180deg, #6b7280, #4b5563)",
                              border: "3px solid #111",
                              overflow: "hidden",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 3px 0 #111",
                            }}
                          >
                            <img
                              src={getAvatarSrc(voter.avatar)}
                              alt={voter.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>

                          <div
                            style={{
                              marginTop: 4,
                              fontSize: isMobile ? 10 : 12,
                              fontWeight: 900,
                              color: "#555",
                              textTransform: "uppercase",
                              lineHeight: 1,
                              textAlign: "center",
                              maxWidth: isMobile ? 48 : 72,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {voter.name}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div
                        style={{
                          fontSize: isMobile ? 12 : 14,
                          fontWeight: 700,
                          color: "#777",
                          paddingTop: 12,
                        }}
                      >
                        —
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
  

  if (gameStarted && phase === "GAME_OVER") {
  if (!players || players.length === 0) return null;

  const currentPlayer =
    players.find((player) => player.id === socket.id) || null;

  const currentPlayerColor = getAvatarBg(currentPlayer?.avatar);

const playerColorMap = {};

players.forEach((p) => {
  playerColorMap[p.id] = getAvatarBg(p.avatar);
});

  const sortedPlayers = [...players].sort((a, b) => {
    const scoreDiff = (b.score || 0) - (a.score || 0);
    if (scoreDiff !== 0) return scoreDiff;
    return (b.roundPoints || 0) - (a.roundPoints || 0);
  });

  const winner = sortedPlayers[0] || null;
  const winnerColor = winner
    ? playerColorMap[winner.id] ||
      "linear-gradient(180deg, #6b7280, #4b5563)"
    : "linear-gradient(180deg, #6b7280, #4b5563)";

  return (
    <div
  style={{
    width: "100vw",
    minHeight: "100dvh",
    height: "auto",
    fontFamily: "Arial",
    backgroundImage: `url(${currentQuestionBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center top",
    position: "relative",
    backgroundRepeat: "no-repeat",
    padding: isMobile ? "12px 10px" : "24px 28px",
    boxSizing: "border-box",
    overflowX: "hidden",
    overflowY: isMobile ? "auto" : "hidden",
    WebkitOverflowScrolling: "touch",
  }}
>
      {currentPlayer && (
        <div
          style={{
            position: "absolute",
            left: isMobile ? 10 : 24,
            top: isMobile ? 92 : 150,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: isMobile ? 8 : 14,
            zIndex: 3,
          }}
        >
          <div
            style={{
              width: isMobile ? 70 : 140,
              height: isMobile ? 70 : 140,
              borderRadius: 14,
              background: currentPlayerColor,
              border: "3px solid #111",
              boxShadow: "0 4px 0 #111",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
  src={getAvatarSrc(currentPlayer.avatar)}
  alt={currentPlayer.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          <div
            style={{
              fontSize: isMobile ? 14 : 22,
              fontWeight: 900,
              color: "#fff",
              textTransform: "uppercase",
              padding: isMobile ? "6px 10px" : "10px 18px",
              borderRadius: 10,
              background: currentPlayerColor,
              border: "3px solid #111",
              boxShadow: "0 4px 0 #111",
              letterSpacing: 1,
            }}
          >
            {currentPlayer.name}
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: isMobile ? 36 : 54,
          left: "50%",
          transform: "translateX(-50%)",
          padding: isMobile ? "8px 16px" : "14px 40px",
          borderRadius: 14,
          background: currentPlayerColor,
          color: "#fff",
          fontSize: isMobile ? 16 : 32,
          fontWeight: 900,
          letterSpacing: isMobile ? 1 : 6,
          textTransform: "uppercase",
          border: "3px solid #111",
          boxShadow: "0 4px 0 #111",
          zIndex: 3,
        }}
      >
        {roomCode}
      </div>

      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: isMobile ? 180 : 250,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: isMobile ? "100%" : "min(760px, 92vw)",
            maxWidth: isMobile ? 420 : "unset",
            minHeight: isMobile ? "unset" : 620,
            background: "#ECECEC",
            borderRadius: 20,
            padding: isMobile ? "14px 10px 16px" : "18px 22px 20px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: `
              0 6px 0 #111,
              0 10px 18px rgba(0,0,0,0.25),
              inset 0 3px 6px rgba(255,255,255,0.9),
              inset 0 -4px 8px rgba(0,0,0,0.15)
            `,
          }}
        >
          <div
            style={{
              fontSize: isMobile ? 30 : 54,
              fontWeight: 900,
              color: "#555",
              textAlign: "center",
              lineHeight: 1,
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            KAZANAN
          </div>

          {winner && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 4,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: isMobile ? 90 : 140,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: isMobile ? 72 : 110,
                    height: isMobile ? 72 : 110,
                    borderRadius: 16,
                    background: winnerColor,
                    border: "3px solid #111",
                    boxShadow: "0 4px 0 #111",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={getAvatarSrc(winner.avatar)}
                    alt={winner.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div
                  style={{
                    marginTop: 8,
                    minWidth: isMobile ? 64 : 88,
                    maxWidth: isMobile ? 120 : 180,
                    textAlign: "center",
                    fontSize: isMobile ? 16 : 24,
                    fontWeight: 900,
                    color: "#fff",
                    textTransform: "uppercase",
                    padding: isMobile ? "4px 10px" : "6px 18px",
                    borderRadius: 12,
                    background: winnerColor,
                    border: "3px solid #111",
                    boxShadow: "0 4px 0 #111",
                    lineHeight: 1.1,
                    letterSpacing: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {winner.name}
                </div>

                <div
                  style={{
                    marginTop: 8,
                    minWidth: isMobile ? 72 : 88,
                    height: isMobile ? 36 : 44,
                    padding: isMobile ? "0 12px" : "0 16px",
                    borderRadius: 12,
                    background: "#fff",
                    border: "3px solid #111",
                    boxShadow: "0 4px 0 #111",
                    color: "#555",
                    fontSize: isMobile ? 14 : 18,
                    fontWeight: 900,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {winner.score || 0}
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              width: "100%",
              height: 3,
              background: "#111",
              borderRadius: 999,
              marginTop: 14,
              marginBottom: 10,
            }}
          />

          <div
            style={{
              fontSize: isMobile ? 22 : 34,
              fontWeight: 900,
              color: "#555",
              textAlign: "center",
              marginBottom: 14,
              textTransform: "uppercase",
            }}
          >
            PUANLAR
          </div>

          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: isMobile
                ? "repeat(3, minmax(0, 1fr))"
                : "repeat(3, 1fr)",
              gap: isMobile ? 10 : 28,
              justifyItems: "center",
              marginBottom: 20,
            }}
          >
            {sortedPlayers
              .filter((player) => player.id !== winner?.id)
              .map((player) => {
                const playerColor =
                  playerColorMap[player.id] ||
                  "linear-gradient(180deg, #6b7280, #4b5563)";

                return (
                  <div
                    key={player.id}
                    style={{
                      width: "100%",
                      maxWidth: isMobile ? 110 : 180,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: isMobile ? 6 : 10,
                    }}
                  >
                    <div
                      style={{
                        width: isMobile ? 42 : 58,
                        height: isMobile ? 42 : 58,
                        borderRadius: 12,
                        background: playerColor,
                        border: "3px solid #111",
                        boxShadow: "0 4px 0 #111",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {player.avatar ? (
                        <img
                          src={getAvatarSrc(player.avatar)}
                          alt={player.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : null}
                    </div>

                    <div
                      style={{
                        minWidth: isMobile ? 40 : 54,
                        maxWidth: "100%",
                        textAlign: "center",
                        fontSize: isMobile ? 10 : 18,
                        fontWeight: 900,
                        color: "#fff",
                        textTransform: "uppercase",
                        padding: isMobile ? "2px 6px" : "2px 10px",
                        borderRadius: 10,
                        background: playerColor,
                        border: "3px solid #111",
                        boxShadow: "0 4px 0 #111",
                        lineHeight: 1.05,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {player.name}
                    </div>

                    <div
                      style={{
                        minWidth: isMobile ? 54 : 74,
                        height: isMobile ? 28 : 40,
                        padding: isMobile ? "0 8px" : "0 14px",
                        borderRadius: 10,
                        background: "#fff",
                        border: "3px solid #111",
                        boxShadow: "0 4px 0 #111",
                        color: "#555",
                        fontSize: isMobile ? 11 : 18,
                        fontWeight: 900,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {player.score || 0}
                    </div>
                  </div>
                );
              })}
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: "auto",
            }}
          >
            <button
              onClick={() => {
                playClick();
                socket.disconnect();
                window.location.reload();
              }}
              style={{
                minWidth: isMobile ? 180 : 220,
                height: isMobile ? 46 : 54,
                padding: isMobile ? "0 18px" : "0 24px",
                borderRadius: 14,
                border: "3px solid #111",
                background: "linear-gradient(180deg, #ffb347, #ff7a00)",
                color: "#fff",
                fontSize: isMobile ? 18 : 24,
                fontWeight: 900,
                cursor: "pointer",
                boxShadow: "0 4px 0 #111",
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              ANA SAYFAYA DÖN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

if (gameStarted && phase === "WORD_HUNT") {
  const currentTurnPlayer =
    wordHunt && players.length > 0
      ? players.find(
          (player) => player.id === wordHunt.turnOrder?.[wordHunt.currentTurnIndex]
        )
      : null;

  const isMyTurn = currentTurnPlayer?.id === socket.id;
  const me = players.find((p) => p.id === socket.id);

  const currentPlayerColor = getAvatarBg(me?.avatar);

  return (
    <div
  style={{
    width: "100vw",
    minHeight: "100dvh",
    height: "auto",
    backgroundImage: `url(${currentQuestionBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center top",
    backgroundRepeat: "no-repeat",
    fontFamily: "Arial",
    position: "relative",
    overflowX: "hidden",
    overflowY: isMobile ? "auto" : "hidden",
    WebkitOverflowScrolling: "touch",
    padding: isMobile ? "12px 10px" : "24px 28px",
    boxSizing: "border-box",
  }}
>
      {/* SOL ÜST AVATAR */}
      <div
        style={{
          position: "absolute",
          left: isMobile ? 10 : 24,
          top: isMobile ? 82 : 150,
          zIndex: 3,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: isMobile ? 8 : 14,
        }}
      >
        <div
          style={{
            width: isMobile ? 70 : 140,
            height: isMobile ? 70 : 140,
            borderRadius: 14,
            border: "3px solid #111",
            background: currentPlayerColor,
            overflow: "hidden",
            boxShadow: "0 4px 0 #111",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {me?.avatar && (
            <img
              src={getAvatarSrc(me.avatar)}
              alt={me.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}
        </div>

        <div
          style={{
            minWidth: isMobile ? 72 : 92,
            height: isMobile ? 28 : 42,
            padding: isMobile ? "0 10px" : "0 16px",
            borderRadius: 10,
            border: "3px solid #111",
            background: currentPlayerColor,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isMobile ? 14 : 20,
            fontWeight: 900,
            textTransform: "uppercase",
            boxShadow: "0 4px 0 #111",
          }}
        >
          {me?.name || ""}
        </div>
      </div>

      {/* ROOM CODE */}
      <div
        style={{
          position: "absolute",
          top: isMobile ? 46 : 100,
          left: "50%",
          transform: "translateX(-50%)",
          padding: isMobile ? "8px 16px" : "14px 40px",
          borderRadius: 14,
          background: currentPlayerColor,
          color: "#fff",
          fontSize: isMobile ? 16 : 32,
          fontWeight: 900,
          zIndex: 3,
          boxShadow: "0 4px 0 #111",
        }}
      >
        {roomCode}
      </div>

      {/* SÜRE */}
      <div
        style={{
          position: "absolute",
          top: isMobile ? 152 : 210,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 3,
          minWidth: isMobile ? 170 : 220,
          height: isMobile ? 46 : 70,
          padding: "0 16px",
          borderRadius: 14,
          background: "#f9162a",
          color: "#fff",
          border: "3px solid #111",
          boxShadow: "0 4px 0 #111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: isMobile ? 18 : 30,
          fontWeight: 900,
          textTransform: "uppercase",
        }}
      >
        SÜRE: {timeLeft}
      </div>

      {/* TUR */}
      <div
        style={{
          position: "absolute",
          top: isMobile ? 98 : 200,
          right: isMobile ? 10 : 28,
          zIndex: 3,
          minWidth: isMobile ? 98 : 150,
          height: isMobile ? 40 : 56,
          padding: "0 12px",
          borderRadius: 12,
          background: currentPlayerColor,
          color: "#fff",
          border: "3px solid #111",
          boxShadow: "0 4px 0 #111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: isMobile ? 14 : 22,
          fontWeight: 900,
          textTransform: "uppercase",
        }}
      >
        TUR: {round}/{roomMaxRounds}
      </div>

      {/* ORTA KART */}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: isMobile ? 210 : 280,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: isMobile ? "100%" : "min(760px, 72vw)",
            maxWidth: isMobile ? 420 : "unset",
            background: "#ececec",
            borderRadius: 20,
            padding: isMobile ? "16px 12px 18px" : "22px 26px 26px",
            position: "relative",
            zIndex: 2,
            boxShadow: `
              0 6px 0 #111,
              0 10px 18px rgba(0,0,0,0.25),
              inset 0 3px 6px rgba(255,255,255,0.9),
              inset 0 -4px 8px rgba(0,0,0,0.15)
            `,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              margin: "0 0 12px 0",
              fontSize: isMobile ? 28 : 48,
              lineHeight: 1,
              fontWeight: 900,
              color: isMole ? "#ef4444" : "#555",
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            {isMole ? "SEN KÖSTEBEKSİN!" : "KELİME"}
          </div>

          <div
            style={{
              backgroundImage: `url(${currentQuestionBg})`,
              color: "#fff",
              borderRadius: 10,
              minHeight: 58,
              padding: isMobile ? "8px 10px" : "10px 22px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontWeight: 900,
              fontSize: isMobile ? 16 : 26,
              lineHeight: 1.1,
              marginBottom: 18,
              boxShadow: `
                0 3px 0 #111,
                0 1px 28px rgba(0,0,0,0.25),
                inset 0 3px 6px rgba(255,255,255,0.9),
                inset 0 -4px 8px rgba(0,0,0,0.155)
              `,
            }}
          >
            {isMole
              ? "Rastgele bir kelime yaz ve diğerlerini kandırmaya çalış!"
              : question?.text}
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: isMobile ? 16 : 22,
              fontWeight: 900,
              color: "#4b5563",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            YAZILAN KELİMELER
          </div>

          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: isMobile
                ? "repeat(3, minmax(0, 1fr))"
                : "repeat(3, minmax(0, 1fr))",
              gap: isMobile ? 10 : 22,
              justifyItems: "center",
              marginBottom: 20,
            }}
          >
            {players.map((player) => {
              const submission = wordHunt?.submissions?.find(
                (s) => s.playerId === player.id
              );

              const playerBg = getAvatarBg(player.avatar);

              const isCurrentTurn = currentTurnPlayer?.id === player.id;

              return (
                <div
                  key={player.id}
                  style={{
                    width: "100%",
                    maxWidth: isMobile ? 110 : 170,
                    minHeight: isMobile ? 112 : 150,
                    background: "#f6efef",
                    borderRadius: 16,
                    boxShadow: isCurrentTurn
                      ? "0 6px 0 #111, 0 0 0 4px rgba(255,159,10,0.28), 0 0 18px rgba(255,159,10,0.7)"
                      : "0 6px 0 #111",
                    padding: isMobile ? "10px 8px 10px" : "14px 12px 14px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      background: playerBg,
                      color: "#fff",
                      borderRadius: 10,
                      padding: isMobile ? "5px 8px" : "6px 10px",
                      fontSize: isMobile ? 11 : 13,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      marginBottom: 12,
                      maxWidth: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      boxShadow: "0 4px 0 #111",
                    }}
                  >
                    {player.name}
                  </div>

                  {[0, 1].map((index) => {
                    const value = submission?.words?.[index];

                    return (
                      <div
                        key={index}
                        style={{
                          width: "100%",
                          minHeight: isMobile ? 26 : 30,
                          padding: isMobile ? "0 6px" : "0 12px",
                          borderRadius: 999,
                          background: playerBg,
                          color: "#fff",
                          fontSize: isMobile ? 11 : 14,
                          fontWeight: 900,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textTransform: "uppercase",
                          marginBottom: 8,
                          boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.12)",
                          textAlign: "center",
                          wordBreak: "break-word",
                          boxSizing: "border-box",
                        }}
                      >
                        {value && value !== "" ? value : "—"}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              marginTop: "auto",
              width: "100%",
            }}
          >
            <input
              type="text"
              value={isMyTurn ? wordInput : ""}
              onChange={(e) => setWordInput(e.target.value)}
              placeholder={isMyTurn ? "Kelimenizi yazın" : "Sıra sende değil"}
              disabled={!isMyTurn}
              onKeyDown={(e) => {
                if (e.key === "Enter" && isMyTurn) {
                  submitWordHuntWord();
                }
              }}
              style={{
                width: "100%",
                maxWidth: 300,
                height: isMobile ? 48 : 42,
                borderRadius: 14,
                border: "3px solid #111",
                textAlign: "center",
                fontSize: isMobile ? 16 : 18,
                fontWeight: 700,
                outline: "none",
                background: isMyTurn ? "#fff" : "#e5e7eb",
                color: isMyTurn ? "#111" : "#6b7280",
                fontStyle: "italic",
                boxSizing: "border-box",
                boxShadow: `
                  0 6px 0 #111,
                  0 10px 18px rgba(0,0,0,0.25),
                  inset 0 3px 6px rgba(255,255,255,0.9),
                  inset 0 -4px 8px rgba(0,0,0,0.15)
                `,
              }}
            />

            <button
              onClick={() => {
                playClick();
                submitWordHuntWord();
              }}
              disabled={!isMyTurn}
              style={{
                width: "100%",
                maxWidth: 170,
                height: isMobile ? 46 : 42,
                borderRadius: 14,
                border: "3px solid #111",
                background: isMyTurn
                  ? "linear-gradient(180deg, #4cd964, #28a745)"
                  : "linear-gradient(180deg, #9ca3af, #6b7280)",
                color: "#fff",
                fontSize: isMobile ? 18 : 22,
                fontWeight: 900,
                cursor: isMyTurn ? "pointer" : "not-allowed",
                textTransform: "uppercase",
                boxShadow: "0 4px 0 #111",
              }}
            >
              GÖNDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
 
if (gameStarted && questionType === "select_player") {
  const currentPlayer =
    players.find((player) => player.id === socket.id) || null;

  const currentPlayerColor = getAvatarBg(currentPlayer?.avatar);

  return (
    <div
  style={{
    width: "100vw",
    minHeight: "100dvh",
    height: "auto",
    fontFamily: "Arial",
    backgroundImage: `url(${currentQuestionBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center top",
    position: "relative",
    backgroundRepeat: "no-repeat",
    padding: isMobile ? "12px 10px" : "24px 28px",
    boxSizing: "border-box",
    overflowX: "hidden",
    overflowY: isMobile ? "auto" : "hidden",
    WebkitOverflowScrolling: "touch",
  }}
>
      {currentPlayer && (
        <div
          style={{
            position: "absolute",
            left: isMobile ? 10 : 24,
            top: isMobile ? 90 : 150,
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 8 : 14,
            zIndex: 3,
          }}
        >
          <div
            style={{
              width: isMobile ? 70 : 140,
              height: isMobile ? 70 : 140,
              borderRadius: 14,
              background: currentPlayerColor,
              border: "3px solid #111",
              boxShadow: "0 4px 0 #111",
              overflow: "hidden",
            }}
          >
            <img
              src={getAvatarSrc(currentPlayer.avatar)}
              alt={currentPlayer.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div
            style={{
              fontSize: isMobile ? 14 : 22,
              padding: isMobile ? "6px 10px" : "10px 18px",
              borderRadius: 10,
              background: currentPlayerColor,
              border: "3px solid #111",
              boxShadow: "0 4px 0 #111",
              color: "#fff",
              fontWeight: 900,
            }}
          >
            {currentPlayer.name}
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: isMobile ? 56 : 100,
          left: "50%",
          transform: "translateX(-50%)",
          padding: isMobile ? "8px 16px" : "14px 40px",
          fontSize: isMobile ? 16 : 32,
          borderRadius: 14,
          background: currentPlayerColor,
          border: "3px solid #111",
              boxShadow: "0 4px 0 #111",
          color: "#fff",
          fontWeight: 900,
          zIndex: 3,
        }}
      >
        {roomCode}
      </div>

      <div
        style={{
          position: "absolute",
          top: isMobile ? 156 : 240,
          left: "50%",
          transform: "translateX(-50%)",
          height: isMobile ? 46 : 70,
          padding: "0 16px",
          borderRadius: 14,
          background: "#f9162a",
          border: "3px solid #111",
              boxShadow: "0 4px 0 #111",
          color: "#fff",
          fontSize: isMobile ? 18 : 30,
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 3,
          boxShadow: "0 4px 0 #111",
        }}
      >
        SÜRE: {timeLeft}
      </div>

      <div
        style={{
          position: "absolute",
          top: isMobile ? 108 : 200,
          right: isMobile ? 10 : 28,
          height: isMobile ? 40 : 56,
          padding: "0 12px",
          borderRadius: 12,
          background: currentPlayerColor,
          border: "3px solid #111",
          color: "#fff",
          fontSize: isMobile ? 14 : 22,
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
          boxShadow: "0 4px 0 #111",
          zIndex: 3,
        }}
      >
        TUR: {round}/{roomMaxRounds}
      </div>

        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingTop: isMobile ? 220 : 400,
            boxSizing: "border-box",
          }}
        >
        <div
          style={{
            width: isMobile ? "100%" : "min(860px, 92vw)",
            maxWidth: isMobile ? 420 : "unset",
            background: "#FFF",
            borderRadius: 20,
            padding: isMobile ? "16px 12px 18px" : "24px 28px 28px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: isMobile ? 0 : 0,
            boxShadow: `
              0 6px 0 #111,
              0 10px 18px rgba(0,0,0,0.25),
              inset 0 3px 6px rgba(255,255,255,0.9),
              inset 0 -4px 8px rgba(0,0,0,0.15)
            `,
            boxSizing: "border-box",
          }}
        >
          <h1
            style={{
              fontSize: isMobile ? 28 : 58,
              margin: "0 0 18px 0",
              textAlign: "center",
              fontWeight: 900,
              color: isMole ? "#ef4444" : "#333",
            }}
          >
            {isMole ? " SEN KÖSTEBEKSİN!" : "SORU"}
          </h1>

          <div
            style={{
              borderRadius: 10,
              padding: isMobile ? "8px 10px" : "30px 22px",
              width: "100%",
              textAlign: "center",
              fontSize: isMobile ? 16 : 26,
              fontWeight: 900,
              marginBottom: 24,
              backgroundImage: `url(${currentQuestionBg})`,
              boxShadow: `
                0 3px 0 #111,
                0 1px 28px rgba(0,0,0,0.25),
                inset 0 3px 6px rgba(255,255,255,0.9),
                inset 0 -4px 8px rgba(0,0,0,0.155)
              `,
              color: "#fff",
            }}
          >
            {isMole
              ? "Rastgele bir seçim yap ve diğerlerini kandırmaya çalış!"
              : question?.text}
          </div>

          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: isMobile
                ? "repeat(3, minmax(0, 1fr))"
                : "repeat(auto-fit, minmax(140px, 1fr))",
              gap: isMobile ? 12 : 24,
              justifyItems: "center",
            }}
          >
            {players.map((player) => {
              const playerAvatarKey = player.avatar?.split("/").pop();
              const playerColor =
                avatarColorMap[playerAvatarKey] ||
                "linear-gradient(180deg, #6b7280, #4b5563)";

              const isSelected = selectedPlayer === player.id;

              return (
                <div
                  key={player.id}
                  style={{
                    width: "100%",
                    maxWidth: isMobile ? 110 : 150,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <button
                    onClick={() => {
                      clickSound.currentTime = 0;
                      clickSound.play();
                      selectPlayer(player.id);
                    }}
                    style={{
                      width: "100%",
                      maxWidth: isMobile ? 82 : 110,
                      height: isMobile ? 38 : 44,
                      borderRadius: 12,
                      border: "3px solid #111",
                      background: "linear-gradient(180deg, #4cd964, #28a745)",
                      color: "#fff",
                      fontSize: isMobile ? 13 : 16,
                      fontWeight: 900,
                      cursor: "pointer",
                      boxShadow: isSelected
                        ? "0 2px 0 #111, 0 0 18px rgba(76,217,100,0.95)"
                        : `
                          0 6px 0 #111,
                          0 10px 18px rgba(0,0,0,0.25)
                        `,
                      transform: isSelected
                        ? "translateY(4px)"
                        : "translateY(0)",
                    }}
                  >
                    SEÇ
                  </button>

                  <div
                    style={{
                      width: isMobile ? 72 : 92,
                      height: isMobile ? 72 : 92,
                      borderRadius: 16,
                      background: playerColor,
                      border: "3px solid #111",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 8,
                      boxShadow: isSelected
                        ? `
                          0 6px 0 #111,
                          0 0 0 4px rgba(76,217,100,0.35),
                          0 0 18px rgba(76,217,100,0.9),
                          0 10px 18px rgba(0,0,0,0.25),
                          inset 0 3px 6px rgba(255,255,255,0.9),
                          inset 0 -4px 8px rgba(0,0,0,0.15)
                        `
                        : `
                          0 6px 0 #111,
                          0 10px 18px rgba(0,0,0,0.25),
                          inset 0 3px 6px rgba(255,255,255,0.9),
                          inset 0 -4px 8px rgba(0,0,0,0.15)
                        `,
                    }}
                  >
                    <img
                      src={getAvatarSrc(player.avatar)}
                      alt={player.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      fontSize: isMobile ? 13 : 16,
                      fontWeight: 900,
                      color: "#4b5563",
                      textTransform: "uppercase",
                      textAlign: "center",
                      lineHeight: 1.1,
                      wordBreak: "break-word",
                    }}
                  >
                    {player.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

  if (gameStarted && questionType === "yes_no" && phase === "QUESTION") {
  const me = players.find((p) => p.id === socket.id);

  const currentPlayerColor = getAvatarBg(me?.avatar);

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        fontFamily: "Arial",
        backgroundImage: `url(${currentQuestionBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        position: "relative",
        backgroundRepeat: "no-repeat",
        padding: isMobile ? "12px 10px" : "24px 28px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* AVATAR */}
      {me && (
        <div
          style={{
            position: "absolute",
            left: isMobile ? 10 : 24,
            top: isMobile ? 100 : 150,
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 8 : 14,
            zIndex: 3,
          }}
        >
          <div
            style={{
              width: isMobile ? 70 : 140,
              height: isMobile ? 70 : 140,
              borderRadius: 14,
              background: currentPlayerColor,
              border: "3px solid #111",
              boxShadow: "0 4px 0 #111",
              overflow: "hidden",
            }}
          >
            <img
              src={getAvatarSrc(me.avatar)}
              alt={me.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div
            style={{
              fontSize: isMobile ? 14 : 22,
              padding: isMobile ? "6px 10px" : "10px 18px",
              borderRadius: 10,
              background: currentPlayerColor,
              border: "3px solid #111",
              boxShadow: "0 4px 0 #111",
              color: "#fff",
              fontWeight: 900,
            }}
          >
            {me.name}
          </div>
        </div>
      )}

      {/* ROOM CODE */}
      <div
        style={{
          position: "absolute",
          top: isMobile ? 60 : 100,
          left: "50%",
          transform: "translateX(-50%)",
          padding: isMobile ? "8px 16px" : "14px 40px",
          fontSize: isMobile ? 16 : 32,
          borderRadius: 14,
          background: currentPlayerColor,
          color: "#fff",
          border: "3px solid #111",
              boxShadow: "0 4px 0 #111",
          fontWeight: 900,
          zIndex: 3,
        }}
      >
        {roomCode}
      </div>

      {/* TIMER */}
      <div
        style={{
          position: "absolute",
          top: isMobile ? 200 : 240,
          left: "50%",
          transform: "translateX(-50%)",
          height: isMobile ? 46 : 70,
          padding: "0 16px",
          borderRadius: 14,
          background: "#f9162a",
          border: "3px solid #111",
              boxShadow: "0 4px 0 #111",
          color: "#fff",
          fontSize: isMobile ? 18 : 30,
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 3,
        }}
      >
        SÜRE: {timeLeft}
      </div>

      {/* ROUND */}
      <div
        style={{
          position: "absolute",
          top: isMobile ? 115 : 200,
          right: isMobile ? 10 : 28,
          height: isMobile ? 40 : 56,
          padding: "0 12px",
          borderRadius: 12,
          background: currentPlayerColor,
          border: "3px solid #111",
              boxShadow: "0 4px 0 #111",
          color: "#fff",
          fontSize: isMobile ? 14 : 22,
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
        }}
      >
        TUR: {round}/{roomMaxRounds}
      </div>

      {/* ORTA ALAN */}
      <div
        style={{
          width: "100%",
          minHeight: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: isMobile ? 320 : 480,
          paddingBottom: isMobile ? 60 : 120,
        }}
      >
        <div
          style={{
            width: isMobile ? "100%" : "min(860px, 92vw)",
            background: "#FFF",
            borderRadius: 20,
            padding: isMobile ? "16px 12px" : "24px 28px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: `
              0 6px 0 #111,
              0 10px 18px rgba(0,0,0,0.25),
              inset 0 3px 6px rgba(255,255,255,0.9),
              inset 0 -4px 8px rgba(0,0,0,0.15)
            `,
          }}
        >
          <h1
            style={{
              fontSize: isMobile ? 28 : 58,
              marginBottom: 18,
              textAlign: "center",
              fontWeight: 900,
              color: isMole ? "#ef4444" : "#333",
            }}
          >
            {isMole ? " SEN KÖSTEBEKSİN!" : "SORU"}
          </h1>

          <div
            style={{
              borderRadius: 10,
              padding: isMobile ? "8px 10px" : "30px 22px",
              width: "100%",
              textAlign: "center",
              fontSize: isMobile ? 16 : 26,
              fontWeight: 900,
              marginBottom: 40,
              backgroundImage: `url(${currentQuestionBg})`,
              boxShadow: `
                0 3px 0 #111,
                0 1px 28px rgba(0,0,0,0.25),
                inset 0 3px 6px rgba(255,255,255,0.9),
                inset 0 -4px 8px rgba(0,0,0,0.155)
              `,
              color: "#fff",
            }}
          >
            {isMole
              ? "Rastgele bir seçim yaparak, diğerlerini kandırmaya çalış!"
              : question?.text}
          </div>

          <div
            style={{
              display: "flex",
              gap: isMobile ? 12 : 24,
              width: "100%",
              justifyContent: "center",
            }}
          >
            {/* EVET */}
            <button
              onClick={() => {
                submitYesNoAnswer("Evet");
                clickSound.play();
              }}
              style={{
                flex: 1,
                maxWidth: 200,
                height: isMobile ? 56 : 68,
                borderRadius: 14,
                border: "3px solid #111",
                background: "linear-gradient(180deg, #4cd964, #28a745)",
                color: "#fff",
                fontSize: isMobile ? 20 : 28,
                fontWeight: 900,

                boxShadow:
                  yesNoAnswer === "Evet"
                    ? "0 2px 0 #111"
                    : `
                      0 6px 0 #111,
                      0 10px 18px rgba(0,0,0,0.25)
                    `,

                transform:
                  yesNoAnswer === "Evet"
                    ? "translateY(4px)"
                    : "translateY(0)",
              }}
            >
              EVET
            </button>

            {/* HAYIR */}
            <button
              onClick={() => {
                submitYesNoAnswer("Hayır");
                clickSound.play();
              }}
              style={{
                flex: 1,
                maxWidth: 200,
                height: isMobile ? 56 : 68,
                borderRadius: 14,
                border: "3px solid #111",
                background: "linear-gradient(180deg, #ef4444, #dc2626)",
                color: "#fff",
                fontSize: isMobile ? 20 : 28,
                fontWeight: 900,

                boxShadow:
                  yesNoAnswer === "Hayır"
                    ? "0 2px 0 #111"
                    : `
                      0 6px 0 #111,
                      0 10px 18px rgba(0,0,0,0.25)
                    `,

                transform:
                  yesNoAnswer === "Hayır"
                    ? "translateY(4px)"
                    : "translateY(0)",
              }}
            >
              HAYIR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
 
          if (gameStarted && questionType === "number_input") {
            const currentPlayer =
              players.find((player) => player.id === socket.id) || null;
          
            const currentPlayerColor = getAvatarBg(currentPlayer?.avatar);
          
            return (
             <div
  style={{
    width: "100vw",
    minHeight: "100vh",
    fontFamily: "Arial",
    backgroundImage: `url(${currentQuestionBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center top",    
    position: "relative",
    backgroundRepeat: "no-repeat",
    padding: isMobile ? "12px 10px" : "24px 28px",
    boxSizing: "border-box",
    overflow: "hidden",
  }}
>
  {/* AVATAR */}
  {currentPlayer && (
    <div
      style={{
        position: "absolute",
        left: isMobile ? 10 : 24,
        top: isMobile ? 100 : 150,
        display: "flex",
        alignItems: "center",
        gap: isMobile ? 8 : 14,
        zIndex: 3,
      }}
    >
      <div
        style={{
          width: isMobile ? 70 : 140,
          height: isMobile ? 70 : 140,
          borderRadius: 14,
          background: currentPlayerColor,
          border: "3px solid #111",
          boxShadow: "0 4px 0 #111",
          overflow: "hidden",
        }}
      >
        <img
          src={getAvatarSrc(currentPlayer.avatar)}
          alt={currentPlayer.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <div
        style={{
          fontSize: isMobile ? 14 : 22,
          padding: isMobile ? "6px 10px" : "10px 18px",
          borderRadius: 10,
          background: currentPlayerColor,
          border: "3px solid #111",
              boxShadow: "0 4px 0 #111",
          color: "#fff",
          fontWeight: 900,
        }}
      >
        {currentPlayer.name}
      </div>
    </div>
  )}

  {/* ROOM CODE */}
  <div
    style={{
      position: "absolute",
      top: isMobile ? 60 : 100,
      left: "50%",
      transform: "translateX(-50%)",
      padding: isMobile ? "8px 16px" : "14px 40px",
      fontSize: isMobile ? 16 : 32,
      borderRadius: 14,
      background: currentPlayerColor,
      color: "#fff",
      border: "3px solid #111",
              boxShadow: "0 4px 0 #111",
      fontWeight: 900,
      zIndex: 3,
    }}
  >
    {roomCode}
  </div>

  {/* TIMER */}
  <div
    style={{
      position: "absolute",
      top: isMobile ? 200 : 240,
      left: "50%",
      transform: "translateX(-50%)",
      height: isMobile ? 46 : 70,
      padding: "0 16px",
      borderRadius: 14,
      background: "#f9162a",
      border: "3px solid #111",
              boxShadow: "0 4px 0 #111",
      color: "#fff",
      fontSize: isMobile ? 18 : 30,
      fontWeight: 900,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 3,
    }}
  >
    SÜRE: {timeLeft}
  </div>

  {/* ROUND */}
  <div
    style={{
      position: "absolute",
      top: isMobile ? 115 : 200,
      right: isMobile ? 10 : 28,
      height: isMobile ? 40 : 56,
      padding: "0 12px",
      borderRadius: 12,
      background: currentPlayerColor,
      border: "3px solid #111",
      color: "#fff",
      fontSize: isMobile ? 14 : 22,
      fontWeight: 900,
      display: "flex",
      alignItems: "center",
    }}
  >
    TUR: {round}/{roomMaxRounds}
  </div>

  {/* ORTA ALAN */}
  <div
    style={{
      width: "100%",
      minHeight: "auto",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      paddingTop: isMobile ? 320 : 480,
      paddingBottom: isMobile ? 60 : 120,
      
    }}
  >
    <div
      style={{
        width: isMobile ? "100%" : "min(860px, 92vw)",
        background: "#FFF",
        borderRadius: 20,
        padding: isMobile ? "16px 12px" : "24px 28px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: `
  0 6px 0 #111,
  0 10px 18px rgba(0,0,0,0.25),
  inset 0 3px 6px rgba(255,255,255,0.9),
  inset 0 -4px 8px rgba(0,0,0,0.15)
`,
      }}
    >
      <h1
        style={{
          fontSize: isMobile ? 28 : 58,
          marginBottom: 18,
          textAlign: "center",
          fontWeight: 900,
          color: isMole ? "#ef4444" : "#333",
        }}
      >
        {isMole ? " SEN KÖSTEBEKSİN!" : "SORU"}
      </h1>

      <div
        style={{
          borderRadius: 10,
          padding: isMobile ? "8px 10px" : "30px 22px",
          width: "100%",
          textAlign: "center",
          fontSize: isMobile ? 16 : 26,
          fontWeight: 900,
          marginBottom: 40,
          backgroundImage: `url(${currentQuestionBg})`,
          boxShadow: `
  0 3px 0 #111,
  0 1px 28px rgba(0,0,0,0.25),
  inset 0 3px 6px rgba(255,255,255,0.9),
  inset 0 -4px 8px rgba(0,0,0,0.155)
`,
          color: "#fff",
        }}
      >
        {isMole
          ? "Rastgele sayı girerek, diğerlerini kandırmaya çalış!"
          : question?.text}
      </div>

      <input
        type="number"
        value={numberAnswer}
        onChange={(e) => {
          const value = e.target.value;
          setNumberAnswer(value);
          if (value !== "") submitNumberAnswer(value);
        }}
        style={{
          width: "100%",
          maxWidth: 260,
          height: isMobile ? 56 : 88,
          borderRadius: 14,
          boxShadow: `
            0 6px 0 #111,
            0 10px 18px rgba(0,0,0,0.25),
            inset 0 3px 6px rgba(255,255,255,0.9),
            inset 0 -4px 8px rgba(0,0,0,0.15)
          `,
          textAlign: "center",
          fontSize: isMobile ? 22 : 40,
          fontWeight: 900,
        }}
      />
    </div>
  </div>
</div>
            );
          }           

  if (gameStarted && phase !== "START_COUNTDOWN" && questionType !== "select_player") {
    return (
      <div style={{ padding: 50, fontFamily: "Arial", textAlign: "center" }}>
        <h1>Yeni Soru Tipi</h1>
        <p>{question?.text}</p>
        <p>Type: {questionType}</p>
        <p>Henüz bu ekran yapılmadı 👷</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 50, fontFamily: "Arial" }}>
      

      {!roomCode && (
        <div>
          {mode && (
            <button onClick={() => setMode("")} style={{ marginBottom: 20 }}>
              ← Ana Sayfa
            </button>
          )}

          <div style={{ marginBottom: 10 }}>
            <input
              placeholder="İsmin"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
          <input
            placeholder="İsmini gir"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: 240,
              height: 50,
              borderRadius: 16,
              border: "4px solid #111",
              textAlign: "center",
              fontSize: 18,
              fontWeight: "bold",
              outline: "none",
              boxShadow: "0 4px 0 #111",
            }}
          />
          </div>

          {mode === "create" && (
            <div style={{ marginBottom: 10 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 20,
                  marginBottom: 20,
                }}
              >
                <button
                  onClick={prevCategory}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    border: "4px solid #111",
                    background: "#F2F2F2",
                    fontSize: 24,
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 4px 0 #111",
                  }}
                >
                  ‹
                </button>

                <div
                  style={{
                    width: 300,
                    height: 200,
                    backgroundImage: `url(${selectedCategory.bg})`,
                    backgroundSize: "cover",
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    border: "4px solid #111",
                    boxShadow: "0 8px 0 #111",
                  }}
                >
                  <img
                    src={selectedCategory.image}
                    style={{ maxHeight: "80%" }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      bottom: -10,
                      background: "white",
                      padding: "4px 12px",
                      borderRadius: 10,
                      fontWeight: "bold",
                    }}
                  >
                    {selectedCategory.name}
                  </div>
                </div>

                <button
                  onClick={nextCategory}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    border: "4px solid #111",
                    background: "#F2F2F2",
                    fontSize: 24,
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 4px 0 #111",
                  }}
                >
                  ›
                </button>
              </div>
              <label>Tur Sayısı: </label>
              <div
                style={{
                  marginBottom: 18,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div style={{ fontWeight: "bold", fontSize: 18 }}>
                  Tur Sayısı: {maxRounds}
                </div>

                <input
                  type="range"
                  min="3"
                  max="10"
                  step="1"
                  value={maxRounds}
                  onChange={(e) => setMaxRounds(Number(e.target.value))}
                  style={{
                    width: 220,
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>
          )}
          {mode === "create" ? (
            <button
            onClick={createRoom}
            style={{
              width: 260,
              height: 64,
              borderRadius: 20,
              border: "4px solid #111",
              background: "linear-gradient(180deg, #ffb347, #ff7a00)",
              color: "white",
              fontSize: 22,
              fontWeight: 900,
              cursor: "pointer",
              boxShadow: "0 6px 0 #111",
              marginTop: 10,
            }}
          >
            ODAYI OLUŞTUR
          </button>
          ) : (
            <button onClick={joinRoom}>Odaya Katıl</button>
          )}
        </div>
      )}


    </div>
  );
}

export default App;
