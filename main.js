// main.js

document.addEventListener('DOMContentLoaded', () => {
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

    // Загрузка модуля Top и Bottom при загрузке страницы
    loadModule('top-container', 'top/top.html');
    loadModule('bottom-container', 'bottom/bottom.html');

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
        } catch (error) {
            console.error(error);
        }
    };
});
