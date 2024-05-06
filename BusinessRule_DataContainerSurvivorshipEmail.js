/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "DataContainerSurvivorshipEmail",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "DataContainer Survivorship Email",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ContactPerson", "IndividualCustomer", "OrganizationCustomer" ],
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
    "alias" : "emailPair",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "EmailField",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,log,emailPair) {
var email1 = emailPair.getValue1() + "";
var email2 = emailPair.getValue2() + "";

if (email1.equals(email2)) {

	return true;
}

return false;


}