/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "WPRejectCoreEvents",
  "type" : "BusinessCondition",
  "setupGroups" : [ "OutboundIntegrationEndpointRules" ],
  "name" : "WP Reject Core Events",
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
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "CurrentEventTypeBinding",
    "alias" : "currentEventType",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (currentEventType) {
if(currentEventType instanceof com.stibo.core.domain.eventqueue.BasicEventType) {
	logger.info("Filter: Discarded core event of type '" + currentEventType.getID() + "'");
	return false;
}
else {
	logger.info("Filter: Let derived event of type '" + currentEventType.getID() + "' pass");
	return true;
}
}