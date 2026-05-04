import { auth, initAuth, saveAnswerEvent, saveSessionSummary } from "./firebase-init.js";

const STORAGE_KEY = "mathmatics_progress_v1";

const state = {
  startedAt: null,
  levelIndex: 0,
  questionIndex: 0,
  solvedToday: 0,
  correctToday: 0,
  completed: false,
  student: {
    id: null,
    name: "栗原才弥"
  }
};

function nowISO() {
  return new Date().toISOString();
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function getMaxLevelIndex() {
  return window.QUIZ_DATA.length - 1;
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
  void logo.offsetWidth;
  logo.classList.add("flash-correct");
}

/** ローカル保存 */
function saveProgressLocal() {
  const payload = {
    startedAt: state.startedAt,
    levelIndex: state.levelIndex,
    questionIndex: state.questionIndex,
    solvedToday: state.solvedToday,
    correctToday: state.correctToday,
    completed: state.completed,
    studentName: state.student.name,
    savedAt: nowISO()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

/** ローカル復元 */
function loadProgressLocal() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  try {
    const p = JSON.parse(raw);
    state.startedAt = p.startedAt || nowISO();
    state.levelIndex = clamp(Number(p.levelIndex ?? 0), 0, getMaxLevelIndex());
    state.questionIndex = clamp(
      Number(p.questionIndex ?? 0),
      0,
      currentLevelObj().questions.length - 1
    );
    state.solvedToday = Number(p.solvedToday ?? 0);
    state.correctToday = Number(p.correctToday ?? 0);
    state.completed = !!p.completed;
    if (p.studentName) state.student.name = p.studentName;
    return true;
  } catch {
    return false;
  }
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

  const qTitle = document.getElementById("qTitle");
  const qBox = document.getElementById("question");
  const choicesDiv = document.getElementById("choices");
  const resultEl = document.getElementById("result");
  const expEl = document.getElementById("explanation");

  if (state.completed) {
    qTitle.textContent = "クリア！";
    qBox.textContent = "すべての問題を解き終えました。すごい！";
    choicesDiv.innerHTML = "";
    resultEl.className = "result ok";
    resultEl.textContent = "🎉 全レベル完了";
    expEl.textContent = "「問題を更新」で表示を更新するか、必要なら新しい問題を追加してください。";
    return;
  }

  const q = currentQuestion();
  qTitle.textContent = `Lv${lv} 問題`;
  qBox.textContent = q.question;

  choicesDiv.innerHTML = "";
  q.choices.forEach((choice, idx) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = `${idx + 1}. ${choice}`;
    btn.onclick = () => answer(idx);
    choicesDiv.appendChild(btn);
  });

  resultEl.textContent = "";
  resultEl.className = "result";
  expEl.textContent = "";
}

/** 正解時に次へ。最後なら completed=true */
function moveNextIfCorrect() {
  const levelObj = currentLevelObj();
  const isLastQuestionInLevel = state.questionIndex >= levelObj.questions.length - 1;
  const isLastLevel = state.levelIndex >= getMaxLevelIndex();

  if (!isLastQuestionInLevel) {
    state.questionIndex += 1;
    return;
  }

  if (!isLastLevel) {
    state.levelIndex += 1;
    state.questionIndex = 0;
    return;
  }

  // 最後のレベル最後の問題を正解した
  state.completed = true;
}

async function answer(selectedIdx) {
  if (state.completed) return;

  const q = currentQuestion();
  const isCorrect = selectedIdx === q.answer_index;

  state.solvedToday++;
  if (isCorrect) state.correctToday++;

  // 1問ごとに記録
  try {
    await saveAnswerEvent({
      studentId: state.student.id,
      level: currentLevel(),
      qid: q.id,
      selectedIndex: selectedIdx,
      correct: isCorrect
    });
  } catch (e) {
    console.warn("saveAnswerEvent failed:", e);
  }

  const resultEl = document.getElementById("result");
  resultEl.className = `result ${isCorrect ? "ok" : "ng"}`;
  resultEl.textContent = isCorrect ? "✅ 正解！次へ進みます。" : "❌ 不正解。もう一度考えてみよう。";
  document.getElementById("explanation").textContent = q.explanation;

  if (isCorrect) {
    flashLogoOnCorrect();
    moveNextIfCorrect();
  }

  // 正誤に関係なく毎回保存
  saveProgressLocal();

  if (isCorrect) {
    setTimeout(render, 500);
  }
}

async function endSession() {
  const endedAt = nowISO();

  // セッション要約
  try {
    await saveSessionSummary({
      studentId: state.student.id,
      studentName: state.student.name,
      startedAt: state.startedAt,
      endedAt,
      solved: state.solvedToday,
      correct: state.correctToday,
      currentLevel: currentLevel()
    });
  } catch (e) {
    console.warn("saveSessionSummary failed:", e);
  }

  saveProgressLocal();
  alert("学習記録を保存しました。おつかれさま！");
}

async function init() {
  await initAuth();

  if (!auth.currentUser) {
    alert("認証に失敗しました。ページを再読み込みしてください。");
    return;
  }

  state.student.id = auth.currentUser.uid;

  const restored = loadProgressLocal();
  if (!restored) {
    state.startedAt = nowISO();
    saveProgressLocal();
  }

  document.getElementById("endBtn").onclick = endSession;
  document.getElementById("reloadBtn").onclick = render;

  render();
}

init();