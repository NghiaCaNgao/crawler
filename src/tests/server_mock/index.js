const express = require("express");
const multer = require("multer");
const fs = require("fs");

const app = express();
const port = 5000;
const upload = multer();

app.use(express.json()); // for parsing raw text as JSON
app.use(express.urlencoded({ extended: true })); // for parsing urlencoded
app.use(upload.none()); // for uploading and form data

app.get("/", (req, res) => {
    try {
        console.log(req.query, typeof req.query.error);
        const query = req.query;

        if (query.error && query.error === "false") {
            const data = fs.readFileSync("./data/test_fetch.txt");
            res.status(200).send(data.toString());
        } else {
            res.status(500).send("Throw an error intentionally");
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post("/", (req, res) => {
    try {
        console.log(req.body, typeof req.body.error);
        const query = req.body;

        if ((typeof query.error === "boolean" && !query.error) ||
            typeof query.error === "string" && query.error === "false") {
            const data = fs.readFileSync("./data/test_fetch.txt");
            res.status(200).send(data.toString());
        } else {
            res.status(500).send("Throw an error intentionally");
        }

    } catch (error) {
        res.status(500).send(error);
    }
})

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

