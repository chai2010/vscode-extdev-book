# 3.5 多步骤输入框

多步骤输入框是比较常用也比较复杂的问题，VS Code的`QuickInput`等提供了界面实现。本节我们讨论多步骤输入框的实现。

## 3.5.1 最简实现

先看一个最简单实现，先封装一个`showMultiStepQuickPick`，其中参数部分包含了多步骤输入框基本参数：

```js
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
            if (selection[0]) { c(selection[0].label); } else { c(undefined); }
            quickPick.hide();
        })),
        new Promise(c => quickPick.onDidAccept(() => {
            c(quickPick.value);
            quickPick.hide();
        })),
        new Promise(c => quickPick.onDidHide(() => {
            c(undefined);
        }))
    ]);
}
```

然后通过`Promise`封装3个顺序的异步代码：

```js
/** @param {vscode.ExtensionContext} context */
function activate(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extdev.multiStepInput', () => {
            const totalSteps = 3;
            showMultiStepQuickPick(
                '第一步', 1, totalSteps, ["aa1", "bb1", "cc1"]
            ).then(result1 => {
                showMultiStepQuickPick(
                    '第二步', 2, totalSteps, ["aa2", "bb2", "cc2"]
                ).then(result2 => {
                    showMultiStepQuickPick(
                        '第三步', 3, totalSteps, ["aa3", "bb3", "cc3"]
                    ).then(result3 => {
                        vscode.window.showInformationMessage(
                            `${result1} -> ${result2} -> ${result3}`
                        );
                    });
                });
            });
        })
    );
}
```

以下是执行效果图：

![](../images/ch3.5-01.png)

但是这个多步骤输入功能非常不稳健：不能后退也没有中间退出机制——输入的交互非常生硬。

## 3.5.2 后退和前进导航

TODO
