/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "ISellPackWeightCheckerJS",
  "type" : "BusinessCondition",
  "setupGroups" : [ "InstructorBusinessRules" ],
  "name" : "I Sell Pack Weight Checker JS",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SalesItem", "SalesItemFamily" ],
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
  } ],
  "messages" : [ {
    "variable" : "ErrorMessage",
    "message" : "For object with ID {id} the Sell Package Weight cannot be more than five times the product weight.",
    "translations" : [ ]
  } ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (obj,ErrorMessage) {
var result = true;
if(parseFloat(obj.getValue("Weight").getValue()) * 5 < parseFloat(obj.getValue("SellPackWeight").getValue())) {
	var mesg = new ErrorMessage();
	mesg.id = obj.getID();
	result = mesg;
}
return result;

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
