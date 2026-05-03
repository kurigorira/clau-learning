import { auth, initAuth, saveAnswerEvent, saveSessionSummary } from "./firebase-init.js";

const state = {
  startedAt: null,
  levelIndex: 0,
  questionIndex: 0,
  solvedToday: 0,
  correctToday: 0,
  student: {
    id: null,         // auth.uid
    name: "栗原才弥"
  }
};

function nowISO() {
  return new Date().toISOString();
}
function currentLevel() {
  return window.QUIZ_DATA[state.levelIndex];
}
function currentQuestion() {
  return currentLevel().questions[state.questionIndex];
}

function render() {
  const lv = currentLevel().level;
  const rate = state.solvedToday === 0 ? 0 : Math.round((state.correctToday / state.solvedToday) * 100);

  document.getElementById("status").textContent =
    `${state.student.name} / Lv${lv} / 解答 ${state.solvedToday}問 / 正答 ${state.correctToday}問 / 正答率 ${rate}%`;

  const q = currentQuestion();
  document.getElementById("qTitle").textContent = `Lv${lv}`;
  document.getElementById("question").textContent = q.question;

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";
  q.choices.forEach((choice, idx) => {
    const btn = document.createElement("button");
    btn.textContent = `${idx + 1}. ${choice}`;
    btn.onclick = () => answer(idx);
    choicesDiv.appendChild(btn);
  });
}

function moveNextIfCorrect() {
  state.questionIndex++;
  if (state.questionIndex >= currentLevel().questions.length) {
    state.levelIndex = Math.min(state.levelIndex + 1, window.QUIZ_DATA.length - 1);
    state.questionIndex = 0;
  }
}

async function answer(selectedIdx) {
  const q = currentQuestion();
  const isCorrect = selectedIdx === q.answer_index;

  state.solvedToday++;
  if (isCorrect) state.correctToday++;

  await saveAnswerEvent({
    studentId: state.student.id,
    level: currentLevel().level,
    qid: q.id,
    selectedIndex: selectedIdx,
    correct: isCorrect
  });

  document.getElementById("result").textContent = isCorrect ? "正解！" : "不正解、もう一度！";
  document.getElementById("explanation").textContent = q.explanation;

  if (isCorrect) moveNextIfCorrect();
  setTimeout(render, 350);
}

async function endSession() {
  const endedAt = nowISO();
  await saveSessionSummary({
    studentId: state.student.id,
    studentName: state.student.name,
    startedAt: state.startedAt,
    endedAt,
    solved: state.solvedToday,
    correct: state.correctToday,
    currentLevel: currentLevel().level
  });
  alert("学習記録を保存しました。");
}

async function init() {
  await initAuth();
  if (!auth.currentUser) {
    alert("認証に失敗しました。再読み込みしてください。");
    return;
  }
  state.student.id = auth.currentUser.uid;
  state.startedAt = nowISO();
  render();
  document.getElementById("endBtn").onclick = endSession;
}
init();