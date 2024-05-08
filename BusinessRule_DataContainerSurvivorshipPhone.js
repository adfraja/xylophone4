/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "DataContainerSurvivorshipPhone",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "DataContainerSurvivorshipPhone",
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
    "alias" : "phoneNumberPair",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "PhoneNumber",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,log,phoneNumberPair) {
var phone1 = phoneNumberPair.getValue1() + "";
var phone2 = phoneNumberPair.getValue2() + "";

if (phone1.equals(phone2)) {

	return true;
}

return false;


}