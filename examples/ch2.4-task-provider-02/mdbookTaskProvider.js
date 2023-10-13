const vscode = require('vscode');
const child_process = require('child_process');
const fs = require('fs');

/** @implements {vscode.TaskProvider} */
class MnbookTaskProvider {
	static MnbookType = 'mnbook';

	/** @type {string} */
	workspaceRoot = undefined;

	/** @type {Thenable<vscode.Task[]> | undefined} */
	mnbookPromise = undefined;

	constructor(workspaceRoot /** @param {string} */) {
		this.workspaceRoot = workspaceRoot;
	}

	/**
	 * @returns {Thenable<vscode.Task[]> | undefined}
	 */ 
	provideTasks() {
		if(!this.mnbookPromise) {
			this.mnbookPromise = this.getTasks();
		}
		return this.mnbookPromise;
	}

	/**
	 * @param {vscode.Task | undefined} _task
	 */
	resolveTask(_task) {
		return undefined;
	}

	async getTasks() {
		const buildTask = new vscode.Task(
			{type: 'mnbook', task: 'build'}, // kind
			vscode.TaskScope.Workspace,      // scope
			'build',                         // name
			'mnbook',                        // source
			new vscode.ShellExecution(`mnbook build`), // execution
			`mnbook_build`
		);

		let previewExec;

		// macos only
		previewExec = new vscode.ShellExecution(`mnbook build && open ${this.workspaceRoot}/book/index.html`);

		const previewTask = new vscode.Task(
			{type: 'mnbook', task: 'preview'}, // kind
			vscode.TaskScope.Workspace,        // scope
			'preview',                         // name
			'mnbook',                          // source
			previewExec, // execution
			`mnbook_preview`
		);
		const cleanTask = new vscode.Task(
			{type: 'mnbook', task: 'clean'}, // kind
			vscode.TaskScope.Workspace,      // scope
			'clean',                         // name
			'mnbook',                        // source
			new vscode.ShellExecution(`mnbook clean`), // execution
			`mnbook_clean`
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
	MnbookTaskProvider,
}
