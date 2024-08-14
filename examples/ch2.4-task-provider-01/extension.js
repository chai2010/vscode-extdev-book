const vscode = require('vscode');
const pkg = require("./waBookTaskProvider");

/** @type {vscode.Disposable | undefined} */
let waBookTaskProvider = null;

/**@type {vscode.OutputChannel} */
let _channel = null;

/** @return {vscode.OutputChannel} */
function getOutputChannel()  {
	if (!_channel) {
		_channel = vscode.window.createOutputChannel('waBook Task Provider');
	}
	return _channel;
}

function activate(context /** @param {vscode.ExtensionContext} */) {
	console.log("hello wabook task provider");

	const workspaceRoot =
		vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
		? vscode.workspace.workspaceFolders[0].uri.fsPath
		: undefined;
	if (!workspaceRoot) {
		getOutputChannel().appendLine('waBook task provider requires a workspace root.');
		getOutputChannel().show(true);
		return;
	}

	waBookTaskProvider = vscode.tasks.registerTaskProvider(
		pkg.waBookTaskProvider.waBookType,
		new pkg.waBookTaskProvider(workspaceRoot)
	);
}

function deactivate() {
	if (waBookTaskProvider) {
		waBookTaskProvider.dispose();
	}
}

module.exports = {
	activate,
	deactivate
}
