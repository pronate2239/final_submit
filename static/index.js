document.addEventListener('DOMContentLoaded', function() {
    const mazeCards = document.querySelectorAll('.maze-card');
    
    mazeCards.forEach(card => {
        card.addEventListener('click', function() {
            const level = this.dataset.level;
            
            // 클릭 효과 애니메이션
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-5px)';
            }, 100);
            
            // 게임 페이지로 이동
            setTimeout(() => {
                window.location.href = `/game/${level}`;
            }, 300);
        });
    });
}); 