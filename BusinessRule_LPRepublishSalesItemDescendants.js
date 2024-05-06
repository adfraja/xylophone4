/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "LPRepublishSalesItemDescendants",
  "type" : "BusinessAction",
  "setupGroups" : [ "OutboundIntegrationEndpointRules" ],
  "name" : "LP Republish Sales Item Descendants",
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
    "alias" : "currentObject",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "logger",
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
    "contract" : "CurrentEventQueueBinding",
    "alias" : "currentEventQueue",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "DerivedEventTypeBinding",
    "alias" : "salesItemRepublish",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "salesItemRepublish",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (currentObject,logger,manager,currentEventQueue,salesItemRepublish) {
function prodIsInApp(prodID) {
	var appProd;
	manager.executeInWorkspace("Approved", function(appManager) {
		appProd = appManager.getProductHome().getProductByID(prodID);
	});
	return (appProd != null);
}

function generateEventForApprovedLeafSalesItems(ancestor) {
	var children = ancestor.getChildren();
	for(var i = 0; i < children.size(); i++) {
		var current = children.get(i);
		if(current.getObjectType().getID() == "SalesItem") {
			if (prodIsInApp(current.getID())) {
				logger.info("Generating 'salesItemRepublish' event for approved descendant Sales Item '" + current.getID() + "'.");
				currentEventQueue.queueDerivedEvent(salesItemRepublish, current);
			}
		}
		else generateEventForApprovedLeafSalesItems(current);
	}
}
generateEventForApprovedLeafSalesItems(currentObject);
}