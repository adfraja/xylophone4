/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "ExMarketingAttributeChecker",
  "type" : "BusinessCondition",
  "setupGroups" : [ "InstructorBusinessRules" ],
  "name" : "Ex Marketing Attribute Checker",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SalesItem" ],
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
    "alias" : "obj",
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
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (obj,manager,logger) {
var marketingAtts = manager.getAttributeGroupHome().getAttributeGroupByID("MarketingAttributesChecker").getAttributes().toArray();
var contexts = manager.getContextHome().getContexts().toArray();
var contextIDs = [];
var contextNames = [];
for(var index in contexts) {
	contextIDs.push(contexts[index].getID());
	contextNames.push(contexts[index].getName());
}
var mesg = "";

function checkValue(manager, prodID, attrID){
	var val = manager.getProductHome().getProductByID(prodID).getValue(attrID).getSimpleValue();
	isOK = val && val.length() > 10;
}


for(var aIndex in marketingAtts) {
	for(var cIndex in contextIDs) {
		var isOK;
		manager.executeInContext(contextIDs[cIndex], function(localManager){
			checkValue(localManager, obj.getID(), marketingAtts[aIndex].getID());
		});
		if(!isOK) mesg += "In Context '" + contextNames[cIndex] + "', value for Attribute with ID '" + marketingAtts[aIndex].getID() + "' must be longer than 10 characters.\n";
	}
}
return mesg == "" ? true : mesg;
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ValidHierarchiesBusinessCondition",
  "parameters" : [ {
    "id" : "HierarchyRoots",
    "type" : "java.util.List",
    "values" : [ ]
  } ],
  "pluginType" : "Precondition"
}
*/
