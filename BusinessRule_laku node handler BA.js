/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "laku node handler BA",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "laku node handler BA",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "laku product folder", "laku products" ],
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
    "contract" : "OutboundBusinessProcessorNodeHandlerSourceBindContract",
    "alias" : "nodeHandlerSource",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "OutboundBusinessProcessorExecutionReportLoggerBindContract",
    "alias" : "executionReportLogger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "OutboundBusinessProcessorNodeHandlerResultBindContract",
    "alias" : "nodeHandlerResult",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (nodeHandlerSource,executionReportLogger,nodeHandlerResult) {
// Node Handler Source bound to nodeHandlerSource
// Node Handler Result bound to nodeHandlerResult
// ExecutionReportLogger bound to executionReportLogger

var simpleEventType = nodeHandlerSource.getSimpleEventType();
if (simpleEventType == null) {
  executionReportLogger.logInfo("No event information available in node handler");
} else {
  executionReportLogger.logInfo("Event with ID '" + simpleEventType.getID()+ "' passed to node handler");
}
var node = nodeHandlerSource.getNode();
if (node != null && node instanceof com.stibo.core.domain.Product) {
  executionReportLogger.logInfo("Node handler handling product with URL: " + node.getURL());
  executionReportLogger.logInfo("laku text" + node.getURL());
  var mesg = {};
  mesg.stepid = node.getID() + "";
  mesg.lakutext=node.getValue("laku text").getSimpleValue() + "";
  if (nodeHandlerSource.isDeleted()) {
    nodeHandlerResult.addMessage("delete", JSON.stringify(mesg));	
  } else {
    mesg.category = node.getParent() == null ? null : node.getParent().getID() + "";
    mesg.shortDescription = "ShortDescription";//node.getValue("ShortDescription").getSimpleValue() + "";
    mesg.color ="Color"// node.getValue("Color").getSimpleValue()+ "";
    executionReportLogger.logInfo("laku test" + mesg);
    nodeHandlerResult.addMessage("upsert", JSON.stringify(mesg));	
  }
}
}