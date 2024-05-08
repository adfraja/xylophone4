/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "hasSupplierAccount",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "hasSupplierAccount",
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
    "contract" : "ClassificationBindContract",
    "alias" : "noSelf",
    "parameterClass" : "com.stibo.core.domain.impl.FrontClassificationImpl",
    "value" : "NoSelfServiceSuppliers",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (manager,node,log,noSelf) {
var supplierRef = manager.getReferenceTypeHome().getReferenceTypeByID("SupplierAccount");


var selfServiceRefs = node.getReferences(supplierRef);
var hasExistingSelfServiceRef = false;
if(selfServiceRefs && selfServiceRefs.iterator().hasNext()) {​​
    var iter = selfServiceRefs.iterator();
    while(iter.hasNext()) {​​
        var ref = iter.next();
        if(!ref.getTarget().equals(noSelf)) {​​
           log.info(ref.getTarget().getID());
           return false;
        }​​ ​
    }​​
}​else {
	return true;
}

}