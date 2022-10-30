class HTMLAST {

	fromStr(str) {}

	fromFile(file) {}

}

export default HTMLAST;

function highlightHtml(code){
	// let color = highlightSettings.html,
	let inStyle = false,
		inScript = false;

	//tags (non-greedy matching)
    code = code.replace(/&lt;(.*?)&gt;/g, htmlSegment);
	//comments (looking for n-dashes, see notes above)
	code = code.replace(/&lt;!––(.+)––&gt;/g, "<span data-code-comment>&lt;!--$1--&gt;</span>");
	//css
	code = code.replace(/(style.*<\/span><span data-code-tagBracket>&gt;<\/span>)(.*)(<span data-code-tagBracket>&lt;<\/span><span data-code-tagBracket>\/<\/span><span data-code-tagName>style)/gi, (match, capture1, capture2, capture3, index) => capture1 + highlightCss(capture2) + capture3);
	//javascript
	code = code.replace(/(script.*<\/span><span data-code-tagBracket>&gt;<\/span>)(.*)(<span data-code-tagBracket>&lt;<\/span><span data-code-tagBracket>\/<\/span><span data-code-tagName>script)/gi, (match, capture1, capture2, capture3, index) => capture1 + highlightJs(capture2) + capture3);

	function htmlSegment(match, capture, index){
		let originalInStyle = inStyle,
			originalInScript = inScript,
			replaced = "<span data-code-tagBracket>&lt;</span>";
		replaced += htmlTag(capture);
		replaced += "<span data-code-tagBracket>&gt;</span>";
		//if we've only just entered <style> or <script>
		//be sure to include the actual <style> or <script> tag first,
		//otherwise ignore any matches not actually in html
		if (inStyle && originalInStyle) return match;
		if (inScript && originalInScript) return match;
		return replaced;
	}
	function htmlTag(tag){
		let originalTag = tag,
			replaced = "";
		//slash
		if (tag[0] === "/"){
			replaced += "<span data-code-tagBracket>/</span>";
			tag = tag.slice(1);
		}
		//tag name
		let tagName;
		if (tag.includes(" ")){
			tagName = tag.slice(0, tag.indexOf(" "));
			tag = tag.slice(tag.indexOf(" "));
		}
		else {
			tagName = tag;
			tag = "";
		}
		replaced += "<span data-code-tagName>" + tagName + "</span>";
		if (tagName.toLowerCase() === "style") inStyle = !inStyle;
		if (tagName.toLowerCase() === "script") inScript = !inScript;
		return replaced + htmlAttributes(tag);
	}
	function htmlAttributes(attributes){
		if (!attributes.trim().length) return "";
		let replaced = "<span data-code-attributeName>";
        replaced += attributes.replace(/(=.*)/g, htmlAttributeValue);
        replaced += "</span>";
		return replaced;
	}
    function htmlAttributeValue(match, value){
        return "<span data-code-attributeEqual>=</span><span data-code-attributeValue>" + value.slice(1) + "</span>";
    }

	// for (let prop in color){
	// 	let regex = new RegExp("data\-" + prop, "gi");
	// 	code = code.replace(regex, "style=color:" + color[prop] + ";");
	// }

	return code;
}
