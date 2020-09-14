"use strict";
document.addEventListener('DOMContentLoaded', function () {
    let calendarEl = document.getElementById('calendar');
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'ja',
        headerToolbar: {
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
        },
        events: [
            {
                title: 'All Day Event',
                start: '2020-09-01'
            }
        ]
    });
    calendar.render();
});