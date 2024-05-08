/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "NoPotentialDuplicatesContact",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "No Potential Duplicates Contact",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ContactPerson" ],
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
    "value" : "ContactFindSimilar"
  } ],
  "pluginType" : "Operation"
}
*/
