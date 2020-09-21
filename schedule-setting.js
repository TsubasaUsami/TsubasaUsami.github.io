'use strict';

// DOM構築後の初期処理
$(document).ready(() => {
    //何かしらの処理
});

/**
 * @param year 求めたい日付の年を指定
 * @param month 求めたい日付の月を指定
 * @param week 第n週か。第1週なら1、第3週なら3を指定
 * @param day 求めたい曜日。0〜6までの数字で指定
 * @return 算出された日付(yyyy-MM-dd形式)
 */
function getWeekOfDay(year, month, week, day) {
	// 1・指定した年月の最初の曜日を取得
	const date = new Date(year+'/'+month+'/1');
	const firstDay = date.getDay();

	// 2・求めたい曜日の第1週の日付けを計算する
	day = day - firstDay + 1;
	if(day <= 0) {
        day += 7;
    }

	// 3・n週まで1週間を足す
	day += 7 * (week - 1);

	// 4・結果
    const result = new Date(year+'/'+month+'/'+day);
    if (isNaN(result.getTime())) {
        // 指定された形式が不正の場合はfalseを返却する
        return false;
    }

	const y = result.getFullYear();
    let m = result.getMonth()+1;
    m = ('0' + m).slice(-2)
    let d = result.getDate();
    d = ('0' + d).slice(-2)

	return y + '-' + m + '-' + d;
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
    let eventList = []; 
    let eventObj = {
        title: '',
        rrule: {
            freq: '',
            byweekday: [],
            dtstart: null,
            interval: 1,
        },
        className: []
    }

    // ごみの種類が未入力の場合は、エラーメッセージを表示
    if (!typeOfGarbageVal) {
        alert('ゴミの種類を入力してください。');
    }

    // 格納されているスケジュール追加月と、現在の月が異なる場合はイベントリストを削除する
    if (Number(localStorage.getItem('currentMonth')) !== currentMonth) {
        localStorage.removeItem('dataList');
    }
    // 追加日の当月をローカルストレージに格納
    localStorage.setItem('currentMonth', currentMonth);
    
    eventObj.title = typeOfGarbageVal;
    eventObj.className.push(colorVal);
    eventObj.rrule.byweekday.push(weekOfDayVal);
    console.log(periodVal);

    switch(periodVal) {
        case '0':
            eventObj.rrule.freq = 'weekly';
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
            eventObj.rrule.dtstart = dtstart;
        break;
    }

    // if (periodVal === 'monthly') {
    //     
    //     const startDay = getWeekOfDay(2020, currentMonth, Number(weekNumberVal), Number(weekOfDayVal));
    // }
    console.log(eventObj);
    const dataList = JSON.parse(localStorage.getItem('dataList'));
    if (!dataList) {
        eventList.push(eventObj);
        localStorage.setItem('dataList', JSON.stringify(eventList));
    } else {
        dataList.push(eventObj);
        localStorage.setItem('dataList', JSON.stringify(dataList));
    }
}