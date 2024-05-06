/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "PMDM.BRA.PDS.QueueEvent.Accepted",
  "type" : "BusinessAction",
  "setupGroups" : [ "PMDM.BusinessRuleActions" ],
  "name" : "PDX: Queue Event - Accepted",
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
    "contract" : "EventQueueBinding",
    "alias" : "eventQueue",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.FrontEventQueueImpl",
    "value" : "step://eventqueue?id=PMDM.EQ.PDS.EventQueue",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,eventQueue) {
function setStatusAndRepublish(node) {
	node.getValue("PMDM.AT.PDS.WorkflowEvent").setLOVValueByID("PDS_ACCEPTED");
	eventQueue.republish(node);
}

setStatusAndRepublish(node);

/*var allPackaging = getAllPackagingFromExternalBusinessFunction.evaluate({"node" : node});
allPackaging.toArray().forEach(
	function (packagingObject) {
		setStatusAndRepublish(packagingObject);
	}
);*/
}