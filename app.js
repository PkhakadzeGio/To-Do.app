import readline from "node:readline/promises";
import toDoManager from "./toDoManager.js";

function printTasks(tasks) {
	tasks.forEach((t) => {
		console.log(
			`Id : [${t.id}] - [${t.done ? "✅" : "❌"}] ${t.task[0].toUpperCase() + t.task.slice(1).toLowerCase()} - DueDate : [${formatDate(t.dueDate)}]`)})

	}


function formatDate(dateString) {
	if (!dateString) return "No date";

	const date = new Date(dateString);
	const now = new Date();

	const day = date.getDate();
	const month = date.toLocaleString("en-US", { month: "short" });
	const year = date.getFullYear();

	if (year === now.getFullYear()) {
		return `${day} ${month}`;
	}
	return `${year} ${month} ${day}`;
}

function getTaskOrBack(message) {
	const tasks = toDoManager.getTasks();
	if (tasks.length === 0) {
		console.log(message);
		return null;
	}
	return tasks;
}

async function handleEditTaskById(id) {
	const newTask = await rl.question("Edit Task : ");
	const answer = await rl.question(
		`Are you sure you want to edit task with Id : "${id}" \n with "${newTask}" ?  y/n  :  `,
	);

	if (answer.trim().toLowerCase() === "y") {
		const result = toDoManager.editTask(Number(id), newTask);
		console.log(result);
		await rl.question("Press [Enter] for continue...");
	} else {
		console.log("Back to menu");
	}
}

async function handleMarkTaskById(id) {
	const result = toDoManager.toggleTask(Number(id));
	console.log(result);

	await rl.question("Press [Enter] to continue...");
}

async function handleDeleteTaskById(id) {
	const answer = await rl.question(
		`Are you sure you want to delete task with Id: "${id}" ?  y/n :  `,
	);

	if (answer.trim().toLowerCase() === "y") {
		const result = toDoManager.deleteTask(Number(id));
		console.log(result);
		await rl.question("Press [Enter] for continue...");
	} else {
		console.log("Back to menu");
	}
}

async function navigationPromptForSubMenu() {
	const answer = await rl.question(
		"\n[Enter] Repeat the menu | [b] Back | [q] Quit : ",
	);
	const a = answer.trim().toLowerCase();

	if (a === "") return "repeat";
	if (a === "b") return "back";
	if (a === "q") return "quit";

	console.log("Invalid choice, try again.");
	return navigationPromptForSubMenu();
}

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

async function main() {
	let running = true;
	while (running) {
		console.log("M E N U");
		console.log("\n1. Add task");
		console.log("2. Show Tasks");
		console.log("3. Delete Tasks");
		console.log("4. Mark Task");
		console.log("5. Edit Task");
		console.log("6. Search");

		console.log("0. EXIT");

		const choice = await rl.question("Choose an option : ");

		const option = Number(choice);
		if (option === 1) {
			const task = await rl.question("Enter task : ");
			const dueDate = await rl.question(
				"Enter due date (YYYY-MM-DD) or leave empty: ",
			);
			const res = toDoManager.addTask(task, dueDate);
			console.log(res);
			await rl.question("Press [Enter] to continue...");
		} else if (option === 2) {
			const tasks = getTaskOrBack("No tasks yet");
			if (!tasks) return;

			async function subMenu() {
				let runningSubMenu = true;

				while (runningSubMenu) {
					console.log("1. Show all");
					console.log("2. Show completed");
					console.log("3. Show active");
					console.log("4. Show tasks sorted by date");

					console.log("0. Back");
					const choice = await rl.question("Choose an option : ");

					const option = Number(choice);
					if (option === 1) {
						console.log("Your Tasks : ");
						printTasks(tasks);
					} else if (option === 2) {
						if (toDoManager.getCompleted().length === 0) {
							console.log("No completed tasks yet.");
						}
						console.log("Your Tasks : ");
						printTasks(toDoManager.getCompleted());
					} else if (option === 3) {
						if (toDoManager.getActive().length === 0) {
							console.log("No active tasks yet");
						}
						console.log("Your Tasks : ");
						printTasks(toDoManager.getActive());
					} else if (option === 4) {
						printTasks(toDoManager.sortTaskByDate());
					} else if (option === 0) {
						runningSubMenu = false;
					} else {
						console.log("Enter Valid Option");
					}

					if (!runningSubMenu) break;

					const nav = await navigationPromptForSubMenu();
					if (nav === "back") {
						runningSubMenu = false;
					} else if (nav === "quit") {
						console.log("Goodbye!");
						rl.close();
						process.exit(0);
					}
				}
			}
			await subMenu();
		} else if (option === 3) {
			const tasks = getTaskOrBack("No tasks to delete");
			if (!tasks) return;

			async function subMenuDeleting() {
				const runningSubMenu = true;
				while (runningSubMenu) {
					console.log("Delete : ");
					console.log("1. One Task ");
					console.log("2. Completed");
					console.log("3. Active");
					console.log("4. All");
					console.log("0. Back to main menu");

					const choice = await rl.question("Choos an option : ");
					const option = Number(choice);

					if (option === 1) {
						printTasks(toDoManager.getTasks());
						const id = await rl.question("Enter id for deleting : ");
						await handleDeleteTaskById(id);
					} else if (option === 2) {
						printTasks(toDoManager.getTasks());
						const answer = await rl.question(
							`Are you sure you want to delete completed tasks ? y/n : `,
						);
						if (answer.trim().toLowerCase() === "y") {
							const result = toDoManager.deleteCompletedTasks();
							console.log(result);
							await rl.question("Press [Enter] to continue...");
						}
					} else if (option === 3) {
						printTasks(toDoManager.getTasks());
						const answer = await rl.question(
							`Are you sure you want delete active tasks ? y/n : `,
						);
						if (answer.trim().toLowerCase() === "y") {
							const result = toDoManager.deleteActiveTasks();
							console.log(result);
							await rl.question("Press [Enter] to continue...");
						}
					} else if (option === 4) {
						printTasks(toDoManager.getTasks());
						const answer = await rl.question(
							`Are you sure you want to delete All tasks ? y/n : `,
						);
						if (answer.trim().toLowerCase() === "y") {
							const result = toDoManager.deleteAllTask();
							console.log(result);
							await rl.question("Press [Enter] to continue...");
						}
					} else if (option === 0) {
						break;
					}
				}
			}
			await subMenuDeleting();
		} else if (option === 4) {
			const tasks = getTaskOrBack("No tasks to mark");
			if (!tasks) return;

			printTasks(tasks);

			const id = await rl.question("Enter Task Id to mark  : ");
			await handleMarkTaskById(id);
		} else if (option === 5) {
			const tasks = getTaskOrBack("No Tasks To Edit");
			if (!tasks) return;

			printTasks(tasks);

			const id = await rl.question("Enter Id : ");
			await handleEditTaskById(id);
		} else if (option === 6) {
			const tasks = getTaskOrBack("No tasks yet");
			if (!tasks) return;

			const search = await rl.question("Type for searching : ");
			const result = toDoManager.searchForTask(search);

			if (Array.isArray(result)) {
				printTasks(result);
				if (result.length > 0) {
					const id = await rl.question(
						"Which task are you looking for ? Choose Id : ",
					);
					const chosenTask = toDoManager
						.getTasks()
						.find((t) => t.id === Number(id));
					if (!chosenTask) {
						console.log("Invalid id");
					} else {
						console.log("1. Edit");
						console.log("2. Mark");
						console.log("3. Delete");
						const nextOption = Number(
							await rl.question("What you want to do with chosen task ? : "),
						);
						if (nextOption === 1) {
							await handleEditTaskById(chosenTask.id);
						} else if (nextOption === 2) {
							await handleMarkTaskById(chosenTask.id);
						} else if (nextOption === 3) {
							await handleDeleteTaskById(chosenTask.id);
						} else {
							console.log("Enter valid number");
						}
					}
				}
			} else {
				console.log(result);
			}
		} else if (option === 0) {
			console.log("Goodbye !");
			running = false;
		} else {
			console.log("Enter valid number");
		}
	}

	rl.close();
	process.exit(0);
}

await main();
