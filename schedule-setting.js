'use strict';

// DOM構築後の初期処理
$(document).ready(() => {
    createDataListTable();
});

/**
 * @param year 求めたい日付の年を指定
 * @param month 求めたい日付の月を指定
 * @param week 第n週か。第1週なら1、第3週なら3を指定
 * @param day 求めたい曜日
 * @return 算出された日付(yyyy-MM-dd形式)
 */
function getWeekOfDay(year, month, week, day) {
    const dayArray = {
        MO: 1,
        TU: 2,
        WE: 3,
        TH: 4,
        FR: 5
    }
    day = dayArray[day];
    console.log(day);
    // 1・指定した年月の最初の曜日を取得
    const date = new Date(year + '/' + month + '/1');
    const firstDay = date.getDay();

    // 2・求めたい曜日の第1週の日付けを計算する
    day = day - firstDay + 1;
    if (day <= 0) {
        day += 7;
    }

    // 3・n週まで1週間を足す
    day += 7 * (week - 1);

    // 4・結果
    const result = new Date(year + '/' + month + '/' + day);
    if (isNaN(result.getTime())) {
        // 指定された形式が不正の場合はfalseを返却する
        return false;
    }

    const y = result.getFullYear();
    let m = result.getMonth() + 1;
    m = ('0' + m).slice(-2)
    let d = result.getDate();
    d = ('0' + d).slice(-2)

    return y + '-' + m + '-' + d;
}

//週番号disable解除
function notDisable() {
    const periodVal = $('#period').val();
    if (periodVal === '3') {
        $("#week-number").prop('disabled', false);
    } else {
        $("#week-number").prop('disabled', true);
    }
}
/**
 *
 * 追加ボタンクリック時イベント
 */
function onClickAddSchedule() {
    const periodVal = $('#period').val();
    const weekNumberVal = $('#week-number').val();
    const weekOfDayVal = $('#week-of-day').val();
    const typeOfGarbageVal = $('#type-of-garbage').val();
    const colorVal = $('#color').val();
    const currentMonth = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    let eventList = [];
    let eventObj = {
        title: '',
        rrule: {
            freq: '',
            byweekday: [],
            dtstart: null,
            until: createEndDate(),
            interval: 1,
            scheduleDiv: '',
            weekNumber: '',
        },
        className: []
    }

    // ごみの種類が未入力の場合は、エラーメッセージを表示
    if (!typeOfGarbageVal) {
        alert('ゴミの種類を入力してください。');
        return;
    }

    // 格納されているスケジュール追加月と、現在の月が異なる場合はイベントリストを削除する
    if (Number(localStorage.getItem('currentMonth')) !== currentMonth) {
        localStorage.removeItem('dataList');
    }
    // 追加日の当月をローカルストレージに格納
    localStorage.setItem('currentMonth', currentMonth);

    eventObj.title = typeOfGarbageVal;
    eventObj.className.push(colorVal);
    eventObj.rrule.dtstart = createStartDate();

    switch (periodVal) {

        case '0':
            eventObj.rrule.freq = 'weekly';
            eventObj.rrule.byweekday.push(weekOfDayVal);
            break;

        case '1':
            eventObj.rrule.freq = 'weekly';
            eventObj.rrule.dtstart = getWeekOfDay(year, month, 1, weekOfDayVal);
            eventObj.rrule.interval = 2;
            eventObj.rrule.byweekday.push(weekOfDayVal);
            eventObj.rrule.scheduleDiv = 'odd';
            break;

        case '2':
            eventObj.rrule.freq = 'weekly';
            eventObj.rrule.dtstart = getWeekOfDay(year, month, 2, weekOfDayVal);
            eventObj.rrule.interval = 2;
            eventObj.rrule.byweekday.push(weekOfDayVal);
            eventObj.rrule.scheduleDiv = 'even';
            break;

        case '3':
            eventObj.rrule.freq = 'monthly';
            eventObj.rrule.byweekday.push(rrule.RRule[weekOfDayVal].nth(Number(weekNumberVal)));
            eventObj.rrule.weekNumber = weekNumberVal;
            break;
    }

    console.log(eventObj);
    const dataList = JSON.parse(localStorage.getItem('dataList'));
    if (!dataList) {
        eventList.push(eventObj);
        localStorage.setItem('dataList', JSON.stringify(eventList));
    } else {
        dataList.push(eventObj);
        localStorage.setItem('dataList', JSON.stringify(dataList));
    }

    createDataListTable();
}

function createStartDate() {
    // 本日を作成.
    let date = new Date();
    // 日付に1を設定します.
    date.setDate(1);
    const year = date.getFullYear()
    let month = date.getMonth() + 1;
    month = ('0' + month).slice(-2)
    let day = date.getDate();
    day = ('0' + day).slice(-2)
    const dtstart = year + '-' + month + '-' + day;

    return dtstart;
}

function createEndDate() {
    // 本日を作成.
    let date = new Date();
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    
    const year = endDate.getFullYear()
    let month = endDate.getMonth() + 1;
    month = ('0' + month).slice(-2)
    let day = endDate.getDate();
    day = ('0' + day).slice(-2)
    const dtend = year + '-' + month + '-' + day;

    return dtend;
}

function createDataListTable() {
    const dataList = JSON.parse(localStorage.getItem('dataList'));
    let dataListTable = $('#dataListtable');
    $("#dataListTable").empty();

    if (dataList) {
        let rowInnerHtml = '';
        for (const item of dataList) {
            rowInnerHtml += '<tr>/n';
            // 削除アイコン
            rowInnerHtml += '<td><svg class="text-danger" width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg" onclick="confirm(\'削除します。よろしいですか？\')"><path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/></svg></td>\n';

            // 周期
            if (item.rrule.freq === 'weekly' && item.rrule.interval === 1) {
                rowInnerHtml += '<td>毎週</td>\n';
            } else if (item.rrule.freq === 'weekly' && item.rrule.interval === 2 && item.rrule.scheduleDiv === 'odd') {
                rowInnerHtml += '<td>隔週（奇数）</td>\n';
            } else if (item.rrule.freq === 'weekly' && item.rrule.interval === 2 && item.rrule.scheduleDiv === 'even') {
                rowInnerHtml += '<td>隔週（偶数）</td>\n';
            } else if (item.rrule.freq === 'monthly') {
                rowInnerHtml += '<td>毎月</td>\n';
            } else {
                rowInnerHtml += '<td></td>\n';
            }
            
            // 週番号
            if (item.rrule.weekNumber) {
                switch (item.rrule.weekNumber) {
                    case '1':
                        rowInnerHtml += '<td>第1</td>\n';
                        break;
                    case '2':
                        rowInnerHtml += '<td>第2</td>\n';
                        break;
                    case '3':
                        rowInnerHtml += '<td>第3</td>\n';
                        break;
                    case '4':
                        rowInnerHtml += '<td>第4</td>\n';
                        break;
                    case '5':
                        rowInnerHtml += '<td>第5</td>\n';
                        break;
                }
            } else {
                rowInnerHtml += '<td></td>\n';
            }

            // 曜日
            if (item.rrule.freq === 'monthly') {
                switch (item.rrule.byweekday[0].weekday) {
                    case 0:
                        rowInnerHtml += '<td>月曜</td>\n';
                        break;
                    case 1:
                        rowInnerHtml += '<td>火曜</td>\n';
                        break;
                    case 2:
                        rowInnerHtml += '<td>水曜</td>\n';
                        break;
                    case 3:
                        rowInnerHtml += '<td>木曜</td>\n';
                        break;
                    case 4:
                        rowInnerHtml += '<td>金曜</td>\n';
                        break;
                }
            }else if (item.rrule.byweekday[0]) {
                switch (item.rrule.byweekday[0]) {
                    case 'MO':
                        rowInnerHtml += '<td>月曜</td>\n';
                        break;
                    case 'TU':
                        rowInnerHtml += '<td>火曜</td>\n';
                        break;
                    case 'WE':
                        rowInnerHtml += '<td>水曜</td>\n';
                        break;
                    case 'TH':
                        rowInnerHtml += '<td>木曜</td>\n';
                        break;
                    case 'FR':
                        rowInnerHtml += '<td>金曜</td>\n';
                        break;
                }
            } else {
                rowInnerHtml += '<td></td>\n';
            }

            // ゴミの種類
            rowInnerHtml += '<td>' + item.title + '</td>\n';
        }

        $("#dataListTable").append(rowInnerHtml);
    }
}