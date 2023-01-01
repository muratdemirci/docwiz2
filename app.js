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
            setValueToInput({ inputId: "html-output", value: parse(element.innerHTML) });
        });
        observer.observe(element, {childList: true});
    });
}

// parser map starts
var
	/**
	 * The parsed output string, in HTML format.
	 * @type {String}
	 */
	output = "",

	BLOCK = "block",
	INLINE = "inline",

	/**
	 * Used to attach MarkdownToHtml object to `window` in browser
	 * context, or as an AMD module where appropriate.
	 * @type {Object}
	 */
	exports,

	/**
	 * An array of parse rule descriptor objects. Each object has two keys;
	 * pattern (the RegExp to match), and replace (the replacement string or
	 * function to execute).
	 * @type {Array}
	 */
	parseMap = [
		{
			// <h1>
			// A line starting with 1-6 hashes.
			pattern: /(#{1,6})([^\n]+)/g,
			replace: "<h$L1>$2</h$L1>",
			type: BLOCK,
		},
		{
			// <p>
			// Any line surrounded by newlines that doesn't start with
			// an HTML tag, asterisk or numeric value with dot following.
			pattern: /\n(?!<\/?\w+>|\s?\*|\s?[0-9]+|>|\&gt;|-{5,})([^\n]+)/g,
			replace: "<p>$1</p>",
			type: BLOCK,
		},
		{
			// <blockquote>
			// A greater-than character preceding any characters.
			pattern: /\n(?:&gt;|\>)\W*(.*)/g,
			replace: "<blockquote><p>$1</p></blockquote>",
			type: BLOCK,
		},
		{
			// <ul>
			//
			pattern: /\n\s?\*\s*(.*)/g,
			replace: "<ul>\n\t<li>$1</li>\n</ul>",
			type: BLOCK,
		},
		{
			// <ol>
			//
			pattern: /\n\s?[0-9]+\.\s*(.*)/g,
			replace: "<ol>\n\t<li>$1</li>\n</ol>",
			type: BLOCK,
		},
		{
			// <strong>
			// Either two asterisks or two underscores, followed by any
			// characters, followed by the same two starting characters.
			pattern: /(\*\*|__)(.*?)\1/g,
			replace: "<strong>$2</strong>",
			type: INLINE,
		},
		{
			// <em>
			// Either one asterisk or one underscore, followed by any
			// characters, followed by the starting character.
			pattern: /(\*|_)(.*?)\1/g,
			replace: "<em>$2</em>",
			type: INLINE,
		},
		{
			// <a>
			// Not starting with an exclamation mark, square brackets
			// surrounding any characters, followed by parenthesis surrounding
			// any characters.
			pattern: /([^!])\[([^\[]+)\]\(([^\)]+)\)/g,
			replace: "$1<a href=\"$3\">$2</a>",
			type: INLINE,
		},
		{
			// <img>
			// Starting with an exclamation mark, then followed by square
			// brackets surrounding any characters, followed by parenthesis
			// surrounding any characters.
			pattern: /!\[([^\[]+)\]\(([^\)]+)\)/g,
			replace: "<img src=\"$2\" alt=\"$1\" />",
			type: INLINE,
		},
		{
			// <del>
			// Double tilde characters surrounding any characters.
			pattern: /\~\~(.*?)\~\~/g,
			replace: "<del>$1</del>",
			type: INLINE,
		},
		{
			// <code>
			//
			pattern: /`(.*?)`/g,
			replace: "<code>$1</code>",
			type: INLINE,
		},
		{
			// <hr>
			//
			pattern: /\n-{5,}\n/g,
			replace: "<hr />",
			type: BLOCK,
		},
	];


function parse(string) {
	// Pad with newlines for compatibility.
	output = "\n" + string + "\n";

	parseMap.forEach(function(p) {
		// Replace all matches of provided RegExp pattern with either the
		// replacement string or callback function.
		output = output.replace(p.pattern, function() {
			// // console.log(this, arguments);
			return replace.call(this, arguments, p.replace, p.type);
		});
	});

	// Perform any post-processing required.
	output = clean(output);
	// Trim for any spaces or newlines.
	output = output.trim();
	// Tidy up newlines to condense where more than 1 occurs back to back.
	output = output.replace(/[\n]{1,}/g, "\n");
	return output;
}

function replace(matchList, replacement, type) {
	var
		i,
	$$;

	for(i in matchList) {
		if(!matchList.hasOwnProperty(i)) {
			continue;
		}

		// Replace $n with the matching regexp group.
		replacement = replacement.split("$" + i).join(matchList[i]);
		// Replace $Ln with the matching regexp group's string length.
		replacement = replacement.split("$L" + i).join(matchList[i].length);
	}

	if(type === BLOCK) {
		replacement = replacement.trim() + "\n";
	}

	return replacement;
}

function clean(string) {
	var cleaningRuleArray = [
		{
			match: /<\/([uo]l)>\s*<\1>/g,
			replacement: "",
		},
		{
			match: /(<\/\w+>)<\/(blockquote)>\s*<\2>/g,
			replacement: "$1",
		},
	];

	cleaningRuleArray.forEach(function(rule) {
		string = string.replace(rule.match, rule.replacement);
	});

	return string;
}