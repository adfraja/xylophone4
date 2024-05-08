/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "PMDM.BF.GetAllPackagingFromInternal",
  "type" : "BusinessFunction",
  "setupGroups" : [ "PMDM.BusinessFunctions" ],
  "name" : "Get All Packaging From Internal",
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
  "binds" : [ ],
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
exports.operation0 = function (node) {
function gatherAllPackages(packageMap, referenceTypesIDs, node) {
	node.queryReferencedBy(com.stibo.core.domain.Product, null).forEach(
		function(reference) {
			if (referenceTypesIDs.contains(reference.getReferenceType().getID())) {
				var source = reference.getSource();
				if(!packageMap.containsKey(source.getID())) {
					packageMap.put(source.getID(), source);
					gatherAllPackages(packageMap, referenceTypesIDs, source);
				}
			}
			return true;
		}
	);
}

var referenceTypesIDs = new java.util.HashSet();
packagingUnitReferencesAttributeGroup.getLinkTypes().toArray().filter(function (linktype) {return linktype instanceof com.stibo.core.domain.ReferenceType}).forEach(function (referenceType) {referenceTypesIDs.add(referenceType.getID());});

var packageMap = new java.util.LinkedHashMap();
gatherAllPackages(packageMap, referenceTypesIDs, node);

var result = new java.util.ArrayList();
result.addAll(packageMap.values());
return result;
}