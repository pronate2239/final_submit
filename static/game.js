class Maze {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = Array(height).fill().map(() => Array(width).fill(1));
        this.player = { x: 1, y: 1 };
        this.goal = { x: 1, y: 1 }; // 종료 지점 초기화
    }

    generate() {
        this.generateMaze(1, 1);
        this.grid[1][1] = 2; // 플레이어 위치
        this.grid[this.goal.y][this.goal.x] = 3; // 목표 위치
    }

    generateMaze(x, y) {
        const directions = [
            [0, 2], [2, 0], [0, -2], [-2, 0]
        ].sort(() => Math.random() - 0.5);

        this.grid[y][x] = 0;

        for (const [dx, dy] of directions) {
            const nextX = x + dx;
            const nextY = y + dy;

            if (this.isValidCell(nextX, nextY) && this.grid[nextY][nextX] === 1) {
                this.grid[y + dy / 2][x + dx / 2] = 0; // 경로 연결
                this.generateMaze(nextX, nextY);

                // 종료 지점 업데이트: 가장 먼 경로를 설정
                if (this.getDistance(1, 1, nextX, nextY) > this.getDistance(1, 1, this.goal.x, this.goal.y)) {
                    this.goal = { x: nextX, y: nextY };
                }
            }
        }
    }

    isValidCell(x, y) {
        return x > 0 && x < this.width - 1 && y > 0 && y < this.height - 1;
    }

    movePlayer(direction) {
        const moves = {
            ArrowUp: { x: 0, y: -1 },
            ArrowDown: { x: 0, y: 1 },
            ArrowLeft: { x: -1, y: 0 },
            ArrowRight: { x: 1, y: 0 }
        };

        const move = moves[direction];
        if (!move) return;

        const newPos = {
            x: this.player.x + move.x,
            y: this.player.y + move.y
        };

        if (this.isValidMove(newPos)) {
            this.grid[this.player.y][this.player.x] = 0; // 이전 위치 초기화
            this.player = newPos;
            this.grid[newPos.y][newPos.x] = 2; // 플레이어 위치 표시

            // 플레이어가 종료 지점에 도달했는지 확인
            if (newPos.x === this.goal.x && newPos.y === this.goal.y) {
                setTimeout(() => alert('Congratulations! You completed the maze!'), 100);
            }
        }
    }

    isValidMove(pos) {
        return this.isValidCell(pos.x, pos.y) && this.grid[pos.y][pos.x] !== 1;
    }

    // 두 지점 사이의 맨해튼 거리 계산
    getDistance(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Game Level:', GAME_LEVEL);

    // 난이도별 맵 크기 설정
    const sizes = {
        1: 25,  // 초급: 25x25
        2: 50,  // 중급: 50x50
        3: 100  // 고급: 100x100
    };
    
    const size = sizes[GAME_LEVEL] || 25; // 기본값은 초급 크기
    const maze = new Maze(size, size);
    maze.generate();

    function renderMaze() {
        const mazeElement = document.getElementById('maze');
        mazeElement.innerHTML = '';
        
        // 화면 크기에 따라 셀 크기 계산
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const maxSize = Math.min(viewportWidth * 0.8, viewportHeight * 0.8);
        const cellSize = Math.floor(maxSize / Math.max(maze.width, maze.height));
        
        mazeElement.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`;
        
        for (let y = 0; y < maze.height; y++) {
            for (let x = 0; x < maze.width; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.style.width = `${cellSize}px`;
                cell.style.height = `${cellSize}px`;
                
                switch(maze.grid[y][x]) {
                    case 1:
                        cell.classList.add('wall');
                        break;
                    case 2:
                        cell.classList.add('player');
                        break;
                    case 3:
                        cell.classList.add('goal');
                        break;
                    default:
                        cell.classList.add('path');
                }
                
                mazeElement.appendChild(cell);
            }
        }
    }

    // 키보드 이벤트 처리
    document.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
            maze.movePlayer(e.key);
            renderMaze();
        }
    });

    // 초기 미로 렌더링
    renderMaze();

    // 화면 크기 변경 시 미로 다시 렌더링
    window.addEventListener('resize', () => {
        renderMaze();
    });
});