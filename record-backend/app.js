// app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const path = require('path');

// 환경 변수 로드
dotenv.config();

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 일기 분석 API 엔드포인트
app.post('/api/analyze-diary', async (req, res) => {
  try {
    const { diaryText } = req.body;
    
    // 입력 검증
    if (!diaryText) {
      return res.status(400).json({ error: "일기 내용이 필요합니다." });
    }
    
    // 일기 형식이 아닌 경우 처리
    if (diaryText.length < 10) {
      return res.status(400).json({ error: "please input diary format" });
    }
    
    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `
            당신은 일기 분석 전문가입니다. 다음 일기를 분석하여 JSON 형식으로 결과를 반환하세요:
            1. keyword: 일기에서 중요한 3-5개의 키워드를 추출하세요.
            2. summery: 아침, 오후, 밤으로 나누어 각각 1-2문장으로 요약하세요.
            3. question: 일기 내용과 관련된 의미 있는 질문을 하나 생성하세요.
            4. feelings: 일기에서 느껴지는 주요 감정과 그 이유를 설명하세요.
            예시:
            {
  "keywords": ["공원", "강아지", "산책", "친구", "프로젝트"],
  "summary": {
    "morning": "공원에서 강아지와 함께 산책을 하며 좋은 날씨를 즐겼다.",
    "afternoon": "오랜 친구를 만나 새로운 프로젝트에 대해 이야기를 나눴다.",
    "night": "집에 돌아와 하루 동안 있었던 일을 생각하며 마무리했다."
  },
  "question": "새로운 프로젝트를 어떻게 발전시켜 나갈 계획인가요?",
  "feeling": {
    "emotion": "행복",
    "reason": "좋은 날씨와 강아지와의 산책, 친구와의 만남 등 즐거운 활동들로 가득 찬 하루였기 때문에 행복한 감정이 느껴집니다."
  }
}
          `
        },
        {
          role: "user",
          content: diaryText
        }
      ],
      response_format: { type: "json_object" }
    });
    
    // 응답 처리
    const result = JSON.parse(completion.choices[0].message.content);
    res.json(result);
    
  } catch (error) {
    console.error('Error analyzing diary:', error);
    res.status(500).json({ error: "일기 분석 중 오류가 발생했습니다." });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
