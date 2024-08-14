const vscode = require('vscode');

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

	getTasks() {
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

		// dependsOn build?

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

module.exports = {
	waBookTaskProvider,
}
