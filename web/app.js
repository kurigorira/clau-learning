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

function currentLevelObj() {
  return window.QUIZ_DATA[state.levelIndex];
}

function currentLevel() {
  return currentLevelObj().level;
}

function currentQuestion() {
  return currentLevelObj().questions[state.questionIndex];
}

function levelToCharacter(lv) {
  if (lv <= 10) return "🥚";
  if (lv <= 25) return "🐣";
  if (lv <= 40) return "🧙";
  if (lv <= 60) return "🧠";
  if (lv <= 80) return "🦉";
  return "👑";
}

function flashLogoOnCorrect() {
  const logo = document.querySelector(".logo-main");
  if (!logo) return;
  logo.classList.remove("flash-correct");
  void logo.offsetWidth; // 再描画でアニメーション再発火
  logo.classList.add("flash-correct");
}

function render() {
  const lv = currentLevel();
  const rate = state.solvedToday === 0
    ? 0
    : Math.round((state.correctToday / state.solvedToday) * 100);

  document.getElementById("status").innerHTML = `
    <span class="pill">学習者: ${state.student.name}</span>
    <span class="pill">現在Lv: ${lv}</span>
    <p>解答数: <b>${state.solvedToday}</b>問 / 正答: <b>${state.correctToday}</b>問 / 正答率: <b>${rate}%</b></p>
  `;

  const bar = document.getElementById("levelBar");
  const pct = Math.min((lv / 100) * 100, 100);
  bar.style.width = `${pct}%`;

  document.getElementById("character").textContent = levelToCharacter(lv);

  const q = currentQuestion();
  document.getElementById("qTitle").textContent = `Lv${lv} 問題`;
  document.getElementById("question").textContent = q.question;

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";
  q.choices.forEach((choice, idx) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = `${idx + 1}. ${choice}`;
    btn.onclick = () => answer(idx);
    choicesDiv.appendChild(btn);
  });

  document.getElementById("result").textContent = "";
  document.getElementById("result").className = "result";
  document.getElementById("explanation").textContent = "";
}

function nextQuestionOnCorrect() {
  state.questionIndex++;
  if (state.questionIndex >= currentLevelObj().questions.length) {
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
    level: currentLevel(),
    qid: q.id,
    selectedIndex: selectedIdx,
    correct: isCorrect
  });

  const resultEl = document.getElementById("result");
  resultEl.className = `result ${isCorrect ? "ok" : "ng"}`;
  resultEl.textContent = isCorrect ? "✅ 正解！次へ進みます。" : "❌ 不正解。もう一度考えてみよう。";
  document.getElementById("explanation").textContent = q.explanation;

  if (isCorrect) {
    flashLogoOnCorrect();
    nextQuestionOnCorrect();
    setTimeout(render, 700);
  }
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
    currentLevel: currentLevel()
  });

  alert("学習記録を保存しました。おつかれさま！");
}

async function init() {
  await initAuth();

  if (!auth.currentUser) {
    alert("認証に失敗しました。ページを再読み込みしてください。");
    return;
  }

  state.student.id = auth.currentUser.uid;
  state.startedAt = nowISO();

  document.getElementById("endBtn").onclick = endSession;
  document.getElementById("reloadBtn").onclick = () => render();

  render();
}

init();