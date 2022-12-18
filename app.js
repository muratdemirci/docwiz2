// test
console.log("follow the deusmur 🐰")
// in this project, everything will be in the same file.

const textAreaInput = { value: "lorem ipsum" }

window.onload = () => {
    // 1) init example markdown text
    // 2) if user uses docwiz at the second time, load saved user data from local storage
    init();
}

function init() {
    textInput();
    setInitialValues();
    watch({id: "☯"})
}

function setInitialValues(){
    setValueToInput({ inputId: "text-input", value: textAreaInput.value });
    setValueToInput({ inputId: "html-output", value: textAreaInput.value });
}

function textInput() {
    inputOnChange({inputId: "text-input", eventType: "input", selector: "byId" });
}

// first of all we need onchange event for textarea
function inputOnChange(args) {
    const input = document.getElementById(args.inputId);
    input.addEventListener(args.eventType, function (e) {
        textAreaInput.value = e.target.value;
        setValueToInput({ inputId: "☯", value: textAreaInput.value });
    });
}

function setValueToInput(args) {
    const input = document.getElementById(args.inputId);
    input.innerHTML= args.value;
}

function watch(args) {
    var element = document.getElementById(args.id);
    element.addEventListener('DOMSubtreeModified', function () {
        element = document.getElementById(args.id);
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var observer = new MutationObserver(function() {
            console.log(`value changed to ${element.innerHTML}`)
            // set new value to display
            setValueToInput({ inputId: "html-output", value: element.innerHTML });
        });
        observer.observe(element, {childList: true});
    });
}

function markdownToHtmlParser(){
    // TODO: make this parser...
}