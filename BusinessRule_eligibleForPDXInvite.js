/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "eligibleForPDXInvite",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "eligibleForPDXInvite",
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
  "pluginId" : "ReferenceOtherBCBusinessCondition",
  "parameters" : [ {
    "id" : "ReferencedBC",
    "type" : "com.stibo.core.domain.businessrule.BusinessCondition",
    "value" : "hasPimForRetail"
  }, {
    "id" : "ValueWhenReferencedIsNA",
    "type" : "com.stibo.util.basictypes.TrueFalseParameter",
    "value" : "false"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "pdxChannelAccountIdentifierAttribute",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "PDXChannelAccountIdentifier",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "supplierAccountReferenceType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "SupplierAccount",
    "description" : null
  }, {
    "contract" : "ClassificationBindContract",
    "alias" : "noSelfServiceSuppliersClassification",
    "parameterClass" : "com.stibo.core.domain.impl.FrontClassificationImpl",
    "value" : "NoSelfServiceSuppliers",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation1 = function (manager,node,log,pdxChannelAccountIdentifierAttribute,supplierAccountReferenceType,noSelfServiceSuppliersClassification) {
function findSupplierClassification(supplier) {
	var result = null;
	node.queryReferences(supplierAccountReferenceType).forEach(
		function(reference) {
			result = reference.getTarget().getParent();
			return false;
		}
	);
	return result;
}

var supplierClassification = findSupplierClassification(node);

if (supplierClassification && !noSelfServiceSuppliersClassification.equals(supplierClassification)) {
	var channelIDValue = supplierClassification.getValue(pdxChannelAccountIdentifierAttribute.getID()).getSimpleValue();
	if(channelIDValue){
		return false;
	} else {
		return true;
	}
}


}