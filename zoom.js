const d3 = require('d3');

let zoomed = function(event, b, c) {
	d3.select("#scene").attr('transform', d3.event.transform);
}

d3.select("svg").call(
	d3.zoom().on("zoom", zoomed)
);