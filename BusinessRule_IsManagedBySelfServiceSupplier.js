/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "IsManagedBySelfServiceSupplier",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Is Managed By Self Service Supplier",
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
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ClassificationBindContract",
    "alias" : "noSelf",
    "parameterClass" : "com.stibo.core.domain.impl.FrontClassificationImpl",
    "value" : "NoSelfServiceEntities",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,refType,noSelf) {
/* if (node.getReferences(refType).iterator().hasNext() && refType.getTarget().equals(noSelf))  {
	return false;
}
else {
	return true;
}
*/
var selfServiceRefs = node.getReferences(refType);
var hasExistingSelfServiceRef = false;
if(selfServiceRefs && selfServiceRefs.iterator().hasNext()) {​​
    var iter = selfServiceRefs.iterator();
    while(iter.hasNext()) {​​
        var ref = iter.next();
        if(!ref.getTarget().equals(noSelf)) {​​
            return true;
        }​​ else {​​
            return false;
        }​​
    }​​
}​​

}