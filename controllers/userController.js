const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const usersPath = path.join(__dirname, "../models/users.json");

const readUsers = () => JSON.parse(fs.readFileSync(usersPath));
const writeUsers = (data) => fs.writeFileSync(usersPath, JSON.stringify(data, null, 2));

function validateUserInput(username, password) {
    if (!username || typeof username !== "string" || username.length < 3) {
        return "Usuário inválido: mínimo 3 caracteres";
    }
    if (!password || typeof password !== "string" || password.length < 6) {
        return "Senha inválida: mínimo 6 caracteres";
    }
    return null;
}

exports.register = (req, res) => {
    const { username, password } = req.body;
    const validationError = validateUserInput(username, password);
    if (validationError) return res.status(400).json({ message: validationError });
    const users = readUsers();
    const existing = users.find(u => u.username === username);
    if (existing) return res.status(400).json({ message: "Usuário já existe" });

    const hash = bcrypt.hashSync(password, 10);
    users.push({ id: Date.now(), username, password: hash });
    writeUsers(users);
    res.status(201).json({ message: "Usuário criado com sucesso" });
};

exports.login = (req, res) => {
    const { username, password } = req.body;
    const validationError = validateUserInput(username, password);
    if (validationError) return res.status(400).json({ message: validationError });
    const users = readUsers();
    const user = users.find(u => u.username === username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: "Credenciais inválidas" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
};

exports.getProfile = (req, res) => {
    const users = readUsers();
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    res.json({ id: user.id, username: user.username });
};