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
        console.log("In GET /", req.query, typeof req.query.error);
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
        console.log("In POST /", req.body, typeof req.body.error);
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

app.post("/calendar", (req, res) => {
    try {
        console.log("In POST /calendar", req.body, typeof req.body.error);
        const query = req.body;
        const test_error = query.error &&
            typeof query.error === "string" &&
            query.error === "true";
        console.log("test_error", test_error);
        
        if (!test_error) {
            const path = "./data/test_get_calendar_1.txt";
            const data = fs.readFileSync(path);

            res.status(200).send(data.toString());
        }
        else {
            res.status(500).send("Throw an error intentionally");
        }
    } catch (error) {
        res.status(500).send(error);
    }
})

app.listen(port, () => {
    console.log("Start server at port: " + port);
});

