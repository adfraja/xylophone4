/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "WPGenerateDerivedEvents",
  "type" : "BusinessAction",
  "setupGroups" : [ "OutboundIntegrationEndpointRules" ],
  "name" : "WP Generate Derived Events",
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
    "contract" : "LoggerBindContract",
    "alias" : "logger",
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
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "CurrentEventTypeBinding",
    "alias" : "currentEventType",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ApproveContextBindContract",
    "alias" : "appContext",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "DerivedEventTypeBinding",
    "alias" : "webAdd",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "webAdd",
    "description" : null
  }, {
    "contract" : "DerivedEventTypeBinding",
    "alias" : "webModify",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "webModify",
    "description" : null
  }, {
    "contract" : "DerivedEventTypeBinding",
    "alias" : "webRemove",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "webRemove",
    "description" : null
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "currentObject",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (logger,currentEventQueue,manager,currentEventType,appContext,webAdd,webModify,webRemove,currentObject) {
var prodClassLinkTypeID = "WebsiteLink"
var ClassObjTypeID = "WebLevel2";

var linkType = manager.getLinkTypeHome().getClassificationProductLinkTypeByID(prodClassLinkTypeID);

function classInApp(classID) {
	var res;
	manager.executeInWorkspace("Approved", function(appManager) {
		res = appManager.getClassificationHome().getClassificationByID(classID) != null;
	});
	return res;
}

if(currentEventType instanceof com.stibo.core.domain.eventqueue.DerivedEventType) {
	logger.info("Generator: Derived event type is '" + currentEventType.getID() + "'. Ignoring...");
}
else {
	logger.info("Generator: Core event type is '" + currentEventType.getID() + "'. Performing analysis...");
	var appProd;
	
	//Event generated based on an approval
	if(appContext) {
		logger.info("Generator: Core event generated based on approval");
		var mainProd = appContext.getMainNode();
		appProd = appContext.getApprovedNode();
		var stepDelete = currentEventType == com.stibo.core.domain.eventqueue.BasicEventType.Delete;
		
		var linkInMain = !mainProd.getClassificationProductLinks().get(linkType).isEmpty();
		var mainMesg = linkInMain ? "Product has Website Link in Main" : "Product does not have Website Link in Main";
		logger.info(mainMesg);
		
		var linkInApp = false;
		if(appProd) {
			logger.info("Product exists in Approved");
			linkInApp = !appProd.getClassificationProductLinks().get(linkType).isEmpty();
		}
		var appMesg = linkInApp ? "Product has Website Link in Approved" : "Product does not have Website Link in Approved";
		logger.info(appMesg);

		//Case A - Prod has been delete approved and has link in Approved > WebRemove
		if(stepDelete && linkInApp) {
			logger.info("Generating event of type 'WebRemove' (STEP deletion)");
			currentEventQueue.queueDerivedEvent(webRemove, mainProd);
		}
		//Case B - Prod has link in both Main and Approved > WebModify
		else if(linkInMain && linkInApp) {
			logger.info("Generating event of type 'WebModify'");
			currentEventQueue.queueDerivedEvent(webModify, mainProd);
		}
		else {
			var partObjects = appContext.getPartObjects().toArray();
			var linkToBeApproved = false;
			for(var i = 0; i < partObjects.length; i++) {
				if(partObjects[i] instanceof com.stibo.core.domain.partobject.ClassificationLinkPartObject) {
					var currentClassID = partObjects[i].getClassificationID();
					var currentClassObjTypeID = manager.getClassificationHome().getClassificationByID(currentClassID).getObjectType().getID();
					if(currentClassObjTypeID == ClassObjTypeID && classInApp(currentClassID)) {
						linkToBeApproved = true;
						logger.info("Website Link to be approved");
						break;
					}
				}
			}
			//Case C - Prod has link in Main but not in Approved and link is part object > WebAdd
			if(linkInMain && linkToBeApproved) {
				logger.info("Generating event of type 'WebAdd'");
				currentEventQueue.queueDerivedEvent(webAdd, mainProd);
			}
			//Case D - Prod has link in Approved but not in Main and link is part object > WebRemove
			if(linkInApp && linkToBeApproved) {
				logger.info("Generating event of type 'WebRemove'");
				currentEventQueue.queueDerivedEvent(webRemove, mainProd);
			}
		}
	}
	//Event based on republish or change to externally maintained data
	else {
		logger.info("Generator: Core event not based on approval");
		manager.executeInWorkspace("Approved", function(appManager) {
			appProd = appManager.getProductHome().getProductByID(currentObject.getID());
		});
		//Case E - Non approval based event has been generated and prod is in Approved with link > WebModify
		if (appProd && !appProd.getClassificationProductLinks().get(linkType).isEmpty()) {
			logger.info("Generating event of type 'WebModify' for non-approval based event");
			currentEventQueue.queueDerivedEvent(webModify, currentObject);
		}
	}
}
}