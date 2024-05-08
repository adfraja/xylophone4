/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "SubmitToSupplier",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Submit To Supplier",
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
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
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
    "contract" : "ClassificationBindContract",
    "alias" : "noSelf",
    "parameterClass" : "com.stibo.core.domain.impl.FrontClassificationImpl",
    "value" : "NoSelfServiceEntities",
    "description" : null
  } ],
  "messages" : [ {
    "variable" : "msg",
    "message" : "Can not submit to Supplier since current record has no Supplier Account",
    "translations" : [ ]
  } ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,refType,noSelf,msg) {
/* if (node.getReferences(refType).iterator().hasNext() && refType.getTarget().equals(noSelf))  {
	return false;
}
else {
	return true;
}
*/
var selfServiceRefs = node.getReferences(refType);
var hasExistingSelfServiceRef = false;
var message = new msg();
if(selfServiceRefs && selfServiceRefs.iterator().hasNext()) {​​
    var iter = selfServiceRefs.iterator();
    while(iter.hasNext()) {​​
        var ref = iter.next();
        if(!ref.getTarget().equals(noSelf)) {​​
            return true;
        }​​ else {​​
            return message;
        }​​
    }​​
}​​

}