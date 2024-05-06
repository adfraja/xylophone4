/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "PMDM.BRA.CreateInternalFromExternal",
  "type" : "BusinessAction",
  "setupGroups" : [ "PMDM.BusinessRuleActions" ],
  "name" : "Create Internal Records from External Source Records",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "PMDM.PRD.ExternalSourceRecord" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
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
    "contract" : "ObjectTypeBindContract",
    "alias" : "SizeObjType",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "PMDM.PRD.InternalSourceRecord",
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "masterParentObjType",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "PMDM.PRD.InternalMasterProduct",
    "description" : null
  }, {
    "contract" : "ProductBindContract",
    "alias" : "internalParentProduct",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,SizeObjType,masterParentObjType,internalParentProduct) {
var masterProductIDAttr = node.getValue("PMDM.AT.PDS.MasterProductID").getSimpleValue();

var existingMasterProduct = null;
if(masterProductIDAttr){
var existingMasterProduct = manager.getNodeHome().getObjectByKey('PMDM.Key.INTMP.MasterProductID',masterProductIDAttr);
}

if(existingMasterProduct){
var newSizeProd = existingMasterProduct.createProduct("",SizeObjType);
copyAttributesFromExternalSourceToSize(newSizeProd);
copyNameFromExternalSourceToSize(newSizeProd);
copyAttributesFromSizeToMasterProduct(existingMasterProduct,newSizeProd);
//Copy references from external record to internal record
copyReferencesToSize(newSizeProd);
//copyReferencesToMasterProduct(existingMasterProduct,newSizeProd);

}
else{
var newMasterProduct = internalParentProduct.createProduct("",masterParentObjType);
var newSizeProduct = newMasterProduct.createProduct("",SizeObjType);	
copyAttributesFromExternalSourceToSize(newSizeProduct);
copyNameFromExternalSourceToSize(newSizeProduct);
copyAttributesFromSizeToMasterProduct(newMasterProduct,newSizeProduct);
copyNameFromSizeToMasterProduct(newMasterProduct,newSizeProduct);
//Copy references from enternal record to internal record
copyReferencesToSize(newSizeProduct);
copyReferencesToMasterProduct(newMasterProduct,newSizeProduct);
}

function copyAttributesFromExternalSourceToSize(size){
	var groupAttributes = manager.getAttributeGroupHome().getAttributeGroupByID("PMDM.ATG.CopyToInternalSourceRecord").getAttributes();
	var groupAttrIter = groupAttributes.iterator();
	while (groupAttrIter.hasNext()) {
		var attribute = groupAttrIter.next();		
			var actualValue = node.getValue(attribute.getID());
			if (actualValue != null) {
				var simpleValue = actualValue.getSimpleValue();
				if (simpleValue != null) {
					size.getValue(attribute.getID()).setSimpleValue(simpleValue);
					
			}
		}		
	}	
}

function copyAttributesFromSizeToMasterProduct(masterProd,sizeProd){
	var groupAttributes = manager.getAttributeGroupHome().getAttributeGroupByID("PMDM.ATG.CopyToInternalMasterProduct").getAttributes();
	var groupAttrIter = groupAttributes.iterator();
	while (groupAttrIter.hasNext()) {
		var attribute = groupAttrIter.next();		
			var actualValue = sizeProd.getValue(attribute.getID());
			if (actualValue != null) {
				var simpleValue = actualValue.getSimpleValue();
				if (simpleValue != null) {
					masterProd.getValue(attribute.getID()).setSimpleValue(simpleValue);
					
			}
		}		
	}	
}


function copyReferencesToSize(size){
    var nodeRefs = node.getReferences().asList();
    for (var i = 0; i < nodeRefs.size(); i++) {
        var nodeReference = nodeRefs.get(i);
        var nodeRefID = nodeReference.getReferenceType().getID();      
        var refTarget = nodeReference.getTarget();             
            size.createReference(refTarget, nodeRefID);                
    }
}

function copyReferencesToMasterProduct(masterProd,sizeProd){
    var nodeRefs = sizeProd.getReferences().asList();
    for (var i = 0; i < nodeRefs.size(); i++) {
        var nodeReference = nodeRefs.get(i);
        var nodeRefID = nodeReference.getReferenceType().getID();      
        var refTarget = nodeReference.getTarget();             
            masterProd.createReference(refTarget, nodeRefID);                
    }
}

function copyNameFromExternalSourceToSize(size){
	var attrNameSize = node.getName();
	size.setName(attrNameSize);	
}

function copyNameFromSizeToMasterProduct(masterProd,sizeProd){
	var attrNameMaster = sizeProd.getName();
	masterProd.setName(attrNameMaster);	
}

}