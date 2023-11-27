const vscode = require('vscode');

/**
 * @param {string} title
 * @param {number} step
 * @param {number} totalSteps
 * @param {string[]} items
 * @returns vscode.Thenable<string|undefined>
 */
function showMultiStepQuickPick(title, step, totalSteps, items) {
	const quickPick = vscode.window.createQuickPick();
	quickPick.items = items.map(label => ({label}));
	quickPick.title = title;
	quickPick.step = step;
	quickPick.totalSteps = totalSteps;
	quickPick.show();

	return Promise.race([
		new Promise(c => quickPick.onDidChangeSelection((selection) => {
			c(selection[0].label);
			quickPick.hide();
		})),
		new Promise(c => quickPick.onDidAccept(() => {
			c(quickPick.value);
			quickPick.hide();
		})),
		new Promise((_, reject) => quickPick.onDidHide(() => {
			reject(undefined);
		})),
	]);
}

/** @param {vscode.ExtensionContext} context */
function activate(context) {
	context.subscriptions.push(
		vscode.commands.registerCommand('extdev.multiStepInput', () => {
			const totalSteps = 3;
			showMultiStepQuickPick('第一步', 1, totalSteps, ["aa1", "bb1", "cc1"]).then(result1 => {
				showMultiStepQuickPick('第二步', 2, totalSteps, ["aa2", "bb2", "cc2"]).then(result2 => {
					showMultiStepQuickPick('第三步', 3, totalSteps, ["aa3", "bb3", "cc3"]).then(result3 => {
						vscode.window.showInformationMessage(`${result1} -> ${result2} -> ${result3}`);
					});
				});
			});
		})
	);
}

// this method is called when your extension is deactivated
function deactivate() {}

// eslint-disable-next-line no-undef
module.exports = {
	activate,
	deactivate
}
