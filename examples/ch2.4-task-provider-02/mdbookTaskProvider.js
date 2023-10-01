const vscode = require('vscode');
const child_process = require('child_process');
const fs = require('fs');

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

	async getTasks() {
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

		/*
		const { stdout, stderr } = await exec(commandLine, { cwd: folderString });
			if (stderr && stderr.length > 0) {
				getOutputChannel().appendLine(stderr);
				getOutputChannel().show(true);
			}
		*/

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
	MdbookTaskProvider,
}
