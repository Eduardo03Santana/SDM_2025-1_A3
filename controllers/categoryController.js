const fs = require("fs");
const path = require("path");
const categoriesPath = path.join(__dirname, "../models/categories.json");
const tasksPath = path.join(__dirname, "../models/tasks.json");

const readCategories = () => JSON.parse(fs.readFileSync(categoriesPath));
const writeCategories = (data) => fs.writeFileSync(categoriesPath, JSON.stringify(data, null, 2));
const readTasks = () => JSON.parse(fs.readFileSync(tasksPath));
const writeTasks = (data) => fs.writeFileSync(tasksPath, JSON.stringify(data, null, 2));

function validateCategory(category) {
    if (!category.name || typeof category.name !== 'string') {
        return "Campo 'name' é obrigatório e deve ser uma string";
    }
    return null;
}

exports.getAll = (req, res) => {
    const { categoryId } = req.query;
    let categories = readCategories().filter(c => c.userId === req.user.id);
    if (categoryId) {
        categories = categories.filter(c => c.id == categoryId);
    }
    res.json(categories);
};

exports.getById = (req, res) => {
    const categories = readCategories();
    const category = categories.find(c => c.id == req.params.id && c.userId === req.user.id);
    if (!category) return res.status(404).json({ message: "Categoria não encontrada" });
    res.json(category);
};

exports.create = (req, res) => {
    const categories = readCategories();
    const validationError = validateCategory(req.body);
    if (validationError) return res.status(400).json({ message: validationError });
    const category = { id: Date.now(), ...req.body, userId: req.user.id };
    categories.push(category);
    writeCategories(categories);
    res.status(201).json(category);
};

exports.update = (req, res) => {
    const categories = readCategories();
    const index = categories.findIndex(c => c.id == req.params.id && c.userId === req.user.id);
    if (index === -1) return res.status(404).json({ message: "Categoria não encontrada" });
    const validationError = validateCategory(req.body);
    if (validationError) return res.status(400).json({ message: validationError });
    categories[index] = { ...categories[index], ...req.body };
    writeCategories(categories);
    res.json(categories[index]);
};

exports.remove = (req, res) => {
    const categories = readCategories();
    const categoryId = parseInt(req.params.id);
    const newCategories = categories.filter(c => !(c.id == categoryId && c.userId === req.user.id));

    // Remover categoria das tarefas associadas a ela
    const tasks = readTasks();
    const updatedTasks = tasks.map(task => {
        if (task.categoryId === categoryId && task.userId === req.user.id) {
            return { ...task, categoryId: null };
        }
        return task;
    });
    writeTasks(updatedTasks);
    writeCategories(newCategories);

    res.status(204).send();
};
