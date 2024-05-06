/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "DataContainerSurvivorshipLOB",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "DataContainer Survivorship LOB",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "OrganizationCustomer" ],
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
    "alias" : "LOBPair",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "LineOfBusiness",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,log,LOBPair) {
var LOB1 = LOBPair.getValue1() + "";
var LOB2 = LOBPair.getValue2() + "";

if (LOB1.equals(LOB2)) {

	return true;
}

return false;


}