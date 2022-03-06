const dom = {
    board: document.getElementById('board'),
    msg: document.getElementById('msg'),
}
const sleep_ = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const randInt = (btm, top) => Math.floor(Math.random() * (top - btm + 1)) + btm;
class Board {
    constructor(size) {
        // 盤面の初期化
        this.data = new Array(size);
        this.size = size;
        for (let row = 0; row < this.size; row++) {
            this.data[row] = new Array(size);
            for (let col = 0; col < this.data[row].length; col++)
                this.data[row][col] = Math.floor((row * size + col) / 2);
        }
        // 盤面をシャッフル
        for (let count = 0; count < this.size * 2; count++) {
            const row1 = randInt(0, this.size - 1);
            const col1 = randInt(0, this.size - 1);
            const row2 = randInt(0, this.size - 1);
            const col2 = randInt(0, this.size - 1);
            [this.data[row1][col1], this.data[row2][col2]] = [this.data[row2][col2], this.data[row1][col1]]
        }
        // 盤面を表示
        this.data.forEach(rowItems => {
            const trDom = document.createElement('tr');
            rowItems.forEach(item => {
                const tdDom = document.createElement('td');
                tdDom.textContent = `${item}`;
                tdDom.classList.add('sq');
                tdDom.classList.add('hide');
                trDom.appendChild(tdDom);
            })
            dom.board.appendChild(trDom);
        })
        this.isOneOpen = false;
        this.openCount = 0;
        dom.msg.textContent = '未クリアです';
    }
    printConsole() {
        for (let row = 0; row < this.size; row++)
            console.log(this.data[row].map(item => item));
    }
    oneOpen(dm) {
        this.isOneOpen = true;
        dm.classList.remove('hide');
        this.oneDom = dm;
    }
    async checkCorrect(dm) {
        if (this.openCount >= this.size * this.size)
            return;
        this.isOneOpen = false;
        dm.classList.remove('hide');
        if (dm.textContent === this.oneDom.textContent) {
            this.openCount += 2;
            this.oneDom.classList.add('ok');
            dm.classList.add('ok');
            if (this.openCount >= this.size * this.size)
                dom.msg.textContent = 'クリアです';
        }
        else {
            await sleep_(500);
            this.oneDom.classList.add('hide');
            dm.classList.add('hide');
        }
    }
    async checkTouch() {
        document.querySelectorAll('.sq').forEach(tdDom => {
            tdDom.onclick = async () => {
                if (this.isOneOpen)
                    await this.checkCorrect(tdDom)
                else
                    this.oneOpen(tdDom);
            }
        })
    }
}
const board = new Board(6);
board.checkTouch();
