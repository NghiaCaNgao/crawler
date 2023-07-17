import CalendarGetter from "../core/calendar.get";
import { CalendarCrawler } from "../core/calendar";
import { CalendarOption, CrawlerOption } from "../types";
interface I extends CalendarOption { a: string }

(async function () {
    const instance = new CalendarCrawler<CrawlerOption, I>({
        a: "a",
        amphitheater: "1234",
    }, "abc.com");

    console.log(instance.host);
    console.log(instance.query);
    console.log(instance.keyMap);
})();

// npx ts-node src/demo/crawl_calendar.ts
// git rm -rf --cached .