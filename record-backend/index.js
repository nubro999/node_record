// index.js 파일 내에 직접 추가

const express = require('express');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const path = require('path');

dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

// 정적 파일 제공 설정 - path.join() 사용으로 변경
app.use(express.static(path.join(__dirname, 'public')));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 일기 분석 API 엔드포인트를 간단한 챗봇으로 수정
app.post('/api/analyze-diary', async (req, res) => {
  try {
    const { diaryText } = req.body;
    
    if (!diaryText) {
      return res.status(400).json({ error: '일기 내용이 필요합니다' });
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "당신은 친절한 일기 챗봇입니다. 사용자의 일기에 공감하고 따뜻한 응답을 제공해주세요."
        },
        {
          role: "user",
          content: diaryText
        }
      ]
    });
    
    // 응답이 undefined인지 확인
    if (!response || !response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error('OpenAI API 응답이 예상 형식이 아닙니다');
    }
    
    // 단순한 텍스트 응답 반환
    res.json({ 
      message: response.choices[0].message.content 
    });
  } catch (error) {
    console.error('API 요청 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다', details: error.message });
  }
});

// 루트 경로 처리 추가
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다`);
});

