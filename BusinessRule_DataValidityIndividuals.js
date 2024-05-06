/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "DataValidityIndividuals",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Data Validity Individuals",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "IndividualCustomer" ],
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
    "alias" : "income",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "Income",
    "description" : null
  }, {
    "contract" : "SimpleValueBindContract",
    "alias" : "creditLimit",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "CreditLimit",
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (readOnly,mandatory,hidden,manager,node,income,creditLimit,log) {
var attrHome = manager.getAttributeHome();

//readonly
if (income < 25000){
	log.info(income);
	readOnly.setReadOnly(node, attrHome.getAttributeByID("CreditLimit"));
}
return(true);
}