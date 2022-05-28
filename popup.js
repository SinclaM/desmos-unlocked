let setToText = document.getElementById('setToText');
let setToDefault = document.getElementById('setToDefault');
let setToDesmosDefault = document.getElementById('setToDesmosDefault');
let textbox = document.querySelector('textarea');
console.log(textbox);

chrome.storage.sync.get('autoCommands', function(data) {
  textbox.value = data.autoCommands;
});

setToText.onclick = function(element) {
	chrome.storage.sync.set({autoCommands: textbox.value}, function() {});
};
setToDefault.onclick = function(element) {
	chrome.storage.sync.set({autoCommands: 'alpha beta sqrt theta Theta phi Phi pi Pi tau nthroot cbrt sum prod int ans percent infinity infty gamma Gamma delta Delta epsilon epsiv zeta eta kappa lambda Lambda mu xi Xi rho sigma Sigma chi Psi omega Omega'}, function() {});
	textbox.value = 'alpha beta sqrt theta Theta phi Phi pi Pi tau nthroot cbrt sum prod int ans percent infinity infty gamma Gamma delta Delta epsilon epsiv zeta eta kappa lambda Lambda mu xi Xi rho sigma Sigma chi Psi omega Omega';
};
setToDesmosDefault.onclick = function(element) {
	chrome.storage.sync.set({autoCommands: 'alpha beta sqrt theta phi pi tau nthroot cbrt sum prod int ans percent infinity infty'}, function() {});
	textbox.value = 'alpha beta sqrt theta phi pi tau nthroot cbrt sum prod int ans percent infinity infty';
};

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});
