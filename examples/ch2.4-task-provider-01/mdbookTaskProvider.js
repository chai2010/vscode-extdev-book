const vscode = require('vscode');

/** @implements {vscode.TaskProvider} */
class MdbookTaskProvider {
	static MdbookType = 'mdbook';

	/** @type {string} */
	workspaceRoot = undefined;

	/** @type {Thenable<vscode.Task[]> | undefined} */
	mdbookPromise = undefined;

	constructor(workspaceRoot /** @param {string} */) {
		this.workspaceRoot = workspaceRoot;
	}

	/**
	 * @returns {Thenable<vscode.Task[]> | undefined}
	 */ 
	provideTasks() {
		if(!this.mdbookPromise) {
			this.mdbookPromise = this.getTasks();
		}
		return this.mdbookPromise;
	}

	/**
	 * @param {vscode.Task | undefined} _task
	 */
	resolveTask(_task) {
		return undefined;
	}

	getTasks() {
		const buildTask = new vscode.Task(
			{type: 'mdbook', task: 'build'}, // kind
			vscode.TaskScope.Workspace,      // scope
			'build',                         // name
			'mdbook',                        // source
			new vscode.ShellExecution(`mdbook build`), // execution
			`mdbook_build`
		);

		let previewExec;

		// macos only
		previewExec = new vscode.ShellExecution(`open ${this.workspaceRoot}/book/index.html`);

		// dependsOn build?

		const previewTask = new vscode.Task(
			{type: 'mdbook', task: 'preview'}, // kind
			vscode.TaskScope.Workspace,        // scope
			'preview',                         // name
			'mdbook',                          // source
			previewExec, // execution
			`mdbook_preview`
		);
		const cleanTask = new vscode.Task(
			{type: 'mdbook', task: 'clean'}, // kind
			vscode.TaskScope.Workspace,      // scope
			'clean',                         // name
			'mdbook',                        // source
			new vscode.ShellExecution(`mdbook clean`), // execution
			`mdbook_clean`
		);
		return [buildTask, previewTask, cleanTask];
	}
}

module.exports = {
	MdbookTaskProvider,
}
