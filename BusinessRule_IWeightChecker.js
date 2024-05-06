/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "IWeightChecker",
  "type" : "BusinessCondition",
  "setupGroups" : [ "InstructorBusinessRules" ],
  "name" : "I Weight Checker",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SalesItem", "SalesItemFamily" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "AttributeComparatorCondition",
  "parameters" : [ {
    "id" : "Attribute1",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "SellPackWeight"
  }, {
    "id" : "Attribute2",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "Weight"
  }, {
    "id" : "Constant",
    "type" : "java.lang.String",
    "value" : ""
  }, {
    "id" : "Operator",
    "type" : "java.lang.String",
    "value" : ">"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ValidHierarchiesBusinessCondition",
  "parameters" : [ {
    "id" : "HierarchyRoots",
    "type" : "java.util.List",
    "values" : [ ]
  } ],
  "pluginType" : "Precondition"
}
*/
