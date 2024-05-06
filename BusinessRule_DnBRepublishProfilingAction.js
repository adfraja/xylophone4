/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "DnBRepublishProfilingAction",
  "type" : "BusinessAction",
  "setupGroups" : [ "DnBBusinessRules" ],
  "name" : "D&B Republish Detailed Company Profile Request",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "OrganizationCustomer" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "RepublishEventQueueOperation",
  "parameters" : [ {
    "id" : "HasEventQueue",
    "type" : "com.stibo.core.domain.haseventqueue.HasEventQueue",
    "value" : "step://eventprocessor?id=DnBCompanyProfileProcessor"
  } ],
  "pluginType" : "Operation"
}
*/
