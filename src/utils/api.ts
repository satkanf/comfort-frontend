// src/utils/api.ts

// Утилитарная функция для JSONP запросов к WordPress API
export const fetchJSONP = (url: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const callbackName = `wp_callback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const script = document.createElement('script');
        script.src = `${url}&_jsonp=${callbackName}`;
        script.async = true;

        // Глобальная функция callback
        (window as any)[callbackName] = (data: any) => {
            resolve(data);
            cleanup();
        };

        script.onerror = () => {
            reject(new Error('JSONP request failed'));
            cleanup();
        };

        const cleanup = () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
            delete (window as any)[callbackName];
        };

        document.head.appendChild(script);

        // Таймаут на случай, если запрос зависнет
        setTimeout(() => {
            reject(new Error('JSONP request timeout'));
            cleanup();
        }, 15000);
    });
};

