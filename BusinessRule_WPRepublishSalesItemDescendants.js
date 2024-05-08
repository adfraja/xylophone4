/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "WPRepublishSalesItemDescendants",
  "type" : "BusinessAction",
  "setupGroups" : [ "OutboundIntegrationEndpointRules" ],
  "name" : "WP Republish Sales Item Descendants",
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
    "contract" : "DerivedEventTypeBinding",
    "alias" : "webModify",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "webModify",
    "description" : null
  }, {
    "contract" : "CurrentEventTypeBinding",
    "alias" : "currentEventType",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "CurrentEventQueueBinding",
    "alias" : "currentEventQueue",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (currentObject,logger,manager,webModify,currentEventType,currentEventQueue) {
var linkTypeID = "WebsiteLink";
var linkType = manager.getLinkTypeHome().getClassificationProductLinkTypeByID(linkTypeID);

function prodIsInAppWithLink(prodID) {
	var appProd;
	manager.executeInWorkspace("Approved", function(appManager) {
		appProd = appManager.getProductHome().getProductByID(prodID);
	});
	return appProd ? !appProd.getClassificationProductLinks().get(linkType).isEmpty() : false;
}

function findApprovedLeafSalesItems(ancestor) {
	var children = ancestor.getChildren().toArray();
	if(children.length == 0) return;
	for(var i = 0; i < children.length; i++) {
		var current = children[i];
		if(current.getObjectType().getID() == "SalesItem") {
			if (prodIsInAppWithLink(current.getID())) {
				logger.info("Generating webModify event for approved descendant Sales Item '" + children[i].getID() + "' on website");
				currentEventQueue.queueDerivedEvent(webModify, children[i]);
			}
		}
		else findApprovedLeafSalesItems(current);
	}
}

if(currentEventType == com.stibo.core.domain.eventqueue.BasicEventType.Modify) {
	findApprovedLeafSalesItems(currentObject);
}
}