/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "NoPotentialDuplicatesOrganization",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "No Potential Duplicates Organization",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "OrganizationCustomer" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "FindSimilarBusinessCondition",
  "parameters" : [ {
    "id" : "MatchingAlgorithm",
    "type" : "com.stibo.core.domain.ranking.MatchingAlgorithm",
    "value" : "OrganizationFindSimilar"
  } ],
  "pluginType" : "Operation"
}
*/
