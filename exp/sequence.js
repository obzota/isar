/*
  datasetInfo.strings
  TangVizPilotApp

  Created by Yvonne Jansen on 4/11/12.
  Copyright (c) 2012 INRIA AVIZ. All rights reserved.
*/

let json = require('json-file');

descriptions = {
// training data sets
	homicide : "This indicator gives homicide rates per 100.000 inhabitants. Sources: WHO, GBD, UNODC, GIMD.",
	food : "This indicator gives the total supply of food available in a country per person per day. Source: FAO stat",
	births : "This indicator gives the ratio of births attended by skilled health staff, i.e., the percentage of deliveries attended by personnel trained to give the necessary supervision, care, and advice to women during pregnancy, labor, and the postpartum period. Source: UNICEF, State of the World's Children, Childinfo, and Demographic and Health Surveys by Macro International.",
	tax : "This indicator gives tax revenues, i.e., compulsory transfers to the central government for public purposes. Source: International Monetary Fund, Government Finance Statistics Yearbook and data files, and World Bank and OECD GDP estimates.",
// the trial data sets
	suicide : "This indicator gives mortality rates due to self-inflicted injury, per 100 000 people. Source: WHO.",
	military : "This indicator gives military expenditures, which includes all current and capital expenditures on the armed forces, including peacekeeping forces. Source: World Bank",
	education : "This indicator gives education aids as percentage of total aid. Source: OECD.",
	externaldebt : "This indicator gives the ratio of external debt stocks to gross national income. Total external debt is debt owed to nonresidents repayable in foreign currency, goods, or services. GNI (formerly GNP) is the sum of value added by all resident producers plus any product taxes. Source: World Bank, Global Development Finance.",
	carmortality : "This indicator gives car road traffic mortality per 100 000. Source: GMID, WHO.",
	agriculturalland : "This indicator gives the rates of agricultural land which refers to the share of land area that is arable, under permanent crops, and under permanent pastures. Source: World Bank.",
	army : "This indicator gives armed forces personnel in relation to total labor force. Armed forces personnel are active duty military personnel, including paramilitary forces if the training, organization, equipment, and control suggest they may be used to support or replace regular military forces. Source: World Development Indicators.",
	co2 : "This indicator gives average CO2 emission in metric tons per person during the given year, calculated from deviding the total CO2 with the total population of the countries. Source: CDIAC (Carbon Dioxide Information Analysis Center)",
	electricity : "This indicator gives per capita consumption of electricity during the given year, counted in kilowatt-hours (kWh). Source: International Energy Agency.",
	hiv : "This indicator gives the estimated number of people living with HIV per 100 population of age group 15-49. Source: UNAIDS",
	grosscapital : "This indicator gives gross capital formation consisting of outlays on additions to the fixed assets of the economy plus net changes in the level of inventories. Source: World Bank.",
	health : "This indicator gives the total expenditure on health as percentage of gross domestic product. Source: WHO.",
}


titles = {
	homicide : "Homicides",
	food : "Food Consumption",
	births : "Births attended by skilled health personnel",
	tax : "Tax Revenue",
	suicide : "Suicides",
	military : "Military Expenditures",
	education : "Education Aid",
	externaldebt : "External Debt Rates",
	carmortality : "Car Mortality",
	agriculturalland : "Agricultural Land",
	army : "Armed Forces Personnel",
	co2 : "CO2 Emissions",
	electricity : "Electricity Consumption",
	hiv : "HIV Prevalence",
	grosscapital : "Gross Capital Formation",
	health : "Total Health Expenditures",
}

sequences = [
	[ 1, 2, 3 ], // demo
	[ 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ],
	[ 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ],
	[ 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ],
];

keys = ["", // sentinel
	"homicide",
	"food",
	"births",
	"tax",
	"suicide",
	"military",
	"education",
	"externaldebt",
	"carmortality",
	"agriculturalland",
	"army",
	"co2",
	"electricity",
	"hiv",
	"grosscapital",
	"health"
];

exports.get = function(seqNum) {
	let exp = [];
	for (var i = 0; i < sequences[seqNum].length; i++) {
		index = sequences[seqNum][i];
		key = keys[index];

		let file = json.read('./data/tasks/'+key+'.json');
		exp.push({
			type: "descr",
			description: descriptions[key],
			title: titles[key]
		});
		for (var j = 0; j < file.data.length; j++) {
			exp.push(file.data[j]);
		}
	}
	return exp;
}