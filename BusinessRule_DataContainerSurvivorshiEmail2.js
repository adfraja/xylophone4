/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "DataContainerSurvivorshiEmail2",
  "type" : "BusinessAction",
  "setupGroups" : [ "GlobalBusinessRulesRoot" ],
  "name" : "DataContainer Survivorshi Email2",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
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
exports.operation0 = function (node,manager,log,emailPair,corenonpostalsysid) {
var email1 = emailPair.getValue1() + "";
var email2 = emailPair.getValue2() + "";
var nonpostalsysid1 = corenonpostalsysid.getValue1() + "";
var nonpostalsysid2 = corenonpostalsysid.getValue2() + "";
logger.info(email1)
logger.info(email2)
logger.info(nonpostalsysid1)
logger.info(nonpostalsysid2)
if (email1.equals(email2) && nonpostalsysid1.equals(nonpostalsysid2)) {

	return true;
}

return false;
}