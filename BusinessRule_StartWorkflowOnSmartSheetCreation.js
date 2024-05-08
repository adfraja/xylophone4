/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "StartWorkflowOnSmartSheetCreation",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Start Workflow on Smart Sheet Creation",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SalesItem" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "BulkUpdateInitiateMultipleItemsInWorkflow",
  "parameters" : [ {
    "id" : "processNote",
    "type" : "java.lang.String",
    "value" : ""
  }, {
    "id" : "stateFlowID",
    "type" : "java.lang.String",
    "value" : "SupplierPortalV1 Workflow"
  } ],
  "pluginType" : "Operation"
}
*/
