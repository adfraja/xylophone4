/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "LinkToExistingSupplier",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Link To Existing Supplier",
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "refType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "SupplierAccount",
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "web",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,refType,web) {
//node.createReference(null, refType);
var selection = web.getSelectedSetOfNodes();
var selfServiceRefs = node.getReferences(refType);
var iter = selfServiceRefs.iterator();
var ref = iter.next();
if(selection.size() > 1){
	throw "Only 1 is allowed";
}

var selectionIterator = selection.iterator();
//there's always only going to be 1 selection - so just get the first selection
ref.delete();
node.createReference(selectionIterator.next(), refType);


}