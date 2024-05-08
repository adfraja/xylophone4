/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "LinkContactToSelfServiceSupplier",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Link Contact To Self Service Supplier",
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "contact",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ContactPersonOrganization",
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
exports.operation0 = function (node,manager,refType,contact,noSelf) {
/*var selection = web.getSelectedSetOfNodes();
var selfServiceRefs = node.getReferences(refType);
var iter = selfServiceRefs.iterator();
var ref = iter.next();
if(selection.size() > 1){
	throw "Only 1 is allowed";
}
var selectionIterator = selection.iterator();
there's always only going to be 1 selection - so just get the first selection
ref.delete();

var orgRef = node.getReferences(contact);
var iter2 = orgRef.iterator();
var ref2 = iter2.next();
var targetSupplier = ref2.getTarget();

return targetSupplier;

node.createReference(selectionIterator.next(), refType);*/

//var node.getReferences(refType);


var supplierClassRef = node.getReferences(refType);
var hasExistingSelfServiceRef = false;
if(supplierClassRef && supplierClassRef.iterator().hasNext()) {​​
    var iterator = supplierClassRef.iterator();
    while(iterator.hasNext()) {​​
        var reference = iterator.next();
        if(reference.getTarget().equals(noSelf)) {​​
            reference.delete();
        }​​ else {​​
            hasExistingSelfServiceRef =true;
        }​​
    }​​
}​​

var selfServiceRefs = node.getReferences(contact);
var iter = selfServiceRefs.iterator();
var ref = iter.next();
var link = ref.getTarget();


var linkRef = link.getReferences(refType);
var iter2 = linkRef.iterator();
var ref2 = iter2.next();
var link2 = ref2.getTarget();

node.createReference(link2, refType);







}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBCBusinessCondition",
  "parameters" : [ {
    "id" : "ReferencedBC",
    "type" : "com.stibo.core.domain.businessrule.BusinessCondition",
    "value" : "CurrentUserIsNotSupplier"
  }, {
    "id" : "ValueWhenReferencedIsNA",
    "type" : "com.stibo.util.basictypes.TrueFalseParameter",
    "value" : "false"
  } ],
  "pluginType" : "Precondition"
}
*/
