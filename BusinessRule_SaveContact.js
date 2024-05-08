/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "SaveContact",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Save Contact",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ContactPerson" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "StandardizeAddressAction"
  } ],
  "pluginType" : "Operation"
}
*/
