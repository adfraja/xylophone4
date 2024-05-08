/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "PMDM.BF.SuppliersMasterProductID",
  "type" : "BusinessFunction",
  "setupGroups" : [ "PMDM.BusinessFunctions" ],
  "name" : "HTML Function - Supplier's Master Product ID",
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
    "contract" : "ObjectTypeBindContract",
    "alias" : "masterProductObjectType",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "PMDM.PRD.InternalMasterProduct",
    "description" : null
  }, {
    "contract" : "BusinessFunctionBindContract",
    "alias" : "getGoldenFromSourceBusinessFunction",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "masterProductIDAttribute",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "PMDM.AT.PDS.MasterProductID",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation",
  "functionReturnType" : "java.lang.String",
  "functionParameterBinds" : [ {
    "contract" : "NodeBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : ""
  } ]
}
*/
exports.operation0 = function (masterProductObjectType,getGoldenFromSourceBusinessFunction,manager,masterProductIDAttribute,node) {
function getMasterProductID(node) {
	var masterProductID = "";
	masterProductID = node.getValue(masterProductIDAttribute.getID()).getSimpleValue();
	if (!masterProductID) {
		var goldenRecord = getGoldenFromSourceBusinessFunction.evaluate({"node" : node});
		if (goldenRecord) {
			masterProductID = goldenRecord.getValue(masterProductIDAttribute.getID()).getSimpleValue();
		}
	}
	return masterProductID;
}

// System Messages are stored on entities, for localization purpose.
var msg1 = manager.getEntityHome().getEntityByID("SysMsg_PMDM.BF.SuppliersMPID_msg1").getValue("PMDM.AT.SystemMessage").getSimpleValue(); // 'No Master Product ID on Internal Source Record or Golden Record'

var result = "";
var masterProductID = getMasterProductID(node);
if (masterProductID) {
	result = masterProductID;
} else {
	result = msg1; // "No Master Product ID on Internal Source Record or Golden Record"
}

return result;
}