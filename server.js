const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');
const { spawn } = require('child_process');
const app = express();

// CORS 및 정적 파일 설정
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// 뉴스 캐시 및 업데이트 시간 설정
let newsCache = [];
let lastUpdate = null;

// 뉴스 스크래핑 함수
async function scrapeWired() {
    try {
        const response = await axios.get('https://www.wired.com/category/science/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        const $ = cheerio.load(response.data);
        const articles = [];

        $('.summary-item').each((i, element) => {
            const title = $(element).find('.summary-item__hed').text().trim();
            const summary = $(element).find('.summary-item__dek').text().trim();
            const link = 'https://www.wired.com' + ($(element).find('a').attr('href') || '');
            
            if (title && summary) {
                articles.push({
                    title,
                    summary,
                    link
                });
            }
        });

        return articles;
    } catch (error) {
        console.error('Scraping error:', error);
        throw error;
    }
}

// 뉴스 API 엔드포인트
app.get('/api/news', async (req, res) => {
    try {
        const now = new Date();
        
        // 캐시가 없거나 1시간이 지났으면 새로운 데이터 가져오기
        if (!lastUpdate || now - lastUpdate > 3600000) {
            const articles = await scrapeWired();
            
            if (articles.length === 0) {
                throw new Error('No articles found');
            }

            newsCache = articles;
            lastUpdate = now;
        }

        res.json(newsCache);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch news',
            details: error.message
        });
    }
});

// 주가 예측 API 엔드포인트
app.get('/api/stock-prediction', (req, res) => {
    console.log('주가 예측 API 호출됨');
    
    const python = spawn('python', ['stock_prediction.py']);
    let dataString = '';
    
    python.stdout.on('data', (data) => {
        console.log('Python 출력:', data.toString());
        dataString += data.toString();
    });
    
    python.stderr.on('data', (data) => {
        console.error('Python 에러:', data.toString());
    });
    
    python.on('close', (code) => {
        console.log('Python 프로세스 종료. 코드:', code);
        try {
            const result = JSON.parse(dataString);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: '데이터 처리 실패' });
        }
    });
});

// HTML 파일 라우팅
app.get('/', (req, res) => {
    res.send('서버가 정상적으로 동작중입니다.');
});

app.get('/useful-sites', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'useful-sites.html'));
});

app.get('/stock-prediction', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'stock-prediction.html'));
});

// 서버 시작
const PORT = 3000;
try {
    app.listen(PORT, () => {
        console.log('=================================');
        console.log(`서버가 포트 ${PORT}에서 실행중입니다`);
        console.log(`http://localhost:${PORT} 에서 확인하세요`);
        console.log('=================================');
    });
} catch (error) {
    console.error('서버 시작 실패:', error);
} 