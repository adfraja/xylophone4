/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "DataContainerSurvivorshipEmail2",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "DataContainerSurvivorshipEmail2",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "IndividualCustomer" ],
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
    "contract" : "SimpleValuePairBindContract",
    "alias" : "emailPair",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "EmailField",
    "description" : null
  }, {
    "contract" : "SimpleValuePairBindContract",
    "alias" : "corenonpostalsysid",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "CORENONPOSTALADDRESSSYSID",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,emailPair,corenonpostalsysid) {
return false;
}