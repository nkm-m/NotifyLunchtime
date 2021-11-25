const request = require("request");
const rp = require("request-promise-native");
const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/Tokyo");

function getGoogleCalendar() {
  return new Promise((resolve) => {
    const main = async () => {
      const createOption = (date) => {
        try {
          const options = {
            uri: `https://www.googleapis.com/calendar/v3/calendars/japanese__ja@holiday.calendar.google.com/events`,
            headers: {
              "Accept-Charset": "utf-8",
              "Content-Type": "application/json",
            },
            qs: {
              key: process.env.APIKEY, //GCPのAPI Key
              timeMin: date.timeMin,
              timeMax: date.timeMax,
            },
            json: true,
            resolveWithFullResponse: true,
          };
          return options;
        } catch (err) {
          console.log(err);
        }
      };

      try {
        // Googleに渡す日付を作成
        const timeMin = moment().startOf("year").format("YYYY-MM-DDT00:00:00Z"); // 今年の元日
        const timeMax = moment(timeMin)
          .endOf("year")
          .format("YYYY-MM-DDT00:00:00Z"); // 今年の年末
        const date = { timeMin: timeMin, timeMax: timeMax };
        const options = createOption(date);

        const res = await rp(options); // リクエストを投げる
        if (res.statusCode === 200) resolve(res.body.items); // レスポンスがない場合はifを外してエラーを確認
      } catch (err) {
        console.log(err);
      }
    };
    main();
  });
}

function formatDate(date) {
  const month = ("00" + (date.getMonth() + 1)).slice(-2);
  const day = ("00" + date.getDate()).slice(-2);
  return month + "-" + day;
}

exports.handler = async function (event) {
  const result = await getGoogleCalendar();
  const holidays = [];
  result.forEach((holiday) => {
    const result = holiday.start.date.substr(5, 9);
    holidays.push(result);
  });

  //会社指定の休日があれば配列に追加する
  const businessHolidays = [
    "12-29",
    "12-30",
    "12-31",
    "01-02",
    "01-03",
    "01-04",
  ];
  businessHolidays.forEach((holiday) => {
    holidays.push(holiday);
  });

  const today = formatDate(new Date());

  const isholiday = holidays.some((holiday) => {
    return today === holiday;
  });

  if (!isholiday) {
    const options = {
      url: "Slack Incoming WebHook URL",
      headers: {
        "Content-type": "application/json",
      },
      body: {
        username: "Lambda Lunchtime Notificaion",
        text: "お昼です。",
        icon_emoji: ":bento:",
      },
      json: true,
    };
    return new Promise((resolve) =>
      request.post(options).on("response", () => resolve())
    );
  }
};
