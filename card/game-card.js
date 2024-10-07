// card/game-card.js

class GameCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // Получаем атрибуты
        this.grade = this.getAttribute('grade') || 'common';
        this.gameImage = this.getAttribute('game-image') || 'assets/images/game-image.png';
        this.notification = this.hasAttribute('notification');
    }

    static get observedAttributes() {
        return ['grade', 'game-image', 'notification'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if (name === 'notification') {
                this.notification = this.hasAttribute('notification');
            } else {
                this[name] = newValue;
            }
            this.render();
        }
    }

    connectedCallback() {
        this.render();
    }

    render() {
        // Определяем дополнительные классы для специальных грейдов
        const gradeClass = this.grade !== 'all' ? `game-card-up-${this.grade}` : 'game-card-up-all';

        // HTML-шаблон компонента
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    aspect-ratio: 1 / 1; /* Сохраняем квадратную форму */
                    position: relative;
                    border-radius: var(--br-9xs);
                    box-shadow: var(--grade-${this.grade});
                    background: var(--grade-${this.grade}-radial);
                    overflow: hidden;
                    box-sizing: border-box;
                }

                /* Специальные стили для грейда 'all' */
                :host(.game-card-up-all) {
                    box-shadow: none;
                    background: var(--grade-all-radial);
                    border: 1px solid var(--grade-all-angular);
                }

                /* Индикатор уведомления */
                .notification-dot {
                    position: absolute;
                    height: 4%;
                    width: 4%;
                    top: 3.5%;
                    right: 3.5%;
                    border-radius: 50%;
                    background-color: var(--colored-red-02);
                    z-index: 5;
                    animation: blink 1s infinite;
                }

                /* Анимация мигания уведомления */
                @keyframes blink {
                    0% { opacity: 1; }
                    50% { opacity: 0; }
                    100% { opacity: 1; }
                }

                /* Фон карточки */
                .background-up-icon {
                    position: absolute;
                    height: 100%;
                    width: 100%;
                    top: 0;
                    left: 0;
                    border-radius: inherit;
                    object-fit: cover;
                    opacity: 0.25;
                    z-index: 1;
                }

                /* Изображение игры */
                .game-image-icon {
                    position: absolute;
                    height: 92.3%;
                    width: 92.3%;
                    top: 3.85%;
                    left: 3.85%;
                    border-radius: 8px 28px var(--br-9xs) var(--br-9xs);
                    object-fit: cover;
                    z-index: 2;
                }

                /* Бордер карточки */
                .up-border-icon {
                    position: absolute;
                    height: 93%;
                    width: 93%;
                    top: 3.5%;
                    left: 3.5%;
                    object-fit: cover;
                    z-index: 3;
                }

                /* Маленький логотип карточки */
                .small-card-logo-icon {
                    position: absolute;
                    height: 22.5%;
                    width: 22.5%;
                    top: 3.5%;
                    right: 3.5%;
                    object-fit: cover;
                    z-index: 4;
                }
            </style>

            ${this.notification ? '<div class="notification-dot"></div>' : ''}
            <img class="background-up-icon" alt="Background Up" src="assets/images/background-up.png">
            <img class="game-image-icon" alt="Game Image" src="${this.gameImage}">
            <img class="up-border-icon" alt="Up Border ${this.grade}" src="assets/images/up-border-${this.grade}.svg">
            <img class="small-card-logo-icon" alt="Small Card Logo ${this.grade}" src="assets/images/small-card-logo-${this.grade}.svg">
        `;

        // Добавляем класс для специальных грейдов
        if (this.grade === 'all') {
            this.classList.add('game-card-up-all');
        } else {
            this.classList.remove('game-card-up-all');
        }
    }
}

// Регистрация кастомного элемента
customElements.define('game-card', GameCard);
