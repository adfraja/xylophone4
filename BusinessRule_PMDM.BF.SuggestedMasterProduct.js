/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "PMDM.BF.SuggestedMasterProduct",
  "type" : "BusinessFunction",
  "setupGroups" : [ "PMDM.BusinessFunctions" ],
  "name" : "HTML Function - Suggested Master Product",
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
	logger.info("Master Product from INT: " + masterProductID);
	if (!masterProductID) {
		var goldenRecord = getGoldenFromSourceBusinessFunction.evaluate({"node" : node});
		if (goldenRecord) {
			masterProductID = goldenRecord.getValue(masterProductIDAttribute.getID()).getSimpleValue();
			logger.info("Master Product from GR: " + masterProductID);	
		}
	}
	return masterProductID;
}

// System Messages are stored on entities, for localization purpose.
var msg1 = manager.getEntityHome().getEntityByID("SysMsg_PMDM.BF.SuggestedMP_msg1").getValue("PMDM.AT.SystemMessage").getSimpleValue(); // 'Existing variants (Displaying %n of %t):'
var msg2 = manager.getEntityHome().getEntityByID("SysMsg_PMDM.BF.SuggestedMP_msg2").getValue("PMDM.AT.SystemMessage").getSimpleValue(); // 'No existing variants'
var msg3 = manager.getEntityHome().getEntityByID("SysMsg_PMDM.BF.SuggestedMP_msg3").getValue("PMDM.AT.SystemMessage").getSimpleValue(); // 'No existing Master Product found matching the Supplier's Master Product ID.'
var msg4 = manager.getEntityHome().getEntityByID("SysMsg_PMDM.BF.SuggestedMP_msg4").getValue("PMDM.AT.SystemMessage").getSimpleValue(); // 'If you choose below to use the Supplier's Master Product, then a new Master Product object will be created in PIM and the Supplier's Master Product ID will be assigned to it.'

var result = "";

var masterProductID = getMasterProductID(node);
if (masterProductID) {
	var masterProduct = manager.getNodeHome().getObjectByKey('PMDM.Key.INTMP.MasterProductID', masterProductID);
	logger.info("Existing Master Product : " + masterProduct);
	if (masterProduct) {
		var masterProductDisplayName = masterProduct.getName();
		if (!masterProductDisplayName) {
			masterProductDisplayName = "(" + masterProduct.getID() + ")";
		}
		result = result + "<div style=\"padding-bottom:1em;\"><b>" + masterProductDisplayName + "</b></div>";
		var children = masterProduct.getChildren().toArray();
		if (children.length > 0) {

			// Header for existing variants
			if (children.length > 5) {
				//result = result + "Existing variants (Displaying 5 of " + children.length + "):";
				result = result + String(msg1).replace("%n","5").replace("%t",children.length);// "Existing variants (Displaying 5 of " + children.length + "):";
			} else {
				//result = result + "Existing variants:";				
				result = result + String(msg1).replace("%n",children.length).replace("%t",children.length);// "Existing variants (Displaying 5 of " + children.length + "):";
			}

			// Make list of variants sorted by name
			// It shouldn't be used if customer has 1000's of variants in the same Master Product
			var childrenSorted = new Array();
			for (var i = 0; i < children.length; i++) {
				childrenSorted.push(children[i].getName());
			}

			// Only show the first 5 variants
			var childrenToDisplay = childrenSorted.sort().splice(0,5);
			for (var i = 0; i < childrenToDisplay.length; i++) {
				result = result + "<br/>" + childrenToDisplay[i];
			}
		} else {
			//result = result + "No existing variants";
			result = result + msg2;
		}
	} else {
		//result = result + "No existing Master Product found matching the Supplier's Master Product ID."  + "<br/>" + "<br/>" + "<div style=\"padding-bottom:1em;\"><i>" + "If you choose below to use the Supplier's Master Product, then a new Master Product object will be created in PIM and the Supplier's Master Product ID will be assigned to it." + "</i></div>";
		result = result + msg3  + "<br/><br/><div style=\"padding-bottom:1em;\"><i>" + msg4 + "</i></div>";
	}
} else {
	result = "N/A";
}

return result;
}