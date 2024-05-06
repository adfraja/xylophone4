/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "DataValiditySuppliers",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Data Validity Suppliers",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "OrganizationCustomer" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "ReadOnlyContextBind",
    "alias" : "readOnly",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "MandatoryContextBind",
    "alias" : "mandatory",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "HiddenContextBind",
    "alias" : "hidden",
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
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "SimpleValueBindContract",
    "alias" : "revenueSize",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "RevenueSize",
    "description" : null
  }, {
    "contract" : "SimpleValueBindContract",
    "alias" : "naicsCode",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "NAICSCode",
    "description" : null
  }, {
    "contract" : "SimpleValueBindContract",
    "alias" : "sicCode",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "SICCode",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (readOnly,mandatory,hidden,manager,node,revenueSize,naicsCode,sicCode) {
var attrHome = manager.getAttributeHome();

//hidden
if (revenueSize < 1000000){
	hidden.setHidden(node, attrHome.getAttributeByID("NAICSCode"));
	hidden.setHidden(node, attrHome.getAttributeByID("SICCode"));
} else{
	mandatory.setMandatory(node, attrHome.getAttributeByID("NAICSCode"));
	mandatory.setMandatory(node, attrHome.getAttributeByID("SICCode"));
}

return(true);
}