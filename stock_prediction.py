# 필요한 라이브러리만 임포트
from bs4 import BeautifulSoup
import requests
import json
from datetime import datetime, timedelta

# 전역 변수로 디버그 모드 설정
DEBUG = True

def debug_print(message):
    """디버그 메시지 출력"""
    if DEBUG:
        print(f"[DEBUG] {message}")

def get_stock_data():
    print("데이터 수집 시작...")  # 첫 번째 디버그 포인트
    
    url = "https://finance.naver.com/item/sise_day.nhn?code=005930"
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    try:
        # 데이터 가져오기
        response = requests.get(url, headers=headers)
        response.encoding = 'euc-kr'
        print("네이버 금융 접속 성공")  # 두 번째 디버그 포인트
        
        # HTML 파싱
        soup = BeautifulSoup(response.text, 'html.parser')
        print("HTML 파싱 완료")  # 세 번째 디버그 포인트
        
        # 주가 데이터 추출
        data = []
        table = soup.find('table', class_='type2')
        
        if not table:
            print("테이블을 찾을 수 없음")
            return None
            
        print("주가 테이블 찾음")  # 네 번째 디버그 포인트
        
        # 데이터 추출
        for row in table.find_all('tr')[1:]:  # 헤더 제외
            cols = row.find_all('td')
            if len(cols) >= 2:
                date = cols[0].text.strip()
                price = cols[1].text.strip()
                
                if date and price:
                    try:
                        price_value = int(price.replace(',', ''))
                        data.append({
                            'date': date,
                            'price': price_value
                        })
                    except ValueError:
                        continue
        
        print(f"수집된 데이터 수: {len(data)}")  # 다섯 번째 디버그 포인트
        
        if not data:
            return None
            
        return data[:5]  # 최근 5일 데이터만 반환
        
    except Exception as e:
        print(f"에러 발생: {str(e)}")
        return None

def make_prediction(data):
    print("예측 시작...")  # 여섯 번째 디버그 포인트
    
    try:
        if not data or len(data) < 2:
            return None
            
        # 현재가와 전일가
        current_price = data[0]['price']
        prev_price = data[1]['price']
        
        # 예측 계산
        price_change = current_price - prev_price
        predicted_price = current_price + (price_change * 0.5)
        
        # 예측 범위
        margin = current_price * 0.01
        
        result = {
            'last_date': data[0]['date'],
            'last_price': current_price,
            'predicted_price': int(predicted_price),
            'predicted_upper': int(predicted_price + margin),
            'predicted_lower': int(predicted_price - margin),
            'trend': '상승' if price_change > 0 else '하락',
            'confidence': 70
        }
        
        print("예측 완료")  # 일곱 번째 디버그 포인트
        return result
        
    except Exception as e:
        print(f"예측 중 에러: {str(e)}")
        return None

def main():
    print("프로그램 시작")  # 여덟 번째 디버그 포인트
    
    # 데이터 수집
    stock_data = get_stock_data()
    if not stock_data:
        print(json.dumps({'error': '데이터 수집 실패'}, ensure_ascii=False))
        return
        
    # 예측 수행
    prediction = make_prediction(stock_data)
    if not prediction:
        print(json.dumps({'error': '예측 실패'}, ensure_ascii=False))
        return
        
    # 결과 출력
    print(json.dumps(prediction, ensure_ascii=False))

if __name__ == "__main__":
    main()