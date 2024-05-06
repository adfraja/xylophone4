/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "PMDM.BRA.StartExternalWFromNodeList",
  "type" : "BusinessAction",
  "setupGroups" : [ "PMDM.BusinessRuleActions" ],
  "name" : "Start External WF From Node List",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "PMDM.PRD.ExternalSourceRecord" ],
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
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "web",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,web) {
var workflowID = "PMDM.WF.ExternalSourceRecordHandling";
var workflow = manager.getWorkflowHome().getWorkflowByID(workflowID);

// System Messages are stored on entities, for localization purpose.

var msg1 = manager.getEntityHome().getEntityByID("SysMsg_PMDM.BRA.StartExtlWFromNodeL_msg1").getValue("PMDM.AT.SystemMessage").getSimpleValue(); // "Selected Product has been started in Workflow"

// loop through each of the selected products and start in workflow
var selection = web.getSelection().iterator();
while (selection.hasNext()){
	var node = selection.next();
	var objectType = node.getObjectType().getID();
	logger.info("@@@@ objectType: " + objectType);
	var inWorkflow = node.getWorkflowInstanceByID(workflowID);
	if (objectType.equals("PMDM.PRD.ExternalSourceRecord") && !inWorkflow){
		workflow.start(node, null);
	}
}

web.showAlert("ACKNOWLEDGMENT", msg1);
web.navigate(null, null);
}