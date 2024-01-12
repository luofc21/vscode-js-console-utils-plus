const vscode = require('vscode');

const insertText = (val) => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage('Can\'t insert log because no document is open');
        return;
    }

    const selection = editor.selection;

    const range = new vscode.Range(selection.start, selection.end);

    editor.edit((editBuilder) => {
        editBuilder.replace(range, val);
    });
}

function getAllLogStatements(document, documentText) {
    let logStatements = [];

    const logRegex = /console.(log|debug|info|warn|error|assert|dir|dirxml|trace|group|groupEnd|time|timeEnd|profile|profileEnd|count)\((.*)\);?/g;
    let match;
    while (match = logRegex.exec(documentText)) {
        let matchRange =
            new vscode.Range(
                document.positionAt(match.index),
                document.positionAt(match.index + match[0].length)
            );
        if (!matchRange.isEmpty)
            logStatements.push(matchRange); 
    }
    return logStatements;
}

function deleteFoundLogStatements(workspaceEdit, docUri, logs) {
    logs.forEach((log) => {
        workspaceEdit.delete(docUri, log);
    });

    vscode.workspace.applyEdit(workspaceEdit).then(() => {
        logs.length > 1
            ? vscode.window.showInformationMessage(`${logs.length} console.logs deleted`)
            : vscode.window.showInformationMessage(`${logs.length} console.log deleted`);
    });
}

function annotateFoundLogStatements(workspaceEdit, doc, logs) {
    logs.forEach((log) => {
        workspaceEdit.insert(doc.uri, log.start, `// `);
    });

    vscode.workspace.applyEdit(workspaceEdit).then(() => {
        logs.length > 1
            ? vscode.window.showInformationMessage(`${logs.length} console.logs annotated`)
            : vscode.window.showInformationMessage(`${logs.length} console.log annotated`);
    });
}
function activate(context) {
    console.log('console-log-utils is now active');

    const insertLogStatement = vscode.commands.registerCommand('extension.insertLogStatement', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        const selection = editor.selection;
        const text = editor.document.getText(selection);
        const formatText = vscode.workspace.getConfiguration().get('console.formatText') // 自定义格式化样式配置
        const pureFormatText = formatText.replaceAll('variable', text);

        text
            ? vscode.commands.executeCommand('editor.action.insertLineAfter')
                .then(() => {
                    const logToInsert = `console.log(${formatText ? pureFormatText : `'${text}:', ${text}`});`;
                    insertText(logToInsert);
                })
            : insertText('console.log();');

    });
    context.subscriptions.push(insertLogStatement);

    const deleteAllLogStatements = vscode.commands.registerCommand('extension.deleteAllLogStatements', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        const document = editor.document;
        const documentText = editor.document.getText();

        let workspaceEdit = new vscode.WorkspaceEdit();

        const logStatements = getAllLogStatements(document, documentText);

        deleteFoundLogStatements(workspaceEdit, document.uri, logStatements);
    });
    context.subscriptions.push(deleteAllLogStatements);

    const annotatellLogStatements = vscode.commands.registerCommand('extension.annotatellLogStatements', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        const document = editor.document;
        const documentText = editor.document.getText();

        let workspaceEdit = new vscode.WorkspaceEdit();

        const logStatements = getAllLogStatements(document, documentText);

        annotateFoundLogStatements(workspaceEdit, document, logStatements);
    });
    context.subscriptions.push(annotatellLogStatements);
}
exports.activate = activate;

function deactivate() {
}

exports.deactivate = deactivate;
