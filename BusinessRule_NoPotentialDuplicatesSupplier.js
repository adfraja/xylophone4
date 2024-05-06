/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "NoPotentialDuplicatesSupplier",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "No Potential Duplicates Supplier",
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
  "pluginId" : "FindSimilarBusinessCondition",
  "parameters" : [ {
    "id" : "MatchingAlgorithm",
    "type" : "com.stibo.core.domain.ranking.MatchingAlgorithm",
    "value" : "SupplierFindSimilar"
  } ],
  "pluginType" : "Operation"
}
*/
