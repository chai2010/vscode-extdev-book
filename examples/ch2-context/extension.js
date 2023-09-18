// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscontext" is now active!');


	console.log("isTrusted:", vscode.workspace.isTrusted);
	console.log("name:", vscode.workspace.name);
	console.log("textDocuments:", vscode.workspace.textDocuments);
	console.log("workspaceFolders:", vscode.workspace.workspaceFolders);
	console.log("ws:", vscode.workspace);

	console.log("-----");

	/*
	启动时怎么自动执行？下次会保存

	打开文件，打开目录
	打开系统路径，是否信任
	ws的名字时什么

	ws 的 api 部分列表。

	什么是workspace？？？

	*/

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vscontext.helloWorld', function () {
		// The code you place here will be executed every time your command is executed
		console.log("====");

		console.log("isTrusted:", vscode.workspace.isTrusted);
		console.log("name:", vscode.workspace.name);
		console.log("textDocuments:", vscode.workspace.textDocuments);
		console.log("workspaceFolders:", vscode.workspace.workspaceFolders);
		console.log("ws:", vscode.workspace);
		/*
		
const name: string | undefined;
const textDocuments: readonly TextDocument[];
const workspaceFolders: WorkspaceFolder[] | undefined;
const fs: FileSystem;
const isTrusted: boolean;

加载时就执行？
		*/

		// Display a message box to the user
		vscode.window.showInformationMessage(`Hello: ${vscode.workspace.workspaceFolders}`);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
