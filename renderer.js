let sequence = require('./exp/sequence')
let jq = require('jquery')
let answer = require('./exp/answer')

let subjectNum = 10;

let current = -1;
let currentItem = null;
let exp = [];

let elmts = {
	head: jq("#header"),
	descr: jq("#description"),
	question: jq("#question"),
	range: jq("#range"),
	order: jq("#order"),
	choice: jq("#choice"),
	submit: jq("#submit"),
	choices: [
		jq("choice-1"),
		jq("choice-2"),
		jq("choice-3")
	]
}

function init(subjectNum) {
	if (subjectNum == 0) {
		exp = sequence.get(0);
	} else {
		exp = sequence.get((subjectNum+1)%3+1);
	}
	current = -1;
	currentItem = null;
}

function next() {
	current += 1;
	if (current >= exp.length) {
		displayEndOfExp();
		return;
	}
	currentItem = exp[current];
	switch (currentItem.type) {
		case "descr":
		displayDescription(currentItem);
		break;
		case "two-bar": // range
		displayRange(currentItem);
		break;
		case "rank": // order
		displayOrder(currentItem);
		break;
		case "radio": // choice
		displayChoice(currentItem);
		break;
	}
}

function displayEndOfExp() {
	undisplayAll();
	elmts.head.html("End of experiment");
}

function undisplayAll() {
	elmts.descr.hide();
	elmts.question.hide();
	elmts.range.hide();
	elmts.choice.hide();
	elmts.order.hide();
}

function displayDescription(item) {
	undisplayAll();
	elmts.descr.show();
	elmts.head.html(item.title);
	elmts.descr.html(item.descr);
}

function displayChoice(item) {
	undisplayAll();
	elmts.question.text(item.question);
	for(i = 0; i<item.answers.length; i++) { // 3 choices
		elmts.choices[i].html(item.answers[i]);
		elmts.choices[i].click(chooseOptionCallback);
		elmts.choices[i].removeClass('selected');
	}

	elmts.choice.show();
	elmts.question.show();
}

function chooseOptionCallback() {
	jq("#choice").children().removeClass('selected');
	jq(this).addClass('selected');
}

function displayOrder(item) {
	undisplayAll();
	elmts.question.text(item.question);
	elmts.order.show();
	for (var i = 0; i < item.answers.length; i++) {
		jq("country-"+(i+1)).html(item.answers[i]);
		addCountryCallback.call(jq("country-"+(i+1)));
	}

	elmts.order.show();
	elmts.question.show();
}

function addCountryCallback() {
	let that = jq(this);
	jq("#orderStock").append(that.remove());
	that.click(removeCountryCallback);
	that.removeClass('selected');
}

function removeCountryCallback() {
	let that = jq(this);
	jq("#orderAnswer").append(that.remove());
	jq(that).click(addCountryCallback);
	that.addClass('selected');
}

function displayRange(item) {
	undisplayAll();
	elmts.question.text(item.question);
	jq("#min").val("");
	jq("#max").val("");

	elmts.range.show();
	elmts.question.show();
}

jq(document).ready(function() {
	undisplayAll();
	elmts.submit.hide();
	elmts.head.html("Experiment #" + subjectNum)
	jq(document).one('click', function() {
		init(subjectNum);
		elmts.submit.show();
		next();
	});
});

jq("#submitBtn").click(function() {
	if(!currentItem) {
		console.log("[WARNING] Treat Submit : No current item")
		return;
	}
	switch (currentItem.type) {
		case "descr":
		break;
		case "two-bar": // range
		handleRangeAnswer(currentItem);
		break;
		case "rank": // order
		handleOrderAnswer(currentItem);
		break;
		case "radio": // choice
		handleChoiceAnswer(currentItem);
		break;
	}
	next();
});



function handleRangeAnswer(item) {
	let res = {
		min: +jq("#min").val(),
		max: +jq("#max").val(),
	}

	answer.saveRange(res);
}

function handleOrderAnswer(item) {
	let res = []
	jq.each(jq("#orderAnswer").children(), function(index, el) {
		res.push(jq(el).text());
	});
	answer.saveOrder(res);
}

function handleChoiceAnswer(item) {
	if (elmts.choices[0].hasClass('selected')) {
		answer.saveChoice(elmts.choices[0].html());
	} else if (elmts.choices[1].hasClass('selected')) {
		answer.saveChoice(elmts.choices[1].html());
	} else if (elmts.choices[2].hasClass('selected')) {
		answer.saveChoice(elmts.choices[2].html());
	}
}