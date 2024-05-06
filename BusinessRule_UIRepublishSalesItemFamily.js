/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "UIRepublishSalesItemFamily",
  "type" : "BusinessAction",
  "setupGroups" : [ "OutboundIntegrationEndpointRules" ],
  "name" : "UI Republish Sales Item Family",
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
    "contract" : "CurrentObjectBindContract",
    "alias" : "currentObject",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "CurrentEventQueueBinding",
    "alias" : "currentEventQueue",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "DerivedEventTypeBinding",
    "alias" : "salesItemFamilyRepublish",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "SalesItemFamilyRepublish",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (currentObject,currentEventQueue,salesItemFamilyRepublish) {
if (currentObject.getParent().getObjectType().getID().equals("SalesItemFamily")) {
	currentEventQueue.queueDerivedEvent(salesItemFamilyRepublish, currentObject.getParent());
}

}