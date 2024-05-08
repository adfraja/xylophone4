/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "GrantAdmin",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Grant Admin",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "entity",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "UserGroupBindContract",
    "alias" : "adminGroup",
    "parameterClass" : "com.stibo.core.domain.impl.GroupImpl",
    "value" : "SupplierAdmin",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (entity,adminGroup) {
var userGroupHome = entity.getManager().getGroupHome();
var userHome = entity.getManager().getUserHome();
var user = userHome.getUserByID(entity.getID());

adminGroup.addUser(user);

}