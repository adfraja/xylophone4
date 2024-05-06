/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "InitiateMaintenanceAndNavigate",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Initiate Maintenance And Navigate",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ContactPerson", "Supplier" ],
  "allObjectTypesValid" : false,
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
    "contract" : "WebUiContextBind",
    "alias" : "webui",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ {
    "variable" : "EditNotAllowedUserAssigned",
    "message" : "You are currently not allowed to edit this {objectTypeName}, as it is currently in task {task} that is assigned to user {assignee}",
    "translations" : [ ]
  }, {
    "variable" : "EditNotAllowedUserGroupAssigned",
    "message" : "You are currently not allowed to edit this {objectTypeName}, as it is currently in task {task} that is assigned to user group {assignee}, which you are not a member of",
    "translations" : [ ]
  } ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,webui,EditNotAllowedUserAssigned,EditNotAllowedUserGroupAssigned) {
var currentUser = node.getManager().getCurrentUser();
var workflowInstancesIter = node.getWorkflowInstances().iterator();

while(workflowInstancesIter.hasNext()) {
    var workflowInstance = workflowInstancesIter.next();
    if(workflowInstance.getWorkflow().getID().equals("SupplierOnboardingSelfService") ||workflowInstance.getWorkflow().getID().equals("SupplierMaintenanceSelfService") ||workflowInstance.getWorkflow().getID().equals("ContactMaintenanceSelfService") ||workflowInstance.getWorkflow().getID().equals("ContactOnboardingSelfService")) {
        var task = workflowInstance.getTasks().iterator().next(); //This logic assumes no parallel tasks
        var assignee = task.getAssignee();
        if(assignee instanceof com.stibo.core.domain.User) {
            var canEdit = assignee.equals(currentUser);
            if(canEdit) {
            	var canEditReturn1 = true;
            } else {
            	var message = new EditNotAllowedUserAssigned();
            	message.objectTypeName = node.getObjectType().getName();
            	message.task = task.getState().getTitle();
            	message.assignee = assignee.getID();
            	throw message;
            }
        } else {
            var canEdit = currentUser.getAllGroups().contains(assignee);
            if(canEdit) {
            	var canEditReturn2 = true;
            } else {
            	var message = new EditNotAllowedUserGroupAssigned();
            	message.objectTypeName = node.getObjectType().getName();
            	message.task = task.getState().getTitle();
            	message.assignee = assignee.getID();
            	throw message;
            }

        }
    }
}


var canEditReturn3 = true;

var wfOnboarding = node.getObjectType().getID().equals("Supplier")?"SupplierOnboardingSelfService":"ContactOnboardingSelfService";
var wfMaintenance = node.getObjectType().getID().equals("Supplier")?"SupplierMaintenanceSelfService":"ContactMaintenanceSelfService";
var screenID = node.getObjectType().getID().equals("Supplier")?"Details-Supplier-WF":"Details-ContactPerson-WF";
var workflowInstanceIterator = node.getWorkflowInstances().iterator();
var existingWFInstance = null;
while(workflowInstanceIterator.hasNext()) {
    var workflowInstance = workflowInstanceIterator.next();
    if(workflowInstance.getWorkflow().getID().equals(wfOnboarding) ||workflowInstance.getWorkflow().getID().equals(wfMaintenance)) {
        existingWFInstance = workflowInstance;
    }
}
if(!existingWFInstance) { 
    existingWFInstance = node.startWorkflowByID(wfMaintenance, "");
}
webui.navigate(screenID, node, existingWFInstance.getTasks().iterator().next().getState()); //This logic assumes no parallel tasks
}