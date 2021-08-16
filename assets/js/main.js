//////////////////////////////////// Functions ////////////////////////////////////////

// Проверка на ответ 
function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}

// Преобазовывает response в формат JSON
function json(response) {
    return response.json()
}

// Возвращает JSON файл о погоде за послед. 7 суток
function get_weather_daily_json(lat, lon) {
    // Отправляет запрос по широте и долготе
    let url = 'http://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly,alerts&lang=ru&appid=053040538b40cfbe0af79a1518a074de';
    return fetch(url)
        .then(status)
        .then(json);
}

function create_weather_blocks(data) {
    // Верстаем 5 дней недели и погоду и давление по дням

    // Получаем блок информации недели
    let container_inf_week = document.querySelector(".inf__week");
    // Справочник дней недели
    let week = ['Воскресенье', 'Понедельник',
                'Вторник', 'Среда',
                'Четверг', 'Пятница',
                'Суббота']
    // Получаем дату с компьютера
    var today = new Date;
    // Получаем день 
    let day = today.getDay();
    // Верстаем блоки дней и погоды
    for (let i = 0; i < 5; i++) {
        // Добавляем блоки дня
        container_inf_week.innerHTML += `<div class="inf__day">
                    <h2 class="day__title">${week[day]}</h2>
                    <div class="day__morning day_container">
                        <h3 class="day__aftitle">Утром: </h3>
                        <span class="day__temperature">${(data.daily[i].temp.morn - data.daily[i].dew_point).toFixed(2)}</span>
                    </div>
                    <div class="day__mid-day day_container">
                        <h3 class="day__aftitle">Днем: </h3>
                        <span class="day__temperature">${(data.daily[i].temp.day - data.daily[i].dew_point).toFixed(2)}</span>
                    </div>
                    <div class="day__midnight day_container">
                        <h3 class="day__aftitle">Вечером: </h3>
                        <span class="day__temperature">${(data.daily[i].temp.eve - data.daily[i].dew_point).toFixed(2)}</span>
                    </div>
                    <div class="day__night day_container">
                        <h3 class="day__aftitle">Ночью: </h3>
                        <span class="day__temperature">${(data.daily[i].temp.night - data.daily[i].dew_point).toFixed(2)}</span>
                    </div>
                    <div class="day__preassure day_container">
                        <h3 class="day__aftitle">Давление: </h3>
                        <span class="day__preassure">${data.daily[i].pressure} hPa</span>
                    </div>
                </div>
            </div>`;
        //Получаем следующий день по счету
        day++;
        // Сбрасываем индекс для списка
        if (day == 6)
            day = 0;
    }

    // Верстаем максимальное давление за 5 дней

    // Получаем блок доп информации недели
    let container_inf_additional = document.querySelector(".inf__additional");
    
    // Максимальное значение давления
    let high_preassure = 0;
    // Находим максимальное значение
    for (let i = 0; i < 5; i++) {
        if(high_preassure < data.daily[i].pressure) 
            high_preassure = data.daily[i].pressure;
    }
    // Монтируем блок
    container_inf_additional.innerHTML += `<div class="inf__preassure">
                    <h3 class="preassure__title">Максимальное давление:</h3>
                    <span class="preassure__measure">${high_preassure} hPa</span>
                </div>`;
    
    // Верстаем день с минимальной разницей между ночью и утром
    
    // Температура для проверки
    let min_temp = 9999;
    // Получаем индекс нужного дня 
    let index_min_morn_night;
    for (let i = 0; i < 5; i++) {
        if(Math.abs(data.daily[i].temp.night - data.daily[i].temp.morn) < min_temp){
            min_temp = data.daily[i].temp.night - data.daily[i].temp.morn;
            index_min_morn_night = i;
            console.log(min_temp);
            console.log(index_min_morn_night);
        }
    }
    // Получаем день 
    day = today.getDay() + index_min_morn_night;
    if(day > 6)
        day -= 6;
    // Монтируем блок
    container_inf_additional.innerHTML += `<div class="inf__day_mor_night">
                    <h3 class="day_mor_night__title">День с минимальной разницой между утром и ночью:</h3>
                    <span class="day_mor_night__measure">${week[day]}</span>
                </div>`;
}

// Общая функция построения блоков погоды 
//    если ошибка, то строит блок ошибки
function get_weather(lat, lon) {
    get_weather_daily_json(lat, lon)
        .then(create_weather_blocks)
        .catch(err => {
            console.error(err);
        });
}


//////////////////////////////////// Events ///////////////////////////////////////////

/* Загрузка всех пользователей во время прогрузки страницы */
window.onload = function () {
    // Широта и Долгота
    let lat = 54.7431,
        lon = 55.9678;
    // Получаем 
    get_weather(lat, lon);
}


//////////////////////////////////// Pattern //////////////////////////////////////////

function SelectElemByStyle(nameOfStyle) {
    return document.querySelector(nameOfStyle);
}

function WriteToBlock(nameOfStyleOfBlock, options) {
    element = SelectElemByStyle(nameOfStyleOfBlock);
    element.innerHTML += '\n' + options;
}
