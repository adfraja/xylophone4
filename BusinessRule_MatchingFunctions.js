/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "MatchingFunctions",
  "type" : "BusinessLibrary",
  "setupGroups" : [ "MatchingAndLinking" ],
  "name" : "Matching Functions",
  "description" : null,
  "scope" : null,
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : null,
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessLibrary",
  "binds" : [ ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
function normalizeValue(value, handleFirstWordOnly) {
	if(value) {
		var normVal = value + "";
		if(handleFirstWordOnly) {
			normVal = normVal.split(" ")[0];
		}
		normVal = normVal.toLowerCase();
		normVal = normVal.replace(/[^\w]|_/g, "");	
		return normVal;
	}
	else {
		return "";	
	}
}

function normalizeStreet(input, lookupTableHome) {
	var output = "";
	if(input) {
		input = input + "";
		input = input.toLowerCase();
		input = input.replace(/[\.\,#]|_/g, "");
		var inArr = input.split(" ");
		var outArr = [];
		for(var i = 0; i < inArr.length; i++) {
			outArr.push(lookupTableHome.getLookupTableValue("AddressAbbreviations", inArr[i]));
		}
		for(var j = 0; j < outArr.length; j++) {
			output += outArr[j];
			if(j != outArr.length - 1) {
				output += " ";
			}
		}
	}
	return output;
}

function getNameWeight(name, manager, lookupTableHome, isFirstName, minWeight) {
	var newMax = 1;
	var newMin = minWeight;
	var lookupTableID;
	if(isFirstName) {
		lookupTableID = "FirstNameFrequencies";
	}
	else {
		lookupTableID = "LastNameFrequencies";		
	}
	var lookupValue = parseFloat(lookupTableHome.getLookupTableValue(lookupTableID, name));
	var returnValue;
	if(lookupValue == -1) {
		returnValue = newMax;
	}
	else {
		var origMax = parseFloat(manager.getAssetHome().getAssetByID(lookupTableID).getValue("NameFrequencyMaxValue").getSimpleValue());
		var newRange = newMax - newMin;
		returnValue = ((-1 * (newRange / origMax)) * lookupValue) + 1;
	}
	return returnValue;
}

function getFullNameWeight(firstName, lastName, manager, lookupTableHome, minWeight, lastNameWeightFactor) {
	var firstNameWeight = getNameWeight(firstName, manager, lookupTableHome, true, minWeight);
	var lastNameWeight = getNameWeight(lastName, manager, lookupTableHome, false, minWeight);
	return (firstNameWeight * (1 - lastNameWeightFactor)) + (lastNameWeight * lastNameWeightFactor);
}

function nameComparison(normFirstName1, normLastName1, normFirstName2, normLastName2, manager, lookupTableHome, commonNameFactor, nicknameMatchFactor, lastNameWeightFactor) {
	var nameMatchValue = 0;
	
	var normName1 = null;
	if(normFirstName1 && normLastName1) {
		normName1 = normFirstName1 + ":" + normLastName1;
	}
	
	var normName2 = null;
	if(normFirstName2 && normLastName2) {
		normName2 = normFirstName2 + ":" + normLastName2;
	}
	if(normName1 && normName2) {
		if(normName1 == normName2) {
			nameMatchValue = getFullNameWeight(normFirstName1, normLastName1, manager, lookupTableHome, commonNameFactor, lastNameWeightFactor);
		}
		else if(normLastName1 && normLastName2 && normLastName1 == normLastName2) {
			var lookup1 = lookupTableHome.getLookupTableValue("Nicknames", normFirstName1) + "";
			var lookup2 = lookupTableHome.getLookupTableValue("Nicknames", normFirstName2) + "";		
			if(lookup1 == lookup2) {
				var fullNameWeight = getFullNameWeight(lookup1, normLastName1, manager, lookupTableHome, commonNameFactor, lastNameWeightFactor);
				nameMatchValue = fullNameWeight * nicknameMatchFactor;
			}
		}
	}
	return nameMatchValue;
}
/*===== business library exports - this part will not be imported to STEP =====*/
exports.normalizeValue = normalizeValue
exports.normalizeStreet = normalizeStreet
exports.getNameWeight = getNameWeight
exports.getFullNameWeight = getFullNameWeight
exports.nameComparison = nameComparison