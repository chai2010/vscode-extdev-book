const vscode = require('vscode');
const child_process = require('child_process');
const fs = require('fs');

/** @implements {vscode.TaskProvider} */
class waBookTaskProvider {
	static waBookType = 'wabook';

	/** @type {string} */
	workspaceRoot = undefined;

	/** @type {Thenable<vscode.Task[]> | undefined} */
	waBookPromise = undefined;

	constructor(workspaceRoot /** @param {string} */) {
		this.workspaceRoot = workspaceRoot;
	}

	/**
	 * @returns {Thenable<vscode.Task[]> | undefined}
	 */ 
	provideTasks() {
		if(!this.waBookPromise) {
			this.waBookPromise = this.getTasks();
		}
		return this.waBookPromise;
	}

	/**
	 * @param {vscode.Task | undefined} _task
	 */
	resolveTask(_task) {
		return undefined;
	}

	async getTasks() {
		const buildTask = new vscode.Task(
			{type: 'wabook', task: 'build'}, // kind
			vscode.TaskScope.Workspace,      // scope
			'build',                         // name
			'wabook',                        // source
			new vscode.ShellExecution(`wabook build`), // execution
			`waBook_build`
		);

		let previewExec;

		// macos only
		previewExec = new vscode.ShellExecution(`wabook build && open ${this.workspaceRoot}/book/index.html`);

		const previewTask = new vscode.Task(
			{type: 'wabook', task: 'preview'}, // kind
			vscode.TaskScope.Workspace,        // scope
			'preview',                         // name
			'wabook',                          // source
			previewExec, // execution
			`waBook_preview`
		);
		const cleanTask = new vscode.Task(
			{type: 'wabook', task: 'clean'}, // kind
			vscode.TaskScope.Workspace,      // scope
			'clean',                         // name
			'wabook',                        // source
			new vscode.ShellExecution(`wabook clean`), // execution
			`waBook_clean`
		);
		return [buildTask, previewTask, cleanTask];
	}
}

/**
 * @param {string} file 
 * @returns {Promise<boolean>}
 */
function exists(file) {
	return new Promise((resolve, _reject) => {
		fs.exists(file, (value) => {
			resolve(value);
		});
	});
}

/**
 * @param {string} command 
 * @param {child_process.ExecOptions} options 
 * @returns {Promise<{ stdout: string; stderr: string }>}
 */
function exec(command, options) {
	return new Promise((resolve, reject) => {
		child_process.exec(command, options, (error, stdout, stderr) => {
			if (error) {
				reject({ error, stdout, stderr });
			}
			resolve({ stdout, stderr });
		});
	});
}

module.exports = {
	waBookTaskProvider,
}
