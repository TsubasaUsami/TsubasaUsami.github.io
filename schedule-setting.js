'use strict';

const startDay = getWeekOfDay(2020, 9, 1, 0);
console.log(startDay);
let event = {
    title: '燃えないゴミ',
    rrule: {
        freq: 'weekly',
        byweekday: ['mo'],
        dtstart: startDay,
        interval: 1,
    },
    className: [
        'event-danger'
    ]
}

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

	const Y = result.getFullYear();
    let m = result.getMonth()+1;
    m = ('0' + m).slice(-2)
    let d = result.getDate();
    d = ('0' + d).slice(-2)

	return Y+'-'+m+'-'+d;
}