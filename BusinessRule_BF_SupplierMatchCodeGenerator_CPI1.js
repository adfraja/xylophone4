/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "BF_SupplierMatchCodeGenerator_CPI1",
  "type" : "BusinessFunction",
  "setupGroups" : [ "Functions" ],
  "name" : "BF_SupplierMatchCodeGenerator_CPI1",
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
    "alias" : "addressRefType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "REF_SupplierToAddress",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "bankAccountRefType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "REF_SupplierToBankAccount",
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation",
  "functionReturnType" : "java.util.List<java.lang.String>",
  "functionParameterBinds" : [ {
    "contract" : "NodeBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : ""
  }, {
    "contract" : "StringBindContract",
    "alias" : "name1",
    "parameterClass" : "null",
    "value" : null,
    "description" : ""
  } ]
}
*/
exports.operation0 = function (addressRefType,bankAccountRefType,step,node,name1) {
result = new java.util.ArrayList();
if(node) {
	//Name Match Codes
	if(name1) {
		result.add("Name1:"+name1.toUpperCase());
	}
	
	
}
return result;
}