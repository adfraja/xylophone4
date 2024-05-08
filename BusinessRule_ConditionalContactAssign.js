/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "ConditionalContactAssign",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Conditional Contact Assign",
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
  "pluginId" : "JavaScriptBusinessActionWithBinds",
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
    "value" : "ContactPersonOrganization",
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "supplierOT",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "Supplier",
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "orgCustOT",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "OrganizationCustomer",
    "description" : null
  }, {
    "contract" : "UserGroupBindContract",
    "alias" : "procurementUsers",
    "parameterClass" : "com.stibo.core.domain.impl.GroupImpl",
    "value" : "ProcurementManagerUsers",
    "description" : null
  }, {
    "contract" : "UserGroupBindContract",
    "alias" : "salesUsers",
    "parameterClass" : "com.stibo.core.domain.impl.GroupImpl",
    "value" : "SalesUsers",
    "description" : null
  }, {
    "contract" : "CurrentWorkflowBindContract",
    "alias" : "currentWF",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,refType,logger,supplierOT,orgCustOT,procurementUsers,salesUsers,currentWF) {
/*var wfIter = node.getWorkflowInstances().iterator();
var wf = wfIter.next();
var task = wf.getTasks().iterator().next();
var refs = node.getReferences(refType);
if (refs.iterator().hasNext()){
	var iterator = refs.iterator();
	while(iterator.hasNext()){
		var reference = iterator.next();
		if(reference.getTarget().getObjectType().equals("OrganizationCustomer"){
			assignee = salesUsers;
		} else {
			assignee = procurementUsers;
		}
	}
}
*/


var currentUser = node.getManager().getCurrentUser();
var workflowInstance = node.getWorkflowInstance(currentWF);

var contactPersonOrgRef = node.getReferences(refType);
var hasExistingRef = false;

if (contactPersonOrgRef && contactPersonOrgRef.iterator().hasNext()) {
    ​​logger.info("hi there");
    var iterator = contactPersonOrgRef.iterator();
    while (iterator.hasNext()) {
        ​​logger.info("in the 1st while loop");
        var reference = iterator.next();
        var refTarget = reference.getTarget();
        var targetOT = refTarget.getObjectType().getID();
        var task = workflowInstance.getTaskByID("SalesProcurementReview");

        if (targetOT == "Supplier") {
            logger.info("i'm a supplier");
            task.reassign(procurementUsers);
        } else
            task.reassign(salesUsers);
    }
}

}