class FourWayMaze {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = Array(height).fill().map(() => Array(width).fill(1));
        this.centerX = Math.floor(width / 2);
        this.centerY = Math.floor(height / 2);
        this.player = { x: this.centerX, y: this.centerY };

        // 목표 지점 위치 수정
        this.goals = [
            { x: 1, y: 1, reached: false },             
            { x: width - 2, y: 1, reached: false },     
            { x: 1, y: height - 2, reached: false },    
            { x: width - 2, y: height - 2, reached: false }
        ];
    }

    generate() {
        this.generateMazeFromCenter(this.centerX, this.centerY);
        
        // 플레이어 위치 설정
        this.grid[this.centerY][this.centerX] = 2;
        
        // 목표 지점 설정
        this.goals.forEach(goal => {
            this.grid[goal.y][goal.x] = 3;
            // 목표 지점으로 가는 길 확보
            this.ensurePathToGoal(goal);
        });
    }

    generateMazeFromCenter(startX, startY) {
        const stack = [];
        const visited = new Set();
        
        // 시작점 설정
        this.grid[startY][startX] = 0;
        stack.push([startX, startY]);
        visited.add(`${startX},${startY}`);

        while (stack.length > 0) {
            const [currentX, currentY] = stack[stack.length - 1];
            const neighbors = this.getUnvisitedNeighbors(currentX, currentY, visited);
            
            if (neighbors.length === 0) {
                stack.pop();
            } else {
                const [nextX, nextY] = neighbors[Math.floor(Math.random() * neighbors.length)];
                this.grid[nextY][nextX] = 0;
                this.grid[currentY + (nextY - currentY) / 2][currentX + (nextX - currentX) / 2] = 0;
                visited.add(`${nextX},${nextY}`);
                stack.push([nextX, nextY]);
            }
        }
    }

    getUnvisitedNeighbors(x, y, visited) {
        const neighbors = [];
        const directions = [
            [0, -1], // 상
            [1, 0],  // 우
            [0, 1],  // 하
            [-1, 0]  // 좌
        ];

        for (const [dx, dy] of directions) {
            const newX = x + dx * 2;
            const newY = y + dy * 2;
            
            if (newX >= 0 && newX < this.width && 
                newY >= 0 && newY < this.height && 
                !visited.has(`${newX},${newY}`)) {
                neighbors.push([newX, newY]);
            }
        }
        
        return neighbors;
    }

    ensurePathToGoal(goal) {
        let currentX = goal.x;
        let currentY = goal.y;
        const visited = new Set();
        
        while (currentX !== this.centerX || currentY !== this.centerY) {
            visited.add(`${currentX},${currentY}`);
            
            // 현재 위치에서 중앙으로 가는 최적 방향 선택
            const dx = Math.sign(this.centerX - currentX);
            const dy = Math.sign(this.centerY - currentY);
            
            if (Math.random() < 0.5 && dx !== 0) {
                currentX += dx;
            } else if (dy !== 0) {
                currentY += dy;
            } else {
                currentX += dx;
            }
            
            this.grid[currentY][currentX] = 0;
        }
    }

    movePlayer(direction) {
        const newPos = { ...this.player };

        switch (direction) {
            case 'ArrowUp': newPos.y--; break;
            case 'ArrowDown': newPos.y++; break;
            case 'ArrowLeft': newPos.x--; break;
            case 'ArrowRight': newPos.x++; break;
        }

        if (this.isValidMove(newPos)) {
            // 이전 위치의 플레이어 제거
            this.grid[this.player.y][this.player.x] = 0;
            
            // 새로운 위치로 플레이어 이동
            this.player = newPos;
            this.grid[this.player.y][this.player.x] = 2;

            // 목표 지점 도달 체크
            const goalIndex = this.goals.findIndex(
                goal => goal.x === newPos.x && goal.y === newPos.y && !goal.reached
            );

            if (goalIndex !== -1) {
                this.goals[goalIndex].reached = true;
                const remainingGoalsElement = document.getElementById('remainingGoals');
                const remainingGoals = this.goals.filter(goal => !goal.reached).length;
                if (remainingGoalsElement) {
                    remainingGoalsElement.textContent = remainingGoals;
                }

                // 모든 목표 달성 체크
                if (remainingGoals === 0) {
                    setTimeout(() => {
                        alert('축하합니다! 모든 목표를 달성하셨습니다!');
                        window.location.href = '/four-way';
                    }, 100);
                }
            }

            this.renderMaze();
        }
    }

    renderMaze() {
        const mazeElement = document.getElementById('maze');
        mazeElement.innerHTML = '';

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const maxSize = Math.min(viewportWidth * 0.8, viewportHeight * 0.8);
        const cellSize = Math.floor(maxSize / Math.max(this.width, this.height));

        mazeElement.style.gridTemplateColumns = `repeat(${this.width}, ${cellSize}px)`;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.style.width = `${cellSize}px`;
                cell.style.height = `${cellSize}px`;

                const isGoal = this.goals.find(goal => goal.x === x && goal.y === y);

                if (isGoal) {
                    cell.classList.add(isGoal.reached ? 'goal-reached' : 'goal');
                } else if (x === this.player.x && y === this.player.y) {
                    cell.classList.add('player');
                } else {
                    switch (this.grid[y][x]) {
                        case 1:
                            cell.classList.add('wall');
                            break;
                        case 0:
                            cell.classList.add('path');
                            break;
                    }
                }

                mazeElement.appendChild(cell);
            }
        }
    }

    isValidMove(pos) {
        return pos.x >= 0 && pos.x < this.width && 
               pos.y >= 0 && pos.y < this.height && 
               this.grid[pos.y][pos.x] !== 1;
    }
}

// CSS 스타일 수정
const style = document.createElement('style');
style.textContent = `
    .maze {
        display: grid;
        gap: 0;
        padding: 10px;
        margin: 20px auto;
        background-color: #2C3E50;
    }
    .cell {
        width: 25px;
        height: 25px;
        box-sizing: border-box;
    }
    .wall {
        background-color: #2C3E50;
    }
    .path {
        background-color: #ECF0F1;
        border: 1px solid rgba(44, 62, 80, 0.1);
    }
    .player {
        background-color: #E74C3C;
        border-radius: 50%;
        border: none;
        box-shadow: 0 0 10px rgba(231, 76, 60, 0.5);
    }
    .goal {
        background-color: #ECF0F1;
        border: 1px solid rgba(44, 62, 80, 0.1);
        position: relative;
    }
    .goal::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 12px;
        height: 12px;
        background-color: #27AE60;
        border-radius: 50%;
    }
    .goal-reached {
        background-color: #ECF0F1;
        border: 1px solid rgba(44, 62, 80, 0.1);
        position: relative;
    }
    .goal-reached::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 12px;
        height: 12px;
        background-color: #F1C40F;
        border-radius: 50%;
    }
`;
document.head.appendChild(style);

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    const sizes = {
        1: 25,  // 초급
        2: 50,  // 중급
        3: 100   // 고급
    };
    
    const size = sizes[GAME_LEVEL] || 15;
    const maze = new FourWayMaze(size, size);
    maze.generate();
    maze.renderMaze();  // 초기 미로 렌더링

    // 키보드 이벤트 리스너
    document.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
            maze.movePlayer(e.key);
        }
    });
});