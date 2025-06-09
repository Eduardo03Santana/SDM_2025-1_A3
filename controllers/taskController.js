const fs = require("fs");
const path = require("path");
const tasksPath = path.join(__dirname, "../models/tasks.json");
const categoriesPath = path.join(__dirname, "../models/categories.json");

const readTasks = () => JSON.parse(fs.readFileSync(tasksPath));
const writeTasks = (data) => fs.writeFileSync(tasksPath, JSON.stringify(data, null, 2));
const readCategories = () => JSON.parse(fs.readFileSync(categoriesPath));

function validateTask(task) {
    if (!task.title || typeof task.title !== 'string') {
        return "Campo 'title' é obrigatório e deve ser uma string";
    }
    if (!task.description || typeof task.description !== 'string') {
        return "Campo 'description' é obrigatório e deve ser uma string";
    }
    return null;
}

exports.getAll = (req, res) => {
    const { categoryId } = req.query;
    let tasks = readTasks().filter(t => t.userId === req.user.id);
    if (categoryId) {
        tasks = tasks.filter(t => t.categoryId == categoryId);
    }
    res.json(tasks);
};

exports.getById = (req, res) => {
    const tasks = readTasks();
    const task = tasks.find(t => t.id == req.params.id && t.userId === req.user.id);
    if (!task) return res.status(404).json({ message: "Tarefa não encontrada" });
    res.json(task);
};

exports.create = (req, res) => {
    const tasks = readTasks();
    const validationError = validateTask(req.body);
    if (validationError) return res.status(400).json({ message: validationError });
    if (req.body.categoryId) {
        const categories = readCategories();
        const exists = categories.find(c => c.id === req.body.categoryId && c.userId === req.user.id);
        if (!exists) return res.status(400).json({ message: "Categoria inválida" });
    }
    const task = { id: Date.now(), ...req.body, userId: req.user.id };
    tasks.push(task);
    writeTasks(tasks);
    res.status(201).json(task);
};

exports.update = (req, res) => {
    const tasks = readTasks();
    const index = tasks.findIndex(t => t.id == req.params.id && t.userId === req.user.id);
    if (index === -1) return res.status(404).json({ message: "Tarefa não encontrada" });
    const validationError = validateTask(req.body);
    if (validationError) return res.status(400).json({ message: validationError });
    if (req.body.categoryId) {
        const categories = readCategories();
        const exists = categories.find(c => c.id === req.body.categoryId && c.userId === req.user.id);
        if (!exists) return res.status(400).json({ message: "Categoria inválida" });
    }
    tasks[index] = { ...tasks[index], ...req.body };
    writeTasks(tasks);
    res.json(tasks[index]);
};

exports.remove = (req, res) => {
    const tasks = readTasks();
    const newTasks = tasks.filter(t => !(t.id == req.params.id && t.userId === req.user.id));
    writeTasks(newTasks);
    res.status(204).send();
};