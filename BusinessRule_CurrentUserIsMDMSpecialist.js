/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "CurrentUserIsMDMSpecialist",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Current User Is MDM Specialist",
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
    "value" : "MDMSpecialistUsers",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,grp) {
return node.getManager().getCurrentUser().getAllGroups().contains(grp);
}