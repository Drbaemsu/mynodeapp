async function fetchNews() {
    try {
        const response = await fetch('/api/news');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        displayNews(data);
    } catch (error) {
        console.error('Error fetching news:', error);
        displayError(error.message);
    }
}

function displayNews(articles) {
    const container = document.getElementById('newsContainer');
    container.innerHTML = articles.map(article => `
        <div class="news-card">
            <div class="news-content">
                <div class="news-category">${article.category}</div>
                <h3 class="news-title">${article.title}</h3>
                <p class="news-summary">${article.summary}</p>
                <a href="${article.link}" class="news-link" target="_blank">
                    자세히 보기 <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `).join('');
}

function displayError(message) {
    const container = document.getElementById('newsContainer');
    container.innerHTML = `
        <div class="alert alert-danger" role="alert">
            <h4 class="alert-heading">뉴스를 불러오는데 실패했습니다</h4>
            <p>${message || '잠시 후 다시 시도해주세요.'}</p>
            <button class="btn btn-primary mt-3" onclick="fetchNews()">다시 시도</button>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', fetchNews);