/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "QuerySupplierEntityClassByNameOrID",
  "type" : "BusinessFunction",
  "setupGroups" : [ "Functions" ],
  "name" : "Query Supplier Entity Classification by Name or ID",
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
  "pluginId" : "JavaScriptBusinessFunctionWithBinds",
  "binds" : [ {
    "contract" : "QueryHomeBindContract",
    "alias" : "qh",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "ot",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "SupplierEntitiesClassification",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation",
  "functionReturnType" : "com.stibo.query.home.QuerySpecification",
  "functionParameterBinds" : [ {
    "contract" : "StringBindContract",
    "alias" : "input",
    "parameterClass" : "null",
    "value" : null,
    "description" : ""
  }, {
    "contract" : "NodeBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : ""
  } ]
}
*/
exports.operation0 = function (qh,ot,input,node) {
var c = com.stibo.query.condition.Conditions;
return qh.queryFor(com.stibo.core.domain.Classification).where(c.objectType(ot).and(c.name().like(input).or(c.objectType(ot).and(c.id().like(input)))));
}