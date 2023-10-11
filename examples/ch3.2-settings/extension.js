const vscode = require('vscode');

/** @param {vscode.ExtensionContext} context */
function activate(context) {
	context.subscriptions.push(vscode.commands.registerCommand('extdev.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World!');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extdev.showConfig', () => {
		const config = vscode.workspace.getConfiguration();
		const bookTitle = config.get('vscode-extdev-book.bookTitle');
		vscode.window.showInformationMessage(`bookTitle: ${bookTitle}`);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('extdev.updateConfig', () => {
		const config = vscode.workspace.getConfiguration();
		config.update('vscode-extdev-book.bookTitle', "《VS Code插件开发》")
	}));

	const lastBookTitle = vscode.workspace.getConfiguration().get('vscode-extdev-book.bookTitle');

	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(() => {
		const config = vscode.workspace.getConfiguration();
		const bookTitle = config.get('vscode-extdev-book.bookTitle');
		if(lastBookTitle != bookTitle) {
			vscode.window.showInformationMessage(`bookTitle changed: ${bookTitle}`);
			lastBookTitle = bookTitle;
		}
	}));
}

// this method is called when your extension is deactivated
function deactivate() {}

// eslint-disable-next-line no-undef
module.exports = {
	activate,
	deactivate
}
