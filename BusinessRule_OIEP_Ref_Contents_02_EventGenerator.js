/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "OIEP_Ref_Contents_02_EventGenerator",
  "type" : "BusinessAction",
  "setupGroups" : [ "GlobalBusinessRulesRoot" ],
  "name" : "OIEP_Ref_Contents_02_EventGenerator",
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
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "DerivedEventTypeBinding",
    "alias" : "dEvent",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "OIEP_Ref_Brands_And_Contents_Event",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "eventQueue",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=E0003a",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,dEvent,eventQueue) {
eventQueue.queueDerivedEvent(dEvent, node);
return true;
}