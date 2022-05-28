// thx stackOverflow
// https://stackoverflow.com/questions/9515704/insert-code-into-the-page-context-using-a-content-script/9517879#9517879

function updateAutoCommands() {
	chrome.storage.sync.get('autoCommands', function(data) {
		var actualCode = `Desmos.MathQuill.config({
			autoCommands: "${data.autoCommands}"
		});
    console.log(Desmos.MathQuill.config);`;
		var script = document.createElement('script');
		script.textContent = actualCode;
		(document.head||document.documentElement).appendChild(script);
		script.remove();
	});
}
updateAutoCommands();
chrome.storage.onChanged.addListener(updateAutoCommands);
