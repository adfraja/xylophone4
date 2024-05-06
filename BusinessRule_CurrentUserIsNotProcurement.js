/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "CurrentUserIsNotProcurement",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Current User Is Not Procurement",
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
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "UserGroupBindContract",
    "alias" : "grp",
    "parameterClass" : "com.stibo.core.domain.impl.GroupImpl",
    "value" : "ProcurementManagerUsers",
    "description" : null
  } ],
  "messages" : [ {
    "variable" : "SubmitNotAllowedUserAssigned",
    "message" : "You are not allowed to submit {objectTypeName} for Review. Please submit to Supplier Review or Approve",
    "translations" : [ ]
  } ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,grp,SubmitNotAllowedUserAssigned) {
if (!node.getManager().getCurrentUser().getAllGroups().contains(grp)) {
	return true;
} else {
	var workflowInstancesIter = node.getWorkflowInstances().iterator();
	var workflowInstance = workflowInstancesIter.next();
	var task = workflowInstance.getTasks().iterator().next();
	var assignee = task.getAssignee();
	var message = new SubmitNotAllowedUserAssigned();
	message.objectTypeName = node.getObjectType().getName();
	message.task = task.getState().getTitle();
	message.assignee = assignee.getID();
	return message;
}

}