# 3.4 常用输入框

输入信息是软件和人交换的必要手段，通过界面可以极大改进用户的输入体验。本节讨论常用输入框的使用。

## 3.4.1 列表输入框

最简单的是列表输入框，在2.3.5节我们已经见过Task的配置输入参数采用的列表输入的方式。列表可以通过`vscode.window.showQuickPick()`函数实现，其签名如下：

```ts
interface QuickPickOptions {
    title?: string;
    placeHolder?: string;
    onDidSelectItem?(item: QuickPickItem | string): any;
    // 其他省略
}

function showQuickPick(
    items: readonly string[],
    options?: QuickPickOptions
): Thenable<string>;
```

第一个参数是列表选项，第二个参数是`QuickPickOptions`类型表示输入框的各种配置。配置中比较常用的有`title`标题、`placeHolder`输入提示和`onDidSelectItem`切换选择时的回调函数等。

下面是一个例子：

```js
function activate(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extdev.showQuickPick', () => {
            vscode.window.showQuickPick(
                ['KCL', '凹语言', 'CodeBlitz'],
                {
                    placeHolder: 'KCL, 凹语言 or CodeBlitz',
                    onDidSelectItem: item =>
                        vscode.window.showInformationMessage(
                            `焦点切换: ${item}`
                        )
                }
            ).then((result) => {
                vscode.window.showInformationMessage(`选中: ${result}`);
            });
        })
    );
}
```

显示效果如下：

![](../images/ch3.4-01.png)

## 3.4.2 通用输入框

列表适合有固定选择的输入项。如果是更普通的输入，可以用`vscode.window.showInputBox()`函数，其函数签名如下：

```ts 
interface InputBoxOptions {
    title?: string;
    value?: string;
    placeHolder?: string;
    password?: boolean;
    validateInput?(value: string): string;
    // 其他省略
}

function showInputBox(options?: InputBoxOptions): Thenable<string>;
```

因为没有后续列表项，参数主要是`InputBoxOptions`配置信息，其标题、默认值和提示信息等基础内容和`QuickPickOptions`相似。但是输入框不仅仅可以设置密码输入模式，还可以通过`validateInput`函数验证输入的合法性。

下面是一个例子：

```js
function activate(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extdev.showInputBox', () => {
            vscode.window.showInputBox({
                value: 'abc',
                placeHolder: 'For example: abc. But not: 123',
                validateInput: text => {
                    vscode.window.showInformationMessage(`Validating: ${text}`);
                    return text === '123' ? 'Not 123!' : null;
                }
            }).then((result) => {
                vscode.window.showInformationMessage(`Got: ${result}`);
            });
        })
    );
}
```

显示效果如下：


![](../images/ch3.4-02.png)

遇到无效的输入：

![](../images/ch3.4-03.png)

