/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "SORIANA.BRA.JSONMsgHandlerArticlesMD04",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "SORIANA.BRA.JSONMsgHandlerArticlesMD04",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "itemToERPLinkType",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "Default Classification Product Link Type",
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "itemToERPCCLinkType",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "Default Classification Product Link Type",
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (itemToERPLinkType,itemToERPCCLinkType,log) {
log.info(itemToERPLinkType);
log.info(itemToERPCCLinkType);
}