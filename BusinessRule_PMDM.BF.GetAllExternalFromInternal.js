/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "PMDM.BF.GetAllExternalFromInternal",
  "type" : "BusinessFunction",
  "setupGroups" : [ "PMDM.BusinessFunctions" ],
  "name" : "Get All External From Internal (NEW)",
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
  "pluginId" : "JavaScriptBusinessFunctionWithBinds",
  "binds" : [ {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "internalToExternalRecordReferenceType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "PMDM.PRT.INT2EXT",
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "externalSourceRecordObjectType",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "PMDM.PRD.ExternalSourceRecord",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation",
  "functionReturnType" : "java.util.List<com.stibo.core.domain.Product>",
  "functionParameterBinds" : [ {
    "contract" : "ProductBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : ""
  } ]
}
*/
exports.operation0 = function (internalToExternalRecordReferenceType,externalSourceRecordObjectType,node) {
var result = new java.util.ArrayList();
node.queryReferences(internalToExternalRecordReferenceType).forEach(
	function(reference) {
		if (reference.getTarget().getObjectType().equals(externalSourceRecordObjectType)) {
			result.add(reference.getTarget());
		}
		return true;
	}
);
return result;
}