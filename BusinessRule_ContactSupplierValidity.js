/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "ContactSupplierValidity",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "ContactSupplierValidity",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ContactPerson" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
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
    "contract" : "MandatoryContextBind",
    "alias" : "mandatory",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "contactRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ContactPersonOrganization",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,mandatory,contactRef) {
mandatory.setMandatory(node, manager.getReferenceTypeHome().getReferenceTypeByID(contactRef));
mandatory.setMandatory(node, manager.getAttributeHome().getAttributeByID("FirstName"));
mandatory.setMandatory(node, manager.getAttributeHome().getAttributeByID("LastName"));
}