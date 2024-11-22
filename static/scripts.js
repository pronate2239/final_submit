document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const container = document.querySelector('.start-container');
    
    // 시작 버튼에 호버 효과음 추가
    startButton.addEventListener('mouseenter', () => {
        playHoverSound();
    });
    
    startButton.addEventListener('click', function() {
        // 클릭 효과음 재생
        playClickSound();
        
        // 페이지 전환 애니메이션
        container.classList.add('fade-out');
        
        setTimeout(() => {
            window.location.href = '/index';
        }, 500);
    });
    
    // 효과음 함수
    function playHoverSound() {
        const hoverSound = new Audio('/static/hover.mp3'); // 효과음 파일 필요
        hoverSound.volume = 0.2;
        hoverSound.play().catch(() => {});
    }
    
    function playClickSound() {
        const clickSound = new Audio('/static/click.mp3'); // 효과음 파일 필요
        clickSound.volume = 0.3;
        clickSound.play().catch(() => {});
    }
}); 