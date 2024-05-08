/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "BC_SUPLReplicationMergeCondition",
  "type" : "BusinessCondition",
  "setupGroups" : [ "GlobalBusinessRulesRoot" ],
  "name" : "Supplier Replication Service| Update Data Container Condition",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Supplier", "SupplierPurchasingData" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function () {
return true
}