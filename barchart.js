// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.



/////////////////////////////////////////////////////////
///////////////-----BARCHART-----////////////////////////
/////////////////////////////////////////////////////////
let barchart = {
	offset: {
		ov: {
			x: 100,
			y: 100,
		},
		bc: {
			x: 1300,
			y: 100,
		}
	},

	scale: {
		year: d3.scaleBand().range([0, 1000]).padding(0.1),
		country: d3.scaleBand().range([0,1000]).padding(0.1),
		value: d3.scaleLinear().range([1000, 0]),
		radius: d3.scaleLinear().range([10, 90])
	},

	setScaleDomain: function(a,b, years, countries) {
		barchart.scale.year.domain(years);
		barchart.scale.country.domain(countries);
		barchart.scale.value.domain([a,b]);
		barchart.scale.radius.domain([a,b]);
	},

	displayLegend: function() {

		let yt = d3.select("#yearTriggers").selectAll('rect').data(data.yearLabels)
		.on('click', function(d,i) {barchart.displayYear(d)});


		let ct = d3.select("#countryTriggers").selectAll('rect').data(data.countryLabels)
		.on('click', function(d,i) {barchart.displayCountry(d)});


		d3.select("#years").call(d3.axisBottom(barchart.scale.year)).attr('transform', 'translate(100,1100)');
		d3.select("#countries").call(d3.axisLeft(barchart.scale.country)).attr('transform', 'translate(100, 100)');

	},

	relocateHover: function(x, w, vertical) {
		if(vertical) {
			d3.select("#hover")
			.attr("height", 100)
			.attr("width", 1100);
		} else {
			d3.select("#hover")
			.attr("height", 1100)
			.attr("width", 100);
		}
		d3.select("#hover")
		.attr("x", x)
		.attr("y", y);
	},

	displayCountry: function(country) {
		let bars = d3.select("#bars").selectAll('rect').data(data.countries[country]);
		bars.merge(bars.enter().append('rect'))
		.attr('style', function(d, i) {return 'fill:'+d.color})
		.attr('x', function(d, i) { return barchart.scale.year(d.year) + barchart.offset.bc.x})
		.attr('width', function(d, i) { return barchart.scale.country.bandwidth()})
		.transition(300)
		.attr('y', function(d, i) { return barchart.scale.value(d.value) + barchart.offset.bc.y})
		.attr('height', function(d, i) { return 1000 - barchart.scale.value(d.value)})

		d3.select("#values").call(d3.axisLeft(barchart.scale.value)).attr('transform', 'translate(1300, 100)');
		d3.select("#labels").call(d3.axisBottom(barchart.scale.year)).attr('transform', 'translate(1300, 1100)');
	},

	displayYear: function(year) {
		let bars = d3.select("#bars").selectAll('rect').data(data.years[year]);
		bars.merge(bars.enter().append('rect'))
		.attr('style', function(d, i) {return 'fill:'+d.color})
		.attr('x', function(d, i) { return barchart.scale.country(d.country) + barchart.offset.bc.x})
		.attr('width', function(d, i) { return barchart.scale.year.bandwidth()})
		.transition(300)
		.attr('y', function(d, i) { return barchart.scale.value(d.value) + barchart.offset.bc.y})
		.attr('height', function(d, i) { return 1000 - barchart.scale.value(d.value)})

		d3.select("#values").call(d3.axisLeft(barchart.scale.value)).attr('transform', 'translate(1300, 100)');
		d3.select("#labels").call(d3.axisBottom(barchart.scale.country)).attr('transform', 'translate(1300, 1100)');

	},

	displayOverview: function() {
		let squares = d3.select("#squares").selectAll('rect').data(data.items);

		squares.merge(squares.enter().append('rect'))
		.attr('x', function(d, i) { return barchart.scale.year(d.year) + barchart.offset.ov.x + (barchart.scale.year.bandwidth() - barchart.scale.radius(d.value))/2})
		.attr('y', function(d, i) { return barchart.scale.country(d.country) + barchart.offset.ov.y + (barchart.scale.country.bandwidth() - barchart.scale.radius(d.value))/2})
		.attr('height', function(d, i) { return barchart.scale.radius(d.value)})
		.attr('width', function(d, i) { return barchart.scale.radius(d.value)})
		.attr('style', function(d, i) {return 'fill:'+d.color})
	}
}



/////////////////////////////////////////////////////////
/////////////////-----DATA-----//////////////////////////
/////////////////////////////////////////////////////////
let data = {

	rows: [],
	items: [],
	years: {},
	yearLabels: [],
	countries: {},
	countryLabels: [],
	max: undefined,
	min: undefined,

	load: function(key, callback) {
		this.items = [];
		let that = this;
		filename = "./data/" + key + ".csv";
		$("title").html(key);
		d3.csv(filename, function(error,data) {
			if(error) {
				console.log("WARNING: Data: loading error: " + error);
				return;
			}
			that.rows = data;
			let years = data.columns;
			for (var i = 0; i < data.length; i++) {
				for (var j = 1; j <= 10; j++) {
					let item = {
						country: data[i][years[0]], // first column is year[0] = 'Matrix'
						i: i,
						j: j-1,
						year: years[j],
						value: +data[i][years[j]],
						color: palette.get(i)
					}
					that.items.push(item);
					if (j==1) {
						that.countryLabels.push(item.country);
					}

					if(!that.years[item.year]) {
						that.years[item.year] = [];
					}
					that.years[item.year].push(item);

					if(!that.countries[item.country]) {
						that.countries[item.country] = [];
					}
					that.countries[item.country].push(item);
					if( !(item.value < that.max))
						that.max = item.value;
					if( !(item.value > that.min))
						that.min = item.value;
				}
			}

			that.yearLabels = years.slice(1,11);
			barchart.setScaleDomain(that.min, that.max, that.yearLabels, that.countryLabels);

			callback();
		});
	}
}



/////////////////////////////////////////////////////////
/////////////////-----PALETTE-----///////////////////////
/////////////////////////////////////////////////////////
let palette =  {
	colors: [
	'rgb(166,206,227)',
	'rgb(31,120,180)',
	'rgb(178,223,138)',
	'rgb(51,160,44)',
	'rgb(251,154,153)',
	'rgb(227,26,28)',
	'rgb(253,191,111)',
	'rgb(255,127,0)',
	'rgb(202,178,214)',
	'rgb(106,61,154',
	],

	get: function(i) {
		return this.colors[i];
	}
}



/////////////////////////////////////////////////////////
/////////////////////-----NEXT----///////////////////////
/////////////////////////////////////////////////////////


$(document).ready(function () {
	console.log("[INFO] Launching app");
	data.load('army', function() {
		barchart.displayLegend();
		barchart.displayOverview();
	});
});
