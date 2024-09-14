const Task = require("../models/Task");

// Crear una nueva tarea
const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las tareas
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener una tarea por ID
const getTaskId = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: "Tarea no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una tarea por ID
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (task) {
      await task.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Tarea no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una tarea por ID
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (task) {
      await task.update(req.body);
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: "Tarea no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTaskByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const tasks = await Task.findAndCountAll({
      where: { UserId: userId },
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      tasks: tasks.rows,
      totalTasks: tasks.count,
      totalPages: Math.ceil(tasks.count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTaskByCategory = async (req, res) => {
  try {
    //OBTENER VALORES DE LA RUTA
    const { categoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    //CALCULAR EL OFFSET
    const offset = (page - 1) * limit;

    //BUSCAR EN TABLA CON FILTRO Y PAGINADO
    const tasks = await Task.findAndCountAll({
      where: { CategoryId: categoryId },
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    //RESPUESTA A CLIENTE
    res.status(200).json({
        tasks: tasks.rows,
        totalTasks: tasks.count,
        totalPages: Math.ceil(tasks.count/limit),
        currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTask,
  getTaskByCategory,
  getTaskByUser,
  getAllTasks,
  getTaskId,
  deleteTask,
  updateTask,
};
