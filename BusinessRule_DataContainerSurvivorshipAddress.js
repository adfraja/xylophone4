/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "DataContainerSurvivorshipAddress",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "DataContainer Survivorship Address",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ContactPerson", "Household", "IndividualCustomer", "OrganizationCustomer", "Supplier" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "SimpleValuePairBindContract",
    "alias" : "standardizedZipPair",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "StandardizedZip",
    "description" : null
  }, {
    "contract" : "SimpleValuePairBindContract",
    "alias" : "standardizedStreetPair",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "StandardizedStreet",
    "description" : null
  }, {
    "contract" : "SimpleValuePairBindContract",
    "alias" : "standardizedCityPair",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "StandardizedCity",
    "description" : null
  }, {
    "contract" : "SimpleValuePairBindContract",
    "alias" : "standardizedStatePair",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "StandardizedState",
    "description" : null
  }, {
    "contract" : "SimpleValuePairBindContract",
    "alias" : "standardizedCountryPair",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "StandardizedCountry",
    "description" : null
  }, {
    "contract" : "SimpleValuePairBindContract",
    "alias" : "zipPair",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "InputZip",
    "description" : null
  }, {
    "contract" : "SimpleValuePairBindContract",
    "alias" : "streetPair",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "InputStreet",
    "description" : null
  }, {
    "contract" : "SimpleValuePairBindContract",
    "alias" : "cityPair",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "InputCity",
    "description" : null
  }, {
    "contract" : "SimpleValuePairBindContract",
    "alias" : "statePair",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "InputState",
    "description" : null
  }, {
    "contract" : "SimpleValuePairBindContract",
    "alias" : "countryPair",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "InputCountry",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,log,standardizedZipPair,standardizedStreetPair,standardizedCityPair,standardizedStatePair,standardizedCountryPair,zipPair,streetPair,cityPair,statePair,countryPair) {
function normalize(value) {

	if (value != null) {

		return value.trim().toLowerCase();
	}
return "";
}

function buildKeys(useStandardized) {

	var key1 = "";
	var key2 = ""; 

	if (useStandardized) {

	key1 = normalize(standardizedStreetPair.getValue1())
		+ normalize(standardizedCityPair.getValue1())
		+ normalize(standardizedZipPair.getValue1())
		+ normalize(standardizedStatePair.getValue1())
		+ normalize(standardizedCountryPair.getValue1());

	key2 = normalize(standardizedStreetPair.getValue2())
		+ normalize(standardizedCityPair.getValue2())
		+ normalize(standardizedZipPair.getValue2())
		+ normalize(standardizedStatePair.getValue2())
		+ normalize(standardizedCountryPair.getValue2());
			
	} else {

		key1 = normalize(streetPair.getValue1())
			+ normalize(cityPair.getValue1())
			+ normalize(zipPair.getValue1())
			+ normalize(statePair.getValue1())
			+ normalize(countryPair.getValue1());

		key2 = normalize(streetPair.getValue2())
			+ normalize(cityPair.getValue2())
			+ normalize(zipPair.getValue2())
			+ normalize(statePair.getValue2())
			+ normalize(countryPair.getValue2());

	}
	

return new Array (key1, key2);

}

var standardizedZip1 = standardizedZipPair.getValue1();
var standardizedZip2 = standardizedZipPair.getValue2();

var useStandardized = false;

if (standardizedZip1 != null && standardizedZip2 != null) {

	useStandardized = true;	
}

var combinedKeys = buildKeys(useStandardized);

if (!("".equals(combinedKeys[0])) && !("".equals(combinedKeys[1]))) {

	if (combinedKeys[0].equals(combinedKeys[1])) {

		return true;
	}
}

return false;


}