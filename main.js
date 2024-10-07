// main.js

document.addEventListener('DOMContentLoaded', () => {
    // Флаг для предотвращения повторных перенаправлений
    let isRedirecting = false;

    // Храним токен после авторизации
    let authToken = null;

    // Функция для загрузки HTML модулей
    const loadModule = async (containerId, modulePath) => {
        try {
            const response = await fetch(modulePath);
            if (!response.ok) {
                throw new Error(`Не удалось загрузить ${modulePath}: ${response.statusText}`);
            }
            const html = await response.text();
            document.getElementById(containerId).innerHTML = html;
            // После загрузки HTML, загружаем соответствующие CSS и JS
            const cssPath = modulePath.replace('.html', '.css');
            const jsPath = modulePath.replace('.html', '.js');
            await loadCSS(cssPath);
            await loadJS(jsPath);
        } catch (error) {
            console.error(error);
        }
    };

    // Функция для загрузки CSS файлов
    const loadCSS = (href) => {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = () => resolve();
            link.onerror = () => reject(new Error(`Не удалось загрузить CSS: ${href}`));
            document.head.appendChild(link);
        });
    };

    // Функция для загрузки JS файлов
    const loadJS = (src) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.defer = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Не удалось загрузить JS: ${src}`));
            document.body.appendChild(script);
        });
    };

    // Функция для инициализации авторизации через Telegram Web App
    const initializeTelegramAuth = async () => {
        const tg = window.Telegram.WebApp;

        // Проверяем, открыто ли приложение внутри Telegram
        if (!tg.initData) {
            if (!isRedirecting) {
                isRedirecting = true;
                // Если нет, перенаправляем пользователя к боту
                //window.location.href = 'https://t.me/gamen_test_bot';
            }
            return;
        }

        const initData = tg.initData;

        // Путь к вашему FastAPI бэкенду
        const backendUrl = 'https://wildly-certain-oarfish.ngrok-free.app/auth'; // Замените на ваш URL

        try {
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ init_data: initData }),
            });

            if (!response.ok) {
                throw new Error(`Ошибка авторизации: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.status === 'ok') {
                // Успешная аутентификация, сохраняем токен
                authToken = data.auth_token;

                // Обновляем nickname в top.html
                const nicknameElement = document.getElementById('user-nickname');
                if (nicknameElement) {
                    nicknameElement.innerText = data.username || 'Пользователь';
                } else {
                    console.warn('Элемент с id "user-nickname" не найден.');
                }

                // После успешной авторизации загружаем контентный модуль Spin
                await loadContentModule('spin/spin.html');
            } else {
                // Обработка ошибок, полученных от бэкенда
                console.error('Ошибка авторизации:', data);
                document.getElementById('user-nickname').innerText = 'Ошибка авторизации';
            }
        } catch (error) {
            console.error('Ошибка при авторизации:', error);
            document.getElementById('user-nickname').innerText = 'Ошибка при запросе';
        }
    };

    // Функция для загрузки модулей и инициализации авторизации после загрузки
    const loadModulesAndAuthenticate = async () => {
        const modules = [
            loadModule('top-container', 'top/top.html'),
            loadModule('bottom-container', 'bottom/bottom.html')
            // Добавьте другие модули по необходимости
        ];

        try {
            await Promise.all(modules);
            // После загрузки всех модулей выполняем авторизацию
            await initializeTelegramAuth();
        } catch (error) {
            console.error('Ошибка при загрузке модулей:', error);
        }
    };

    // Запуск загрузки модулей и авторизации
    loadModulesAndAuthenticate();

    // Функция для загрузки модулей внутри content
    window.loadContentModule = async (modulePath) => {
        const contentDiv = document.querySelector('.content');
        try {
            const response = await fetch(modulePath);
            if (!response.ok) {
                throw new Error(`Не удалось загрузить ${modulePath}: ${response.statusText}`);
            }
            const html = await response.text();
            contentDiv.innerHTML = html;
            // Загрузка CSS и JS для контентного модуля
            const cssPath = modulePath.replace('.html', '.css');
            const jsPath = modulePath.replace('.html', '.js');
            await loadCSS(cssPath);
            await loadJS(jsPath);

            // Передаем authToken в глобальную область видимости контентного модуля
            if (window.initializeContentModule) {
                window.initializeContentModule(authToken);
            }
        } catch (error) {
            console.error(error);
        }
    };
});
