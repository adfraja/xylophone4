/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "RevenueSICCondition",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Revenue SIC Condition",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "OrganizationCustomer", "Supplier" ],
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
    "value" : "RevenueSize"
  }, {
    "id" : "Attribute2",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : null
  }, {
    "id" : "Constant",
    "type" : "java.lang.String",
    "value" : "1000000"
  }, {
    "id" : "Operator",
    "type" : "java.lang.String",
    "value" : ">"
  } ],
  "pluginType" : "Operation"
}
*/
