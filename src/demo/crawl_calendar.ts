import CalendarCrawler from "../core/calendar.crawler";

(async function(){
    const instance = new CalendarCrawler();
    var data = await instance.getCalendar();
    console.log(data);
    console.log(data.data.data[0]);
})();

// npx ts-node src/demo/crawl_calendar.ts