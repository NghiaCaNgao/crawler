const express = require("express");
const fs = require("fs");

var app = express();
var port = 5000;

app.get("/", (req, res) => {
    try {
        console.log(req.query);
        const query = req.query;

        if (query.d && query.d == 10) {
            const data = fs.readFileSync("./data/test_fetch.txt");
            res.status(200).send(data.toString());
        } else {
            res.status(202).send("");
        }

    } catch (error) {
        res.send(error);
    }
});

app.get("/calendar", (req, res) => {
    try {
        const query = req.query;
        console.log(query);

        const path = "./data/".concat(
            (query.fail_test_num)
                ? `test_parse_calendar_crawler_${query.fail_test_num}.txt`
                : "test_parse_calendar_crawler_1.txt");

        const data = fs.readFileSync(path);
        res.status(200).send(data.toString());
    } catch (error) {
        res.send(error);
    }
})

app.listen(port, () => {
    console.log("Start server at port: " + port);
});

