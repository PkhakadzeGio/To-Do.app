import fs from "node:fs";

const toDoManager = {
	_filename: "todos.json",
	_tasks: null,

	loadTasks() {
		if (fs.existsSync(this._filename)) {
			try {
				const data = fs.readFileSync(this._filename);
				this._tasks = JSON.parse(data);
			} catch {
				console.log("Failed to load");
				this._tasks = [];
			}
		} else {
			console.log("Failed to load");
			this._tasks = [];
		}
		return this._tasks;
	},

	save() {
		fs.writeFileSync(this._filename, JSON.stringify(this._tasks, null, 2));
	},

	addTask(task,dueDate) {
		if (!task || task.trim() === "") return "Task cannot be empty";
		if (this._tasks.some((t) => t.task.toLowerCase() === task.toLowerCase()))
			return "Task already exists";

		const normilizeDTask = task.trim().toLowerCase();
		const finalDueDate = dueDate.trim() === "" ? null : new Date(dueDate)

		const newTask = {
			id:
				this._tasks.length > 0
					? Math.max(...this._tasks.map((t) => t.id)) + 1
					: 1,
			task: normilizeDTask,
			done: false,
			date : new Date().toISOString(),
			dueDate : finalDueDate || null
		};

		this._tasks.push(newTask);
		this.save();
		return "Task added successfully ";
	},

	reindexTasks() {
		this._tasks.forEach((task, index) => {
			task.id = index + 1;
		});
	},

	deleteTask(id) {
		if (!Number.isInteger(id) || id <= 0) {
			return "Enter valid number";
		}

		const oGlength = this._tasks.length;

		this._tasks = this._tasks.filter((t) => t.id !== id);

		if (this._tasks.length === oGlength) {
			return "Task not found";
		}

		this.reindexTasks();
		this.save();
		return "Task deleted successfully";
	},

	deleteCompletedTasks() {
		const oGlength = this._tasks.length;
		this._tasks = this._tasks.filter((t) => !t.done);

		if (this._tasks.length === oGlength) {
			return "There are no completed tasks to delete";
		}

		this.reindexTasks();
		this.save();
		return "Completed tasks deleted successfully";
	},

	deleteActiveTasks() {
		const oGlength = this._tasks.length;
		this._tasks = this._tasks.filter((t) => t.done);

		if (this._tasks.length === oGlength) {
			return "There are no active tasks to delete";
		}

		this.reindexTasks();
		this.save();
		return "Active tasks deleted successfully";
	},

	deleteAllTask() {
		this._tasks = [];
		this.save();
		return "All tasks have been deleted successfully";
	},

	toggleTask(id) {
		if (!Number.isInteger(id) || id <= 0) {
			return "Enter Valid Number";
		}

		const task = this._tasks.find((t) => t.id === id);

		if (!task) {
			return "Task Not found";
		}

		task.done = !task.done;
		this.save();
		return "Task Marked Successfully";
	},

	editTask(id, newTask) {
		if (!Number.isInteger(id) || id <= 0) {
			return "Enter Valid Number";
		}

		const task = this._tasks.find((t) => t.id === id);

		if (!task) {
			return "Task Not Found";
		}

		if (!newTask || newTask.trim() === "") {
			return "Task Cannot Be Empty";
		}

		task.task = newTask.trim().toLowerCase();
		this.save();
		return "Task Edited Successfully";
	},

	getCompleted() {
		return this._tasks.filter((t) => t.done);
	},

	getActive() {
		return this._tasks.filter((t) => !t.done);
	},

	sortTaskByDate(){
		return [...this._tasks].sort((a,b) => {
			if(!a.dueDate) return 1
			if(!b.dueDate) return -1
			return new Date(a.dueDate) - new Date(b.dueDate)
		})
	},

	searchForTask(input){
		if(typeof(input) !== "string"){
			return "Type words which are you searching for ..."
		}
		const words = input.toLowerCase().trim().split(/\s+/)
		const found = this._tasks.filter(t => words.some(word => t.task.includes(word)))


		return found.length > 0 ? found : "Task not found"

	},

	getTasks() {
		return this._tasks;
	},
};

toDoManager.loadTasks();
export default toDoManager;
