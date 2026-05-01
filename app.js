const introPanel = document.getElementById("introPanel");
const gamePanel = document.getElementById("gamePanel");
const resultPanel = document.getElementById("resultPanel");
const nameForm = document.getElementById("nameForm");
const playerNameInput = document.getElementById("playerName");
const phoneNumber = document.getElementById("phoneNumber");
const chatArea = document.getElementById("chatArea");
const quizCount = document.getElementById("quizCount");
const nextButton = document.getElementById("nextButton");
const resultName = document.getElementById("resultName");
const scoreValue = document.getElementById("scoreValue");
const resultSummary = document.getElementById("resultSummary");
const lessonList = document.getElementById("lessonList");
const restartButton = document.getElementById("restartButton");

let playerName = "";
let currentIndex = 0;
let score = 0;
let answered = false;
let selectedLessons = [];
let selectedResults = [];
let activeLinkButton = null;
let scenarioStartTime = null;
const fallbackTimeLabel = "9:45 AM";

const scenarioTemplates = [
  {
    title: "문제 1",
    number: "070-XXXX-9876",
    setup: [
      { side: "incoming", text: "이 링크 누르면\n게임 아이템 줄게!", timeOffset: 0 },
      { side: "incoming", text: "http://rpdla/fh.com", timeOffset: 0 },
    ],
    interaction: {
      options: [
        {
          label: "모르는 링크는 누르면 안 돼!",
          correct: true,
          resultText: "잘했어요! 이상한 링크는 누르지 않는 게 안전해요.",
          lesson: "공짜 선물이나 게임 아이템을 준다며 링크를 보내도 바로 누르지 않기.",
          followUp: [
            { side: "outgoing", text: "모르는 링크는 누르면 안 돼!", timeOffset: 1 },
            { side: "incoming", text: "에이, 아쉽네...", timeOffset: 2 },
          ],
        },
      ],
    },
    riskyLinkFlow: {
      resultText: "조심! 수상한 링크를 누르면 내 정보가 새어 나갈 수 있어요.",
      lesson: "모르는 링크를 누르면 아이디나 비밀번호 같은 정보가 위험해질 수 있어요.",
      form: {
        title: "게임 아이템을 받을\n아이디와 비밀번호를 입력해 주세요",
        idLabel: "아이디",
        passwordLabel: "비밀번호",
        submitLabel: "게임 아이템 받기",
      },
      preAppendedFirstMessage: false,
      followUp: [
        { side: "incoming", text: "아이디:{idValue}\n비밀번호:{passwordValue}", timeOffset: 3 },
        { side: "outgoing", text: "어? 이거 내 아이디 비밀번호인데!", timeOffset: 3 },
      ],
    },
  },
  {
    title: "문제 2",
    number: "010-XXXX-1234",
    setup: [
      { side: "incoming", text: "안녕 {nameSubject} 맞니?", timeOffset: 0 },
      { side: "outgoing", text: "네! 누구세요?", timeOffset: 1 },
      { side: "incoming", text: "엄마 친구야~~\n{nameSubject} 집이 어디니?", timeOffset: 2 },
    ],
    interaction: {
      title: "보내고 싶은 답장",
      copy: "하나를 골라 보세요",
      options: [
        {
          label: "엄마한테 먼저 물어볼게요!",
          correct: true,
          resultText: "잘했어요! 모르는 사람이 물으면 부모님께 먼저 물어봐야 해요.",
          lesson: "집 주소, 학교, 전화번호 같은 개인정보는 부모님 확인 없이 보내지 않기.",
          followUp: [
            { side: "outgoing", text: "엄마한테 먼저 물어볼게요!", timeOffset: 3 },
            { side: "incoming", text: "...", timeOffset: 3 },
          ],
        },
        {
          label: "엄마 친구니까 알려드릴게요!",
          correct: false,
          resultText: "조심! 집 주소는 아주 중요한 개인정보예요.",
          lesson: "친한 어른인 척해도 바로 믿지 말고, 부모님께 확인 후 보내기.",
          followUp: [
            { side: "outgoing", text: "행복동 햇살아파트\n103동 105호에요!", timeOffset: 3 },
            { side: "incoming", text: "이따 갈테니까\n문좀 열어주렴!", timeOffset: 4 },
          ],
        },
      ],
    },
  },
  {
    title: "문제 3",
    number: "053-XXXX-1234",
    setup: [
      {
        side: "incoming",
        text: "[web발신] {name}님\n26년 민생지원금 신청\n>> [MONEY.com] <<\n1인 최고 1000만원\n접수 마감 임박!!",
        timeOffset: 0,
      },
    ],
    interaction: {
      copy: "하나를 골라 보세요",
      options: [
        {
          label: "링크를 눌러서\n신청해 볼래요!",
          correct: false,
          resultText: "조심! 개인정보를 넣으면 다른 사람에게 넘어갈 수 있어요.",
          lesson: "개인정보를 수상한 링크에 바로 넣으면 안 돼요!",
          form: {
            title: "민생지원금 신청",
            idLabel: "이름",
            passwordLabel: "학교",
            submitLabel: "신청하기",
          },
          preAppendedFirstMessage: false,
          followUp: [
            // 이름 뒤에 조사 없이 '님'만 붙이도록 {name} 사용
            { side: "incoming", text: "{passwordValue} {name}님 광고 수신 동의 되었습니다.", timeOffset: 2 },
            { side: "outgoing", text: "난 이런거 동의 한 적 없는데?", timeOffset: 3 },
          ],
        },
        {
          label: "부모님께 먼저\n물어볼래요!",
          correct: true,
          resultText: "잘했어요! 돈을 준다는 문자는 꼭 다시 확인해야 해요.",
          lesson: "돈을 준다거나 마감이 임박했다고 재촉하는 문자는 부모님과 먼저 확인하기.",
          followUp: [
            { side: "outgoing", text: "부모님께 먼저 물어볼래요!", timeOffset: 2 },
            { side: "incoming", text: "좋은 생각이야!", timeOffset: 2 },
          ],
        },
      ],
    },
  },
];

function fillTemplate(text) {
  const safeName = playerName || "OO";
  const familyName = safeName.charAt(0);
  return text
    .replaceAll("{name}", safeName)
    .replaceAll("{familyName}", familyName || "김")
    .replaceAll("{nameSubject}", getNameWithSubjectParticle(safeName));
}

function fillOptionTemplate(text, values = {}) {
  return fillTemplate(text)
    .replaceAll("{idValue}", values.idValue || "")
    .replaceAll("{passwordValue}", values.passwordValue || "");
}

function getNameWithSubjectParticle(name) {
  const safeName = (name || "OO").trim();
  if (!safeName) return "OO";

  // 이미 조사 '이' 또는 '가'로 끝나면 중복 붙이지 않음
  const lastCharRaw = safeName.charAt(safeName.length - 1);
  if (lastCharRaw === "이" || lastCharRaw === "가") return safeName;

  const lastChar = lastCharRaw;
  const code = lastChar.charCodeAt(0);

  // 한글 음절 범위를 벗어나면 기본적으로 '이'를 붙임
  if (code < 0xac00 || code > 0xd7a3) {
    // 한글이 아니면 조사 붙이지 않음
    return safeName;
  }

  const hasBatchim = (code - 0xac00) % 28 !== 0;
  // 받침이 있으면 '이'를 붙이고, 없으면 조사 없이 이름만 반환
  return hasBatchim ? `${safeName}이` : safeName;
}

function formatScenarioTime(offsetMinutes = 0) {
  try {
    const base = scenarioStartTime ? new Date(scenarioStartTime) : new Date();
    if (Number.isNaN(base.getTime())) {
      return fallbackTimeLabel;
    }

    base.setMinutes(base.getMinutes() + offsetMinutes);
    return base.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return fallbackTimeLabel;
  }
}

function createMessageElement(message) {
  const wrapper = document.createElement("div");
  wrapper.className = `message-block ${message.side}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  const text = fillTemplate(message.text);
  bubble.textContent = text;
  wrapper.appendChild(bubble);

  if (message.time) {
    const time = document.createElement("div");
    time.className = "time";
    time.textContent = message.time;
    wrapper.appendChild(time);
  } else if (typeof message.timeOffset === "number") {
    const time = document.createElement("div");
    time.className = "time";
    time.textContent = formatScenarioTime(message.timeOffset);
    wrapper.appendChild(time);
  }

  return wrapper;
}

function appendSystemLesson(text) {
  chatArea.appendChild(
    createMessageElement({
      side: "system",
      text,
    }),
  );
}

function appendFirstProblemChoices(scenario) {
  const safeOption = scenario.interaction.options[0];
  const riskyOption = scenario.riskyLinkFlow;

  const wrapper = document.createElement("div");
  wrapper.className = "message-block incoming";

  const box = document.createElement("div");
  box.className = "link-choice-box";

  const arrow = document.createElement("div");
  arrow.className = "link-choice-arrow";
  arrow.textContent = "↳ 하나를 골라 보세요";

  const list = document.createElement("div");
  list.className = "link-choice-list";

  const clickButton = document.createElement("button");
  clickButton.type = "button";
  clickButton.className = "link-choice-button risky";
  clickButton.textContent = "1. 링크를 누른다";

  const safeButton = document.createElement("button");
  safeButton.type = "button";
  safeButton.className = "link-choice-button safe";
  safeButton.textContent = "2. 모르는 링크는 누르지 않는다";

  // 선택 버튼 비활성화 로직은 클릭 후 개별 처리하므로 중복 정의 제거

  clickButton.addEventListener("click", () => {
    if (answered) {
      return;
    }

    answered = true;
    activeLinkButton = clickButton;
    arrow.remove();
    list.remove();
    appendCredentialForm(riskyOption, null, null, null);
  });

  safeButton.addEventListener("click", () => {
    if (answered) {
      return;
    }

    answered = true;
    activeLinkButton = safeButton;
    arrow.remove();
    list.remove();
    finishOptionFlow(safeOption, null, null, null);
  });

  list.append(clickButton, safeButton);
  box.append(arrow, list);
  wrapper.appendChild(box);
  chatArea.appendChild(wrapper);
}

function appendInlineChoices(scenario) {
  const wrapper = document.createElement("div");
  wrapper.className = "message-block incoming";

  const box = document.createElement("div");
  box.className = "link-choice-box";

  const arrow = document.createElement("div");
  arrow.className = "link-choice-arrow";
  const copyText = scenario.interaction && scenario.interaction.copy ? scenario.interaction.copy : "하나를 선택해 주세요.";
  arrow.textContent = `↳ ${copyText}`;

  const list = document.createElement("div");
  list.className = "link-choice-list";

  scenario.interaction.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `link-choice-button ${option.correct ? "safe" : "risky"}`;
    button.textContent = `${index + 1}. ${fillTemplate(option.label)}`;

    button.addEventListener("click", () => {
      if (answered) {
        return;
      }

      answered = true;
      activeLinkButton = button;
      arrow.remove();
      list.remove();
      if (option.form) {
        appendCredentialForm(option, null, null, null);
        return;
      }
      finishOptionFlow(option, null, null, null);
    });

    list.appendChild(button);
  });

  box.append(arrow, list);
  wrapper.appendChild(box);
  chatArea.appendChild(wrapper);
}

function appendCredentialForm(option, status, targets, selectedButton) {
  const form = document.createElement("form");
  form.className = "credential-form";

  const title = document.createElement("div");
  title.className = "interaction-title";
  title.textContent = option.form.title;

  const idLabel = document.createElement("label");
  idLabel.textContent = option.form.idLabel;

  const idInput = document.createElement("input");
  idInput.type = "text";
  idInput.required = true;
  idInput.placeholder = "아이디를 입력하세요";
  // 문제 1에서는 자동으로 이름을 채우지 않도록 빈값으로 둡니다
  idInput.value = currentIndex === 0 ? "" : playerName;
  // 문제 1에서는 아이디를 사용자가 수정할 수 있도록 허용
  if (currentIndex === 0) {
    idInput.readOnly = false;
    idInput.classList.remove("prefilled");
  } else {
    idInput.readOnly = true;
    idInput.classList.add("prefilled");
  }

  const pwLabel = document.createElement("label");
  pwLabel.textContent = option.form.passwordLabel;

  const pwInput = document.createElement("input");
  // 문제 1에서는 비밀번호를 마스킹 처리
  pwInput.type = currentIndex === 0 ? "password" : "text";
  pwInput.required = true;
  // 문제 3의 플레이스홀더가 문제 1과 연동되지 않도록 분리
  pwInput.placeholder = currentIndex === 2 ? "예)행복초등학교" : "비밀번호를 입력하세요";

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.textContent = option.form.submitLabel;

  form.append(title, idLabel, idInput, pwLabel, pwInput, submit);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const idValue = idInput.value.trim();
    const pwValue = pwInput.value.trim();

    if (!idValue || !pwValue) {
      return;
    }

    form.remove();
    finishOptionFlow(option, status, targets, selectedButton, {
      idValue,
      passwordValue: pwValue,
    });
  });

  chatArea.appendChild(form);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function finishOptionFlow(option, status, targets, selectedButton, values = {}) {
  const messages =
    option.form && option.preAppendedFirstMessage !== false ? option.followUp.slice(1) : option.followUp;
  messages.forEach((message) => {
    chatArea.appendChild(
      createMessageElement({
        ...message,
        text: fillOptionTemplate(message.text, values),
      }),
    );
  });

  // 결과 박스를 각 문제 페이지에 즉시 표시
  const resultBox = document.createElement("div");
  resultBox.className = `result-box ${option.correct ? "correct" : "wrong"}`;
  resultBox.textContent = option.resultText || "";
  chatArea.appendChild(resultBox);

  appendSystemLesson(option.lesson);
  selectedLessons[currentIndex] = option.lesson;
  selectedResults[currentIndex] = { text: option.resultText || "", correct: !!option.correct };

  if (option.correct) {
    score += 1;
  }

  if (targets) {
    Array.from(targets.children).forEach((item) => {
      item.disabled = true;
      if (item !== selectedButton) {
        item.classList.remove("correct", "wrong");
      }
    });
  }

  if (activeLinkButton) {
    activeLinkButton.disabled = true;
    activeLinkButton = null;
  }
  nextButton.classList.remove("hidden");
  // 레이아웃 변경(메시지/결과 박스 추가) 이후 안전하게 아래로 스크롤
  // setTimeout을 사용해 브라우저가 레이아웃을 반영한 뒤 스크롤합니다.
  setTimeout(() => {
    try {
      chatArea.scrollTop = chatArea.scrollHeight;
    } catch (e) {
      /* 무시 */
    }
  }, 60);
}

function showPanel(panel) {
  [introPanel, gamePanel, resultPanel].forEach((item) => item.classList.add("hidden"));
  panel.classList.remove("hidden");
}

function renderScenario() {
  const scenario = scenarioTemplates[currentIndex];
  answered = false;
  activeLinkButton = null;
  scenarioStartTime = new Date();

  quizCount.textContent = scenario.title;
  phoneNumber.textContent = scenario.number;
  chatArea.innerHTML = "";
  nextButton.classList.add("hidden");

  scenario.setup.forEach((message) => {
    chatArea.appendChild(createMessageElement(message));
  });

  if (currentIndex === 0) {
    appendFirstProblemChoices(scenario);
    return;
  }

  appendInlineChoices(scenario);
}

function showResult() {
  resultName.textContent = playerName;
  scoreValue.textContent = score;
  resultSummary.textContent =
    score === scenarioTemplates.length
      ? "모든 문제에서 안전한 답장을 잘 골랐어요."
      : `${scenarioTemplates.length}문제 중 ${score}문제를 맞혔어요. 아래 교훈을 다시 읽어 보세요.`;

  if (lessonList) {
    lessonList.innerHTML = "";
    selectedLessons.forEach((lesson) => {
      const item = document.createElement("li");
      item.textContent = lesson;
      lessonList.appendChild(item);
    });
  }

  showPanel(resultPanel);
}

nameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  playerName = playerNameInput.value.trim();

  if (!playerName) {
    playerNameInput.focus();
    return;
  }

  currentIndex = 0;
  score = 0;
  selectedLessons = [];
  showPanel(gamePanel);
  renderScenario();
});

nextButton.addEventListener("click", () => {
  currentIndex += 1;

  if (currentIndex >= scenarioTemplates.length) {
    showResult();
    return;
  }

  renderScenario();
});

restartButton.addEventListener("click", () => {
  // 다음 학생이 바로 실습할 수 있도록 이전 입력된 이름 삭제
  playerName = "";
  playerNameInput.value = "";
  showPanel(introPanel);
  playerNameInput.focus();
});
