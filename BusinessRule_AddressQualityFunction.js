/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "AddressQualityFunction",
  "type" : "BusinessFunction",
  "setupGroups" : [ "Functions" ],
  "name" : "Address Quality Function",
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
  "binds" : [ ],
  "messages" : [ ],
  "pluginType" : "Operation",
  "functionReturnType" : "java.lang.Integer",
  "functionParameterBinds" : [ {
    "contract" : "EntityBindContract",
    "alias" : "Entity",
    "parameterClass" : "null",
    "value" : null,
    "description" : ""
  } ]
}
*/
exports.operation0 = function (Entity) {
var value = Entity.getDataContainerByTypeID("MainAddressDataContainer").getDataContainerObject().getValue("QualityIndex").getSimpleValue();
/*logger.info("Value" + value.toString())*/
if ("A".equals(value)) {
	return new java.lang.Integer(10);
}
if ("B".equals(value)) {
	return new java.lang.Integer(8);
}
if ("C".equals(value)) {
	return new java.lang.Integer(6);
}
if ("D".equals(value)) {
	return new java.lang.Integer(4);
}
if ("E".equals(value)) {
	return new java.lang.Integer(2);
}
if (value==null) {
	return new java.lang.Integer(0);
}

}