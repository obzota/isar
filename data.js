const d3 = require('d3')
const fs = require('fs')


let data = {

	rows: [],
	items: [],
	years: {},
	countries: {},

	load: function(filename) {
		this.items = [];

		this.rows = d3.csv(filedata, function() {
			let years = this.rows.columns;

			for (var i = 0; i < rows.length; i++) {
				for (var j = 1; j <= 10; j++) {
					let item = {
						country: rows[i][years[0]],
						i: i,
						j: j-1,
						year: years[j],
						value: rows[i][years[j]]
					}
					this.items.push(item);
					if(!this.years[item.year]) {
						this.years[item.year] = [];
					}
					this.years[item.year].push(item);
				}
			}
		});
	}
}