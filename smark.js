// Declare a global smark object
var smark = {
	// Smark is mainly based on using regex.
	// Regular expressions for matching or replace

	// Use $1 to return the video id  
	youtubeRE: /^(?:https?:\/\/)?(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch|embed\/watch|embed)?[\?\/]?(?:v=|feature=player_embedded&v=)?(\w+)$/,
	vimeoRE: /^(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(?:channels\/)?(?:\w+\/)?(\d+)$/,


	// Match the whole string to return full path to image.
	// This basically just verify it is just a link to an image.
	imageRE: /^(?! ).+\.(jpg|jpeg|gif|png|bmp)$/,


	// Match the whole string to return full URL.
	// This will check that given link is not images while having http type protocol or end with html.
	// Links that do not start with "http://" or end with ".html" 
	//     will not be recognized to prevent some errors with iframe.
	htmlRE: /^((?!.*(jpg|jpeg|gif|png|bmp))(https?:\/\/)[\w\-_]+(\.[\w\-_]+)+[\w\-.,@?^=%&:\/~\\+#]*)|.+\.(?!jpg|jpeg|gif|png|bmp)html?$/,


	// Parses inline markdown style link into <a> tags.
	// Replace with <a href="$2">$1</a> to use.
	linkRE: /\[(.*?)\](?: |-blank )\((.+?)\)/g,
	linkBlankRE: /\[(.*?)\]-blank \((.+?)\)/g,


	// Parse inline mardown style list into a list.
	olRE: /(?:\d\.\s(.+?) \| ?)+/g,
	olliRE: /\d\.\s(.+?) \|/g,
	ulRE: /(?:\*\s(.+?) \| ?)+/g,
	ulliRE: /\*\s(.+?) \|/g,


	// Parses H6 to H1 tags in reverse order.
	h6RE: /#{6} (.+?) #{6}/g,
	h5RE: /#{5} (.+?) #{5}/g,
	h4RE: /#{4} (.+?) #{4}/g,
	h3RE: /#{3} (.+?) #{3}/g,
	h2RE: /#{2} (.+?) #{2}/g,
	h1RE: /# (.+?) #/g,


	// Parse markdown like horizontal rule.
	hrRE: /\s---\s/g,


	// Parse markdown like block quotes.
	bqRE: /```(.+?)(?:\[-source:(.+)\])?```/g,


	// Typographic changes. Check regex.txt for usage.
	dQuotRE: /([[\n \.,;:])\\?"(.+?)\\?"([\n \.,;:\b\]])/g,
	sQuotRE: /([[\n \.,;:])\\?'(.+?)\\?'([\n \.,;:\b\]])/g,
	volRE: /\bvol\.\s\b/gi,
	pRE: /\bp\.\s\b(?=\d+)/g,
	cRE: /\bc\.\s\b(?=\d+)/g,
	flRE: /\bfl\.\s\b(?=\d+)/g,
	ieRE: /\bi\.e\.\s\b/g,
	egRE: /\be\.g\.\s\b/g,
	aposRE: /([A-Za-z]+)'([a-z]+)/g,
	endashRE: /(\d+)-(\d+)/g,
	elipseRE: /\.{3}/g
};


// smark.toHTML = function(source, options){
smark.generate = function(source, options){
	// Temporary variable to store source string for parsing
	var tmp = source;

	// Parse typographic marks are on by default
	var typoMark = true;

	// The resulting html will be stored in this
	var result = "";

	// The type will be stored in this
	var type = "";

	// Check if typographic marks are turned off
	if (options != undefined){
		for (var i = 0; i<options.length; i++){
			if (options[i]==noTypo) typoMark = false;
		}
	}


	if(this.youtubeRE.test(source)){
		// Source is a Youtube link
		tmp = source.replace(this.youtubeRE, "$1");
		result = '<iframe class="smark youtube" src="https://www.youtube.com/embed/'+ tmp + '" frameborder="0" width="853" height="480" allowfullscreen></iframe>';
		type = "youtube";

	}else if(this.vimeoRE.test(source)){
		// Source is a Vimeo link
		tmp = source.replace(this.vimeoRE, "$1");
		result = '<iframe class="smark vimeo" src="https://player.vimeo.com/video/' + tmp + '" frameborder="0" width="853" height="480" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
		type = "vimeo";

	}else if(this.imageRE.test(source)){
		// Source is an image link
		tmp = source.match(this.imageRE)[0];
		result = '<img class="smark image" src="' + tmp + '" width="853" height="480">';
		type = "image";

	}else if(this.htmlRE.test(source)){
		// Source is a general link valid for iframe
		// Note: This is executed after Youtube and Vimeo test
		//       because this will be a valid match for them as well.
		tmp = source.match(this.htmlRE)[0];
		result = '<iframe class="smark website" src="' + tmp + '" width="853" height="480" frameborder="0"></iframe>';
		type = "website";

	}else{
		// Parse the string as a paragraph.
		// Typographic changes will be made if noTypo is not passed.
		// Markdown style syntax will be converted as well.
		tmp = this.parseParagraph(typoMark, tmp);

		// Treat the source as just a paragraph of text.
		result = '<p class="smark paragraph">' + tmp + '</p>';
		type = "paragraph";
	}  

	// return result;
	return {
		html: result,
		type: type
	};
};



// Typographic changes will occur here before parsing into html so as not to mess up html quote marks.
smark.typographicChanges = function(enabled, tmp){
	tmp = tmp.replace(this.dQuotRE, "$1“$2”$3");
	tmp = tmp.replace(this.sQuotRE, "$1‘$2’$3");
	tmp = tmp.replace(this.volRE, "Vol.");
	tmp = tmp.replace(this.pRE, "p.");
	tmp = tmp.replace(this.cRE, "<i>c.</i>");
	tmp = tmp.replace(this.flRE, "<i>fl.</fl>");
	tmp = tmp.replace(this.ieRE, "<i>ie</i> ");
	tmp = tmp.replace(this.egRE, "<i>eg</i> ");
	tmp = tmp.replace(this.aposRE, "$1’$2");
	tmp = tmp.replace(this.endashRE, "$1–$2");
	tmp = tmp.replace(this.elipseRE, "…");

	return tmp;
};



// Parse the string as a paragraph.
// See note.txt for more info.
smark.parseParagraph = function(typoMark, tmp){
	// Typographic changes will occur here before parsing into html so as not to mess up html quote marks.
	tmp = this.typographicChanges(typoMark, tmp);

	// Markdown style syntax will be catch and converted.
	// Markdown style links

	// template is a reused temporary variable, for sneaky convinience only.
	var template = "";
	

	// If the link name is empty use the link address as the name
	if (tmp.replace(this.linkRE, '$1') === ""){
		template = '<a href="$2">$2</a>';
		if (this.linkBlankRE.test(tmp)){
			template = '<a target=_blank href="$2">$2</a>';
		}
	// If the link name is provided, use it then.
	}else{
		template = '<a href="$2">$1</a>';
		if (this.linkBlankRE.test(tmp)){
			template = '<a target=_blank href="$2">$1</a>';
		}
	}
	tmp = tmp.replace(this.linkRE, template);


	// Mardown style list
	// Ordered list
	var matchedOl = tmp.match(this.olRE);
	if (matchedOl != null){
		for (var i=0; i<matchedOl.length; i++){
			var matchedLi = matchedOl[i].match(this.olliRE);

			template = "<ol>";
			for (var j=0; j<matchedLi.length; j++){
				template += "<li>" + matchedLi[j].replace(this.olliRE, "$1") + "</li>";
			}
			template += "</ol>";

			tmp = tmp.replace(matchedOl[i], template);
		}
	}

	// Unordered list
	var matchedUl = tmp.match(this.ulRE);
	if (matchedUl != null){
		for (var i=0; i<matchedUl.length; i++){
			var matchedLi = matchedUl[i].match(this.ulliRE);

			template = "<ul>";
			for (var j=0; j<matchedLi.length; j++){
				template += "<li>" + matchedLi[j].replace(this.ulliRE, "$1") + "</li>";
			}
			template += "</ul>";
			tmp = tmp.replace(matchedUl[i], template);
		}
	}

	// Block quotes
	if(tmp.replace(this.bqRE, "$2") == ""){
		tmp = tmp.replace(this.bqRE, "<blockquote><p>$1</p></blockquote>");
	}else{
		tmp = tmp.replace(this.bqRE, "<blockquote><p>$1</p><footer>$2</footer></blockquote>");
	}

	// Markdown style H6 to H1, in that order.
	tmp = tmp.replace(this.h6RE, "<h6>$1</h6>");
	tmp = tmp.replace(this.h5RE, "<h5>$1</h5>");
	tmp = tmp.replace(this.h4RE, "<h4>$1</h4>");
	tmp = tmp.replace(this.h3RE, "<h3>$1</h3>");
	tmp = tmp.replace(this.h2RE, "<h2>$1</h2>");
	tmp = tmp.replace(this.h1RE, "<h1>$1</h1>");


	// Markdown like horizontal rule.
	// This is much stricter than markdown and I like to keep it that way.
	//    For consistency. Convention before configuration or something like that.
	tmp = tmp.replace(this.hrRE, "<hr />");

	return tmp;
};


// module.exports = smark;
