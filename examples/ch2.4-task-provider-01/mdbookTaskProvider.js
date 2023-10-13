const vscode = require('vscode');

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

	getTasks() {
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

		// dependsOn build?

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

module.exports = {
	MnbookTaskProvider,
}
