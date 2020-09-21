'use strict';

// DOM構築後の初期処理
$(document).ready(() => {
    const dataList = JSON.parse(localStorage.getItem('dataList'));
    const currentMonth = new Date().getMonth() + 1;
    // 格納されているスケジュール追加月と、現在の月が異なる場合はイベントリストを削除する
    if (Number(localStorage.getItem('currentMonth')) !== currentMonth) {
        localStorage.removeItem('dataList');
    }

    // FullCalendarの設定
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'ja',
        headerToolbar: {
            start: 'title',
            end: ''
        },
        footerToolbar: {
            right: 'dayGridMonth,timeGridWeek,listMonth'
        },
        events: dataList,
        dayCellContent: (dayCellContentInfo) => {
            dayCellContentInfo.dayNumberText = dayCellContentInfo.dayNumberText.replace('日', '');
        },
        displayEventTime: false,
        hiddenDays: [0, 6]
    });
    calendar.render();
});