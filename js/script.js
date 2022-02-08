const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div');

car.classList.add('car');


const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

const setting = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 3
};

/* Функция возврата элементов по высоте страницы */
const getQuantityElements = (heightElement) => { // сколько элементов поместится на странице
    return document.documentElement.clientHeight / heightElement + 1;
};


/* Функция запуска игры */
const startGame = () => {
    start.classList.add('hide'); // добавим класс hide для start
    gameArea.innerHTML = '';
    

    for (let i = 0; i < getQuantityElements(100); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }

    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++){
        const enemy = document.createElement('div'); // создаем див
        enemy.classList.add('enemy'); // присваиваем класс 
        enemy.y = -100 * setting.traffic * (i + 1); // прибавили 1 что бы не получалось 0
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px'; // рандомно выставлять авто по ширине дороги. Но отнимем 50 пикселей ширину машины что бы не заезжали за края дороги
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = `transparent url(./image/enemy2.png) center / cover no-repeat`;
        gameArea.appendChild(enemy); // расположим автомобили на игровом пространстве
    }
    start.score = 0;
    setting.start = true;    
    gameArea.appendChild(car);
    // car.style.left = '125px';
    car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
    car.style.top = 'auto';
    car.style.bottom = '10px';
    setting.x = car.offsetLeft; // значение берется от края родителя до нашего элемента
    setting.y = car.offsetTop; // значение берется от самой верхушки родителя до нашего бампера
    requestAnimationFrame(playGame);
};
/* Функция запуска дороги */
const moveRoad = () => {
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(line){
        line.y += setting.speed; // постоянно при запуске функции будет добавляться значение speed
        line.style.top = line.y + 'px';
        if(line.y >= document.documentElement.clientHeight) { // если он больше чем высота нашего элемента
            line.y = -100;
        }
    }) 
}

/* Функция расстановки других машин */
const moveEnemy = () => {
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(function(item){
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();

        if(carRect.top <= enemyRect.bottom && 
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top) {
            setting.start = false;
            start.classList.remove('hide');
            start.style.top = score.offsetHeight;
        }
        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';

        if (item.y >= document.documentElement.clientHeight) {
            item.y = -100 * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    });

    
}

/* Функция отрисовки и перемещения в игре */
const playGame = () => {    
    if (setting.start) {        // как будто === true
        setting.score += setting.speed;
        score.textContent = 'Score: ' + setting.score;
        moveRoad();
        moveEnemy();
        if (keys.ArrowLeft && setting.x > 0) { // если это значение верно то уменьшать значение
            setting.x -= setting.speed;
        }
        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) { // меньше размера поля + размер машины
            setting.x += setting.speed;
        }
        if(keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speed;
        }
        if(keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
            setting.y += setting.speed;
        }

        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';
        requestAnimationFrame(playGame); // функция срабатывает постоянно, потому что вызывает сама себя
    }
    
};

const startRun = (event) => {
    event.preventDefault();
    keys[event.key] = true;
   
};

const stopRun = (event) => {
    event.preventDefault();
    keys[event.key] = false;
};



start.addEventListener('click', startGame); // прослушиватель событий на клик функции startGame
document.addEventListener('keydown', startRun); // прослушиватель на нажатие 
document.addEventListener('keyup', stopRun); // прослушивание на отпускание