// Global DOM elements
const countryLookupBtn = document.querySelector("#country_lookup");
const cityLookupBtn = document.querySelector("#city_lookup");
const lookupResult = document.querySelector("#country");
const resultDiv = document.querySelector("#result");

const countryHeader = {
	tableHeader : ["Name", "Continent", "Independence", "Head of State"],
	databaseName : ["name", "continent", "independence_year", "head_of_state"]
};

const citiesHeader  = {
	tableHeader : ["Name", "District", "Population"],
	databaseName : ["name", "district", "population"]
}

// Onload
 window.addEventListener("load", () => {
	// Initial Retrieval of All Results
	ajaxCall("", "countries");
	// Adding evenlistener to lookup button
	countryLookupBtn.addEventListener("click", () => ajaxCall(lookupResult.value, "countries"));
	cityLookupBtn.addEventListener("click", () => ajaxCall(lookupResult.value, "cities"));
	
 });

function ajaxCall(getRequest, context){
	fetch(`world.php?countryName=${getRequest}&context=${context}`)	
		.then(response => response.json())
		.then(data => {
			if(data.length > 0){
				switch(context){
					case "countries":
						displayResults(data,countryHeader);
						break;
					case "cities": 
						displayResults(data,citiesHeader);
						break;
					default: 
						noResultsMsg();
				}
			}else{
				noResultsMsg();	
			}
		})
		.catch(err => console.log(err));
}

// Parses results from worlds.php 
// Places results in results div 
function displayResults(data, tableHeader){
	// Creation of results Table
	const resultsTable = createEmptyTable(tableHeader.tableHeader); 	
	const resultsTableBody = document.createElement("tbody");

	for(let i = 0; i < data.length; i++){
		currentRow = createNewRow(tableHeader.databaseName.map(x => data[i][x]));
		resultsTableBody.appendChild(currentRow);		
	}

	// Adding table body and 
	resultsTable.appendChild(resultsTableBody);
	resultDiv.innerHTML = "";
	resultDiv.appendChild(resultsTable);
}

function createNewRow(rowValues){
	const row = document.createElement("tr");
	
	for(let i = 0; i < rowValues.length; i++){
		const columnVal = document.createElement("td");
		columnVal.appendChild(document.createTextNode(rowValues[i]));
		row.appendChild(columnVal);
	}

	// Row with column values
	return row
}

// Creates an empty table element
// Parameter: array of headerValues
function createEmptyTable(headerValues){
	const newTable = document.createElement("table");
	const header = document.createElement("thead");

	// Adding header fields to 'header'
	for(let i = 0; i < headerValues.length; i++){
		headerField = document.createElement("th");
		headerField.appendChild(document.createTextNode(headerValues[i]));
		header.appendChild(headerField);
	}

	newTable.appendChild(header);

	// Empty table with header fields
	return newTable;
}

function noResultsMsg(){
	resultDiv.innerHTML = "No Results";
}
