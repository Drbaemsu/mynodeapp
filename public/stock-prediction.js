async function fetchPrediction() {
    const container = document.getElementById('predictionContainer');
    
    // 로딩 표시
    container.innerHTML = `
        <div class="prediction-card">
            <div class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3">예측 데이터를 가져오는 중...</p>
            </div>
        </div>
    `;

    try {
        const response = await fetch('/api/stock-prediction');
        const data = await response.json();
        
        // 디버깅을 위한 로그
        console.log('Received data:', data);

        // 데이터 검증
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid data received');
        }

        // 데이터 표시
        container.innerHTML = generatePredictionHTML(data);

    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = generateErrorHTML(error.message);
    }
}

function formatNumber(value) {
    // 숫자가 아니거나 undefined인 경우 0 반환
    const num = Number(value);
    return isNaN(num) ? 0 : num.toLocaleString('ko-KR');
}

function generatePredictionHTML(data) {
    // 기본값 설정
    const lastPrice = Number(data.last_price) || 0;
    const predictedPrice = Number(data.predicted_price) || 0;
    const priceChange = predictedPrice - lastPrice;
    const changePercent = lastPrice ? ((priceChange / lastPrice) * 100).toFixed(2) : '0.00';
    const predictedLower = Number(data.predicted_lower) || 0;
    const predictedUpper = Number(data.predicted_upper) || 0;

    return `
        <div class="prediction-card">
            <div class="current-price">
                <h3>현재 주가 (${data.last_date || '날짜 없음'})</h3>
                <p class="price">${formatNumber(lastPrice)}원</p>
            </div>
            <div class="predicted-price">
                <h3>예측 주가 (${data.predicted_date || '날짜 없음'})</h3>
                <p class="price">${formatNumber(predictedPrice)}원</p>
                <p class="change ${priceChange >= 0 ? 'text-success' : 'text-danger'}">
                    ${priceChange >= 0 ? '↑' : '↓'} 
                    ${formatNumber(Math.abs(priceChange))}원 
                    (${changePercent}%)
                </p>
            </div>
            <div class="prediction-range">
                <p>예측 범위: ${formatNumber(predictedLower)}원 ~ ${formatNumber(predictedUpper)}원</p>
            </div>
            <div class="mt-3 text-center">
                <button class="btn btn-primary" onclick="fetchPrediction()">새로고침</button>
            </div>
        </div>
    `;
}

function generateErrorHTML(message) {
    return `
        <div class="prediction-card">
            <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading">예측에 실패했습니다</h4>
                <p>${message || '잠시 후 다시 시도해주세요.'}</p>
                <div class="mt-3">
                    <button class="btn btn-primary" onclick="fetchPrediction()">다시 시도</button>
                </div>
            </div>
        </div>
    `;
}

// 페이지 로드시 예측 시작
document.addEventListener('DOMContentLoaded', fetchPrediction);
 