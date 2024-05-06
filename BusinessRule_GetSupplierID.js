/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "GetSupplierID",
  "type" : "BusinessFunction",
  "setupGroups" : [ "Functions" ],
  "name" : "Get Supplier ID",
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "refType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ContactPersonOrganization",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation",
  "functionReturnType" : "java.util.List<java.lang.String>",
  "functionParameterBinds" : [ {
    "contract" : "EntityBindContract",
    "alias" : "entity",
    "parameterClass" : "null",
    "value" : null,
    "description" : ""
  } ]
}
*/
exports.operation0 = function (refType,entity) {
var refsIter = entity.getReferences(refType).iterator();
var result = new java.util.ArrayList();
if(refsIter.hasNext()) {​​
    result.add(refsIter.next().getTarget().getID());
}​​
return result;
}