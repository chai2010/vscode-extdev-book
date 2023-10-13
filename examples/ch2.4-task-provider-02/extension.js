const vscode = require('vscode');
const pkg = require("./mnbookTaskProvider");

/** @type {vscode.Disposable | undefined} */
let mnbookTaskProvider = null;

/**@type {vscode.OutputChannel} */
let _channel = null;

/** @return {vscode.OutputChannel} */
function getOutputChannel()  {
	if (!_channel) {
		_channel = vscode.window.createOutputChannel('Mnbook Task Provider');
	}
	return _channel;
}

function activate(context /** @param {vscode.ExtensionContext} */) {
	console.log("hello mnbook task provider");

	const workspaceRoot =
		vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
		? vscode.workspace.workspaceFolders[0].uri.fsPath
		: undefined;
	if (!workspaceRoot) {
		getOutputChannel().appendLine('Mnbook task provider requires a workspace root.');
		getOutputChannel().show(true);
		return;
	}

	mnbookTaskProvider = vscode.tasks.registerTaskProvider(
		pkg.MnbookTaskProvider.MnbookType,
		new pkg.MnbookTaskProvider(workspaceRoot)
	);
}

function deactivate() {
	if (mnbookTaskProvider) {
		mnbookTaskProvider.dispose();
	}
}

module.exports = {
	activate,
	deactivate
}
