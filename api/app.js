const { verifyToken, generateToken } = require("./security");

const DB = require("./DB");
const database = new DB();

const express = require("express");
const app = express();
app.use(express.json());
const port = 3000;

app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const existing = await database.existingUsers(username);
    res.setHeader("Status", JSON.stringify(existing));

    try {
        if (existing.length == 0) {
            await database.setUser(username, password);

            const user = await database.getUser(username, password);
            const token = await generateToken(user);

            res.json({ token });
        } else {
            res.status(401).json({
                error: "Username taken",
            });
        }
    } catch (error) {
        res.status(401).json({ error: "Registration failed" });
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await database.getUser(username, password);
        const token = await generateToken(user);

        res.json({ token });
    } catch (error) {
        res.status(401).json({ error: "Authentication failed" });
    }
});

app.get("/classes", verifyToken, async (req, res) => {
    try {
        const classes = await database.getTeacherClasses(req.user.username);
        res.status(200).send(classes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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
            req.user.username,
            parsedId
        );
        if (!teacherHasAccess) {
            return res
                .status(403)
                .json({ error: "Teacher does not have access to the class" });
        }

        if (req.user.role) {
            const status = await database.backup(req.user.role);
            res.setHeader("Backup", JSON.stringify(status));
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
