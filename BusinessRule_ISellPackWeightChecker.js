/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "ISellPackWeightChecker",
  "type" : "BusinessCondition",
  "setupGroups" : [ "InstructorBusinessRules" ],
  "name" : "I Sell Pack Weight Checker",
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
  "pluginId" : "FunctionBusinessCondition",
  "parameters" : [ {
    "id" : "Formula",
    "type" : "com.stibo.util.basictypes.FormulaParameter",
    "value" : "value(\"Weight\") * 5 > value(\"SellPackWeight\")"
  }, {
    "id" : "MessageWhenFalse",
    "type" : "java.lang.String",
    "value" : "Sell Pack is more than 5 times heavier than the Product. Please check and correct."
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
