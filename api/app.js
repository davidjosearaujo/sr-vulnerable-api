const express = require("express");
var { expressjwt: jwt, UnauthorizedError } = require("express-jwt");
const DB = require("./DB");

const { verifyToken, generateToken } = require("./security");
const app = express();
app.use(express.json());
const port = 3000;

const database = new DB();

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await database.getUser(username, password);
        const token = generateToken({ username: user.username, id: user.id });

        res.json({ token });
    } catch (error) {
        res.status(401).json({ error: "Authentication failed" });
    }
});

app.get("/classes", verifyToken, async (req, res) => {
    try {
        const classes = await database.getTeacherClasses(req.user.id);
        res.status(200).send(classes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// TODO: verifica mal se o teacher pertence à classe
app.get("/studentsByClass", verifyToken, async (req, res) => {
    try {
        if (!req.query.id) {
            return res
                .status(400)
                .json({ error: 'Missing "id" query parameter' });
        }

        const id = req.query.id;
        const parsedId = Number(id, 10);

        if (isNaN(parsedId)) {
            return res
                .status(400)
                .json({ error: '"id" is not a valid number' });
        }

        const teacherHasAccess = await database.teacherBelongToClass(
            req.user.id,
            parsedId
        );
        if (!teacherHasAccess) {
            return res
                .status(403)
                .json({ error: "Teacher does not have access to the class" });
        }

        const students = await database.getStudentsByClass(parsedId);
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Api is listening on port ${port}`);
});
