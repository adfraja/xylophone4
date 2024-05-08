/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "setGLNCondition",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "setGLNCondition",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager) {
var pdxWF = manager.getWorkflowHome().getWorkflowByID("PDXInvitationHandling");

if (pdxWF) {
var condValue = "Yes";
var condAttr = manager.getAttributeHome().getAttributeByID("glnCondition");

node.getValue(condAttr.getID()).setSimpleValue(condValue);
}
}