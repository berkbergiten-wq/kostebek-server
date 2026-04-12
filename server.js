const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const wordHuntTimers = {};
const countdownTimers = {};

const app = express();
app.use(
  cors({
    origin: ["https://skalacraft.com", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://skalacraft.com", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

const rooms = {};
const socketToRoom = {};
const avatarPool = [
  "avatar1",
  "avatar2",
  "avatar3",
  "avatar4",
  "avatar5",
  "avatar6",
  "avatar7",
  "avatar8",
];
const questionPools = {
  gosteri_zamani: [
    {
      category: "gosteri_zamani",
      type: "select_player",
      text: "Aranızdaki en komik kişiyi seçin",
    },
    {
      category: "gosteri_zamani",
      type: "select_player",
      text: "Aranızdaki en dağınık kişiyi seçin",
    },
    {
      category: "gosteri_zamani",
      type: "select_player",
      text: "Aranızdaki en tatlı kişiyi seçin",
    },
    {
      category: "gosteri_zamani",
      type: "select_player",
      text: "Aranızdaki en kilolu kişiyi seçin",
    },
    {
      category: "gosteri_zamani",
      type: "select_player",
      text: "Aranızdaki en zayıf kişiyi seçin",
    },
    {
      category: "gosteri_zamani",
      type: "select_player",
      text: "Aranızdaki en deli kişiyi seçin",
    },
    {
      category: "gosteri_zamani",
      type: "select_player",
      text: "Aranızdaki en korkak kişiyi seçin",
    },
    {
      category: "gosteri_zamani",
      type: "select_player",
      text: "Aranızdaki en pasaklı kişiyi seçin",
    },
  ],

  eller_yukari: [
    {
      category: "eller_yukari",
      type: "yes_no",
      text: "Daha önce yurt dışına çıktın mı?",
    },
    {
      category: "eller_yukari",
      type: "yes_no",
      text: "Hiç konsere gittin mi?",
    },
    {
      category: "eller_yukari",
      type: "yes_no",
      text: "Daha önce köye gittin mi?",
    },
    {
      category: "eller_yukari",
      type: "yes_no",
      text: "Hiç dondurma yedin mi",
    },
  ],

  parmak_say: [
    {
      category: "parmak_say",
      type: "number_input",
      text: "Kaç kardeşin var?",
    },
    {
      category: "parmak_say",
      type: "number_input",
      text: "Kaç kez uçağa bindin?",
    },
    {
      category: "parmak_say",
      type: "number_input",
      text: "Bugün Kaç kere tuvalete gittin?",
    },
    {
      category: "parmak_say",
      type: "number_input",
      text: "Bugün kaç bardak su içtin?",
    },
  ],

  kelime_avi: [
    {
      category: "kelime_avi",
      type: "text_input",
      text: "Afrodizyak",
    },
    {
      category: "kelime_avi",
      type: "text_input",
      text: "Kola",
    },
    {
      category: "kelime_avi",
      type: "text_input",
      text: "Kleptomani",
    },
    {
      category: "kelime_avi",
      type: "text_input",
      text: "Dünya",
    },
  ],
};

function getRandomQuestion(gameCategory) {
  if (gameCategory === "karisik") {
    const categories = [
      "gosteri_zamani",
      "eller_yukari",
      "parmak_say",
      "kelime_avi"
      
    ];
  
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
  
    console.log("RANDOM CATEGORY:", randomCategory);
  
    const pool = questionPools[randomCategory];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  const pool = questionPools[gameCategory];
  return pool[Math.floor(Math.random() * pool.length)];
}
function shuffleArray(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}
function createWordHuntState(room) {
  const turnOrder = shuffleArray(room.players.map((player) => player.id));

  return {
    secretWord: room.currentQuestion.text,
    turnOrder,
    currentTurnIndex: 0,
    writesPerPlayer: 2,
    totalTurns: room.players.length * 2,
    submittedCount: 0,
    timePerTurn: 10,
    submissions: room.players.map((player) => ({
      playerId: player.id,
      words: [],
    })),
  };
}
function startWordHuntTimer(roomCode) {
  const room = rooms[roomCode];
  if (!room || !room.wordHunt) return;

  clearInterval(wordHuntTimers[roomCode]);

  room.timeLeft = room.wordHunt.timePerTurn;
  io.to(roomCode).emit("room_update", room);

  wordHuntTimers[roomCode] = setInterval(() => {
    const room = rooms[roomCode];
    if (!room || !room.wordHunt) return;

    room.timeLeft -= 1;
    io.to(roomCode).emit("room_update", room);

    if (room.timeLeft > 0) return;

    clearInterval(wordHuntTimers[roomCode]);

    const currentTurnPlayerId =
      room.wordHunt.turnOrder[room.wordHunt.currentTurnIndex];

    const submission = room.wordHunt.submissions.find(
      (s) => s.playerId === currentTurnPlayerId
    );

    if (submission) {
      submission.words.push("");
    }

    room.wordHunt.submittedCount += 1;

    if (room.wordHunt.submittedCount >= room.wordHunt.totalTurns) {
      room.phase = "SHOW_SELECTIONS";
      room.timeLeft = 15;
      io.to(roomCode).emit("room_update", room);

      startCountdown(roomCode, 15, "SHOW_SELECTIONS", (selectionRoom) => {
        startCountdown(roomCode, 15, "MOLE_VOTING", (moleRoom) => {
          const moleId = moleRoom.moleId;

          moleRoom.players.forEach((player) => {
            player.roundPoints = 0;

            if (player.id === moleId) {
              const wrongVotes = moleRoom.players.filter(
                (p) => p.id !== moleId && p.moleVote !== moleId
              ).length;

              player.roundPoints = wrongVotes;
            } else {
              if (player.moleVote === moleId) {
                player.roundPoints = 1;
              }
            }

            player.score = (player.score || 0) + (player.roundPoints || 0);
          });

          moleRoom.players.forEach((p) => {
            p.ready = false;
          });

          moleRoom.phase = "RESULT";
          moleRoom.timeLeft = null;

          io.to(roomCode).emit("room_update", moleRoom);
          io.to(roomCode).emit("all_mole_votes_completed", {
            players: moleRoom.players,
            moleId: moleRoom.moleId,
          });

          
        });
      });

      return;
    }

    room.wordHunt.currentTurnIndex =
      (room.wordHunt.currentTurnIndex + 1) % room.wordHunt.turnOrder.length;

    io.to(roomCode).emit("room_update", room);
    startWordHuntTimer(roomCode);
  }, 1000);
}

function startCountdown(roomCode, seconds, nextPhase, onComplete) {
  const room = rooms[roomCode];
  if (!room) return;

  if (countdownTimers[roomCode]) {
    clearInterval(countdownTimers[roomCode]);
    countdownTimers[roomCode] = null;
  }

  room.timeLeft = seconds;
  room.phase = nextPhase;
  io.to(roomCode).emit("room_update", room);

  countdownTimers[roomCode] = setInterval(() => {
    const currentRoom = rooms[roomCode];
    if (!currentRoom) {
      clearInterval(countdownTimers[roomCode]);
      countdownTimers[roomCode] = null;
      return;
    }

    currentRoom.timeLeft -= 1;
      io.to(roomCode).emit("room_update", currentRoom);

      if (currentRoom.timeLeft > 0) {
        io.to(roomCode).emit("countdown_tick", {
          roomCode,
          phase: currentRoom.phase,
          timeLeft: currentRoom.timeLeft,
        });
      }

    if (currentRoom.timeLeft <= 0) {
      clearInterval(countdownTimers[roomCode]);
      countdownTimers[roomCode] = null;

      onComplete(currentRoom);
      io.to(roomCode).emit("room_update", currentRoom);
      io.to(roomCode).emit("game_started", currentRoom);
    }
  }, 1000);
}

function runNormalRoundFlow(roomCode) {
  startCountdown(roomCode, 30, "QUESTION", (questionRoom) => {
    startCountdown(roomCode, 20, "SHOW_SELECTIONS", (selectionRoom) => {
      startCountdown(roomCode, 40, "MOLE_VOTING", (moleRoom) => {
        const moleId = moleRoom.moleId;

        moleRoom.players.forEach((player) => {
          player.roundPoints = 0;

          if (player.id === moleId) {
            const wrongVotes = moleRoom.players.filter(
              (p) => p.id !== moleId && p.moleVote !== moleId
            ).length;

            player.roundPoints = wrongVotes;
          } else {
            if (player.moleVote === moleId) {
              player.roundPoints = 1;
            }
          }

          player.score = (player.score || 0) + (player.roundPoints || 0);
        });

        moleRoom.players.forEach((p) => {
          p.ready = false;
        });

        moleRoom.phase = "RESULT";
        moleRoom.timeLeft = null;

        io.to(roomCode).emit("room_update", moleRoom);

        io.to(roomCode).emit("all_mole_votes_completed", {
          players: moleRoom.players,
          moleId: moleRoom.moleId,
        });
        if (moleRoom.round >= moleRoom.maxRounds) {
          moleRoom.timeLeft = 5;
          io.to(roomCode).emit("room_update", moleRoom);

          if (countdownTimers[roomCode]) {
            clearInterval(countdownTimers[roomCode]);
            countdownTimers[roomCode] = null;
          }

          countdownTimers[roomCode] = setInterval(() => {
            const finalRoom = rooms[roomCode];
            if (!finalRoom) {
              clearInterval(countdownTimers[roomCode]);
              countdownTimers[roomCode] = null;
              return;
            }

            finalRoom.timeLeft -= 1;
            io.to(roomCode).emit("room_update", finalRoom);

            if (finalRoom.timeLeft <= 0) {
              clearInterval(countdownTimers[roomCode]);
              countdownTimers[roomCode] = null;

              finalRoom.phase = "GAME_OVER";
              finalRoom.timeLeft = null;
              io.to(roomCode).emit("room_update", finalRoom);
            }
          }, 1000);

          return;
        }
        
      });
    });
  });
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("create_room", ({ name, avatar, maxRounds, maxPlayers, gameCategory }) => {
    console.log("Room created by:", name);
    const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const safeRounds = Math.max(3, Math.min(10, maxRounds || 5));
    rooms[roomCode] = {
      players: [
        {
          id: socket.id,
          name,
          avatar,
          ready: false,
          score: 0,
          connected: true,
        },
      ],
      host: socket.id,
      gameState: "LOBBY",
      phase: "LOBBY",
      timeLeft: null,
      round: 0,
      maxRounds: safeRounds,
      maxPlayers: maxPlayers || 5,
      gameCategory: gameCategory || "karisik",
      wordHunt: null,
        };

    socket.join(roomCode);
    socketToRoom[socket.id] = roomCode;

    socket.emit("room_created", { roomCode, playerId: socket.id });
    io.to(roomCode).emit("room_update", rooms[roomCode]);
  });

  socket.on("get_room_state", ({ roomCode }) => {
    const room = rooms[roomCode];
    if (!room) return;

    socket.emit("room_update", room);
  });

  socket.on("leave_room", ({ roomCode }) => {
    const room = rooms[roomCode];
    if (!room) return;
  
    // host çıktıysa odayı dağıt
    if (room.host === socket.id) {
      if (countdownTimers[roomCode]) {
  clearInterval(countdownTimers[roomCode]);
  countdownTimers[roomCode] = null;
}

if (wordHuntTimers[roomCode]) {
  clearInterval(wordHuntTimers[roomCode]);
  wordHuntTimers[roomCode] = null;
}
      io.to(roomCode).emit("host_left");
      room.players.forEach((player) => {
        delete socketToRoom[player.id];
      });
      delete rooms[roomCode];
      return;
    }
  
    // normal oyuncu çıktıysa sadece bağlantısını pasif yap
    const player = room.players.find((p) => p.id === socket.id);
    if (!player) return;
  
    player.connected = false;
    socket.leave(roomCode);
    delete socketToRoom[socket.id];
  
    io.to(roomCode).emit("room_update", room);
  });
  socket.on("disconnect", () => {
    const roomCode = socketToRoom[socket.id];
    if (!roomCode) return;
  
    const room = rooms[roomCode];
    if (!room) {
      delete socketToRoom[socket.id];
      return;
    }
  
    // host çıktıysa odayı dağıt
    if (room.host === socket.id) {
      if (countdownTimers[roomCode]) {
  clearInterval(countdownTimers[roomCode]);
  countdownTimers[roomCode] = null;
}

if (wordHuntTimers[roomCode]) {
  clearInterval(wordHuntTimers[roomCode]);
  wordHuntTimers[roomCode] = null;
}
      io.to(roomCode).emit("host_left");
      room.players.forEach((player) => {
        delete socketToRoom[player.id];
      });
      delete rooms[roomCode];
      return;
    }
  
    // normal oyuncu çıktıysa bağlı değil yap
    const player = room.players.find((p) => p.id === socket.id);
    if (player) {
      player.connected = false;
    }
  
    delete socketToRoom[socket.id];
    io.to(roomCode).emit("room_update", room);
  });
  socket.on("join_room", ({ roomCode, name, avatar }) => {
  console.log("Join request:", roomCode, name);
  const room = rooms[roomCode];

  if (!room) {
    socket.emit("join_error", { message: "ODA BULUNAMADI" });
    return;
  }
    const connectedPlayersCount = room.players.filter((p) => p.connected !== false).length;

    if (connectedPlayersCount >= room.maxPlayers) {
      socket.emit("join_error", { message: "ODA DOLU" });
      return;
    }
    const existingDisconnectedPlayer = room.players.find(
      (p) => p.name === name && p.connected === false
    );
    
    if (existingDisconnectedPlayer) {
      existingDisconnectedPlayer.id = socket.id;
      existingDisconnectedPlayer.connected = true;
    
      socket.join(roomCode);
      socketToRoom[socket.id] = roomCode;
      socket.emit("join_success", { roomCode });
      io.to(roomCode).emit("room_update", room);
      return;
    }
    
    const existingConnectedPlayer = room.players.find(
      (p) => p.name === name && p.connected === true
    );
    
    if (existingConnectedPlayer) {
      socket.emit("join_error", { message: "Bu isim zaten odada kullanılıyor." });
      return;
    }
  
    if (room.gameState !== "LOBBY") {
      socket.emit("join_error", { message: "Oyun başladığı için giriş yapamazsınız." });
      return;
    }
  
    // odadaki kullanılan avatarları al
const usedAvatars = room.players.map(p => p.avatar);

// boşta olan avatarları filtrele
const availableAvatars = avatarPool.filter(a => !usedAvatars.includes(a));

// random seç
const randomAvatar =
  availableAvatars.length > 0
    ? availableAvatars[Math.floor(Math.random() * availableAvatars.length)]
    : avatarPool[0];

// oyuncuyu ekle
room.players.push({
  id: socket.id,
  name,
  avatar: randomAvatar,
  ready: false,
  score: 0,
  roundPoints: 0,
  connected: true,
  vote: null,
  moleVote: null,
  yesNoAnswer: null,
  numberAnswer: null,
});
    
    socket.join(roomCode);
    socketToRoom[socket.id] = roomCode;
    socket.emit("join_success", { roomCode });

    io.to(roomCode).emit("room_update", room);
  
    
  });
  socket.on("kick_player", ({ roomCode, targetId }) => {
    const room = rooms[roomCode];
    if (!room) return;
  
    // sadece host atabilsin
    if (room.host !== socket.id) return;
  
    // host kendini atamasın
    if (targetId === socket.id) return;
  
    const targetPlayer = room.players.find((p) => p.id === targetId);
    if (!targetPlayer) return;
  
    // atılan oyuncuya özel mesaj gönder
    io.to(targetId).emit("kicked_from_room");
  
    // oyuncuyu odadan çıkar
    room.players = room.players.filter((p) => p.id !== targetId);
  
    delete socketToRoom[targetId];
  
    io.to(roomCode).emit("room_update", room);
  });
  socket.on("toggle_ready", ({ roomCode }) => {
    const room = rooms[roomCode];
    if (!room) return;

    const player = room.players.find((p) => p.id === socket.id);
    if (!player) return;

    player.ready = !player.ready;

    io.to(roomCode).emit("room_update", room);
  });

  socket.on("change_avatar", ({ roomCode, direction }) => {
    const room = rooms[roomCode];
    if (!room) return;
  
    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;
  
    const usedAvatars = room.players.map((p) => p.avatar);

    const availableAvatars = avatarPool.filter(
      (a) => !usedAvatars.includes(a) || a === player.avatar
    );

    let currentIndex = availableAvatars.indexOf(player.avatar);

    if (currentIndex === -1) {
      currentIndex = 0;
    }
  
    if (direction === "next") {
      currentIndex =
        currentIndex === availableAvatars.length - 1 ? 0 : currentIndex + 1;
    } else {
      currentIndex =
        currentIndex === 0 ? availableAvatars.length - 1 : currentIndex - 1;
    }
  
    // yeni avatarı ata
    player.avatar = availableAvatars[currentIndex];
  
    // herkese güncel room'u gönder
    io.to(roomCode).emit("room_update", room);
  });

  socket.on("select_player", ({ roomCode, targetId }) => {
    const room = rooms[roomCode];
    if (!room) return;
  
    const player = room.players.find((p) => p.id === socket.id);
    if (!player) return;
  
    player.vote = targetId;
  
    console.log(player.name, "şunu seçti:", targetId);
    io.to(roomCode).emit("room_update", room);
  
  });

  socket.on("start_mole_voting", ({ roomCode }) => {
    const room = rooms[roomCode];
    if (!room) return;
  
    room.gameState = "MOLE_VOTING";
  
    room.players.forEach((player) => {
      player.moleVote = null;
    });
  
    io.to(roomCode).emit("mole_voting_started", room);
    io.to(roomCode).emit("room_update", room);
  });
  
  socket.on("vote_mole", ({ roomCode, targetId }) => {
    const room = rooms[roomCode];
    if (!room) return;
  
    const player = room.players.find((p) => p.id === socket.id);
    if (!player) return;
  
    player.moleVote = targetId;
  
    io.to(roomCode).emit("room_update", room);
  });

  socket.on("submit_yes_no_answer", ({ roomCode, answer }) => {
    const room = rooms[roomCode];
    if (!room) return;
  
    const player = room.players.find((p) => p.id === socket.id);
    if (!player) return;
  
    player.yesNoAnswer = answer;
  
    io.to(roomCode).emit("room_update", room);
  });

  socket.on("submit_number_answer", ({ roomCode, answer }) => {
    const room = rooms[roomCode];
    if (!room) return;
  
    const player = room.players.find((p) => p.id === socket.id);
    if (!player) return;
  
    player.numberAnswer = answer;
  
    io.to(roomCode).emit("room_update", room);
  });

  socket.on("submit_word_hunt_word", ({ roomCode, word }) => {
  const room = rooms[roomCode];
  if (!room || !room.wordHunt) return;

  const currentTurnPlayerId =
    room.wordHunt.turnOrder?.[room.wordHunt.currentTurnIndex];

  const currentTurnPlayer = room.players.find(
    (player) => player.id === currentTurnPlayerId
  );
  if (!currentTurnPlayer) return;

  if (currentTurnPlayer.id !== socket.id) return;

  clearInterval(wordHuntTimers[roomCode]);

  const playerSubmission = room.wordHunt.submissions.find(
    (item) => item.playerId === socket.id
  );

  if (!playerSubmission) return;

  playerSubmission.words.push(word || "");
  room.wordHunt.submittedCount += 1;

  if (room.wordHunt.submittedCount >= room.wordHunt.totalTurns) {
    room.phase = "SHOW_SELECTIONS";
    room.timeLeft = 15;

    io.to(roomCode).emit("room_update", room);

    startCountdown(roomCode, 20, "SHOW_SELECTIONS", (selectionRoom) => {
      startCountdown(roomCode, 40, "MOLE_VOTING", (moleRoom) => {
        const moleId = moleRoom.moleId;

        moleRoom.players.forEach((player) => {
          player.roundPoints = 0;

          if (player.id === moleId) {
            const wrongVotes = moleRoom.players.filter(
              (p) => p.id !== moleId && p.moleVote !== moleId
            ).length;

            player.roundPoints = wrongVotes;
          } else {
            if (player.moleVote === moleId) {
              player.roundPoints = 1;
            }
          }

          player.score = (player.score || 0) + (player.roundPoints || 0);
        });

        moleRoom.players.forEach((p) => {
          p.ready = false;
        });

        moleRoom.phase = "RESULT";
        moleRoom.timeLeft = null;

        io.to(roomCode).emit("room_update", moleRoom);

        io.to(roomCode).emit("all_mole_votes_completed", {
          players: moleRoom.players,
          moleId: moleRoom.moleId,
        });
        if (moleRoom.round >= moleRoom.maxRounds) {
            moleRoom.timeLeft = 5;
            io.to(roomCode).emit("room_update", moleRoom);

            if (countdownTimers[roomCode]) {
              clearInterval(countdownTimers[roomCode]);
              countdownTimers[roomCode] = null;
            }

            countdownTimers[roomCode] = setInterval(() => {
              const finalRoom = rooms[roomCode];
              if (!finalRoom) {
                clearInterval(countdownTimers[roomCode]);
                countdownTimers[roomCode] = null;
                return;
              }

              finalRoom.timeLeft -= 1;
              io.to(roomCode).emit("room_update", finalRoom);

              if (finalRoom.timeLeft <= 0) {
                clearInterval(countdownTimers[roomCode]);
                countdownTimers[roomCode] = null;

                finalRoom.phase = "GAME_OVER";
                finalRoom.timeLeft = null;
                io.to(roomCode).emit("room_update", finalRoom);
              }
            }, 1000);

            return;
          }
       
      });
    });

    return;
  }

  room.wordHunt.currentTurnIndex =
    (room.wordHunt.currentTurnIndex + 1) % room.wordHunt.turnOrder.length;

  io.to(roomCode).emit("room_update", room);
  startWordHuntTimer(roomCode);
});

  socket.on("start_game", ({ roomCode }) => {
    console.log("START_GAME geldi:", roomCode, socket.id);
    
    const room = rooms[roomCode];
    if (!room) return;
  
    const isHost = room.host === socket.id;
    const allReady =
      room.players.length >= 3 && room.players.every((player) => player.ready);
  
    if (!isHost || !allReady) return;
  
    room.gameState = "STARTED";
    room.phase = "START_COUNTDOWN";
    room.timeLeft = 3;
    room.round = 1;

    startCountdown(roomCode, 3, "START_COUNTDOWN", (currentRoom) => {
      currentRoom.players.forEach((p) => {
        p.vote = null;
        p.moleVote = null;
        p.roundPoints = 0;
        p.ready = false;
        p.yesNoAnswer = null;
        p.numberAnswer = null;
        
      });
  const randomIndex = Math.floor(Math.random() * currentRoom.players.length);
  const molePlayer = currentRoom.players[randomIndex];

  currentRoom.moleId = molePlayer.id;
  const selectedQuestion = getRandomQuestion(currentRoom.gameCategory);
  console.log("GAME CATEGORY:", currentRoom.gameCategory);
  console.log("SELECTED QUESTION CATEGORY:", selectedQuestion.category);
  console.log("SELECTED QUESTION TEXT:", selectedQuestion.text);

  currentRoom.currentQuestion = selectedQuestion;
  currentRoom.currentQuestionType = selectedQuestion.type;
  
  if (selectedQuestion.category === "kelime_avi") {
    currentRoom.wordHunt = createWordHuntState(currentRoom);
    currentRoom.timeLeft = currentRoom.wordHunt.timePerTurn;
    console.log("WORD HUNT STATE:", currentRoom.wordHunt);
    currentRoom.phase = "WORD_HUNT";
    startWordHuntTimer(roomCode);
  } else {
    currentRoom.wordHunt = null;
    currentRoom.phase = "QUESTION";
  }

  io.to(roomCode).emit("game_started", currentRoom);

  if (selectedQuestion.category === "kelime_avi") {
    io.to(roomCode).emit("room_update", currentRoom);
  } else {
    runNormalRoundFlow(roomCode);
  }
});

console.log("Game started in room:", roomCode);
  });
  socket.on("toggle_result_ready", ({ roomCode }) => {
    const room = rooms[roomCode];
    if (!room) return;
  
    const player = room.players.find((p) => p.id === socket.id);
    if (!player) return;
  
    player.ready = !player.ready;
  
    io.to(roomCode).emit("room_update", room);
  
    const allReady =
      room.players.length >= 3 && room.players.every((p) => p.ready);
  
    if (room.phase === "RESULT" && allReady) {
  if (room.round >= room.maxRounds) {
    room.phase = "GAME_OVER";
    room.timeLeft = null;
    io.to(roomCode).emit("room_update", room);
    return;
  }

  room.phase = "STARTING_NEXT_ROUND";
  room.phase = "STARTING_NEXT_ROUND";
    io.to(roomCode).emit("room_update", room);
    room.round += 1;
  
      room.players.forEach((p) => {
        p.vote = null;
        p.moleVote = null;
        p.roundPoints = 0;
        p.ready = false;
        p.yesNoAnswer = null;
        p.numberAnswer = null;
      });
  
      startCountdown(roomCode, 5, "START_COUNTDOWN", (currentRoom) => {
        const randomIndex = Math.floor(Math.random() * currentRoom.players.length);
        const molePlayer = currentRoom.players[randomIndex];
  
        currentRoom.moleId = molePlayer.id;
        const selectedQuestion = getRandomQuestion(currentRoom.gameCategory);
  
        currentRoom.currentQuestion = selectedQuestion;
        currentRoom.currentQuestionType = selectedQuestion.type;
  
        if (selectedQuestion.category === "kelime_avi") {
          currentRoom.wordHunt = createWordHuntState(currentRoom);
          currentRoom.timeLeft = currentRoom.wordHunt.timePerTurn;
          console.log("WORD HUNT STATE:", currentRoom.wordHunt);
          currentRoom.phase = "WORD_HUNT";
  
          io.to(roomCode).emit("game_started", currentRoom);
          io.to(roomCode).emit("room_update", currentRoom);
          startWordHuntTimer(roomCode);
        } else {
            currentRoom.wordHunt = null;
            io.to(roomCode).emit("game_started", currentRoom);
            runNormalRoundFlow(roomCode);
          }
      });
    }
  });
});
const PORT = process.env.PORT || 3001;

server.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});