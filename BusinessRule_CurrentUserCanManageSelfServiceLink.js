/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "CurrentUserCanManageSelfServiceLink",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Current User Can Manage Self Service Link",
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
  "pluginId" : "OrBusinessCondition",
  "parameters" : [ {
    "id" : "BusinessConditions",
    "type" : "java.util.List",
    "values" : [ "CurrentUserIsProcurement", "CurrentUserIsMDMSpecialist" ]
  }, {
    "id" : "BusinessConditionsBooleans",
    "type" : "java.util.List",
    "values" : [ "false", "false" ]
  }, {
    "id" : "ReturnMessage",
    "type" : "java.lang.String",
    "value" : "You are not privileged to submit to suppliers. Please consult with a Procurement Manager or MDM Specialist."
  } ],
  "pluginType" : "Operation"
}
*/
