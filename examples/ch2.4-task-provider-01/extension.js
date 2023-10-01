const vscode = require('vscode');
const pkg = require("./mdbookTaskProvider");

/** @type {vscode.Disposable | undefined} */
let mdbookTaskProvider = null;

/**@type {vscode.OutputChannel} */
let _channel = null;

/** @return {vscode.OutputChannel} */
function getOutputChannel()  {
	if (!_channel) {
		_channel = vscode.window.createOutputChannel('Mdbook Task Provider');
	}
	return _channel;
}

function activate(context /** @param {vscode.ExtensionContext} */) {
	console.log("hello mdbook task provider");

	const workspaceRoot =
		vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
		? vscode.workspace.workspaceFolders[0].uri.fsPath
		: undefined;
	if (!workspaceRoot) {
		getOutputChannel().appendLine('Mdbook task provider requires a workspace root.');
		getOutputChannel().show(true);
		return;
	}

	mdbookTaskProvider = vscode.tasks.registerTaskProvider(
		pkg.MdbookTaskProvider.MdbookType,
		new pkg.MdbookTaskProvider(workspaceRoot)
	);
}

function deactivate() {
	if (mdbookTaskProvider) {
		mdbookTaskProvider.dispose();
	}
}

module.exports = {
	activate,
	deactivate
}
