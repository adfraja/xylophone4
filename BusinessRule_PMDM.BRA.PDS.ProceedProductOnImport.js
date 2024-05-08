/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "PMDM.BRA.PDS.ProceedProductOnImport",
  "type" : "BusinessAction",
  "setupGroups" : [ "PMDM.BusinessRuleActions" ],
  "name" : "PDX: Proceed Product On Import",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "PMDM.PRD.ExternalSourceRecord" ],
  "allObjectTypesValid" : false,
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
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "externalSourceRecordObjectType",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "PMDM.PRD.ExternalSourceRecord",
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,logger,externalSourceRecordObjectType,manager) {
// System Messages are stored on entities, for localization purpose.
var msg1 = manager.getEntityHome().getEntityByID("SysMsg_PMDM.BRA.PDS.POnImport_msg1").getValue("PMDM.AT.SystemMessage").getSimpleValue(); // "Returned from supplier"
var msg2 = manager.getEntityHome().getEntityByID("SysMsg_PMDM.BRA.PDS.POnImport_msg2").getValue("PMDM.AT.SystemMessage").getSimpleValue(); // "Supplier has submitted changes to the product"

var workflowID = "PMDM.WF.ProductOnboarding";
var reworkStateID = "State-4";
//var enrichmentStateID = "Enrichment";

var objectTypeID = node.getObjectType().getID();
if(externalSourceRecordObjectType.getID().equals(objectTypeID)) {
	if(node.isInState(workflowID, reworkStateID)) {
		var task = node.getTaskByID(workflowID, reworkStateID);
		task.triggerByID("Submit", msg1);
	} /*else if(node.isInState(workflowID, enrichmentStateID)) {
		var task = node.getTaskByID(workflowID, enrichmentStateID);
		task.triggerByID("Enrichment.PDS", msg2);
	} */else if(!node.isInWorkflow(workflowID)) {
		node.startWorkflowByID(workflowID, msg2);
	}
/* 
 * As the entire product string is always send from PDS, we don't need the following. 
 * 
} else if(packObjectType.getID().equals(objectTypeID) || caseObjectType.getID().equals(objectTypeID) || palletObjectType.getID().equals(objectTypeID)) {
	logger.info("Packaging object");
	var externalSourceRecord = getExternalFromPackagingBusinessFunction.evaluate({"node" : node});
	if(externalSourceRecord && externalSourceRecord.isInState(workflowID, reworkStateID)) {
		var task = externalSourceRecord.getTaskByID(workflowID, reworkStateID);
		task.triggerByID("Submit", msg1);
	} else if(externalSourceRecord && externalSourceRecord.isInState(workflowID, enrichmentStateID)) {
		var task = externalSourceRecord.getTaskByID(workflowID, enrichmentStateID);
		task.triggerByID("Enrichment.PDS", msg2);
	} else if(externalSourceRecord && !externalSourceRecord.isInWorkflow(workflowID))	{
		externalSourceRecord.startWorkflowByID(workflowID, msg2);
		logger.info("externalSourceRecord has been started in WF");
	}
*/
}

}