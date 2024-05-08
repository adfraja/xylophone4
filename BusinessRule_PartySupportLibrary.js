/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "PartySupportLibrary",
  "type" : "BusinessLibrary",
  "setupGroups" : [ "Libraries" ],
  "name" : "Party Support Library",
  "description" : null,
  "scope" : null,
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : null,
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessLibrary",
  "binds" : [ ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
//common function to get attribute value
function getAttributeValue(node, attributeID) {
	return node.getValue(attributeID).getSimpleValue();
}

//common function to set attribute value
function setAttributeValue(node, attributeID, value) {
	return node.getValue(attributeID).setSimpleValue(value);
}

//common function to check if data container has value or not
function isDataContainerHasValue(node, dataContainerID) {
	var dataContainers = node.getDataContainerByTypeID(dataContainerID).getDataContainers();
	var itr = dataContainers.iterator();
	if(itr.hasNext()) {
		return true;
	}
	return false;
}

//common function to check if a reference has a target value or not
function hasReferenceTarget(node, step, referenceID) {
	var references = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID(referenceID));
	if (!references.isEmpty()){
	    return true;
	}
	return false;
}

//common function to retrieve an attribute object
function getAttributeObject(step, attributeID) {
	if(attributeID){
		return (step.getAttributeHome().getAttributeByID(attributeID));
	}
}

//common function to retrieve a reference object
function getReferenceObject(step, referenceID) {
	if(referenceID){
		return (step.getReferenceTypeHome().getReferenceTypeByID(referenceID));
	}
}

//function to send mail
function sendMail(mailer, toList, subject, body) {
	try {
		var mail = mailer.mail();
		mail.addTo(toList);
		mail.subject(subject);
		mail.htmlMessage(body);
		mail.send();
	}
	catch(e) {
		logger.info("Exception in sending mail, to list is "+toList+"\n"+e);
	}
}

//function to send mail with CC list
function sendMailWithCC(mailer, toList, ccList, subject, body) {
	try {
		var mail = mailer.mail();
		mail.addTo(toList);
		mail.addCc(ccList);
		mail.subject(subject);
		mail.htmlMessage(body);
		mail.send();
	}
	catch(e) {
		logger.info("Exception in sending mail, to list is "+toList+"\n"+e);
	}
}

// function to get mid night date and time ex : 2021-11-20 00:00:00
function getMidNightCurrentDateAndTime(){
	var currentDateMidNightTime = new java.text.SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date());
	return currentDateMidNightTime+" 00:00:00";
}

//function to add given days to date exclusing weekends
function addDaysToTextDate(dateAsText, noOfDays) {
	var parsedDate = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(dateAsText);
	var newDate = parsedDate.getTime() + noOfDays * 24 * 3600000;
	newDate = new Date(newDate);
	var isSaturday = newDate.getDay() == 6;
	var isSunday = newDate.getDay() == 0;
	if(isSaturday) {
		newDate = parsedDate.getTime() + (noOfDays+2) * 24 * 3600000;
	}
	else if(isSunday) {
		newDate = parsedDate.getTime() + (noOfDays+1) * 24 * 3600000;
	}
	return new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(newDate);
}

//common function to add days to a particular date
function addDaysToDate(date, noOfDays) {
	date.setDate(date.getDate() + Number(noOfDays));
	return date;
}


//function to set workflow Assignee
function setWorkflowAssignee(node, user, workflowID, stateID) {
	node.getWorkflowInstanceByID(workflowID).getTaskByID(stateID).reassign(user);
}

//function to set the status flag
function setWorkflowStatusFlag(node, workflowID, stateID, statusFlagID) {
    node.getWorkflowInstanceByID(workflowID).getTaskByID(stateID).setStatusFlagByID(statusFlagID);
}

//function to get attribute values of given attribute in the data container
function getAttributeValuesInDC(node, step, dcID, attributeID){
		var dataContainers = node.getDataContainerByTypeID(dcID).getDataContainers();
		var attributeValues = [];
		var itr = dataContainers.iterator();
		while (itr.hasNext()){
			var dcObject = itr.next().getDataContainerObject();
			var dcAttributeValue = dcObject.getValue(attributeID).getSimpleValue();
			if(dcAttributeValue) {
				attributeValues.push(dcAttributeValue);
			}
		}
	return attributeValues;
}

//funtion to get lookup table home , this can be used where lookup table bind is not added.
function getLookUpTableHome(step){
	var lookupTableHome = step.getHome(com.stibo.lookuptable.domain.LookupTableHome);
	return lookupTableHome;
}

//function to get lookup table value from the key value or lookup from value.
function getLookupValue(step, lookupFrom, lookupTableID){
	var lookUpHome = getLookUpTableHome(step);
	var lookupValue = lookUpHome.getLookupTableValue(lookupTableID, lookupFrom);
	return lookupValue;
}

//function to create a data container row for specified data container , this should be used when there is no key configured.
function createDataCointainer(node, dataContainerID){
	var dcID = node.getDataContainerByTypeID(dataContainerID);
	var addDC = dcID.addDataContainer();
	var newDC = addDC.createDataContainerObject("");
	return newDC;
}

//function to create a data container row for specified data container when there is key configured.
function createDataCointainerByKeyAttribute(node, step, dataContainerID, dataContainerKeyAttribute, dataContainerKeyAttributeValue){
	var dataContainerKey = getDataContainerKey(node, step, dataContainerID, dataContainerKeyAttribute, dataContainerKeyAttributeValue)
	var dataContainerObj = node.getDataContainerByTypeID(dataContainerID).addDataContainer();
	var newDataContainerRow = dataContainerObj.createDataContainerObjectWithKey(dataContainerKey);
	return newDataContainerRow;
}

//function to get data container key from the builder.
function getDataContainerKey(node, step, dataContainerID, dataContainerKeyAttribute, dataContainerKeyAttributeValue){
	var dataContainerKeyHome = step.getHome(com.stibo.core.domain.datacontainerkey.keyhome.DataContainerKeyHome);
	var dataContainerKeyBuilder = dataContainerKeyHome.getDataContainerKeyBuilder(dataContainerID).withAttributeValue(dataContainerKeyAttribute, dataContainerKeyAttributeValue);
	var dataContainerKey = dataContainerKeyBuilder.build();
	return dataContainerKey;
}

//function to get data container object for the given attribute ID and attribute value in the data container.
function getDataContainerbyAttrValue(node, step, dataContainerID, attributeID, attributeValue) {
	var dataContainers = node.getDataContainerByTypeID(dataContainerID).getDataContainers();
	var itr = dataContainers.iterator();
	while (itr.hasNext()){
		var dataContainerObject = itr.next().getDataContainerObject();
		var localValue = dataContainerObject.getValue(attributeID).getSimpleValue();
		if(attributeValue) {
			if(attributeValue.equals(localValue)) {
				return dataContainerObject;
			}
		}
	}
return null;
}

//function to get data container object for the given attribute ID and LOV value ID in the data container.
function getDataContainerbyAttrValueID(node, step, dataContainerID, attributeID, attributeValueID) {
	var dataContainers = node.getDataContainerByTypeID(dataContainerID).getDataContainers();
	var itr = dataContainers.iterator();
	while (itr.hasNext()){
		var dataContainerObject = itr.next().getDataContainerObject();
		var localValue = dataContainerObject.getValue(attributeID).getID();
		if(attributeValueID.equals(localValue)) {
			return dataContainerObject;
		}
	
	}
return null;
}

//function to get complete data container object for the given attribute ID and LOV value ID in the data container in an array
function getDCObjectListFromMainWS(node, step, dataContainerID, attributeID, attributeValue) {
    var dataContainers = node.getDataContainerByTypeID(dataContainerID).getDataContainers();
    var dCObjects = new java.util.HashSet("");
    var itr = dataContainers.iterator();
    while (itr.hasNext()) {
        var dataContainerObject = itr.next().getDataContainerObject();
        var localValue = dataContainerObject.getValue(attributeID).getSimpleValue();
        if (attributeValue) {
            if (attributeValue.equals(localValue)) {
                dCObjects.add(dataContainerObject);
            }
        }
    }
    return dCObjects;
}
//function to delete all records of a data container
function deleteAllDataContainerRows(node, dataContainerID) {
	var dataContainers = node.getDataContainerByTypeID(dataContainerID);
	dataContainers.deleteLocal();
}

//function to delete data container row for the givne attribute ID and attribute value in the data container.
function deleteLocalDataContainerRow(node, step, dataContainerID, attributeID, attributeValue) {
	var dataContainers = node.getDataContainerByTypeID(dataContainerID).getDataContainers();
	var itr = dataContainers.iterator();
	while (itr.hasNext()){
		var dcRow = itr.next();
		var dcObject = dcRow.getDataContainerObject();
		var localValue = dcObject.getValue(attributeID).getSimpleValue();
		if(attributeValue.equals(localValue)) {
			dcRow.deleteLocal();
			break;
		}
	}
}

//function to get single reference target attribute value
function getSingleReferenceAttributeValue(node, step, referenceID, referenceAttributeID) {
	var referenceAttributeValue = null;
	var entityReference = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID(referenceID));
	if (!entityReference.isEmpty()) {
	    var target = entityReference.get(0).getTarget();
	    referenceAttributeValue = target.getValue(referenceAttributeID).getSimpleValue();
	}
	return referenceAttributeValue;	
}

//function to get single reference target attribute value ID
function getSingleReferenceAttributeValueID(node, step, referenceID, referenceAttributeID) {
	var referenceAttributeValueID = null;
	var entityReference = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID(referenceID));
	if (!entityReference.isEmpty()) {
	    var target = entityReference.get(0).getTarget();
	    referenceAttributeValueID = target.getValue(referenceAttributeID).getID();
	}
	return referenceAttributeValueID;	
}

//function to get reference target ID
function getReferenceTargetID (node, step, referenceID) {
	var entityReference = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID(referenceID));
	if (!entityReference.isEmpty()) {
		var target = entityReference.get(0).getTarget();
		return target.getID();
	}
	return null;
}

//function to get the reference target object from multi reference by target attribute value
function getRefTargetByTargetAttrValue(node, step, referenceID, targetAttrID, targetAttrValue) {
	var references = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID(referenceID));
	for(var i=0; i<references.size(); i++) {
		var target = references.get(i).getTarget();
		var attributeValue = target.getValue(targetAttrID).getSimpleValue();
		if(targetAttrValue.equals(attributeValue)) {
			return target;
		}
	}
return null;
}

// function to get target of a reference in approved workspace
function getReferenceTargetIDFromApprovedWS(node, step, referenceID) {
	var approvedReferenceTargetID = step.executeInWorkspace("Approved", function(step) {
								var approvedObj = step.getObjectFromOtherManager(node);
								if(approvedObj) {
									var referenceTargetID = getReferenceTargetID (approvedObj, step, referenceID);
									return referenceTargetID;
								}
								return null;
	});
	return approvedReferenceTargetID;
}

function getAssignedSupplierList(node, step) {
	var arr = [];
	if(node!= undefined) {
		var refType= step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierPermittedPayee")
		var references = node.getReferences(refType).toArray();
 		if (references.length > 0) {
			for(var i=0;i<references.length;i++) { 
				var supplierObj = references[i].getTarget();
				arr.push(supplierObj.getID());
		      }
		 }
	 }
	return arr;
}

// function to get approved node
function approvednode(node, step) {
	return step.executeInWorkspace("Approved", function(step) {
		var appnode = step.getEntityHome().getEntityByID(node.getID());
	return appnode;
	});
}

//function to get objects by attribute value & object type
function getObjectsByAttributeValueAndObjectType (step, objectID, attributeID, attributeValue) {
	var result = [];
	var conditions = com.stibo.query.condition.Conditions;
	var systemObjectType = step.getObjectTypeHome().getObjectTypeByID(objectID);
	var attributeObj = step.getAttributeHome().getAttributeByID(attributeID);            
	var queryHome = step.getHome(com.stibo.query.home.QueryHome);
	var querySpecification = queryHome.queryFor(com.stibo.core.domain.entity.Entity).where(
	conditions.valueOf(attributeObj).eq(attributeValue)
	.and(conditions.objectType(systemObjectType))
	);
                
	var resultList = querySpecification.execute();
	 resultList.forEach(function (node) {
	 result.push(node);
	return true;
	});
	return result;
}

//function to get Data Container values from Approved Workspace
function getDCValuesFromApprovedWS(node, step, dataContainerID, attributeID) {
	var dataContainerApprovedWSValues = step.executeInWorkspace("Approved", function(step) {
											var approvedObj = step.getObjectFromOtherManager(node); 
											var approvedWorkspaceValues = getAttributeValuesInDC(approvedObj, step, dataContainerID, attributeID);
											return approvedWorkspaceValues;
										});
	return dataContainerApprovedWSValues;
}

//function to get Data Container object for the given attribute ID and attribute value in the data container from Approved Workspace
function getDCObjectFromApprovedWS(node, step, dataContainerID, attributeID, attributeValue) {
	var dataContainerObjApprovedWS = step.executeInWorkspace("Approved", function(step) {
											var approvedObj = step.getObjectFromOtherManager(node); // suplAWSObj : Supplier object from approved workspace
											if (approvedObj) {
											var approvedWorkspaceDCObject = getDataContainerbyAttrValue(approvedObj, step, dataContainerID,attributeID, attributeValue);
											return approvedWorkspaceDCObject;
											}
											return null;
										});
	return dataContainerObjApprovedWS;
}

//function to get complete Data Container object for the given attribute ID and attribute value in the data container from Approved Workspace in an array
function getDCObjectListFromApprovedWS(node, step, dataContainerID, attributeID, attributeValue) {
    var dataContainerObjApprovedWS = step.executeInWorkspace("Approved", function(step) {
        var approvedObj = step.getObjectFromOtherManager(node);
        if (approvedObj) {
            var approvedWorkspaceDCObject = getDCObjectListFromMainWS(approvedObj, step, dataContainerID, attributeID, attributeValue);
            return approvedWorkspaceDCObject;
        }
        return null;
    });
    return dataContainerObjApprovedWS;
}
//function to get attribute values from Approved Workspace
function getAttrValuesFromApprovedWS(node, step, attributeID) {
	var approvedWorkspaceValues = step.executeInWorkspace("Approved", function(step) {
											var approvedObj = step.getObjectFromOtherManager(node); 
											if(approvedObj) {
												return approvedObj.getValue(attributeID).getSimpleValue();
											}
											return "Did not exist"
										});
	return approvedWorkspaceValues;
	
}
//function to check if reference count is equal or not in main and approved workspace
function areReferencesAddedOrDeleted(node, step, referenceID) {
	var mainWSReferencesSize = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID(referenceID)).size();
	var approvedWSReferencesSize = step.executeInWorkspace("Approved", function(step) {
											var approvedObj = step.getObjectFromOtherManager(node);
											if(approvedObj) {
												return Number(approvedObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID(referenceID)).size());
											}
											return 0;
							});

		approvedWSReferencesSize = Number(approvedWSReferencesSize);
		if(mainWSReferencesSize != approvedWSReferencesSize) {
			return true;
		}
	return false;
}
//ffunction to compare Attrbiute Values in main and approved workspace
function compareMainAndApprovedWsValues(node, step, attributeID) {
	var mainWSValue = node.getValue(attributeID).getSimpleValue();
	var approvedWSvalue = getAttrValuesFromApprovedWS(node, step, attributeID);
	if(mainWSValue != approvedWSvalue) {
		return true;
	}
return false;
}

//function to compare Children Attrbiute Values in main and approved workspace
function compareChildrenAttributeValues(node, step, childObjectTypeID, attributeID) { 
	var childList = node.getChildren();
	for(var i=0; i<childList.size(); i++) {
		var childObj = childList.get(i);
		var childObjID = childList.get(i).getObjectType().getID();
		if(childObjID == childObjectTypeID){
			var mainWSValue = childObj.getValue(attributeID).getSimpleValue();
			if(!"Not in Approved workspace".equals(childObj.getApprovalStatus())) {
				var approvedWSvalue = getAttrValuesFromApprovedWS(childObj, step, attributeID);
				if(mainWSValue != approvedWSvalue) {
					return true;
				}
			}
		}
	}
	return false;
}

//compare reference attribute values
function compareAttributeValuesForReference(node, step, referenceID, attributeID) {
	var refObjs = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID(referenceID));
	for(var i=0; i<refObjs.size(); i++) {
		var refObj = refObjs.get(i).getTarget();
		var mainWSValue = refObj.getValue(attributeID).getSimpleValue();
		if(!"Not in Approved workspace".equals(refObj.getApprovalStatus())) {
			var approvedWSvalue = getAttrValuesFromApprovedWS(refObj, step, attributeID);
			if(mainWSValue != approvedWSvalue) {
				return true;
			}
		}
	}
	return false;
}

//function to get children reference target
function getChildrenReferenceTargetID(node, step, childObjectTypeID, referenceID) {
	var childList = node.getChildren();
	for(var i=0; i<childList.size(); i++) {
		var childObj = childList.get(i);
		var childObjID = childList.get(i).getObjectType().getID();
		if(childObjID == childObjectTypeID){
			var mainAlternativePayee = getReferenceTargetID(childObj, step, referenceID);
			var approvedAlternativePayee = getReferenceTargetIDFromApprovedWS(childObj, step, referenceID);
			if(mainAlternativePayee != approvedAlternativePayee) {
				return true;
			}
		}
	}
	return false;
}

//function to compare reference targets
function compareReferenceTargetID(node, step, objectTypeID, primaryReferenceID, secondaryReferenceID) {
	var refObjs = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID(primaryReferenceID));
	for(var i=0; i<refObjs.size(); i++) {
		var refObj = refObjs.get(i).getTarget();
		var refObjID = refObjs.get(i).getTarget().getObjectType().getID();
		if(refObjID == objectTypeID){
			var mainAlternativePayee = getReferenceTargetID(refObj, step, secondaryReferenceID);
			var approvedAlternativePayee = getReferenceTargetIDFromApprovedWS(refObj, step, secondaryReferenceID);
			if(mainAlternativePayee != approvedAlternativePayee) {
				return true;
			}
		}
	}
	return false;
}

//function to compare Reference Attrbiute Values in main and approved workspace
function compareReferenceAttributeValues(node, step, childObjectTypeID, attributeID) {
	var ref = step.getReferenceTypeHome().getReferenceTypeByID(childObjectTypeID);
	var bankReference = node.getReferences(ref);
	if (!bankReference.isEmpty()){
		for(var i=0; i<bankReference.size(); i++) {
			var bankObj = bankReference.get(i).getTarget();
			var mainWSValue = bankObj.getValue(attributeID).getSimpleValue();
			if(!"Not in Approved workspace".equals(bankObj.getApprovalStatus())) {
				var approvedWSvalue = getAttrValuesFromApprovedWS(bankObj, step, attributeID);
				if(mainWSValue != approvedWSvalue) {
					return true;
				}
			}
		}
	}
	return false;
}

//function to check if child objects are added under given parent
function areChildrenAdded(parentNode, objectTypeID) {
	var childrens = parentNode.getChildren();
    for(var i=0; i<childrens.size(); i++) {
		var childObj = childrens.get(i);
		var childObjTypeID = childObj.getObjectType().getID();
		if(objectTypeID.equals(childObjTypeID)) {
			return true;
		}
	}
	return false;
}

//function to check if reference are added or not
function areReferenceAdded(node, step, referenceID) {
	var refObjs = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID(referenceID));
	if (!refObjs.isEmpty()){
		return true;
	}
	return false;
}

//function to initiate an item in a workflow
function initiateItemIntoWorkflow(node, workflowID, processNote) {
	if(!node.isInWorkflow(workflowID)) {
		node.startWorkflowByID(workflowID, processNote)
	}
}

//function to check if user is member of given group or not
function isUserMemberOfUserGroup(step, userGroupID, userID) {
	var userGroup = step.getGroupHome().getGroupByID(userGroupID);
	var user = step.getUserHome().getUserByID(userID);
	if(userGroup){
		if( userGroup.isMember(user)) {
			return true;
		}
	}
	return false;
}

//function to fetch data container rows in a hashset from main workspace
function getDataContainerRowsInMainWorkspace(node, step, dcID) {
	var mainDCObjects = new java.util.HashSet("");
	var mainDC = node.getDataContainerByTypeID(dcID).getDataContainers();
	var itr = mainDC.iterator();
	while (itr.hasNext()){
		var mainDCObject = itr.next().getDataContainerObject();
		mainDCObjects.add(mainDCObject);
	}
	return mainDCObjects;
}

//function to fetch data container rows in a hashset from approved workspace
function getDataContainerRowsInApprovedWS(node, step, dcID) {
	var appDCObjects = new java.util.HashSet("");
	var dataContainerApprovedWSValues = step.executeInWorkspace("Approved", function(step) {
									var approvedObj = step.getObjectFromOtherManager(node);
									if(approvedObj) {
										var approvedDC = approvedObj.getDataContainerByTypeID(dcID).getDataContainers();
										var itr = approvedDC.iterator();
										while (itr.hasNext()){
											var approvedDCObject = itr.next().getDataContainerObject();
											appDCObjects.add(approvedDCObject);
										}
									}
									return appDCObjects;
	});
	return dataContainerApprovedWSValues;									
}

//function to get attribute value from a data container row from approved workspace(if exists) for comparing with corrosponding value in main workspace
function getAttributeValueFromDCRowInApprovedWS (node, step, dcID, attributeID, mainDCObject) {
	var approvedDCObject= step.executeInWorkspace("Approved", function(step) {
						var approvedObj = step.getObjectFromOtherManager(node);
						if(approvedObj) {
							var appDataContainers = approvedObj.getDataContainerByTypeID(dcID).getDataContainers();
							var appItr = appDataContainers.iterator();
							while (appItr.hasNext()) {
								var appDCObject = appItr.next().getDataContainerObject();
								if (appDCObject.equals(mainDCObject)) {
									return appDCObject;
								}
							}
							return null;
						}
	});
	if(approvedDCObject) {
		return approvedDCObject.getValue(attributeID).getSimpleValue();
	}
	return null;
}

//function to check if LOV value is existing in the given LOV or not.
function isLOVValueExist(step, lovID, lovValueID) {
	var lovObj = step.getListOfValuesHome().getListOfValuesByID(lovID);
	var lovValue = lovObj.getListOfValuesValueByID(lovValueID);
	if(lovValue) {
		return true;
	}
	return false;
}


/**
 * @desc Compare/Detect data container changes in main and approved workspcaes
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns null if nothing has been changed else returns the change info text 
 */
function compareMainAppDataContainers(node, step, DCID, DCAttrGrpID){
	var changeInfo = null
	if(node.getApprovalStatus() != "Not in Approved workspace"){
		var mainDCRows = getDataContainerRowsInMainWorkspace(node, step, DCID);
		var approvedDCRows = getDataContainerRowsInApprovedWS(node, step, DCID);
		var dataContainers = node.getDataContainerByTypeID(DCID).getDataContainers();
		for (var i = approvedDCRows.iterator(); i.hasNext(); ) {
			var approvedDCRow = i.next();
			if(!mainDCRows.contains(approvedDCRow)) {
				if(changeInfo == null){
					changeInfo = ""
				}
				changeInfo += "Data Container ("+approvedDCRow.getValue("AT_TaxNumber").getSimpleValue()+") removed\n";
			}
		}
		var itr = dataContainers.iterator();
		while (itr.hasNext()){
			var dcObject = itr.next().getDataContainerObject();
			var isNewEntry=!approvedDCRows.contains(dcObject);
			if(isNewEntry) {
				if(changeInfo == null){
					changeInfo = ""
				}
				changeInfo += "Data Container ("+dcObject.getValue("AT_TaxNumber").getSimpleValue()+") added\n";
			}
			var attributes = step.getAttributeGroupHome().getAttributeGroupByID(DCAttrGrpID).getAllAttributes();
			var attributeItr = attributes.iterator();
			while(attributeItr.hasNext()) {
				attributeObject = attributeItr.next();
				attributeID = attributeObject.getID();
				
				var mainAttributeValue = dcObject.getValue(attributeID).getSimpleValue();
				var approvedAttributeValue = getAttributeValueFromDCRowInApprovedWS (node, step, DCID, attributeID, dcObject);
				if (mainAttributeValue != approvedAttributeValue && !("AT_FaxNumber".equals(attributeID) && isNewEntry)) {
					if(changeInfo == null){
						changeInfo = ""
					} 	
					changeInfo += attributeID+" changed in Data Container ("+dcObject.getValue("AT_TaxNumber").getSimpleValue()+")\n";
				}
			}
		}
	}
	return changeInfo
}

/**
 * @desc Compare/Detect Attribute value changes in main and approved workspcaes
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns null if nothing has been changed else returns the change info text 
 */
function compareMainApprovedAttrValues(node, step, attrIDList){
	var changeInfo = null
	if(node.getApprovalStatus() != "Not in Approved workspace"){
		for (var i=0;i<attrIDList.length;i++ ) {
			var mainAttributeValue = getAttributeValue(node, attrIDList[i])
			var approvedAttributeValue = getAttrValuesFromApprovedWS(node, step, attrIDList[i])
			if(mainAttributeValue!=approvedAttributeValue){
				if(changeInfo == null){
					changeInfo = ""
				} 
				changeInfo += attrIDList[i]+";"
			}
		}
	}
	return changeInfo
}

/**
 * @desc Compare/Detect Reference changes in main and approved workspcaes
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns null if nothing has been changed else returns the change info text 
 */
function compareMainAppReferenceValues(node, step, refID){
	var changeInfo = null
	var refName =  step.getReferenceTypeHome().getReferenceTypeByID(refID).getName()
	var approvedRefValue = getReferenceTargetIDsFromApprovedWS(node, step, refID)
	var mainRefValue = getReferenceTargetIDs(node, step, refID)
	if(mainRefValue.length>0 && approvedRefValue.length>0) {
		if (!isEqual(mainRefValue, approvedRefValue)){
			if(changeInfo == null){
				changeInfo = ""
			}
			changeInfo += "The value for " + refName +" is changed from '" + getReferenceTargetNamesFromApprovedWS(node, step, refID) + "' to " + getReferenceTargetNames(node, step, refID) + "\n";
		}
	}
	else if(mainRefValue.length == 0 && approvedRefValue.length > 0) {
		if(changeInfo == null){
			changeInfo = ""
		}
		changeInfo += "The value for " + refName +" is changed from '" + getReferenceTargetNamesFromApprovedWS(node, step, refID) + "' to 'null'" ;
	}
	else if (mainRefValue.length > 0 && approvedRefValue.length == 0){
		if(changeInfo == null){
			changeInfo = ""
		}
		changeInfo += "The value for " + refName +" is changed from 'null' to '" + getReferenceTargetNames(node, step, refID) + "'\n";	
	}
	return changeInfo
}

//function to create a new Company Code
function createNewCompanyCode (node, step, newCmpCodeID, companyCodeMasterID) {
	var companyCodeMasterObj = step.getEntityHome().getEntityByID(companyCodeMasterID);
	var newCompanyCodeObj = companyCodeMasterObj.createEntity(newCmpCodeID,"SupplierCompanyCode");
	newCompanyCodeObj.setName(companyCodeMasterID);
	newCompanyCodeObj.getValue("AT_CompanyCode").setLOVValueByID(companyCodeMasterID);
	node.createReference(newCompanyCodeObj, "REF_SupplierToSupplierCompanyCode");
	newCompanyCodeObj.createReference(companyCodeMasterObj, "REF_SuplCompanyCodeToCompanyCodeMaster");
	var suplClearingWithCust = newCompanyCodeObj.getValue("AT_SuplClearingWithCust").setLOVValueByID("N");
	var suplIndividualPmnt = newCompanyCodeObj.getValue("AT_SuplIndividualPmnt").setLOVValueByID("N");
	var suplPostingBlockForCompanyCode = newCompanyCodeObj.getValue("AT_SuplPostingBlockForCompanyCode").setLOVValueByID("N");
	var tradingPartner = node.getValue("AT_TradingPartner").getSimpleValue();
	if(!tradingPartner) {
		var supplierCountryID = getAddressDetails(node, step, "REF_SupplierToAddress").countryCode;
		var ccMasterCountryID = companyCodeMasterID.slice(0,2);
		var ccCountryObjID = "CNTRY_" + ccMasterCountryID;
		var ccCountryObj = step.getEntityHome().getEntityByID(ccCountryObjID);
		var reconciliationAccountNumber = ccCountryObj.getValue("AT_SuplReconciliationAcct").getSimpleValue();
		if(!ccMasterCountryID.equals(supplierCountryID)) {
				reconciliationAccountNumber = ccCountryObj.getValue("AT_SuplReconciliationAcctNonMatching").getSimpleValue();
		}
		if(reconciliationAccountNumber) {
			if(companyCodeMasterID == "DE7A") {
				reconciliationAccountNumber = "4410110000";
			}
			var reconciliationAccountID = companyCodeMasterID + "_" + reconciliationAccountNumber;
			var isReconciliationAccountLOVValuePresent = isLOVValueExist(step, "LOV_ReconciliationAccount", reconciliationAccountID);
			if(isReconciliationAccountLOVValuePresent) {
				newCompanyCodeObj.getValue("AT_ReconciliationAccount").setLOVValueByID(reconciliationAccountID);
			}
		}
		newCompanyCodeObj.getValue("AT_SupplierWFStatus").setLOVValueByID("In_Creation");
		newCompanyCodeObj.getValue("AT_CheckFlagDoubleInvoicesCreditMemos").setLOVValueByID("Y");
	}
	return newCompanyCodeObj;
}

//function to set major revision for a supplier related object
function setMajorRevision(node, step, marker) {
	var revision = node.getRevision();
	revision.setMajor();
	var clazzRev = revision.getClass();
	var method_setComment = clazzRev.getMethod("setComment", java.lang.String);
	method_setComment.invoke(revision, marker);
}

//function to revert back the object to last major revision
function revertToLastMajorRevision (node, step, marker) {
	var revisions = node.getRevisions();
	var iterator = revisions.iterator();
	
	while (iterator.hasNext()) {
	    var rev = iterator.next();
	    var clazzRev = rev.getClass();
	    var method_getComment = clazzRev.getMethod("getComment");
	    var comment = method_getComment.invoke(rev);
	    if (marker.equals(comment)) {
	        var revNode = rev.getNode();
	        var clazzRevNode = revNode.getClass();
	        var method_revert = clazzRevNode.getMethod("revert");
	        method_revert.invoke(revNode);
	        break;
	    }
	}
}

//function to get all tax values from supplier
function getAllTaxValues(node, step) {
	var taxAttributeIDs = ["AT_TaxNumber", "AT_TaxNumber1", "AT_TaxNumber2", "AT_TaxNumber3", "AT_TaxNumber4", "AT_TaxNumber5", "AT_TaxNumber6", "AT_VatNumber"];
	var taxValues = [];
	for(var i=0;i<taxAttributeIDs.length;i++){
		var taxValue = node.getValue(taxAttributeIDs[i]).getSimpleValue();
		if(taxValue) {
			taxValue = taxValue.replace("-", "");
			taxValues.push(taxValue);
		}
	}
	return taxValues;
}

//----------------- Match and Merge Replication functions ----------//
function syncSupplierReferences(sourceObj, goldenObj, step, referenceType){
	deleteSupplierReferences(sourceObj, goldenObj, step, referenceType)
	createReferencesFromSourceObject(goldenObj, sourceObj, step, referenceType)
}

function createReferencesFromSourceObject(goldenObj, sourceObj, step, referenceType){
	var sourceReferences = sourceObj.getReferences(referenceType);
	for(var i=0; i<sourceReferences.size(); i++) {
		var target = sourceReferences.get(i).getTarget();
		var flag = sourceReferences.get(i).getValue("AT_ReplicationActionFlag").getID()+""
		try{
			if (flag == "C" || flag == "U"){
				goldenObj.createReference(target, referenceType);
			}
		}
		catch (e){
			log.info("Exception in match and merge action : "+e);
		}
	}
}

function deleteSupplierReferences(sourceObj, goldenObj, step, referenceType){
	var sourceReferences = sourceObj.getReferences(referenceType);
	for(var i=0; i<sourceReferences.size(); i++) {
		var sourceTarget = sourceReferences.get(i).getTarget().getID();
		var flag = sourceReferences.get(i).getValue("AT_ReplicationActionFlag").getID()+"";
		if (flag != "I"){
			deleteAllGoldenRefs(goldenObj, step, referenceType);
			break;
		}
		else {
			break;
		}
	}
}

function deleteAllGoldenRefs(goldenObj, step, referenceType){
	var goldenReferences = goldenObj.getReferences(referenceType);
	for(var i=0; i<goldenReferences.size(); i++) {
		log.info("Deleting  target supplier : "+goldenReferences.get(i).getTarget().getName());
		var goldenReferenceItem = goldenReferences.get(i);
		goldenReferenceItem.delete();
	}
}

function deleteEmptyDataContainerRow(goldenObj, step, dataContainerID, emptyValueAttributeID) {
	var dataContainers = goldenObj.getDataContainerByTypeID(dataContainerID).getDataContainers();
	var itr = dataContainers.iterator();
	while (itr.hasNext()){
		var dcRow = itr.next();
		var dcObject = dcRow.getDataContainerObject();
		var localValue = dcObject.getValue(emptyValueAttributeID).getSimpleValue();
		if(!localValue) {
			dcRow.deleteLocal();
		}
	}
}
//----------------- Match and Merge Replication functions ----------//

/**
 * @desc function to get value of a required attribute from the pickup list data container
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-4521}
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {String} pickupListID pickList entity ID , ex : PVL_12228874 for Payment Terms
 * @param {String} keyAttributeID key attribute ID in the pickList data container ex : AT_PickupValueId
 * @param {String} keyAttributeValueID key attribute value ID in the pickList data container ex : "N030"
 * @param {String} valueAttributeID ID of the attribute which holds the value ex : AT_Key_6 for ZTAG1 value of payment terms
 * @returns {String} Returns value of the attribute  from the pick list else null
 */
function getValueFromPickupValueList(step, pickupListID, keyAttributeID, keyAttributeValueID, valueAttributeID)
{
	var pickupValueListObj = step.getEntityHome().getEntityByID(pickupListID);
	var dcRow = getDataContainerbyAttrValue(pickupValueListObj, step, "DC_PickupValues", keyAttributeID, keyAttributeValueID);
	if(dcRow) {
		var attributeValue = dcRow.getValue(valueAttributeID).getSimpleValue();
		if(attributeValue) {
			return attributeValue;
		}
	}
return null;
}

/**
 * @desc function to fetch the address details
 * @link
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {String} addressRefID ID of the address reference ex : REF_SupplierToAddress for suuplier , REF_CustomerToAddress for customer
 * @returns {Object} Returns address value object if address referece present else false.
 */

function getAddressDetails(node, step, addressRefID){
	var addressReference = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID(addressRefID));
	if (!addressReference.isEmpty()){
	    var address = addressReference.get(0).getTarget();
		var addressValues = {
			country : address.getValue("AT_Country").getSimpleValue(),
			countryCode : address.getValue("AT_Country").getID(),
			region : address.getValue("AT_Region").getSimpleValue(),
			regionID : address.getValue("AT_Region").getID(),
			city : address.getValue("AT_City").getSimpleValue(),
			street : address.getValue("AT_Street").getSimpleValue(),
			postCode : address.getValue("AT_PostCode").getSimpleValue(),
			poBox :address.getValue("AT_PoBox").getSimpleValue(),
			poBoxPostCode : address.getValue("AT_POBoxPostalCode").getSimpleValue(),
			poBoxCity : address.getValue("AT_PoBoxCity").getSimpleValue(),
			nationalCity : address.getValue("AT_NationalCity").getSimpleValue(),
			nationalStreet : address.getValue("AT_NationalStreet").getSimpleValue(),
			district: address.getValue("AT_District").getSimpleValue()
		};
		return addressValues;
	}
	return false;	
}

/**
 * @desc Sends a mail to supplier requestor
 * @link
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Step} step Step manager.
 * @param {string} userID BSH user ID.
 * @returns {Object} user value object.
 */
function getUserDetails(step, userID) {
	var userDetails = "";
	if(userID) {
		var userObject = step.getUserHome().getUserByID(userID);
		userDetails = 
		{
			userName : userObject.getName(),
			userEmail : userObject.getEMail()
		};
	}
	return userDetails;
}

/**
 * @desc function used to return the attribute value from Country object
 * @link
 * @author Harshit Sharma <Harshit.Sharma-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {String} countryid Country Object ID
 * @param {String} attributeID Attribute ID on country level
 * @returns {String} country attribute value from address reference
 */
 
function getCountryAttrValue(node, step, countryid, attributeID){
	var countryEntity = step.getEntityHome().getEntityByID("Countries");
	var countryChild = countryEntity.getChildren();
    for(var i=0; i<countryChild.size(); i++){
		var countryObj = countryChild.get(i);
		var countryObjID = countryObj.getID();
		if(countryObjID.equals(countryid)){
			var attributeValue = countryObj.getValue(attributeID).getSimpleValue();
			break;
		}
	}
	return attributeValue;
}

/**
 * @desc function used to create a new request for supplier object
 * @link
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {supplierObject} supplier object 
 * @returns {object} newly created request object
 */

function createNewRequest(supplierObject, step) {
	var requestParent = step.getEntityHome().getEntityByID("Requests");
	var newRequest = requestParent.createEntity(null,"Request");
	var currentUser = step.getCurrentUser();
	var userName = currentUser.getName();
	var currentDateTime = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date());
	newRequest.getValue("AT_ChangeRequester").setSimpleValue(userName);
	newRequest.getValue("AT_RequestCreatedTime").setSimpleValue(currentDateTime);
	var requestReference = newRequest.createReference(supplierObject,"REF_RequestToSupplier");

	return newRequest;
}

/*=========================== Supplier Specific Functions ==================================*/

/**
 * @desc function to split string by number of chars
 * @link
 * @author Bharat Gandhi <Bharat.Gandhi-ext@bshg.com>
 * @param {String} fullString Text to be splitted
 * @param {Number} charLength Number of chars to be present in each substring
 * @returns Array of splitted strings.

 */
function splitStringByCharLength(fullString, charLength){
	var result = [];
	while(fullString.length > charLength) {
		var indexOfSpace=fullString.indexOf(' ');
		if(indexOfSpace >charLength){
			result.push(fullString.slice(0,indexOfSpace));
			fullString=fullString.slice(indexOfSpace + 1);
		}
		else if(indexOfSpace == -1){
			result.push(fullString);
			fullString='';
		}
		else {
			var index = fullString.slice(0,charLength).lastIndexOf(' ');
			index = index > -1 ? index : charLength;
			result.push(fullString.slice(0,index));
			fullString = fullString.slice(index+1);  
		}
	}
	if(fullString){
		result.push(fullString);
	}
	return result;
}

/**
 * @desc Split Names into Name 1, Name 2.. and set Supplier name.
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-3657
 * @author Bharat Gandhi <Bharat.Gandhi-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns 

 */
/*function setNameValues(node, step) {
	var name1 = node.getValue("AT_Name1").getSimpleValue();
	if(name1) {
		var nameSplitArray = splitStringByCharLength(String(name1), 35);
		for(i=0; i<nameSplitArray.length; i++) {
			setAttributeValue(node, "AT_Name"+(i+1), nameSplitArray[i]);
		}
		node.setName(getAttributeValue(node, "AT_Name1").trim());
	}
}*/
function setNameValues(node, step,finalName) {
	var nameSplitArray = splitStringByCharLength(String(finalName), 35);
	for(i=0;i<4;i++){
		setAttributeValue(node, "AT_Name"+(i+1),null);
	}
	try{
		for(i=0; i<nameSplitArray.length; i++) {
			setAttributeValue(node, "AT_Name"+(i+1), nameSplitArray[i]);
		}
	}
	catch(e){
		logger.info("Exception !Exceeded the Name length"+e);	
	}
	node.setName(getAttributeValue(node, "AT_Name1").trim());
}

/**
 * @desc Sends a mail to supplier requestor
 * @link
 * @author Savita <Savita.Mannalle-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns
 */
function getMailLinks(node, step) {
	var globalVariables = step.getClassificationHome().getClassificationByID("SupplierVariables");
	var linkDetails = 
	{
		SmdLink : globalVariables.getValue("AT_SmdLink").getSimpleValue(),
		FaQLink : globalVariables.getValue("AT_FaQLink").getSimpleValue(),
	};
	return linkDetails;
}

/**
 * @desc Sends a Submit mail to supplier requestor
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-3892
 * @author Amruta <Amruta.Tangade-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {MailHome} mailer Mail Home
 * @returns
 */
 
function sendSubmitMailToRequestor(node, step, mailer) {
	var userID = node.getValue("AT_RequestorAssignee").getSimpleValue();
	var requestonBehalfOf = node.getValue("AT_RequestCreatedOnBehalfOf").getSimpleValue();
	if(userID) {
		var userDetails = getUserDetails(step, userID);
		var userEmail = userDetails.userEmail;
		var userName = userDetails.userName;
		var supplierObj = getSupplierFromRequest(node, step);
		var sapR3Reference = supplierObj.getValue("AT_SAPR3Reference").getSimpleValue();
			sapR3Reference = sapR3Reference ? sapR3Reference : "No Info";
		var subject = "Request "+node.getID()+" for the vendor " +supplierObj.getName()+ " " +supplierObj.getID()+ " ( " + " SAP ID : " + sapR3Reference + " ) " + "has been submitted.";
		var linkDetails = getMailLinks(node, step);
		var smdtLink =  linkDetails.SmdLink;
		var faqLink = linkDetails.FaQLink;
		var body = "<html><head>";
			body+=  "Dear "+userName+",<br><br>";
			body+= ""+subject;
			body+= "<br><br>Thanks & Regards,<br>Supplier Master Data Team"; 
			body+= "<br><a href="+smdtLink+">Our Website"; 
			if(userEmail) {	
				if(requestonBehalfOf) {
					sendMailWithCC(mailer, userEmail, requestonBehalfOf, subject, body);
				}
				else {
					sendMail(mailer, userEmail, subject, body);
				}
			}
		}
}

/**
 * @desc Sends a mail to supplier requestor
 * @link
 * @author Savita <Savita.Mannalle-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {MailHome} mailer Mail Home
 * @returns
 */
 function sendApproveMailToRequestor(node, step, mailer) {
	var userID = node.getValue("AT_RequestorAssignee").getSimpleValue();
	var requesterUser = step.getUserHome().getUserByID(userID);
	var requestonBehalfOf = node.getValue("AT_RequestCreatedOnBehalfOf").getSimpleValue();
	if(requesterUser){
		var userDetails = getUserDetails(step, userID);
		var userEmail = userDetails.userEmail;
		var userName = userDetails.userName;
		var supplierObj = getSupplierFromRequest(node, step);
		var sapR3Reference = supplierObj.getValue("AT_SAPR3Reference").getSimpleValue();
			sapR3Reference = sapR3Reference ? sapR3Reference : "No Info";
		var linkDetails = getMailLinks(node, step);
		var smdtLink =  linkDetails.SmdLink;
		var faqLink = linkDetails.FaQLink;
		var suplGlobalVariables = step.getClassificationHome().getClassificationByID("SupplierVariables");
		var comments = node.getValue("AT_Comments").getSimpleValue();
		if(comments) {
			comments = comments.replace("<multisep/>","<br>");
		}
		var systemURL = suplGlobalVariables.getValue("AT_SystemURL").getSimpleValue();
		var evaluationWFUrl = systemURL+"webui/SupplierWebUI#screen=TaskListWF_Evaluation&stateflow=WF_SupplierEvaluation&onlyMine=All&state=Evaluation&cellSelection=1046141202.0x0&aeefdceefbbd.nodeType=entity&aeefdceefbbd.selection="+node.getID()+"&NodeDetailsOverlay.NodeType=Entity&NodeDetailsOverlay.Selection="+node.getID()+"&selectedTab=195849898.1_2973734898.0";
		//var evaluationWFUrl = systemURL+"webui/SupplierWebUI#cellSelection=1046141202.0x0&NodeDetailsOverlay.NodeType=Entity&NodeDetailsOverlay.Selection="+node.getID()+"&contextID=Global&workspaceID=Main&screen=TaskListWF_Evaluation&stateflow=WF_SupplierEvaluation&onlyMine=All&state=Evaluation&displayMode=-673246558.0_-1672235204.0_126510176.0&aeefdceefbbd.nodeType=entity&aeefdceefbbd.selection="+node.getID()+"&aeefdceefbbd.inv=0&facbbdeedd.inv=0&selectedTab=3063520804.1_2973734898.0";
		var requestURL=systemURL+"webui/SupplierWebUI#contextID=Global&workspaceID=Main&selection="+node.getID()+"&nodeType=entity";
		var supplierURL=systemURL+"webui/SupplierWebUI#contextID=Global&workspaceID=Main&screen=DetailScreen_Supplier&selection="+supplierObj.getID()+"&nodeType=entity&selectedTab=450412263.0&displayMode=126510176.0";
		var requestLink="<a href="+requestURL+">"+node.getID()+" </a>";
		var supplierLInk="<a href="+supplierURL+">"+supplierObj.getID()+" </a>";
		var requestDetails = " Request  " + requestLink + "  for the vendor " + supplierObj.getName() + " ( " + supplierLInk+ " ) has been approved";
		var changeRequestType = node.getValue("AT_TypeOfChangeRequest").getID();
		if("TU".equals(changeRequestType)){
			var postponedRequestURL = systemURL + "webui/SupplierWebUI#contextID=en_US&workspaceID=Main&selection="+node.getID()+"&nodeType=entity&workflowID=WF_SupplierChange&stateID=CH_TemporarilyUnblocked&bbadf.inv=0&selectedTab=705419466.1_2378723593.0&displayMode=126510176.0";
			var postponedRequestLink = "<a href="+postponedRequestURL+">"+node.getID()+" </a>";
			var deadline = node.getWorkflowInstanceByID("WF_SupplierChange").getTaskByID("CH_TemporarilyUnblocked").getDeadline();
			var subject = "Supplier [ " + supplierObj.getID() + " ( SAP ID : " + sapR3Reference  + " ) " + supplierObj.getName() + " ] has been temporarily unblocked";
			var body = "<html><head>";
				body+=  "Dear "+userName+",<br><br>";
				body+= "Supplier [ "+supplierLInk+" ,  <b>"+supplierObj.getName()+"</b> ] stacked to the request "+postponedRequestLink+" has been temporarily unblocked for three business days. You can postpone the deadline by entering your request and clicking Postpone re-blocking button, otherwise it will be re-blocked automatically on " + deadline + "\n";
				body+= "SAP R3 Reference : "+sapR3Reference+"<br><br>";
				body+= "<br><br><Strong>Clarification comments:</Strong><br>"+comments+"<br><br>";
				body+= "<br><br>Thanks & Regards,<br>Supplier Master Data Team"; 
				body+= "<br><a href="+smdtLink+">Our Website";
		}
		else{
			var subject = " Request " + node.getID() + " for the vendor " + supplierObj.getName() + supplierObj.getID() + " ( " + " SAP ID : " + sapR3Reference + " ) " + " has been approved";
			var body = "<html><head>";
				body+=  "Dear "+userName+",<br>";
				body+= ""+requestDetails+"<br>";
				body+= "SAP R3 Reference : "+sapR3Reference+"<br><br>";
				var isReturnVendorPresent = populateReturnVendorFlagOnSupplierLevel(supplierObj, step);
				if(isReturnVendorPresent && !supplierObj.getValue("AT_CustomerNumber").getSimpleValue()){
					body+= "<br> Please note : This Supplier " + supplierLInk + " marked for return vendor process,customer will be created and customer number will be updated in STIBO, please check the Get Customer Details workflow for more details";
				}
				body+= "<br><br><Strong>Clarification comments:</Strong><br>"+comments+"<br><br>";
				body+= "If you are an ESPRESSO Requestor, please keep in mind, that your vendor number will be available in the system after midnight CET.";
				body+= "<br><br><a href="+evaluationWFUrl+">Click here to provide the feedback</a>";
				body+= "<br><br>Thanks & Regards,<br>Supplier Master Data Team"; 
				body+= "<br><a href="+smdtLink+">Our Website"; 	
		}
		if(userEmail) {
			if(requestonBehalfOf) {
				sendMailWithCC(mailer, userEmail, requestonBehalfOf, subject, body);
			}
			else {
				sendMail(mailer, userEmail, subject, body);
			}
		}
	}
}

/**
 * @desc Sends a rejection mail to supplier requestor
 * @link
 * @author Savita <Savita.Mannalle-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {MailHome} mailer Mail Home
 * @returns
 */
 
function sendRejectionMailToRequestor(node, step, mailer) {
	var userID = node.getValue("AT_RequestorAssignee").getSimpleValue();
	var requesterUser = step.getUserHome().getUserByID(userID);
	var requestonBehalfOf = node.getValue("AT_RequestCreatedOnBehalfOf").getSimpleValue();
	if(requesterUser){
		var userDetails = getUserDetails(step, userID);
		var userEmail = userDetails.userEmail;
		var userName = userDetails.userName;
		var supplierObj = getSupplierFromRequest(node, step);
		var sapR3Reference = supplierObj.getValue("AT_SAPR3Reference").getSimpleValue();
			sapR3Reference = sapR3Reference ? sapR3Reference : " : No Info"; 
		var subject = " Request " + node.getID() + " for the vendor " + supplierObj.getName() + " ( SAP ID :" + sapR3Reference + " ) " +  supplierObj.getID() + " has been rejected";
		var comments = node.getValue("AT_Comments").getSimpleValue();
		if(comments) {
	   		comments = comments.replace("<multisep/>","<br>");
		}
		var linkDetails = getMailLinks(node, step);
		var smdtLink =  linkDetails.SmdLink;
		var faqLink = linkDetails.FaQLink;
		var suplGlobalVariables = step.getClassificationHome().getClassificationByID("SupplierVariables");
		var systemURL = suplGlobalVariables.getValue("AT_SystemURL").getSimpleValue();
		var evaluationWFUrl = systemURL+"webui/SupplierWebUI#screen=TaskListWF_Evaluation&stateflow=WF_SupplierEvaluation&onlyMine=All&state=Evaluation&cellSelection=1046141202.0x0&aeefdceefbbd.nodeType=entity&aeefdceefbbd.selection="+node.getID()+"&NodeDetailsOverlay.NodeType=Entity&NodeDetailsOverlay.Selection="+node.getID()+"&selectedTab=195849898.1_2973734898.0";
		//var evaluationWFUrl = systemURL+"webui/SupplierWebUI#cellSelection=1046141202.0x0&NodeDetailsOverlay.NodeType=Entity&NodeDetailsOverlay.Selection="+node.getID()+"&contextID=Global&workspaceID=Main&screen=TaskListWF_Evaluation&stateflow=WF_SupplierEvaluation&onlyMine=All&state=Evaluation&displayMode=-673246558.0_-1672235204.0_126510176.0&aeefdceefbbd.nodeType=entity&aeefdceefbbd.selection="+node.getID()+"&aeefdceefbbd.inv=0&facbbdeedd.inv=0&selectedTab=3063520804.1_2973734898.0";
		var requestURL=systemURL+"webui/SupplierWebUI#contextID=Global&workspaceID=Main&selection="+node.getID()+"&nodeType=entity";
		var supplierURL=systemURL+"webui/SupplierWebUI#contextID=Global&workspaceID=Main&screen=DetailScreen_Supplier&selection="+supplierObj.getID()+"&nodeType=entity&selectedTab=450412263.0&displayMode=126510176.0";
		var typeOfChangeRequest = node.getValue("AT_TypeOfChangeRequest").getSimpleValue();
		var requestLink="";
		var supplierLInk="";
		if(typeOfChangeRequest){
			 requestLink="<a href="+requestURL+">"+node.getID()+" </a>";
			 supplierLInk="<a href="+supplierURL+">"+supplierObj.getID()+" </a>";
		}
		else{
			requestLink=node.getID();
			supplierLInk=supplierObj.getID();
		}
	
		var requestDetails = "Request "+requestLink+" for the vendor " +supplierObj.getName()+ " ("+supplierLInk+") has been rejected";
		var body = "<html><head>";
			body+=  "Dear "+userName+",<br>";
			body+= ""+requestDetails+"<br>";
			body+= "SAP R3 Reference : "+sapR3Reference;
			body+= "<br><br><Strong>Rejection comments:</Strong><br>"+comments;
			body+= "<br><br>To make our common process efficient, we encourage you to learn more about reasons of rejections and reworks on our link";
			body+= "<br><a href="+faqLink+">FAQ site</a>";
			body+= "<br><br><a href="+evaluationWFUrl+">Click here to provide the feedback</a>";
			body+= "<br><br>Thanks & Regards,<br>Supplier Master Data Team"; 
			body+= "<br><a href="+smdtLink+">Our Website";
			if(userEmail) {	
				if(requestonBehalfOf) {
					sendMailWithCC(mailer, userEmail, requestonBehalfOf, subject, body);
				}
				else {
					sendMail(mailer, userEmail, subject, body);
				}
			}
		}
}

/**
 * @desc Sends a clarification mail to supplier requestor
 * @link
 * @author Savita <Savita.Mannalle-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {MailHome} mailer Mail Home
 * @returns
 */
function sendClarificationMailToRequestor(node, step, mailer) {
	var userID = node.getValue("AT_RequestorAssignee").getSimpleValue();
	var requesterUser = step.getUserHome().getUserByID(userID);
	var suplGlobalVariables = step.getClassificationHome().getClassificationByID("SupplierVariables");
	var systemURL = suplGlobalVariables.getValue("AT_SystemURL").getSimpleValue();
	if(requesterUser) {
		var userDetails = getUserDetails(step, userID);
		var userEmail = userDetails.userEmail;
		var userName = userDetails.userName;
		var supplierObj = getSupplierFromRequest(node, step);
		var sapId = supplierObj.getValue("AT_SAPR3Reference").getSimpleValue();
		var requestType = node.getValue("AT_SuplRequestType").getSimpleValue();
		var supplierCountryCode = getAddressDetails(supplierObj, step, "REF_SupplierToAddress").countryCode;
		var subject = "The Request " + node.getID() + " with supplier "+ supplierObj.getID()+ " ( SAP ID: " +  sapId  + " ) " + " is waiting for your clarification – "+requestType+"_"+supplierCountryCode+"_"+node.getID()+"_"+userEmail;
		var comments = node.getValue("AT_Comments").getSimpleValue();
		if(comments) {
			comments = comments.replace("<multisep/>","<br>");
		}
		var askwebuiLink = systemURL+"webui/SupplierWebUI#contextID=Global&workspaceID=Main&screen=homepage";
		var requesterNotificationCount = 0;
		if (node.isInState("WF_SupplierCreation", "CR_ClarificationPending")) {
			requesterNotificationCount = node.getWorkflowInstanceByID("WF_SupplierCreation").getSimpleVariable("RequesterNotificationCount");
			askwebuiLink = systemURL+"webui/SupplierWebUI#screen=TaskListWF_CR_Requester&stateflow=WF_SupplierCreation&onlyMine=All&state=CR_ClarificationPending&aeefdceefbbd.nodeType=entity&aeefdceefbbd.selection="+node.getID()+"&aeefdceefbbd.inv=0&contextID=Global&workspaceID=Main&NodeDetailsOverlay.NodeType=Entity&NodeDetailsOverlay.Selection="+node.getID();
		}
		else if (node.isInState("WF_SupplierChange", "CH_RequesterClarificationPending")) {
			requesterNotificationCount = node.getWorkflowInstanceByID("WF_SupplierChange").getSimpleVariable("RequesterNotificationCount");
			askwebuiLink = systemURL+"webui/SupplierWebUI#screen=TaskListWF_Default&stateflow=WF_SupplierChange&onlyMine=All&state=CH_RequesterClarificationPending&aeefdceefbbd.nodeType=entity&aeefdceefbbd.selection="+node.getID()+"&aeefdceefbbd.inv=0&contextID=Global&workspaceID=Main&NodeDetailsOverlay.NodeType=Entity&NodeDetailsOverlay.Selection="+node.getID();
		}
		var body = "<html><head>";
		body+=  "Dear Requestor,<br>";		
		
		if(!requesterNotificationCount) {
			body+= "The request  <a href="+askwebuiLink+">"+node.getID()+"</a> with supplier no."+supplierObj.getID()+" is waiting for your clarification.<a href="+askwebuiLink+">Click here</a> to open the request and take the necessary action";
			requesterNotificationCount = Number(requesterNotificationCount)+1;
			if (node.isInState("WF_SupplierCreation", "CR_ClarificationPending")) {
				node.getWorkflowInstanceByID("WF_SupplierCreation").setSimpleVariable("RequesterNotificationCount", requesterNotificationCount);
			}
			else if (node.isInState("WF_SupplierChange", "CH_RequesterClarificationPending")) {
				node.getWorkflowInstanceByID("WF_SupplierChange").setSimpleVariable("RequesterNotificationCount", requesterNotificationCount);
			}
			
		}
		else if(requesterNotificationCount == 1) {
			body+= "The request  <a href="+askwebuiLink+">"+node.getID()+"</a> with supplier no."+supplierObj.getID()+" is waiting for your clarification.<a href="+askwebuiLink+">Click here</a> to open the request and take the necessary action";
			requesterNotificationCount = Number(requesterNotificationCount)+1;
			var nextWorkingDay = getNextWorkingDay(2);
			if (node.isInState("WF_SupplierCreation", "CR_ClarificationPending")) {
				node.getTaskByID("WF_SupplierCreation", "CR_ClarificationPending").setDeadline(nextWorkingDay);
				node.getWorkflowInstanceByID("WF_SupplierCreation").setSimpleVariable("RequesterNotificationCount", requesterNotificationCount);
			}
			else if (node.isInState("WF_SupplierChange", "CH_RequesterClarificationPending")) {
				node.getTaskByID("WF_SupplierChange", "CH_RequesterClarificationPending").setDeadline(nextWorkingDay);
				node.getWorkflowInstanceByID("WF_SupplierChange").setSimpleVariable("RequesterNotificationCount", requesterNotificationCount);
			}
		}
		else {
			body+= "The request  <a href="+askwebuiLink+">"+node.getID()+"</a> with supplier no."+supplierObj.getID()+" is still waiting for your clarification.<a href="+askwebuiLink+">Click here</a> to open the request and take the necessary action";
			if (node.isInState("WF_SupplierCreation", "CR_ClarificationPending")) {
				node.getTaskByID("WF_SupplierCreation", "CR_ClarificationPending").setDeadline(null);
			}
			else if (node.isInState("WF_SupplierChange", "CH_RequesterClarificationPending")) {
				node.getTaskByID("WF_SupplierChange", "CH_RequesterClarificationPending").setDeadline(null);
			}
		}
		body+= "<br><br><Strong>Clarification comments:</Strong><br>"+comments;
		body+= "<br><br>Thanks & Regards,<br>Supplier Master Data Team"; 
		if(userEmail) {
			sendMail(mailer, userEmail, subject, body);
		} 
	         
	}
}

/**
 * @desc Notification to Requestor after Request is completed 
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-6177
 * @author Bhoomika <Bhoomika.katti-ext@bshg.com>
  * @param {Node} node request object
 * @param {Step} step Step manager
 * @param {MailHome} mailer Mail Home
 */

function sendNotificationMailToRequestor(node, step, mailer,userComments) {
    var userID = node.getValue("AT_RequestorAssignee").getSimpleValue();
    var requesterUser = step.getUserHome().getUserByID(userID);
    var suplGlobalVariables = step.getClassificationHome().getClassificationByID("SupplierVariables");
    var systemURL = suplGlobalVariables.getValue("AT_SystemURL").getSimpleValue();


    if (requesterUser) {
        var rejectedLSDCObj = getDataContainerbyAttrValueID(node, step, "ATC_LocalSpecialistStatus", "AT_LocalSpecialistAction", "Rejected");
        if (rejectedLSDCObj) {
            var userDetails = getUserDetails(step, userID);
            var userEmail = userDetails.userEmail;
            var userName = userDetails.userName;
            var supplierObj = getSupplierFromRequest(node, step);
			var sapId = supplierObj.getValue("AT_SAPR3Reference").getSimpleValue();
            var requestType = node.getValue("AT_SuplRequestType").getSimpleValue();
            var supplierCountryCode = getAddressDetails(supplierObj, step, "REF_SupplierToAddress").countryCode;
            var requestorName = node.getValue("AT_RequestorName").getSimpleValue();
            var subject = " The  request  " + node.getID() + " with supplier no. " + supplierObj.getID() + " ( SAP ID: " + sapId + " ) " + "  has been rejected – " + requestType + "_" + supplierCountryCode + "_" + requestorName + " _ " + node.getID() + " _ " + userEmail + " _ " + supplierObj.getName();
            var localSpecialistWhoRejectedRequest = rejectedLSDCObj.getValue("AT_LSApprovedRejectedBy").getSimpleValue();
            

            var requestiLink = systemURL + "webui/SupplierWebUI#contextID=Global&workspaceID=Main&screen=homepage";

            var body = "";
            body += "Dear Stibo User,<br></br>";
            body += "Your request  " + node.getID() + " with  supplier no. " + supplierObj.getID() + " has been rejected – " + requestType + "_" + supplierCountryCode + "_" + node.getID() + "_" + requestorName + " _ " + userEmail + " _ " + supplierObj.getName() + " because the user " + localSpecialistWhoRejectedRequest + "  does not give his approval . Please see below the note reason of rejection In case of any questions please contact him/her personally for further clarification, </br></br>";
		  body += "<b>Reason for rejection:</b> "+userComments;
            body += "<br><html><table style=\"border-collapse:collapse;border:none;\">";
            body += "<tr><td style=\"padding: 8px;width: 233.75pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>CC or PO</strong></p></td>";
            body += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>LS</strong></p></td>";
            body += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>Backup LS</strong></p></td>";
            body += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>LS NPM</strong></p></td>";
            body += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>Backup LS NPM</strong></p></td>";
            body += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black);font-size:17px;text-align:center;'\"><strong>LS Order Center</strong></p></td>";
            body += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>Backup LS Order Center</strong></p></td>";
            body += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>Status</strong></p></td>";
            body += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>Approved/Rejected By</strong></p></td>";
            body += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>Approval/Rejection Date</strong></p></td></tr>";
            var localSpecialistDCs = node.getDataContainerByTypeID("ATC_LocalSpecialistStatus").getDataContainers();
            var itr = localSpecialistDCs.iterator();
            while (itr.hasNext()) {
                var localSpecialistDCRowObj = itr.next().getDataContainerObject();
                var dcCCPO = localSpecialistDCRowObj.getValue("AT_CCORPO").getSimpleValue() == null ? "  - " : localSpecialistDCRowObj.getValue("AT_CCORPO").getSimpleValue();
                var dcLS = localSpecialistDCRowObj.getValue("AT_LocalSpecialist").getSimpleValue() == null ? "  - " : localSpecialistDCRowObj.getValue("AT_LocalSpecialist").getSimpleValue();
                var dcBackupLS = localSpecialistDCRowObj.getValue("AT_BackupLocalSpecialist").getSimpleValue() == null ? "  - " : localSpecialistDCRowObj.getValue("AT_BackupLocalSpecialist").getSimpleValue();
                var dcLSNPM = localSpecialistDCRowObj.getValue("AT_LocalSpecialist_NPM").getSimpleValue() == null ? "  - " : localSpecialistDCRowObj.getValue("AT_LocalSpecialist_NPM").getSimpleValue();
                var dcBackupLSNPM = localSpecialistDCRowObj.getValue("AT_BackupLocalSpecialist_NPM").getSimpleValue() == null ? "  - " : localSpecialistDCRowObj.getValue("AT_BackupLocalSpecialist_NPM").getSimpleValue();
                var dcLSOrderCenter = localSpecialistDCRowObj.getValue("AT_LocalSpecialist_OrderCenter").getSimpleValue() == null ? "  - " : localSpecialistDCRowObj.getValue("AT_LocalSpecialist_OrderCenter").getSimpleValue();
                var dcBackupLSOrderCenter = localSpecialistDCRowObj.getValue("AT_BackupLocalSpecialist_OrderCenter").getSimpleValue() == null ? "  - " : localSpecialistDCRowObj.getValue("AT_BackupLocalSpecialist_OrderCenter").getSimpleValue();
                var dcStatus = localSpecialistDCRowObj.getValue("AT_LocalSpecialistAction").getSimpleValue() == null ? "  - " : localSpecialistDCRowObj.getValue("AT_LocalSpecialistAction").getSimpleValue();
                var dcApprovedRejectedBy = localSpecialistDCRowObj.getValue("AT_LSApprovedRejectedBy").getSimpleValue() == null ? "  -  " : localSpecialistDCRowObj.getValue("AT_LSApprovedRejectedBy").getSimpleValue();
                var dcApprovalRejectionDate = localSpecialistDCRowObj.getValue("AT_LSApprovalRejectionDate").getSimpleValue() == null ? " - ": localSpecialistDCRowObj.getValue("AT_LSApprovalRejectionDate").getSimpleValue();

                body += "<tr><td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcCCPO + "</p></td>";
                body += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcLS + "</p></td>";
                body += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcBackupLS + "</p></td>";
                body += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcLSNPM + "</p></td>";
                body += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcBackupLSNPM + "</p></td>";
                body += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcLSOrderCenter + "</p></td>";
                body += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcBackupLSOrderCenter + "</p></td>";
                body += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcStatus + "</p></td>";
                body += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcApprovedRejectedBy + "</p></td>";
                body += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcApprovalRejectionDate + "</p></td></tr>";

            }
        }


        body += "</table><p>Please contact all (Accounting or PM Purchasing) Local Specialists assigned to the supplier before submitting a new request.</p>";
        var requestURL = systemURL + "webui/SupplierWebUI#contextID=Global&workspaceID=Main&selection=" + node.getID() + "&nodeType=entity";
        var requestLink = "<p>Please open your Requester Form with the following link:</p><a href=" + requestURL + ">" + node.getID() + " </a>";
        body += requestLink;
        body+= "</table><br><br>Thanks & Regards,<br>Supplier Master Data Team"; 
	   body+= "<br><br></body></html>";
        if (userEmail) {
            sendMail(mailer, userEmail, subject, body);
            
        }
    }
}
/**
 * @desc Notification to LS team about Rejected requests 
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-6173
 * @author Bhoomika <Bhoomika.katti-ext@bshg.com>
  * @param {Node} node request object
 * @param {Step} step Step manager
 * @param {MailHome} mailer Mail Home
 */
function sendNotificationMailToLSRejectRequest(node, step, mailer) {
    var suplGlobalVariables = step.getClassificationHome().getClassificationByID("SupplierVariables");
    var systemURL = suplGlobalVariables.getValue("AT_SystemURL").getSimpleValue();
    var rejectedLSDCObj = getDataContainerbyAttrValueID(node, step, "ATC_LocalSpecialistStatus", "AT_LocalSpecialistAction", "Rejected"); 
    if (rejectedLSDCObj) {
        var supplierObj = getSupplierFromRequest(node, step);
		var sapId = supplierObj.getValue("AT_SAPR3Reference").getSimpleValue();
        var requestorName = node.getValue("AT_RequestorName").getSimpleValue();
        var requestType = node.getValue("AT_SuplRequestType").getSimpleValue();
        var localSpecialistWhoRejectedRequest = rejectedLSDCObj.getValue("AT_LSApprovedRejectedBy").getSimpleValue();
        var subject = " The  request  " + node.getID() + " for supplier " + supplierObj.getID() + " ( SAP:ID " + sapId + " ) " + supplierObj.getName() + " has been rejected _ Request type :  " + requestType;
        var requestURL = systemURL + "webui/SupplierWebUI#contextID=Global&workspaceID=Main&selection=" + node.getID() + "&nodeType=entity";
        var supplierURL = systemURL + "webui/SupplierWebUI#contextID=Global&workspaceID=Main&screen=DetailScreen_Supplier&selection=" + supplierObj.getID() + "&nodeType=entity&selectedTab=450412263.0&displayMode=126510176.0";
        var requestLink = "<a href=" + requestURL + ">" + node.getID() + " </a>";
        var supplierLink = "<a href=" + supplierURL + ">" + supplierObj.getID() + " </a>";
        var body = "";
        body += "Dear Local Specialist,<br></br>";
        body += " Request " + requestLink + " for supplier  " + supplierLink + "  _  " + supplierObj.getName() + " initiated by " + node.getID() + " has been rejected , beacuse user " + localSpecialistWhoRejectedRequest + "  does not give his approval for this change, Please see below the details regarding approval process for this request: </br></br>";
        body += "<br><html><table style=\"border-collapse:collapse;border:none;\">";
        body += "<tr><td style=\"padding: 8px;width: 233.75pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>CC or PO</strong></p></td>";
        body += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>LS</strong></p></td>";
        body += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>Backup LS</strong></p></td>";
        body += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>LS NPM</strong></p></td>";
        body += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>Backup LS NPM</strong></p></td>";
        body += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black);font-size:17px;text-align:center;'\"><strong>LS Order Center</strong></p></td>";
        body += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>Backup LS Order Center</strong></p></td>";
        body += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>Status</strong></p></td>";
        body += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>Approved/Rejected By</strong></p></td>";
        body += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>Approval/Rejection Date</strong></p></td></tr>";
        var localSpecialistDCs = node.getDataContainerByTypeID("ATC_LocalSpecialistStatus").getDataContainers();
        var itr = localSpecialistDCs.iterator();
        while (itr.hasNext()) {
            var localSpecialistDCRowObj = itr.next().getDataContainerObject();
            var dcCCPO = localSpecialistDCRowObj.getValue("AT_CCORPO").getSimpleValue() == null ? "  - " : localSpecialistDCRowObj.getValue("AT_CCORPO").getSimpleValue();
            var dcLS = localSpecialistDCRowObj.getValue("AT_LocalSpecialist").getSimpleValue() == null ? "  - " : localSpecialistDCRowObj.getValue("AT_LocalSpecialist").getSimpleValue();
            var dcBackupLS = localSpecialistDCRowObj.getValue("AT_BackupLocalSpecialist").getSimpleValue() == null ? "  - " : localSpecialistDCRowObj.getValue("AT_BackupLocalSpecialist").getSimpleValue();
            var dcLSNPM = localSpecialistDCRowObj.getValue("AT_LocalSpecialist_NPM").getSimpleValue() == null ? "  - " : localSpecialistDCRowObj.getValue("AT_LocalSpecialist_NPM").getSimpleValue();
            var dcBackupLSNPM = localSpecialistDCRowObj.getValue("AT_BackupLocalSpecialist_NPM").getSimpleValue() == null ? "  - " : localSpecialistDCRowObj.getValue("AT_BackupLocalSpecialist_NPM").getSimpleValue();
            var dcLSOrderCenter = localSpecialistDCRowObj.getValue("AT_LocalSpecialist_OrderCenter").getSimpleValue() == null ? "  - " : localSpecialistDCRowObj.getValue("AT_LocalSpecialist_OrderCenter").getSimpleValue();
            var dcBackupLSOrderCenter = localSpecialistDCRowObj.getValue("AT_BackupLocalSpecialist_OrderCenter").getSimpleValue() == null ? "  - " : localSpecialistDCRowObj.getValue("AT_BackupLocalSpecialist_OrderCenter").getSimpleValue();
            var dcStatus = localSpecialistDCRowObj.getValue("AT_LocalSpecialistAction").getSimpleValue() == null ? "  - " : localSpecialistDCRowObj.getValue("AT_LocalSpecialistAction").getSimpleValue();
            var dcApprovedRejectedBy = localSpecialistDCRowObj.getValue("AT_LSApprovedRejectedBy").getSimpleValue() == null ? "  -  " : localSpecialistDCRowObj.getValue("AT_LSApprovedRejectedBy").getSimpleValue();
            var dcApprovalRejectionDate = localSpecialistDCRowObj.getValue("AT_LSApprovalRejectionDate").getSimpleValue() == null ? " - " : localSpecialistDCRowObj.getValue("AT_LSApprovalRejectionDate").getSimpleValue();

            body += "<tr><td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcCCPO + "</p></td>";
            body += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcLS + "</p></td>";
            body += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcBackupLS + "</p></td>";
            body += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcLSNPM + "</p></td>";
            body += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcBackupLSNPM + "</p></td>";
            body += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcLSOrderCenter + "</p></td>";
            body += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcBackupLSOrderCenter + "</p></td>";
            body += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcStatus + "</p></td>";
            body += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcApprovedRejectedBy + "</p></td>";
            body += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcApprovalRejectionDate + "</p></td></tr>";

        }
    }
    var dataContainers = node.getDataContainerByTypeID("ATC_LocalSpecialistStatus").getDataContainers();
    var itr = dataContainers.iterator();
    var mailIDs = "";
    while (itr.hasNext()) {
        var dcRowObj = itr.next().getDataContainerObject();
        var localSpecialistAttrIDs = ["AT_LocalSpecialist", "AT_BackupLocalSpecialist", "AT_LocalSpecialist_NPM", "AT_BackupLocalSpecialist_NPM", "AT_LocalSpecialist_OrderCenter", "AT_BackupLocalSpecialist_OrderCenter"];
        for (var i = 0; i < localSpecialistAttrIDs.length; i++) {
            var localSpecialistAttrID = localSpecialistAttrIDs[i];
            var localSpecialistID = dcRowObj.getValue(localSpecialistAttrID).getID();
            if (localSpecialistID) {
                var user = step.getUserHome().getUserByID(localSpecialistID);
                if (user) {
                    var userMail = user.getEMail();
                    if (userMail) {
                        mailIDs = mailIDs + userMail + ";";
                    }
                }
            }

        }
    }
    var requestURL = systemURL + "webui/SupplierWebUI#contextID=Global&workspaceID=Main&selection=" + node.getID() + "&nodeType=entity";
    var requestLink = "</table><br><br><p>Please open Stibo tool with the following link::</p><a href=" + systemURL + ">" + node.getID() + " </a>";
    body += requestLink;
    body += "</table><br><br>Thanks & Regards,<br>Supplier Master Data Team";
    body += "<br><br></body></html>";


    if (mailIDs != "") {

        sendMail(mailer, mailIDs, subject, body);

    }
}
/**
 * @desc Notification to LS team about Approved requests 
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-6173
 * @author Bhoomika <Bhoomika.katti-ext@bshg.com>
  * @param {Node} node request object
 * @param {Step} step Step manager
 * @param {MailHome} mailer Mail Home
 */
function sendNotificationMailToLSApproveRequest(node, step, mailer) {
    var approvedLSDCObj = getDataContainerbyAttrValueID(node, step, "ATC_LocalSpecialistStatus", "AT_LocalSpecialistAction", "Approved");
    //var reqType = node.getValue("AT_TypeOfChangeRequest").getID();
    if (approvedLSDCObj) {
        var supplierObj = getSupplierFromRequest(node, step);
		var sapId = supplierObj.getValue("AT_SAPR3Reference").getSimpleValue();
        var suplGlobalVariables = step.getClassificationHome().getClassificationByID("SupplierVariables");
        var systemURL = suplGlobalVariables.getValue("AT_SystemURL").getSimpleValue();
        var supplierCountryCode = getAddressDetails(supplierObj, step, "REF_SupplierToAddress").countryCode;
        var userID = node.getValue("AT_RequestorAssignee").getSimpleValue();
        var userDetails = getUserDetails(step, userID);
        var userEmail = userDetails.userEmail;
        var userName = userDetails.userName;
        var requestorName = node.getValue("AT_RequestorName").getSimpleValue();
        var requestType = node.getValue("AT_SuplRequestType").getSimpleValue();
        var subject = " The  request  " + node.getID() + " with supplier no. " + supplierObj.getID() +" ( SAP ID: " + sapId + ")" + "  has been approved – " + requestType + "_" + supplierCountryCode + "_" + requestorName + " _ " + node.getID() + " _ " + userEmail + " _ " + supplierObj.getName();
        var requestURL = systemURL + "webui/SupplierWebUI#contextID=Global&workspaceID=Main&selection=" + node.getID() + "&nodeType=entity";
        var supplierURL = systemURL + "webui/SupplierWebUI#contextID=Global&workspaceID=Main&screen=DetailScreen_Supplier&selection=" + supplierObj.getID() + "&nodeType=entity&selectedTab=450412263.0&displayMode=126510176.0";
        var requestLink = "<a href=" + requestURL + ">" + node.getID() + " </a>";
        var supplierLink = "<a href=" + supplierURL + ">" + supplierObj.getID() + " </a>";
        var body = "";
        body += "Dear Local Specialist,<br></br>";
        body += " The  request  " + requestLink + " with supplier no. " + supplierLink + "  _  " + supplierObj.getName() + "  has been approved  _ " + requestType + " _ " + supplierCountryCode + " _ " + requestorName + " _ " + node.getID() + " _ " + userEmail;
        body += "<br><html><table style=\"border-collapse:collapse;border:none;\">";
        body += "<tr><td style=\"padding: 8px;width: 233.75pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>CC or PO</strong></p></td>";
        body += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>LS</strong></p></td>";
        body += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>Backup LS</strong></p></td>";
        body += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>LS NPM</strong></p></td>";
        body += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>Backup LS NPM</strong></p></td>";
        body += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black);font-size:17px;text-align:center;'\"><strong>LS Order Center</strong></p></td>";
        body += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>Backup LS Order Center</strong></p></td>";
        body += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>Status</strong></p></td>";
        body += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>Approved/Rejected By</strong></p></td>";
        body += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>Approval/Rejection Date</strong></p></td></tr>";
        var localSpecialistDCs = node.getDataContainerByTypeID("ATC_LocalSpecialistStatus").getDataContainers();
        var itr = localSpecialistDCs.iterator();
        while (itr.hasNext()) {
            var localSpecialistDCRowObj = itr.next().getDataContainerObject();
            var dcCCPO = localSpecialistDCRowObj.getValue("AT_CCORPO").getSimpleValue() == null ? "  - " : localSpecialistDCRowObj.getValue("AT_CCORPO").getSimpleValue();
            var dcLS = localSpecialistDCRowObj.getValue("AT_LocalSpecialist").getSimpleValue() == null ? "  - " : localSpecialistDCRowObj.getValue("AT_LocalSpecialist").getSimpleValue();
            var dcBackupLS = localSpecialistDCRowObj.getValue("AT_BackupLocalSpecialist").getSimpleValue() == null ? "  - " : localSpecialistDCRowObj.getValue("AT_BackupLocalSpecialist").getSimpleValue();
            var dcLSNPM = localSpecialistDCRowObj.getValue("AT_LocalSpecialist_NPM").getSimpleValue() == null ? "  - " : localSpecialistDCRowObj.getValue("AT_LocalSpecialist_NPM").getSimpleValue();
            var dcBackupLSNPM = localSpecialistDCRowObj.getValue("AT_BackupLocalSpecialist_NPM").getSimpleValue() == null ? "  - " : localSpecialistDCRowObj.getValue("AT_BackupLocalSpecialist_NPM").getSimpleValue();
            var dcLSOrderCenter = localSpecialistDCRowObj.getValue("AT_LocalSpecialist_OrderCenter").getSimpleValue() == null ? "  - " : localSpecialistDCRowObj.getValue("AT_LocalSpecialist_OrderCenter").getSimpleValue();
            var dcBackupLSOrderCenter = localSpecialistDCRowObj.getValue("AT_BackupLocalSpecialist_OrderCenter").getSimpleValue() == null ? "  - " : localSpecialistDCRowObj.getValue("AT_BackupLocalSpecialist_OrderCenter").getSimpleValue();
            var dcStatus = localSpecialistDCRowObj.getValue("AT_LocalSpecialistAction").getSimpleValue() == null ? "  - " : localSpecialistDCRowObj.getValue("AT_LocalSpecialistAction").getSimpleValue();
            var dcApprovedRejectedBy = localSpecialistDCRowObj.getValue("AT_LSApprovedRejectedBy").getSimpleValue() == null ? "  -  " : localSpecialistDCRowObj.getValue("AT_LSApprovedRejectedBy").getSimpleValue();
            var dcApprovalRejectionDate = localSpecialistDCRowObj.getValue("AT_LSApprovalRejectionDate").getSimpleValue() == null ? " - " : localSpecialistDCRowObj.getValue("AT_LSApprovalRejectionDate").getSimpleValue();

            body += "<tr><td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcCCPO + "</p></td>";
            body += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcLS + "</p></td>";
            body += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcBackupLS + "</p></td>";
            body += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcLSNPM + "</p></td>";
            body += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcBackupLSNPM + "</p></td>";
            body += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcLSOrderCenter + "</p></td>";
            body += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcBackupLSOrderCenter + "</p></td>";
            body += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcStatus + "</p></td>";
            body += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcApprovedRejectedBy + "</p></td>";
            body += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + dcApprovalRejectionDate + "</p></td></tr>";

        }

        var dataContainers = node.getDataContainerByTypeID("ATC_LocalSpecialistStatus").getDataContainers();
        var itr = dataContainers.iterator();
        var mailIDs = "";
        while (itr.hasNext()) {
            var dcRowObj = itr.next().getDataContainerObject();
            var localSpecialistAttrIDs = ["AT_LocalSpecialist", "AT_BackupLocalSpecialist", "AT_LocalSpecialist_NPM", "AT_BackupLocalSpecialist_NPM", "AT_LocalSpecialist_OrderCenter", "AT_BackupLocalSpecialist_OrderCenter"];
            for (var i = 0; i < localSpecialistAttrIDs.length; i++) {
                var localSpecialistAttrID = localSpecialistAttrIDs[i];
                var localSpecialistID = dcRowObj.getValue(localSpecialistAttrID).getID();
                if (localSpecialistID) {
                    var user = step.getUserHome().getUserByID(localSpecialistID);
                    if (user) {
                        var userMail = user.getEMail();
                        if (userMail) {
                            mailIDs = mailIDs + userMail + ";";
                        }
                    }
                }

            }
        }
        var requestURL = systemURL + "webui/SupplierWebUI#contextID=Global&workspaceID=Main&selection=" + node.getID() + "&nodeType=entity";
        var requestLink = "</table><br><br><p>Please open Stibo tool with the following link::</p><a href=" + systemURL + ">" + node.getID() + " </a>";
        body += requestLink;
        body += "</table><br><br>Thanks & Regards,<br>Supplier Master Data Team";
        body += "<br><br></body></html>";

        if (mailIDs != "") {

            sendMail(mailer, mailIDs, subject, body);

        }
    }
}

/**
 * @desc Notification to Data Stewards team about overdue requests 
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-5528
 * @author Bhoomika <Bhoomika.katti-ext@bshg.com>
  * @param {Node} node request object
 * @param {Step} step Step manager
 * @param {MailHome} mailer Mail Home
 */

function sendMailToMDSteward (node, step, mailer){
     var currentUser = step.getCurrentUser();
     var supplierObj = getSupplierFromRequest(node, step);
	 var sapId = supplierObj.getValue("AT_SAPR3Reference").getSimpleValue();
     var assigneeID = node.getWorkflowInstanceByID("WF_SupplierReview").getTaskByID("SSCReview").getAssignee().getID();
     var assigneeName = node.getWorkflowInstanceByID("WF_SupplierReview").getTaskByID("SSCReview").getAssignee().getName();
     var lookupTableID = "LT_LocalSpecialistMailTemplates";
     var assigneeEmail = node.getValue("AT_MDStewardMailID").getSimpleValue(); 
     var mdStewardList = assigneeEmail =getLookupValue(step, "MdSteward_mail_list", lookupTableID);
     var suplGlobalVariables = step.getClassificationHome().getClassificationByID("SupplierVariables");
     var systemURL = suplGlobalVariables.getValue("AT_SystemURL").getSimpleValue();
    var subject = "Attention! Request no. " + node.getID() + "  for " + supplierObj.getName() + "( SAP ID :" + sapId + ")" +  " will overdue in less than one hour.";
    var body = "";
    body += " Request is currently assigned to Assignee " +  assigneeName ;
    var sscreviewURL = systemURL + "webui/SupplierWebUI#screen=TaskList_RQ_SSCReview&stateflow=WF_SupplierReview&onlyMine=All&state=SSCReview&cellSelection=1046141202.0x0&aeefdceefbbd.nodeType=entity.entity&aeefdceefbbd.selection="+ node.getID()+ "&aeefdceefbbd.inv=0&NodeDetailsOverlay.NodeType=Entity&NodeDetailsOverlay.Selection="+ node.getID()+ "&aabbfbbefabea.inv=0&caccebfcebadc.inv=0&aabbfbbefabea.vr=0x50&class+com.stibo.portal.matching.server.DeduplicationListTabPageServerComponent.nodeType=entity&class+com.stibo.portal.matching.server.DeduplicationListTabPageServerComponent.selection="+supplierObj.getID()+ "&class+com.stibo.portal.matching.server.DeduplicationListTabPageServerComponent.inv=0&selectedTab=1736839299.0_974343505.0&displayMode=-673246558.0_-1755489564.0_2106045971.0_126510176.0&contextID=en_US&workspaceID=Main&acdecabaee.vr=0x50";
     var sscreviewLink = "<p>Please open MD Steward Worklist and process it as soon as possible:</p><a href=" + sscreviewURL + ">" + node.getID() + " </a>";
     body += sscreviewLink;
     body+= "</table><br><br>Thanks & Regards,<br>Supplier Master Data Team"; 
    body+= "<br><br></body></html>";        
    if(assigneeEmail!=null) {
        sendMailWithCC(mailer, assigneeEmail, mdStewardList, subject, body);
    }
    else {
        sendMail(mailer, mdStewardList, subject, body);
    }
}

/**
 * @desc Notification to Data Stewards Interns team about overdue requests 
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-19979
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
  * @param {Node} node request object
 * @param {Step} step Step manager
 * @param {MailHome} mailer Mail Home
 */
function sendDeadlineMailToMDInterns(node, step, mailer) {
	var suppObj = getSupplierFromRequest(node, step);
	var sapId = suppObj.getValue("AT_SAPR3Reference").getSimpleValue();
	var suplGlobalVariables = step.getClassificationHome().getClassificationByID("SupplierVariables");
	var systemURL = suplGlobalVariables.getValue("AT_SystemURL").getSimpleValue();
	var requestURL = systemURL + "webui/SupplierWebUI#selection=" + node.getID() + "&nodeType=entity&workflowID=WF_MDInternWorklist&stateID=MDInternWorklist_ToBeChecked&aabbfbbefabea.inv=0&adbfbdfccdec.inv=0&cdaeaaaddeafebdfdf.inv=0&caccebfcebadc.inv=0&aabbfbbefabea.vr=0x50&class+com.stibo.portal.matching.server.DeduplicationListTabPageServerComponent.nodeType=entity&class+com.stibo.portal.matching.server.DeduplicationListTabPageServerComponent.selection=" + suppObj.getID() + "&class+com.stibo.portal.matching.server.DeduplicationListTabPageServerComponent.inv=0&selectedTab=1049244036.1_206675182.0_974343505.0&displayMode=-1755489564.0_-827181927.0_1916320803.0_2106045971.0_1515042908.0_1301238249.0_1756786149.0_2040867568.0_-1920326021.0_1542861008.0_126510176.0&WFDetail_SUPL_ReadOnly_MD_InternsATC_AdditionalTexts.vr=0x50&WFDetail_SUPL_ReadOnly_MD_InternsATC_TelephoneNumbers.vr=0x50&WFDetail_SUPL_ReadOnly_MD_InternsATC_MobileNumbers.vr=0x50&WFDetail_SUPL_ReadOnly_MD_InternsATC_FaxNumbers.vr=0x50&WFDetail_SUPL_ReadOnly_MD_InternsATC_EmailAddress.vr=0x50&WFDetail_SUPL_ReadOnly_MD_InternsATC_InternetAddress.vr=0x50&contextID=Global&workspaceID=Main&acdecabaee.vr=0x50"
	var requestLink = "<a href=" + requestURL + ">" + node.getID() + " </a>";
	var assignee = node.getWorkflowInstanceByID("WF_MDInternWorklist").getTaskByID("MDInternWorklist_ToBeChecked").getAssignee().getName()
	var lookupTableID = "LT_LocalSpecialistMailTemplates";
	var mdInternList = getLookupValue(step, "MDIntern_Deadline_mail_list", lookupTableID);
	var subject = "Attention! Request " + node.getID() + " for supplier " + suppObj.getID() + " ( " +" SAP ID : " + sapId + " ) " + " will overdue in less than three hours"
	var body = "Hello Master Data Interns,</br></br>Request " + requestLink + " is currently assigned to " + assignee + ".</br>Please open MD Intern Worklist and process it as soon as possible.</br></br>Thanks & Regards,</br>Supplier Master Data Team"
	sendMail(mailer, mdInternList, subject, body)
}

/**
 * @desc Local specialists - tool to trigger email
 * @linkhttps://issuetracking.bsh-sdd.com/browse/MDMPB-9343
 * @author Bhoomika <Bhoomika.katti-ext@bshg.com>
  * @param {Node} node request object
 * @param {Step} step Step manager
 * @param {MailHome} mailer Mail Home
 */
function sendNotificationtoLS (step,mailIDs,mailer,subject,content){
	var userID = step.getCurrentUser().getID();
	var userDetails = getUserDetails(step, userID);
	var userName = userDetails.userName;
	var currentUserEmail = userDetails.userEmail;
    	var lookupTableID = "LT_LocalSpecialistMailTemplates";
    	var ccList = getLookupValue(step, "LsMatrix_CC_mail_list", lookupTableID);
	ccList = ccList+";"+currentUserEmail;	
	var body = "";
		body+= "Hi,<br><br>";
		body+= content+"<br><br>";
		body+="</table><br><br>Thanks & Regards,<br>Supplier Master Data Team"; 
		body+= "<br><br></body></html>";     
	
    if(mailIDs!=null) {
       sendMailWithCC(mailer, mailIDs, ccList, subject, body);
    }
}

/**
 * @desc Automatic creation of related PL company code after creation of purchasing org
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-11071
 * @author Bhoomika <Bhoomika.katti-ext@bshg.com>
 * @param {Node} node request object
 * @param {Step} step Step manager
 * @param {MailHome} mailer Mail Home
*/
function autoCreateCompanyCodesBasedOnPurchOrgMapping(node, step, mailer) {
    var supplierObj = getSupplierFromRequest(node, step);
    var supplierCountryCode = getAddressDetails(supplierObj, step, "REF_SupplierToAddress").countryCode;
    var countryObj = step.getEntityHome().getEntityByID("CNTRY_" + supplierCountryCode);
    ccList = new java.util.HashSet("");
    if (supplierObj && (supplierCountryCode == "PL" || supplierCountryCode == "DE" || supplierCountryCode == "ES" ||supplierCountryCode == "ESC")) {
        var purchOrgReferences = supplierObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierPurchasingData"));
        for (var i = 0; i < purchOrgReferences.size(); i++) {
            var purchOrgObj = purchOrgReferences.get(i).getTarget();
            var supplierCategory = purchOrgObj.getValue("AT_SupplierCategory").getID();
            var poMaster = purchOrgObj.getParent();
            var poMasterID = poMaster.getID();
                var ccMappingIDs = poMaster.getValue("AT_ConcatCCValues").getSimpleValue();
                if(poMasterID =="PO_5051") {
            var ccMappingsplit = ccMappingIDs.split(";");
            for (var j = 0; j < ccMappingsplit.length; j++) {
                var ccMappingID = ccMappingsplit[j];
            } 
            }
            else {
            	 ccMappingID=ccMappingIDs;
            }
                if (ccMappingID != null) {
                    ccList.add(ccMappingID);
                }
                var newCmpCodeID = supplierObj.getID() + "-" + ccMappingID + "-" + "CC";
                var isCCAlreadyAdded = step.getEntityHome().getEntityByID(newCmpCodeID);
                var isCCMasterCreated = step.getEntityHome().getEntityByID(ccMappingID);
                if (isCCMasterCreated && !isCCAlreadyAdded) {
                    var newCCObj = createNewCompanyCode(supplierObj, step, newCmpCodeID, ccMappingID);
                    var termsOfPaymentValueID = purchOrgObj.getValue("AT_TermsOfPayment").getID();
                    newCCObj.getValue("AT_TermsOfPayment").setLOVValueByID(termsOfPaymentValueID);
                    var ccCountry = isCCMasterCreated.getValue("AT_Country").getID();
                    if (ccCountry == "PL") {
                        var isAccountingClerkLOVValuePresent = isLOVValueExist(step, "LOV_Clerk", ccMappingID + "_" + "03");
                        if (isAccountingClerkLOVValuePresent) {
                            newCCObj.getValue("AT_SuplClerkAbbreviation").setLOVValueByID(ccMappingID + "_" + "03");
                        }
                    }
                    if ((supplierCountryCode== "ES" || supplierCountryCode== "ESC") && ccCountry == "ES") {
                        if (supplierCategory == "NPM") {
                           var reconciliationAccountNumber = "0041000000";
                          
                        } else if (supplierCategory != "NPM") {
                            var reconciliationAccountNumber = "0040000000";
                        }
                    } else if ((supplierCountryCode=="PL" ||supplierCountryCode=="DE") && ccCountry == "ES") {
                        if (supplierCategory == "NPM") {
                           var  reconciliationAccountNumber = "0041040000";
                          
                        } else if (supplierCategory != "NPM") {
                           var reconciliationAccountNumber = "0040040000";
                        }
                    }
					 else {
                        if (supplierCategory == "NPM") {
                           var  reconciliationAccountNumber = "0041040000";
                        } else if (supplierCategory != "NPM") {
                           var reconciliationAccountNumber = "0040040000";
                        }
					 }
                    var reconciliationAccountID = ccMappingID + "_" + reconciliationAccountNumber;
                    var isReconciliationAccountLOVValuePresent = isLOVValueExist(step, "LOV_ReconciliationAccount", reconciliationAccountID);
                    if (isReconciliationAccountLOVValuePresent) {
                        newCCObj.getValue("AT_ReconciliationAccount").setLOVValueByID(reconciliationAccountID);
                    }
                    
                    if (countryObj) {
                        var countryPaymentMethods = countryObj.getValue("AT_CNTRY_PaymentMethods").getSimpleValue();
                        var countryPaymentmultisep = countryPaymentMethods.split("<multisep/>");
                        for (var l = 0; l < countryPaymentmultisep.length; l++) {
                            var paymentcountrycode = countryPaymentmultisep[l].split("_");
                            if (ccCountry == paymentcountrycode[0]) {
                                var countryPaymentMethods = paymentcountrycode[1].split(":")[1];
                            }
                            var paymentMethodValueID = ccMappingID + "_" + countryPaymentMethods;
                            var paymentMethodLOVObj = step.getListOfValuesHome().getListOfValuesByID("LOV_PaymentMethods");
                        }
                        var isLOVValuePresent = paymentMethodLOVObj.getListOfValuesValueByID(paymentMethodValueID);
                        if (isLOVValuePresent) {
                            newCCObj.getValue("AT_SuplPaymentMethods").setLOVValueByID(paymentMethodValueID);
                            var paymentMethod = newCCObj.getValue("AT_SuplPaymentMethods").getID();
                        }
                    }

                }
            }
            if (isCCMasterCreated && newCCObj) {
                setUserComments(node, step, "Company Codes" + " " + ccMappingID + " has been created automatically based on mappings");
            }
        }


       sendEmailToCountryReprensetativeForPurchOrgCreation(node, step, mailer, ccList);
    }

/**
 * @desc Collection CCPO multivalued attribute 
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-17196
 * @author Bhoomika <Bhoomika.katti-ext@bshg.com>
  * @param {Node} node request object
 * @param {Step} step Step manager

 */
 
function CCPOBusinessCollectionforChinese(supplierObj, step) {
var purchasingOrgs = supplierObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierPurchasingData")) == undefined ? " " : purchasingOrgs = supplierObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierPurchasingData")) ;
var companyCodes = supplierObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierCompanyCode")) == undefined ? " " : companyCodes = supplierObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierCompanyCode"));
if (purchasingOrgs) {
    for (var i = 0; i < purchasingOrgs.size(); i++) {
        var purchOrgObj = purchasingOrgs.get(i).getTarget();
        var purchOrg = purchOrgObj.getValue("AT_PurchasingOrganization").getSimpleValue();
        var mainWSPOValue = purchOrgObj.getValue("AT_PurchasingOrganization").getSimpleValue();
    }
        var approvedWSPOvalue = getAttrValuesFromApprovedWS(supplierObj, step, "AT_POForCollection");
        if (mainWSPOValue != approvedWSPOvalue) {
            supplierObj.getValue("AT_POForCollection").addValue(mainWSPOValue);

        }
    }

if (companyCodes) {
    for (var j = 0; j < companyCodes.size(); j++) {
        var cCObj = companyCodes.get(j).getTarget();
        var compCode = cCObj.getValue("AT_CompanyCode").getID();
        var mainWSCCValue = cCObj.getValue("AT_CompanyCode").getID();
    }
        var approvedWSCCvalue = getAttrValuesFromApprovedWS(supplierObj, step, "AT_CCForCollection");
        if (mainWSCCValue != approvedWSCCvalue) {
            supplierObj.getValue("AT_CCForCollection").addValue(mainWSCCValue);

        }
    
}
}

/**
 * @desc Populate Customer Number on C segment (Return Vendor Number)
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-3884
 * @author Bhoomika <Bhoomika.katti-ext@bshg.com>
  * @param {Node} node Supplier object
 * @param {Step} step Step manager

 */

function populateCustomerNoReturnVendor(node, step) {
    var customerNumber = node.getValue("AT_CustomerNumber").getSimpleValue();
        var purchasingOrgs = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierPurchasingData"));
        for (var i = 0; i < purchasingOrgs.size(); i++) {
            var purchOrgObj = purchasingOrgs.get(i).getTarget();
            var purchOrg = purchOrgObj.getValue("AT_PurchasingOrganization").getSimpleValue();
        if (customerNumber && purchasingOrgs.size()>0) {
            returnsVendorNumber = customerNumber;
            purchOrgObj.getValue("AT_ReturnsVendorNumber").setSimpleValue(returnsVendorNumber);
        }
    }
}


/**
 * @desc Set Scope value based on Country
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-3884
 * @author Bhoomika <Bhoomika.katti-ext@bshg.com>
  * @param {Node} node request object
 * @param {Step} step Step manager

 */
 
function setScopeValue(node, step) {
    var suppObj = getSupplierFromRequest(node, step)
    var countryID = getSingleReferenceAttributeValueID(suppObj, step, "REF_SupplierToAddress", "AT_Country")
    if (countryID == "BN" || countryID == "KH" || countryID == "TP" || countryID == "ID" || countryID == "LA" || countryID == "MY" || countryID == "MM" || countryID == "PH" || countryID == "SG" || countryID == "TH" || countryID == "VN" || countryID == "CN" || countryID == "HK" || countryID == "MO" || countryID == "JP" || countryID == "MN" || countryID == "KP" || countryID == "KR" || countryID == "TW" || countryID == "AS" || countryID == "PF" || countryID == "PN" || countryID == "WS" || countryID == "TO" || countryID == "TV" || countryID == "WF" || countryID == "AU" || countryID == "CX" || countryID == "CC" || countryID == "NF" || countryID == "NZ" || countryID == "CK" || countryID == "NU" || countryID == "TK" || countryID == "FJ" || countryID == "NC" || countryID == "PG" || countryID == "SB" || countryID == "VU" || countryID == "FM" || countryID == "GU" || countryID == "KI" || countryID == "MH" || countryID == "NR" || countryID == "MP" || countryID == "PW" || countryID == "BD" || countryID == "BT" || countryID == "IO" || countryID == "MV" || countryID == "NP" || countryID == "PK" || countryID == "LK" || countryID == "AF") {
        node.getValue("AT_Scope").setLOVValueByID("SSCCN");
    } else if (countryID == "IN") {
        node.getValue("AT_Scope").setLOVValueByID("SSCCN_SSCPL");
    } else {
        node.getValue("AT_Scope").setLOVValueByID("SSCPL");
    }
}



/**
 * @desc National Version validation
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-5525
 * @author Bhoomika <Bhoomika.katti-ext@bshg.com>
  * @param {Node} node request object
 * @param {Step} step Step manager

 */
function nationalVersionValidation(node, step) {
    // Auto populating Does Supplier has a national Version attribute based on some countries
    var suppObj = getSupplierFromRequest(node, step)
    var countryID = getSingleReferenceAttributeValueID(suppObj, step, "REF_SupplierToAddress", "AT_Country")
    if (countryID == "BG" || countryID == "BY" || countryID == "GR" || countryID == "IL" || countryID == "KZ" || countryID == "RU" || countryID == "UA" || countryID == "CN" || countryID == "TH" || countryID == "TW" || countryID == "VN") {
        suppObj.getValue("AT_DoesSupplierHaveANationalVersion").setLOVValueByID("Y");
    }
    //Auto populating National version language based on Country
    if (countryID == "BG" || countryID == "BY" || countryID == "KZ" || countryID == "RU" || countryID == "UA") {
        suppObj.getValue("AT_NationalVersionLanguage").setLOVValueByID("R");
    } else if (countryID == "GR") {
        suppObj.getValue("AT_NationalVersionLanguage").setLOVValueByID("G");
    } else if (countryID == "IL") {
        suppObj.getValue("AT_NationalVersionLanguage").setLOVValueByID("B");
    } else if (countryID == "CN") {
        suppObj.getValue("AT_NationalVersionLanguage").setLOVValueByID("C");
    } else if (countryID == "TH") {
        suppObj.getValue("AT_NationalVersionLanguage").setLOVValueByID("T");
    } else if (countryID == "TW") {
        suppObj.getValue("AT_NationalVersionLanguage").setLOVValueByID("M");
    } else if (countryID == "VN") {
        suppObj.getValue("AT_NationalVersionLanguage").setLOVValueByID("V");
    }
}


/**
 * @desc Sends a clarification mail to supplier requestor
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-9371
 * @author Amruta <Amruta.Tangade-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {MailHome} mailer Mail Home
 * @returns
 */
function sendAdditionalMailForDeletion(node, step, mailer) {
	var userID = node.getValue("AT_RequestorAssignee").getSimpleValue();
	var requesterUser = step.getUserHome().getUserByID(userID);
	var requestonBehalfOf = node.getValue("AT_RequestCreatedOnBehalfOf").getSimpleValue();
	if(requesterUser){
		var userDetails = getUserDetails(step, userID);
		var userEmail = userDetails.userEmail;
		var userName = userDetails.userName;
		var supplierObj = getSupplierFromRequest(node, step);
		var linkDetails = getMailLinks(node, step);
		var smdtLink =  linkDetails.SmdLink;
		var suplGlobalVariables = step.getClassificationHome().getClassificationByID("SupplierVariables");
		var comments = node.getValue("AT_Comments").getSimpleValue();
		if(comments) {
			comments = comments.replace("<multisep/>","<br>");
		}
		 var sapId = supplierObj.getValue("AT_SAPR3Reference").getSimpleValue();
		var systemURL = suplGlobalVariables.getValue("AT_SystemURL").getSimpleValue();
		var requestURL = systemURL + "webui/SupplierWebUI#contextID=Global&workspaceID=Main&selection="+node.getID()+"&nodeType=entity";
		var supplierURL=systemURL+"webui/SupplierWebUI#contextID=Global&workspaceID=Main&screen=DetailScreen_Supplier&selection="+supplierObj.getID()+"&nodeType=entity&selectedTab=450412263.0&displayMode=126510176.0";
		var requestLink="<a href="+requestURL+">"+node.getID()+" </a>";
		var supplierLInk="<a href="+supplierURL+">"+supplierObj.getID()+" </a>";
		var changeRequestType = node.getValue("AT_TypeOfChangeRequest").getID();
			if("DEL".equals(changeRequestType)) {
				var deadline = node.getWorkflowInstanceByID("WF_SupplierChange").getTaskByID("CH_LocalSpecialistApprovalPending").getDeadline();
				logger.info("deadline" +deadline);
			    var reasonForBlockage = node.getValue("AT_ReasonForBlockage").getSimpleValue();
			if ("Other".equals(reasonForBlockage)) {
				var descriptionForOther = node.getValue("AT_DescriptionForOther").getSimpleValue();
			 }
				var duplicatedSupplier = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplier"));
				for(var i=0;i<duplicatedSupplier.size();i++) {
					var duplicatedSupplierReferenceObj = duplicatedSupplier.get(i);
					var duplicatedSupplierTargetSupplierID = duplicatedSupplierReferenceObj.getTarget().getID();
					var duplicatedSupplierTargetSupplierName = duplicatedSupplierReferenceObj.getTarget().getName();
				}
					var lookupTableID = "LT_LocalSpecialistMailTemplates";
					var toList = getLookupValue(step, "Del_mail_List", lookupTableID);
					var subject = "Supplier [" + supplierObj.getID() +" ( SAP ID: " + sapId + ")" + supplierObj.getName() + " ] going to be deleted on "+ deadline +"";
					var body = "<html><head>";
					body+=  "Dears,<br><br>";
					body+= "We are writing in connection with the supplier ["+supplierObj.getID()+" , "+supplierObj.getName()+" ]  which we would like to deactivate from the system.<br><br>";
					if (descriptionForOther) {
				  		 body+= "Reason for blockage: ["+requestLink+" , "+reasonForBlockage+" , "+descriptionForOther+" ]<br><br>";
					}
					else {
						body+= "Reason for blockage: ["+requestLink+" , "+reasonForBlockage+" ]<br><br>";
					}
					body+= "Supplier To be deleted: ["+supplierObj.getID()+" , "+supplierObj.getName()+" ]<br><br>";
					if(duplicatedSupplier != null) {
					   body+= "Supplier which will stay in the system: ["+duplicatedSupplierTargetSupplierID+" , "+duplicatedSupplierTargetSupplierName+" ]<br><br>"
					}
					
				     body+= "Deadline for full deletion of supplier is: ["+deadline+ "]<br><br>";
					body+= "If there is any reason why this supplier should not be blocked, please contact bsh-suppliermasterdata@bshg.com."
					body+= "<br><br>Thanks & Regards,<br>Supplier Master Data Team"; 
					body+= "<br><a href="+smdtLink+">Our Website"; 
		
					if(userEmail) {
						if(requestonBehalfOf) {
							sendMailWithCC(mailer, userEmail, requestonBehalfOf, subject, body);
						}
						else {
							sendMail(mailer, toList, subject, body);
						}
					}
		}
	}
}


/**
 * @desc function to send mail to Requestor about the status of Customer Number updation
 * @author Bhoomika Katti <Bhoomika.katti-ext@bshg.com>
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-25220}
 * @param {Node} node current object (Supplier)
 * @param {Step} step Step manager
 */
function sendMailToRequestorAbtCustomerNoStatus(node, step, mailer) {
    var userID = node.getValue("AT_RequestorAssignee").getSimpleValue();
    var requesterUser = step.getUserHome().getUserByID(userID);
    var requestonBehalfOf = node.getValue("AT_RequestCreatedOnBehalfOf").getSimpleValue();
    if (requesterUser) {
        var userDetails = getUserDetails(step, userID);
        var userEmail = userDetails.userEmail;
        var userName = userDetails.userName;
        var supplierObj = getSupplierFromRequest(node, step);
		var sapId = supplierObj.getValue("AT_SAPR3Reference").getSimpleValue();
        var suplGlobalVariables = step.getClassificationHome().getClassificationByID("SupplierVariables");
        var systemURL = suplGlobalVariables.getValue("AT_SystemURL").getSimpleValue();
        var supplierURL = systemURL + "webui/SupplierWebUI#contextID=Global&workspaceID=Main&screen=DetailScreen_Supplier&selection=" + supplierObj.getID() + "&nodeType=entity&selectedTab=450412263.0&displayMode=126510176.0";
        var supplierLInk = "<a href=" + supplierURL + ">" + supplierObj.getID() + " </a>";
        if (supplierObj.getValue("AT_CustomerNumber").getSimpleValue()) {
            var subject = "For the Supplier " + supplierObj.getID() + " ( " +" SAP ID : " + sapId + " ) "+ supplierObj.getName() + " Customer number has been assigned";
            var body = "<html><head>";
            body += "Dear " + userName + ",<br>";
            body += "<br><br>For the Supplier " +  supplierObj.getName() + "_" +  supplierLInk  + " Customer number has been assigned successfully <br><br>";
            body += "<br><br>Thanks & Regards,<br>Supplier Master Data Team";
        } else {
            var subject = "For the Supplier " +supplierObj.getID()+ " ( " +" SAP ID : " + sapId + " ) " + " Customer number not assigned ";
            var body = "<html><head>";
            body += "Dear " + userName + ",<br>";
            body += "<br><br> For the Supplier " +  supplierObj.getName()  + "_" +  supplierLInk + "  Customer number not assigned, please go to 'Manual Check Required' state of the workflow ,assign it manually and click submit button <br><br>";
            body += "<br><br>Thanks & Regards,<br>Supplier Master Data Team";
        }
        if (userEmail) {
            if (requestonBehalfOf) {
                sendMailWithCC(mailer, userEmail, requestonBehalfOf, subject, body);
            } else {
                sendMail(mailer, userEmail, subject, body);
            }
        }
    }
}

/**
 * @desc Sends a Submit mail to supplier requestor
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-11579
 * https://issuetracking.bsh-sdd.com/browse/MDMPB-11071
 * @author Amruta <Amruta.Tangade-ext@bshg.com>
 * @param {Node} node request object
 * @param {Step} step Step manager
 * @param {MailHome} mailer Mail Home
 */
function sendEmailToCountryReprensetativeForPurchOrgCreation(node, step, mailer, ccList) {
    var supplierObj = getSupplierFromRequest(node, step);
    var suplGlobalVariables = step.getClassificationHome().getClassificationByID("SupplierVariables");
    var systemURL = suplGlobalVariables.getValue("AT_SystemURL").getSimpleValue();
    var supplierURL = systemURL + "webui/SupplierWebUI#contextID=Global&workspaceID=Main&screen=DetailScreen_Supplier&selection=" + supplierObj.getID() + "&nodeType=entity&selectedTab=450412263.0&displayMode=126510176.0";
    var supplierLInk = "<a href=" + supplierURL + ">" + supplierObj.getID() + " </a>";
    var companyCodes = supplierObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierCompanyCode"));
    var PoList = new java.util.HashSet("");
    for (var i = 0; i < companyCodes.size(); i++) {
        var cCObj = companyCodes.get(i).getTarget();
        var compCode = cCObj.getValue("AT_CompanyCode").getID();
    }
    var countryCode = getAddressDetails(supplierObj, step, "REF_SupplierToAddress").countryCode;
    var sapId = supplierObj.getValue("AT_SAPR3Reference").getSimpleValue();
    if (countryCode) {
        var countryObjID = "CNTRY_" + countryCode;
        var countryObj = step.getEntityHome().getEntityByID(countryObjID);
        if (countryObj) {
            var countryRepresentativeEmail = countryObj.getValue("AT_PresentativeEmail").getSimpleValue();
            if (compCode) {
                var subject = " New company code " + "_" + ccList + "_" + " for supplier Stibo: "+ supplierObj.getID() + ", SAP: " + sapId + " - " + supplierObj.getName() + " has been created automatically";
                var body = "<html><head>";
                body += "Dear Team,<br> <br>";
                body += "New supplier" + "  " + supplierLInk + "  " + supplierObj.getName() + " " + " has been created by purchasing department with following purchasing organizations:"
                body += "<table style=\"border-collapse:collapse;border:none;\">";
                body += "<tbody><tr><td style=\"width: 233.75pt;border: 1pt solid white;background: rgb(146, 208, 80);\"><p style=\"font-size:17px;text-align:center;'\"><strong>Purchasing Organization</strong></p></td>";
                body += "<td style=\"width: 155.8pt;border: 1pt solid white;background: rgb(146, 208, 80);\"><p style=\"font-size:17px;text-align:center;'\"><strong>Supplier category</strong></p></td>";
                body += "<td style=\"width: 155.8pt;border: 1pt solid white;background: rgb(146, 208, 80);\"><p style=\"font-size:17px;text-align:center;'\"><strong>Payment terms</strong></p></td>";
                body += "<td style=\"width: 155.8pt;border: 1pt solid white;background: rgb(146, 208, 80);\"><p style=\"font-size:17px;text-align:center;'\"><strong>Incoterms1</strong></p></td>";
                body += "<td style=\"width: 155.8pt;border: 1pt solid white;background: rgb(146, 208, 80);\"><p style=\"font-size:17px;text-align:center;'\"><strong>Incoterms2</strong></p></td>";
                body += "<td style=\"width: 155.8pt;border: 1pt solid white;background: rgb(146, 208, 80);\"><p style=\"font-size:17px;text-align:center;'\"><strong>Currency</strong></p></td></tr>";
                var purchasingOrgs = supplierObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierPurchasingData"));
                for (var j = 0; j < purchasingOrgs.size(); j++) {
                    var purchOrgObj = purchasingOrgs.get(j).getTarget();
                    var poMaster = purchOrgObj.getParent();
                    var purchOrg = purchOrgObj.getValue("AT_PurchasingOrganization").getSimpleValue();
                    var supplierCategory = purchOrgObj.getValue("AT_SupplierCategory").getSimpleValue();
                    var termsOfPayment = purchOrgObj.getValue("AT_TermsOfPayment").getSimpleValue();
                    var incoTerms1 = purchOrgObj.getValue("AT_IncoTerms").getSimpleValue();
                    var incoTerms2 = purchOrgObj.getValue("AT_IncoTerms2").getSimpleValue();
                    var orderCurrency = purchOrgObj.getValue("AT_OrderCurrency").getSimpleValue();
                    var Ccompanycode = poMaster.getValue("AT_CompanyCode").getSimpleValue();
                    if (Ccompanycode == null) {
                        var POParent = purchOrgObj.getParent();
                        var PoParentID = POParent.getID();
                        PoList.add(PoParentID);
                    }
                    body += "<tr><td style=\"border: 1pt solid white;background: rgb(226, 239, 217);\"><p style=\"font-size:15px;text-align:center;'\">" + purchOrg + "</p></td>";
                    body += "<td style=\"border: 1pt solid white;background: rgb(226, 239, 217);\"><p style=\"font-size:15px;text-align:center;'\">" + supplierCategory + "</p></td>";
                    body += "<td style=\"border: 1pt solid white;background: rgb(226, 239, 217);\"><p style=\"font-size:15px;text-align:center;'\">" + termsOfPayment + "</p></td>";
                    body += "<td style=\"border: 1pt solid white;background: rgb(226, 239, 217);\"><p style=\"font-size:15px;text-align:center;'\">" + incoTerms1 + "</p></td>";
                    body += "<td style=\"border: 1pt solid white;background: rgb(226, 239, 217);\"><p style=\"font-size:15px;text-align:center;'\">" + incoTerms2 + "</p></td>";
                    body += "<td style=\"border: 1pt solid white;background: rgb(226, 239, 217);\"><p style=\"font-size:15px;text-align:center;'\">" + orderCurrency + "</p></td></tr>";
                }
                body += "</table><br><br> Company codes that have been added automatically:"

                body += "<table style=\"border-collapse:collapse;border:none;\">";
                body += "<tbody><tr><td style=\"width: 233.75pt;border: 1pt solid white;background: rgb(146, 208, 80);\"><p style=\"font-size:17px;text-align:center;'\"><strong>Company Code</strong></p></td>";
                body += "<td style=\"width: 155.8pt;border: 1pt solid white;background: rgb(146, 208, 80);\"><p style=\"font-size:17px;text-align:center;'\"><strong>Payment terms</strong></p></td>";
                body += "<td style=\"width: 155.8pt;border: 1pt solid white;background: rgb(146, 208, 80);\"><p style=\"font-size:17px;text-align:center;'\"><strong>Payment method</strong></p></td>";
                body += "<td style=\"width: 155.8pt;border: 1pt solid white;background: rgb(146, 208, 80);\"><p style=\"font-size:17px;text-align:center;'\"><strong>Reconciliation Account</strong></p></td></tr>";
                var companyCodes = supplierObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierCompanyCode"));
                for (var i = 0; i < companyCodes.size(); i++) {
                    var cCObj = companyCodes.get(i).getTarget();
                    var compCode = cCObj.getValue("AT_CompanyCode").getID();
                    var paymentTerms = cCObj.getValue("AT_TermsOfPayment").getSimpleValue();
                    var paymentMethods = cCObj.getValue("AT_SuplPaymentMethods").getSimpleValue();
                    var reconciliationAccount = cCObj.getValue("AT_ReconciliationAccount").getSimpleValue();
                    body += "<tr><td style=\"border: 1pt solid white;background: rgb(226, 239, 217);\"><p style=\"font-size:15px;text-align:center;'\">" + compCode + "</p></td>";
                    body += "<td style=\"border: 1pt solid white;background: rgb(226, 239, 217);\"><p style=\"font-size:15px;text-align:center;'\">" + paymentTerms + "</p></td>";
                    body += "<td style=\"border: 1pt solid white;background: rgb(226, 239, 217);\"><p style=\"font-size:15px;text-align:center;'\">" + paymentMethods + "</p></td>";
                    body += "<td style=\"border: 1pt solid white;background: rgb(226, 239, 217);\"><p style=\"font-size:15px;text-align:center;'\">" + reconciliationAccount + "</p></td></tr>";
                }
                body += "</table><br><br>";
                if(PoList!="[]") {
                    body += "For the Supplier " + supplierLInk + " " + supplierObj.getName() + ", "  +  " for which Company codes are not automatically created, kindly create relevant Company Code manually."
                }
                body += "<br><br>Thanks & Regards,<br>Supplier Master Data Team";
                body += "<br><br></body></html>";
                if (companyCodes) {
                    sendMail(mailer, countryRepresentativeEmail, subject, body)
                }
            } else {
                var subject = "New supplier " + supplierObj.getID() + " ( " +" SAP ID : " + sapId + " ) " + " has been created by purchasing department";
                var body = "<html>";
                body += "Dear Team, <br>";
                body += "New supplier " + supplierLInk + "  " + supplierObj.getName() + "  has been created by purchasing department with following purchasing organizations<br><br>";
                body += "<table style=\"border-collapse:collapse;border:none;\">";
                body += "<tbody><tr><td style=\"width: 233.75pt;border: 1pt solid white;background: rgb(146, 208, 80);\"><p style=\"font-size:17px;text-align:center;'\"><strong>Purchasing Organization</strong></p></td>";
                body += "<td style=\"width: 155.8pt;border: 1pt solid white;background: rgb(146, 208, 80);\"><p style=\"font-size:17px;text-align:center;'\"><strong>Supplier Category</strong></p></td>";
                body += "<td style=\"width: 155.8pt;border: 1pt solid white;background: rgb(146, 208, 80);\"><p style=\"font-size:17px;text-align:center;'\"><strong>Payment Terms</strong></p></td>";
                body += "<td style=\"width: 155.8pt;border: 1pt solid white;background: rgb(146, 208, 80);\"><p style=\"font-size:17px;text-align:center;'\"><strong>Incoterms 1</strong></p></td>";
                body += "<td style=\"width: 155.8pt;border: 1pt solid white;background: rgb(146, 208, 80);\"><p style=\"font-size:17px;text-align:center;'\"><strong>Incoterms 2</strong></p></td>";
                body += "<td style=\"width: 155.8pt;border: 1pt solid white;background: rgb(146, 208, 80);\"><p style=\"font-size:17px;text-align:center;'\"><strong>Currency</strong></p></td></tr>";

                var purchasingOrgs = supplierObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierPurchasingData"));
                for (var i = 0; i < purchasingOrgs.size(); i++) {
                    var purchOrgObj = purchasingOrgs.get(i).getTarget();
                    var purchOrg = purchOrgObj.getValue("AT_PurchasingOrganization").getSimpleValue();
                    var supplierCategory = purchOrgObj.getValue("AT_SupplierCategory").getSimpleValue();
                    var termsOfPayment = purchOrgObj.getValue("AT_TermsOfPayment").getSimpleValue();
                    var incoTerms1 = purchOrgObj.getValue("AT_IncoTerms").getSimpleValue();
                    var incoTerms2 = purchOrgObj.getValue("AT_IncoTerms2").getSimpleValue();
                    var orderCurrency = purchOrgObj.getValue("AT_OrderCurrency").getSimpleValue();

                    body += "<tr><td style=\"border: 1pt solid white;background: rgb(226, 239, 217);\"><p style=\"font-size:15px;text-align:center;'\">" + purchOrg + "</p></td>";
                    body += "<td style=\"border: 1pt solid white;background: rgb(226, 239, 217);\"><p style=\"font-size:15px;text-align:center;'\">" + supplierCategory + "</p></td>";
                    body += "<td style=\"border: 1pt solid white;background: rgb(226, 239, 217);\"><p style=\"font-size:15px;text-align:center;'\">" + termsOfPayment + "</p></td>";
                    body += "<td style=\"border: 1pt solid white;background: rgb(226, 239, 217);\"><p style=\"font-size:15px;text-align:center;'\">" + incoTerms1 + "</p></td>";
                    body += "<td style=\"border: 1pt solid white;background: rgb(226, 239, 217);\"><p style=\"font-size:15px;text-align:center;'\">" + incoTerms2 + "</p></td>";
                    body += "<td style=\"border: 1pt solid white;background: rgb(226, 239, 217);\"><p style=\"font-size:15px;text-align:center;'\">" + orderCurrency + "</p></td></tr>";
                }
                body += "</table><br><br>";
                body += "For the Supplier " + supplierLInk + " " + supplierObj.getName() + "," + " kindly create relevant Company Code manually."
                body += "<br><br>Thanks & Regards,<br>Supplier Master Data Team";
                body += "<br><br></body></html>";
                if (countryRepresentativeEmail) {
                    sendMail(mailer, countryRepresentativeEmail, subject, body);
                }
            }

        }
    }
}
/**
 * @desc check conditionally mandatory communication data
 * @link
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns {String} Error Message string.
 */
 
function validateCommunicationMethod(node, step) {
	var communicationMethod = getAttributeValue(node, "AT_STDCommunicationMethod");
	var errorMessage = "";
	if(communicationMethod) {
		var dataContainerID = null;
		if("Fax".equals(communicationMethod)){
			dataContainerID = "ATC_FaxNumbers";
		}
		else if("Email".equals(communicationMethod)){
			dataContainerID = "ATC_EmailAddress";
		}
		if(dataContainerID) {
			var hasDataContainerValues = isDataContainerHasValue(node, dataContainerID);
			if(!hasDataContainerValues && "Email".equals(communicationMethod)) {
				 //errorMessage = "Missing value: "+communicationMethod+" address\n";
				 errorMessage = "Missing value: "+communicationMethod+" address and Default flag for "+communicationMethod+"\n";
			}
			else if(!hasDataContainerValues && "Fax".equals(communicationMethod)){
				errorMessage = "Missing value: "+communicationMethod+" number and its Country Dialing Code,Default flag for "+communicationMethod+"\n";
			}
		}	
	}
	var telephoneValues = isDataContainerHasValue(node, "ATC_TelephoneNumbers");
	var mobileValues = isDataContainerHasValue(node, "ATC_MobileNumbers");

	if(!telephoneValues && !mobileValues){
		 errorMessage += "Missing value: Telephone or Mobile number\n";
	}
	return errorMessage;
}


/**
 * @desc Update Concatenate and set the step Name (STIBO Name)
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-16247
 * @author Bhoomika Katti <Bhoomika.Katti-ext@bshg.com>
 * @param {String} {Step} step Step manager
 * @param {Node} node current object
 * @returns {String} Updated Supplier name
 */
function concatAndSetSuppName(node, step){
	var suppObj = node;
	var stiboName = suppObj.getName();
	var updatedConcatenatedName = "";
	var existingEntireName = true;
	var name1 = suppObj.getValue("AT_Name1").getSimpleValue();
	var name2 = suppObj.getValue("AT_Name2").getSimpleValue();
	var name3 = suppObj.getValue("AT_Name3").getSimpleValue();
	var name4 = suppObj.getValue("AT_Name4").getSimpleValue();
	
	if(name1 == null && name2 == null && name3 == null && name4 == null){
		existingEntireName = false;
	}
	else{
		if(name1 != null){
			updatedConcatenatedName = updatedConcatenatedName + name1.trim() + " ";
		}
		if(name2 != null){
			updatedConcatenatedName = updatedConcatenatedName + name2.trim() + " ";
		}
		if(name3 != null){
			updatedConcatenatedName = updatedConcatenatedName + name3.trim() + " ";
		}
		if(name4 != null){
			updatedConcatenatedName = updatedConcatenatedName + name4.trim();
		}
	}
	if(!existingEntireName){
		var nameSplitArray = splitStringByCharLength(String(stiboName), 35);
		for(i=0;i<4;i++){
			suppObj.getValue("AT_Name"+(i+1)).setSimpleValue(null);
		}
		try{
			for(i=0; i<nameSplitArray.length; i++) {
				suppObj.getValue("AT_Name"+(i+1)).setSimpleValue(nameSplitArray[i]);
			}
		}
		catch(e){
			logger.info("Exception !Exceeded the Name length"+e);	
		}
	}
	else if(existingEntireName && updatedConcatenatedName != stiboName){
		suppObj.setName(updatedConcatenatedName.trim());
	}
}

/**
 * @desc function to read and store user comments while trasitioning between workflow states
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-3886
 * @author Bharat Gandhi <Bharat.Gandhi-ext@bshg.com>
 * @param {String} inputcomments Text to be stored
 * @returns {String} Error Message string.
 */

function setUserComments(node, step, inputcomments) {
	var currentDateTime = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date());
	var userName = step.getCurrentUser().getName();
	var existingComments = node.getValue("AT_Comments").getSimpleValue();
	var commentTobeSet = currentDateTime+" | "+userName+" | "+inputcomments;
	if(existingComments) {
		var revisedComment = commentTobeSet + "<multisep/>" + existingComments;
		setAttributeValue(node, "AT_Comments", revisedComment);
	}
	else{
		setAttributeValue(node, "AT_Comments", commentTobeSet);
	}
	setAttributeValue(node, "AT_UserComments", null);
}

/**
 * @desc function to set the comments between MD Steward and MD Intern
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @param {String} inputcomments Text to be stored
 */
function setInternalDataQualityComments(node, step, inputcomments) {
	var currentDateTime = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date());
	var userName = step.getCurrentUser().getName();
	var commentTobeSet = currentDateTime+" | "+userName+" | "+inputcomments;
	node.getValue("AT_InternalDataQualityComments").addValue(commentTobeSet)
	node.getValue("AT_UserComments").deleteCurrent()
}

/**
 * @desc function to check if reason for blockage is provided in deletion requests
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-8002
 * @author Bharat Gandhi <Bharat.Gandhi-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns {String} Error Message string.
*/

function checkReasonForBlockage(node, step){
	var errorMessage = "";
	var changeRequestType = node.getValue("AT_TypeOfChangeRequest").getID();
	var reasonForBlockage = node.getValue("AT_ReasonForBlockage").getSimpleValue();
	var descriptionForOther = node.getValue("AT_DescriptionForOther").getSimpleValue();
	var references = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplier"));
	if(changeRequestType && "DEL".equals(changeRequestType) && !reasonForBlockage) {
		errorMessage += "Missing Value: Reason for Blockage\n";
	}
	if(changeRequestType && "DEL".equals(changeRequestType) && "Other".equals(reasonForBlockage) && !descriptionForOther) {
		errorMessage += "Missing Value: Description for other\n";
	}
	if(changeRequestType && "DEL".equals(changeRequestType) && ("Duplicate".equals(reasonForBlockage) || "Legal Form Change".equals(reasonForBlockage)) && references.isEmpty()) {
		errorMessage += "Missing Value: Old/Duplicated Supplier\n";
	}
	return errorMessage;
}

/**
 * @desc function to check if the priority is urgent for the ticket
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-3911
 * @author Bharat Gandhi <Bharat.Gandhi-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns {String} Error Message string.
*/

function checkPriority(node, step){
	var errorMessage = "";
	var priority = getAttributeValue(node, "AT_Priority");
	var reasonForUrgent = getAttributeValue(node, "AT_ReasonForUrgent");
	if(!priority) {
		errorMessage = "Missing Value: Priority\n";
	}
	if ("Urgent".equals(priority)) {
		if (!reasonForUrgent) {
			errorMessage = "Missing Value: Reason for urgent\n";
		}
	}
	else {
		setAttributeValue(node, "AT_ReasonForUrgent", null);
		setAttributeValue(node, "AT_Description", null);
	}
	return errorMessage;
}

/**
 * @desc function to check if 'other' reason for urgency of ticket is described or not
 * @link 
 * @author Bharat Gandhi <Bharat.Gandhi-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns {String} Error Message string.
*/

function checkDescriptionForOther(node, step){
	var errorMessage = "";
	var reason = getAttributeValue(node, "AT_ReasonForUrgent");
	var descriptionForOther = "Other".equals(reason);
	var description = getAttributeValue(node, "AT_Description");
	if(descriptionForOther){
		if(!description){
			errorMessage = "Please describe the reason for urgent in 'Description' field\n";
		}
	}
	return errorMessage;
}	

/**
 * @desc function to get the next Working Day
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-3911
 * @author Bharat Gandhi <Bharat.Gandhi-ext@bshg.com>
 * @param {number} number of days to add
 * @returns {Date}
*/

function getNextWorkingDay(noOfDays) {
	var nextWorkingDay = null;
	var currDate = new Date();
	var nextDay = addDaysToDate(currDate, noOfDays);
	var isSaturday = nextDay.getDay() == 6;
	var isSunday = nextDay.getDay() == 0;
	if(isSaturday) {
		nextWorkingDay = addDaysToDate(nextDay, 2);
	}
	else if(isSunday) {
		nextWorkingDay = addDaysToDate(nextDay, 2);
	}
	else{
		nextWorkingDay = nextDay
	}
	return nextWorkingDay;
}

/**
 * @desc function to set the Deadline for a ticket in SSC state
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-3911
 * @author Bharat Gandhi <Bharat.Gandhi-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {id} workflowID ID of the current workflow
 * @param {id} stateID ID of the current state
 * @returns 
*/

function setDeadlineForSSC(node, step, workflowID, stateID) {
	/*var sscDeadline = getAttributeValue(node, "AT_SSCDeadline");
	if(sscDeadline) {
		var date = new Date(sscDeadline);
		node.getTaskByID(workflowID, stateID).setDeadline(date);
	}
	else {
		var daysToAdd = 1;
		var nextWorkingDay = getNextWorkingDay(daysToAdd);
		node.getTaskByID(workflowID, stateID).setDeadline(nextWorkingDay);
		setAttributeValue(node, "AT_SSCDeadline", nextWorkingDay);
	}*/
	var daysToAdd = 1;
	var nextWorkingDay = getNextWorkingDay(daysToAdd);
	node.getTaskByID(workflowID, stateID).setDeadline(nextWorkingDay);
	setAttributeValue(node, "AT_SSCDeadline", nextWorkingDay);
}

/**
 * @desc function to set the value for sorting attribute of ssc tickets
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-3911
 * @author Bharat Gandhi <Bharat.Gandhi-ext@bshg.com>
 *@param {Step} step Step manager
 * @param {Node} node current object
 * @returns 
*/

function setSSCSortingOrder(node, step) {
	var sscDeadline = getAttributeValue(node, "AT_SSCDeadline");
	var isCritical = getAttributeValue(node, "AT_isCritical");
	var priority = getAttributeValue(node, "AT_Priority");
	var date = new java.text.SimpleDateFormat("yyyy/MM/dd HH:mm:ss").format(new Date(sscDeadline));
   
	if(isCritical) {
		setAttributeValue(node, "AT_SSCSort", "1 " + String(date));
	}
	else if("Urgent".equals(priority)) {
		setAttributeValue(node, "AT_SSCSort", "2 " + String(date));
	}
	else {
		setAttributeValue(node, "AT_SSCSort", "3 " + String(date));
	}
}

/**
 * @desc Create a single valued reference between two objects.
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-4458
 * @author Bharat Gandhi <Bharat.Gandhi-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {entityID} ID of the source entity value
 * @param {referenceID} ID of the defined reference between the two objects
 * @returns 
 */

function createSingleValuedEntityReference(node, step, entityID, referenceID) {
    var existingReferences = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID(referenceID));
    if (!existingReferences.isEmpty()) {
        existingReferences.get(0).delete(); // deleting existing reference as for single valued reference.
    }
    var entity = step.getEntityHome().getEntityByID(entityID);
    if(entity) {
        node.createReference(entity, referenceID);
    }
}

/**
 * @desc Set Country object attributes
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-4734
 * @author Bharat Gandhi <Bharat.Gandhi-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {entityID} ID of the source entity value
 * @param {countryKey} ID of the country object
 * @returns 
 */

function populateCountryValues (node, step) {
	var countryCode = getAddressDetails(node, step, "REF_SupplierToAddress").countryCode;
	var tempCountryCode = node.getValue("AT_TempCountry").getID();
	if(!tempCountryCode || (tempCountryCode !== countryCode)) {
		var countryObjID = "CNTRY_" + countryCode;
		var countryObj = step.getEntityHome().getEntityByID(countryObjID);
		if(countryObj) {
			var languageID = countryObj.getValue("AT_Language").getID();
			var timeZoneID = countryObj.getValue("AT_TimeZone").getID();
			node.getValue("AT_Language").setLOVValueByID(languageID);
			node.getValue("AT_TimeZone").setLOVValueByID(timeZoneID);
			node.getValue("AT_TempCountry").setLOVValueByID(countryCode);
		}
	}
}


/**
 * @desc Check if references removed for permitted payee
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-10650
 * @link 
 * @author Amruta Tangade <Amruta.Tangade-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node supplier object
 * @param {Node} requestObj request object
 * @returns boolean true iif difference the fieds else false
 */

function areReferencesRemovedForPermittedPayee(node, step) {
	var mainWSReferencesSize = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierPermittedPayee")).size();
	if (approvednode(node, step) != null) {
		var approvedWSReferencesSize = approvednode(node, step).getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierPermittedPayee")).size();
		if (mainWSReferencesSize < approvedWSReferencesSize) {
			return true;
		}
		else {
			return false
		}
	}
}

/**
 * @desc Check if references Added for permitted payee
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-10650
 * @link 
 * @author Amruta Tangade <Amruta.Tangade-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node supplier object
 * @param {Node} requestObj request object
 * @returns boolean true iif difference the fieds else false
 */
function areReferencesAddedToPermittedPayee(node, step) {
	var mainWSReferencesSize = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierPermittedPayee")).size();
	if (approvednode(node, step) != null) {
		var approvedWSReferencesSize = approvednode(node, step).getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierPermittedPayee")).size();
		if (mainWSReferencesSize > approvedWSReferencesSize) {
			return true;
		}
		else {
			return false
		}
	}
}

/**
 * @desc Check if references Replaced for permitted payee
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-10650
 * @link 
 * @author Amruta Tangade <Amruta.Tangade-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node supplier object
 * @param {Node} requestObj request object
 * @returns boolean true iif difference the fieds else false
 */
function isSupplierReplacedForPermittedPayee (node, step){
	var replaced = false;
	var appNode = approvednode(node, step);
	if (appNode != null){
		var appSuplArr = getAssignedSupplierList(appNode, step);
		var mainSuplArr = getAssignedSupplierList(node , step);
		if (appSuplArr.length > 0 && mainSuplArr.length > 0 && mainSuplArr.length == appSuplArr.length) {
			for (i=0; i < appSuplArr.length; i++) {
				if (mainSuplArr.indexOf(appSuplArr[i]) < 0){
					replaced = true;
				}
			}
		}
		return replaced;
	}
}



/**
 * @desc Check if request need to be sent to Local Specialist in Change Workflow
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-5377
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-6171
 * @author Bharat Gandhi <Bharat.Gandhi-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node supplier object
 * @param {Node} requestObj request object
 * @returns boolean true iif difference the fieds else false
 */

function isLocalSpecialistApprovalRequired(node, step, requestObj) {
	var mainWSEmail = null;
	var approvedWSEmail = null;
	var mainWSFax = null;
	var approvedWSFax = null;
	var isRqPendingForApproval = null;
	var deletionSSCFlag = requestObj.getValue("AT_DelReqSSCFlag").getSimpleValue();
	if("Yes".equals(deletionSSCFlag)) {
		populateLocalSpecialistsForDeletionRequest(requestObj, step);
		isRqPendingForApproval = getDataContainerbyAttrValueID(requestObj, step, "ATC_LocalSpecialistStatus", "AT_LocalSpecialistAction", "Pending Approval");
		//logger.info("isLocalSpltsPopulated : "+isLocalSpltsPopulated);
		//logger.info("isRqPendingForApproval : "+isRqPendingForApproval);
		if(isRqPendingForApproval) {
			return true;
		}
	}
	//Crtitical Changes which reuired PO's Local specialist approval
	var defaultEmailAddressDCFromApprovedWS = getDCObjectFromApprovedWS(node, step, "ATC_EmailAddress", "AT_DefaultFlag", "Yes");
	if(defaultEmailAddressDCFromApprovedWS) {
		approvedWSEmail = defaultEmailAddressDCFromApprovedWS.getValue("AT_EmailAddress").getSimpleValue();
		var defaultEmailAddressDC = getDataContainerbyAttrValue(node, step, "ATC_EmailAddress", "AT_DefaultFlag","Yes");
		if(defaultEmailAddressDC) {
			mainWSEmail = defaultEmailAddressDC.getValue("AT_EmailAddress").getSimpleValue();
		}
		if(mainWSEmail != approvedWSEmail) {
			populateEmailAndFaxChangeLocalSpecialists(requestObj, step, "REF_SupplierToSupplierPurchasingData", "REF_SupplierPOToPOMaster");
			isRqPendingForApproval = getDataContainerbyAttrValueID(requestObj, step, "ATC_LocalSpecialistStatus", "AT_LocalSpecialistAction", "Pending Approval");
			if(isRqPendingForApproval) {
				return true;
			}
		}
	}
	var defaultFaxNumberDCFromApproveWS = getDCObjectFromApprovedWS(node, step, "ATC_FaxNumbers","AT_DefaultFlag", "Yes");
	if(defaultFaxNumberDCFromApproveWS) {
		approvedWSFax = defaultFaxNumberDCFromApproveWS.getValue("AT_FaxNumber").getSimpleValue();
		var defaultFaxNumberDC = getDataContainerbyAttrValue(node, step,"ATC_FaxNumbers","AT_DefaultFlag","Yes");
		if(defaultFaxNumberDC) {
			mainWSFax = defaultFaxNumberDC.getValue("AT_FaxNumber").getSimpleValue();
		}
		if(mainWSFax != approvedWSFax) {
			populateEmailAndFaxChangeLocalSpecialists(requestObj, step, "REF_SupplierToSupplierPurchasingData", "REF_SupplierPOToPOMaster");
			isRqPendingForApproval = getDataContainerbyAttrValueID(requestObj, step, "ATC_LocalSpecialistStatus", "AT_LocalSpecialistAction", "Pending Approval");
			if(isRqPendingForApproval) {
				return true;
			}
		} 
	}
	var mainWSBankAccounts = new java.util.HashSet("");
	var approvedWSBankAccounts = new java.util.HashSet("");
	var mainWSBankReferences = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToBankAccount"));
	for(var i=0; i<mainWSBankReferences.size(); i++) {
		var bankObj = mainWSBankReferences.get(i).getTarget();
		mainWSBankAccounts.add(bankObj.getID());
	}
	var approvedWSBankReferences = step.executeInWorkspace("Approved", function(step) {
											var emptyArrayList = new java.util.ArrayList();
											var approvedObj = step.getObjectFromOtherManager(node);
											if(approvedObj) {
												return approvedObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToBankAccount"));
											}
											return emptyArrayList;
							});
	for(var i=0; i<approvedWSBankReferences.size(); i++) {
		var approvedBankObj = approvedWSBankReferences.get(i).getTarget();
		approvedWSBankAccounts.add(approvedBankObj.getID());
	}
	for (var i = approvedWSBankAccounts.iterator(); i.hasNext(); ) {
		var approvedWSBankAccount = i.next();
		if(!mainWSBankAccounts.contains(approvedWSBankAccount)) {
			populateLocalSpecialists(requestObj, step, "REF_SupplierToSupplierCompanyCode", "REF_SuplCompanyCodeToCompanyCodeMaster");
			isRqPendingForApproval = getDataContainerbyAttrValueID(requestObj, step, "ATC_LocalSpecialistStatus", "AT_LocalSpecialistAction", "Pending Approval");
			if(isRqPendingForApproval) {
				return true;
			}
		}
	}
	
	//Crtitical Changes which reuired CC's Local specialist approval
	var mainAlternativePayee = getReferenceTargetID(node, step, "REF_SupplierToSupplierAlternativePayee");
	var approvedAlternativePayee = getReferenceTargetIDFromApprovedWS(node, step, "REF_SupplierToSupplierAlternativePayee");
	var isPermittedPayeeRemoved = areReferencesRemovedForPermittedPayee(node, step);
	var isPermittedPayeeAdded = areReferencesAddedToPermittedPayee(node, step);
	var isPermittedPayeeReplaced = isSupplierReplacedForPermittedPayee(node, step);
	var isCCAltPayeeChanged = compareReferenceTargetID(node, step, "SupplierCompanyCode", "REF_SupplierToSupplierCompanyCode", "REF_SupplierCompanyCodeToSupplier");
	var isBankNoChanged = compareReferenceAttributeValues(node, step, "REF_SupplierToBankAccount", "AT_NumberOfBankAccount");
	var isPartnerBankChanged = compareReferenceAttributeValues(node, step, "REF_SupplierToBankAccount", "AT_PartnerBankType");
	var isPORBankChanged = compareMainAndApprovedWsValues(node, step, "AT_PORSubscriberNumber");
	if((isCCAltPayeeChanged || isPermittedPayeeRemoved || isPermittedPayeeReplaced) && !((mainAlternativePayee != approvedAlternativePayee) || isBankNoChanged || isPartnerBankChanged || isPORBankChanged) && (isPermittedPayeeAdded != true)) {
		populateSpecificCompanyCodeLocalSpecialists(requestObj, step, "REF_SupplierToSupplierCompanyCode", "REF_SuplCompanyCodeToCompanyCodeMaster");
		isRqPendingForApproval = getDataContainerbyAttrValueID(requestObj, step, "ATC_LocalSpecialistStatus", "AT_LocalSpecialistAction", "Pending Approval");
		if(isRqPendingForApproval) {
			return true;
		}
	}
	if((mainAlternativePayee != approvedAlternativePayee) || (isPermittedPayeeRemoved || isPermittedPayeeReplaced || isBankNoChanged || isPartnerBankChanged || isPORBankChanged) && (isPermittedPayeeAdded != true)) {
		populateLocalSpecialists(requestObj, step, "REF_SupplierToSupplierCompanyCode", "REF_SuplCompanyCodeToCompanyCodeMaster");
		isRqPendingForApproval = getDataContainerbyAttrValueID(requestObj, step, "ATC_LocalSpecialistStatus", "AT_LocalSpecialistAction", "Pending Approval");
		if(isRqPendingForApproval) {
			return true;
		}
	}
	return false;
}




/**
 * @desc check for change in supplier children
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-5377
 * @author Bharat Gandhi <Bharat.Gandhi-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns information about whats changed
 */
function whatsChangedInSupplierChildren(node, step, referenceID) {
	//case 1 : new CC/PO added or removed...
	var newCC = new java.util.HashSet("");
	var newPO = new java.util.HashSet("");
	var changeInfo = "";
	var unApprovedObjects = node.getNonApprovedObjects();
	for (var i = unApprovedObjects.iterator(); i.hasNext(); ) {
		var unApprovedObject = i.next();
		if(unApprovedObject) {
			if (unApprovedObject instanceof com.stibo.core.domain.partobject.EntityReferencePartObject && "REF_SupplierToSupplierCompanyCode".equals(referenceID) && unApprovedObject.getReferenceType() == "REF_SupplierToSupplierCompanyCode") {
				newCC.add(unApprovedObject.getTargetID());
				changeInfo+="New company code " + "'" + step.getEntityHome().getEntityByID(unApprovedObject.getTargetID()).getName() + "'" + " is added.\n";
			}
			else if (unApprovedObject instanceof com.stibo.core.domain.partobject.EntityReferencePartObject && "REF_SupplierToSupplierPurchasingData".equals(referenceID) && unApprovedObject.getReferenceType() == "REF_SupplierToSupplierPurchasingData") {
				newPO.add(unApprovedObject.getTargetID());
				changeInfo+="New purchasing organization " + "'" +  step.getEntityHome().getEntityByID(unApprovedObject.getTargetID()).getName() + "'" + " is added.\n";
			}
		}
	}
	
	//case 2 : changes within a particular CC or PO...
	var refObjs = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID(referenceID));
	for(var i=0; i<refObjs.size(); i++) {
		var refObj = refObjs.get(i).getTarget();
		var refObjID = refObj.getID();
		var refTypeArr = []
		var mainArr = []
		var appArr = []
		var refObjTypeID = refObj.getObjectType().getID();
		if("SupplierCompanyCode".equals(refObjTypeID)) {
			var changedDCIDs = new java.util.HashSet("");
			var unApprovedCC = refObj.getNonApprovedObjects();
			for (var k = unApprovedCC.iterator(); k.hasNext(); ) {
				var unApprovedCCObject = k.next();
				if(unApprovedCCObject && unApprovedCCObject instanceof com.stibo.core.domain.partobject.ValuePartObject && !newCC.contains(refObjID)){
					var mainAttributeValue= getAttributeValue(refObj, unApprovedCCObject.getAttributeID());
					var approvedAttributeValue= getAttrValuesFromApprovedWS(refObj, step, unApprovedCCObject.getAttributeID());
					if(mainAttributeValue!=approvedAttributeValue){
						changeInfo += "The field " + "'" + step.getAttributeHome().getAttributeByID(unApprovedCCObject.getAttributeID()).getName() + "'" + " is changed in the company code " + "'" + step.getEntityHome().getEntityByID(refObjID).getName() + "'. Previous value - " + approvedAttributeValue + ". New Value - " + mainAttributeValue + "\n";
					}
				}
				else if (unApprovedCCObject && unApprovedCCObject instanceof com.stibo.core.domain.partobject.datacontainer.DataContainerPartObject && !"Not in Approved workspace".equals(refObj.getApprovalStatus())) {
					changedDCIDs.add(unApprovedCCObject.getDataContainerTypeID());
				}
				else if (unApprovedCCObject && unApprovedCCObject instanceof com.stibo.core.domain.partobject.EntityReferencePartObject){
					var CCodeArray = ["REF_SupplierCompanyCodeToSupplier", "REF_DunningRecipient", "REF_SupplierCCToHeadOffice"]
					if (CCodeArray.includes(unApprovedCCObject.getReferenceType()+"")){
						var referenceType = unApprovedCCObject.getReferenceType();
						if(!refTypeArr.includes(referenceType) && !mainArr.includes(getReferenceTargetIDs(refObj, step, referenceType).sort(sortAlphaNum)) && !appArr.includes(getReferenceTargetIDsFromApprovedWS(refObj, step, referenceType).sort(sortAlphaNum))){
							var refName =  step.getReferenceTypeHome().getReferenceTypeByID(referenceType).getName();
							var approvedRefValue = getReferenceTargetIDsFromApprovedWS(refObj, step, referenceType);
							var mainRefValue = getReferenceTargetIDs(refObj, step, referenceType);
							if(mainRefValue.length>0 && approvedRefValue.length>0) {
								if (!isEqual(mainRefValue, approvedRefValue)){
									changeInfo += "The value for " + refName +" is changed from '" + getReferenceTargetNamesFromApprovedWS(refObj, step, referenceType) + "' to " + getReferenceTargetNames(refObj, step, referenceType) + " in the company code '"+ step.getEntityHome().getEntityByID(refObjID).getName() +"'\n";
								}
							}
							else if(mainRefValue.length == 0) {
								changeInfo += "The value for " + refName +" is changed from '" + getReferenceTargetNamesFromApprovedWS(refObj, step, referenceType) + "' to 'null' in the Company code '"+step.getEntityHome().getEntityByID(refObjID).getName()+"'" ;
							}
							else if (approvedRefValue.length == 0){
								changeInfo += "The value for " + refName +" is changed from 'null' to '" + getReferenceTargetNames(refObj, step, referenceType) + "' in the company code '"+step.getEntityHome().getEntityByID(refObjID).getName()+"'\n";	
							}
						}
						refTypeArr.push(referenceType)
						mainArr.push(getReferenceTargetIDs(refObj, step, referenceType).sort(sortAlphaNum))
						appArr.push(getReferenceTargetIDsFromApprovedWS(refObj, step, referenceType).sort(sortAlphaNum))
					}
				}
			}
			var hashSetItr = changedDCIDs.iterator();
			while (hashSetItr.hasNext()) {
				var changedDCID = hashSetItr.next();
				if("ATC_WithHoldingTaxData".equals(changedDCID)) {
					var mainDCRows = getDataContainerRowsInMainWorkspace(refObj, step, changedDCID);
					var approvedDCRows = getDataContainerRowsInApprovedWS(refObj, step, changedDCID);
					var dataContainers = refObj.getDataContainerByTypeID(changedDCID).getDataContainers();
					for (var i = approvedDCRows.iterator(); i.hasNext(); ) {
						var approvedDCRow = i.next();
						if(!mainDCRows.contains(approvedDCRow)) {
							changeInfo += "Withholding tax type'" + approvedDCRow.getValue("AT_SuplWithholdingTaxType").getSimpleValue() + "' is removed from withholding tax section\n";
						}
					}
					var itr = dataContainers.iterator();
					while (itr.hasNext()){
						var dcObject = itr.next().getDataContainerObject();
						if (!approvedDCRows.contains(dcObject)) {
							changeInfo += "A new entry with withholding tax type '" + dcObject.getValue("AT_SuplWithholdingTaxType").getSimpleValue() + "' is added in the withholding section\n";
						}
						else {
							var attributes = step.getAttributeGroupHome().getAttributeGroupByID("ATG_WithholdingTaxDCAttributes").getAllAttributes();
							var attributeItr = attributes.iterator();
							while(attributeItr.hasNext()) {
								attributeObject = attributeItr.next();
								attributeID = attributeObject.getID();
								attributeName = attributeObject.getName();
								var mainAttributeValue = dcObject.getValue(attributeID).getSimpleValue();
								var approvedAttributeValue = getAttributeValueFromDCRowInApprovedWS (refObj, step, changedDCID, attributeID, dcObject);
								if (mainAttributeValue != approvedAttributeValue) {
									changeInfo += attributeName + " is changed from '" + approvedAttributeValue + "' to '" + mainAttributeValue + "' in the withholding tax section with withholding tax type - " + dcObject.getValue("AT_SuplWithholdingTaxType").getSimpleValue() + "\n";
								}
							}
						}
					}
				}
				else if("ATC_AdditionalTexts".equals(changedDCID)) {
					var mainDCRows = getDataContainerRowsInMainWorkspace(refObj, step, changedDCID);
					var approvedDCRows =getDataContainerRowsInApprovedWS(refObj, step, changedDCID);
					var dataContainers = refObj.getDataContainerByTypeID(changedDCID).getDataContainers();
					for (var i = approvedDCRows.iterator(); i.hasNext(); ) {
						var approvedDCRow = i.next();
						if(!mainDCRows.contains(approvedDCRow)) {
							changeInfo += "Additional Text ID'" + approvedDCRow.getValue("AT_CC_TextDescription").getSimpleValue() + "' is removed from Additional Text section\n";
						}
					}
					var itr = dataContainers.iterator();
					while (itr.hasNext()){
						var dcObject = itr.next().getDataContainerObject();
						var isNewEntry=!approvedDCRows.contains(dcObject);
						if (isNewEntry) {
							changeInfo += "A new entry with Additional Text ID '" + dcObject.getValue("AT_CC_TextDescription").getSimpleValue() + "' is added in the Additional Text section\n";
						}
						
						var attributes = step.getAttributeGroupHome().getAttributeGroupByID("ATG_CC_AdditionalTextsAttributes").getAllAttributes();
						var attributeItr = attributes.iterator();
						while(attributeItr.hasNext() ) {
							attributeObject = attributeItr.next();
							attributeID = attributeObject.getID();
							attributeName = attributeObject.getName();
							var mainAttributeValue = dcObject.getValue(attributeID).getSimpleValue();
							var approvedAttributeValue = getAttributeValueFromDCRowInApprovedWS (refObj, step, changedDCID, attributeID, dcObject);
							if (mainAttributeValue != approvedAttributeValue && !("AT_CC_TextDescription".equals(attributeID) && isNewEntry)) {
						 	 changeInfo += attributeName + " is changed from '" + approvedAttributeValue + "' to '" + mainAttributeValue + "' in the Additional Text section " + dcObject.getValue("AT_CC_TextDescription").getSimpleValue() + "\n";
							}
						}
					  	
					}
				}
			}
		}
		else if("SupplierPurchasingData".equals(refObjTypeID)) {
			var changedDCIDs = new java.util.HashSet("");
			var unApprovedPO = refObj.getNonApprovedObjects();
			for (var k = unApprovedPO.iterator(); k.hasNext(); ) {
				var unApprovedPOObject = k.next();
				if(unApprovedPOObject && unApprovedPOObject instanceof com.stibo.core.domain.partobject.ValuePartObject && !newPO.contains(refObjID)) {
					var mainAttributeValue= getAttributeValue(refObj, unApprovedPOObject.getAttributeID());
					var approvedAttributeValue= getAttrValuesFromApprovedWS(refObj, step, unApprovedPOObject.getAttributeID()) ;
					if(mainAttributeValue!=approvedAttributeValue){
						if (unApprovedPOObject.getAttributeID() == "AT_AdditionalSupplierID"){
							changeInfo += "Manufacturing Plant '" + mainAttributeValue + "' has been added\n";
						}
						else {
					 		changeInfo += "The field " + "'" + step.getAttributeHome().getAttributeByID(unApprovedPOObject.getAttributeID()).getName() + "'" + " is changed in the purchasing organization " + "'" + step.getEntityHome().getEntityByID(refObjID).getName() + "'. Previous value - " +approvedAttributeValue + ". New Value - " +mainAttributeValue + "\n";
						}
					}
				}
				else if (unApprovedPOObject && unApprovedPOObject instanceof com.stibo.core.domain.partobject.datacontainer.DataContainerPartObject && !"Not in Approved workspace".equals(refObj.getApprovalStatus())) {
					changedDCIDs.add(unApprovedPOObject.getDataContainerTypeID());
				}
				else if (unApprovedPOObject && unApprovedPOObject instanceof com.stibo.core.domain.partobject.ValuePartObject && unApprovedPOObject.getAttributeID() == "AT_AdditionalSupplierID"){
					var mainAttributeValue= getAttributeValue(refObj, unApprovedPOObject.getAttributeID());
					var approvedAttributeValue= getAttrValuesFromApprovedWS(refObj, step, unApprovedPOObject.getAttributeID());
					
					if(mainAttributeValue!=approvedAttributeValue){
						changeInfo += "Manufacturing Plant '" + mainAttributeValue + "' has been added\n";
					}
				}
			}
			var hashSetItr = changedDCIDs.iterator();
			while (hashSetItr.hasNext()) {
				var changedDCID = hashSetItr.next();
				if("ATC_AdditionalTexts".equals(changedDCID)) {
					var mainDCRows = getDataContainerRowsInMainWorkspace(refObj, step, changedDCID);
					var approvedDCRows =getDataContainerRowsInApprovedWS(refObj, step, changedDCID);
					var dataContainers = refObj.getDataContainerByTypeID(changedDCID).getDataContainers();
					for (var i = approvedDCRows.iterator(); i.hasNext(); ) {
						var approvedDCRow = i.next();
						if(!mainDCRows.contains(approvedDCRow)) {
							changeInfo += "Additional Text ID'" + approvedDCRow.getValue("AT_PO_TextDescription").getSimpleValue() + "' is removed from Additional Text section\n";
						}
					}
					var itr = dataContainers.iterator();
					while (itr.hasNext()){
						var dcObject = itr.next().getDataContainerObject();
						var isNewEntry=!approvedDCRows.contains(dcObject);
						if (isNewEntry) {
							changeInfo += "A new entry with Additional Text ID '" + dcObject.getValue("AT_PO_TextDescription").getSimpleValue() + "' is added in the Additional Text section\n";
						}
						var attributes = step.getAttributeGroupHome().getAttributeGroupByID("ATG_PO_AdditionalTextsAttributes").getAllAttributes();
						var attributeItr = attributes.iterator();
						while(attributeItr.hasNext()) {
							attributeObject = attributeItr.next();
							attributeID = attributeObject.getID();
							attributeName = attributeObject.getName();
							var mainAttributeValue = dcObject.getValue(attributeID).getSimpleValue();
							var approvedAttributeValue = getAttributeValueFromDCRowInApprovedWS (refObj, step, changedDCID, attributeID, dcObject);
							if (mainAttributeValue != approvedAttributeValue && !("AT_PO_TextDescription".equals(attributeID) && isNewEntry)) {
							  changeInfo += attributeName + " is changed from '" + approvedAttributeValue + "' to '" + mainAttributeValue + "' in the Additional Text section " + dcObject.getValue("AT_PO_TextDescription").getSimpleValue() + "\n";
							}
						}
					}
				}
			}
		}
	}
	return changeInfo;
}


/**
 * @desc check for changes in Bank Data
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-6269
 * @author Bharat Gandhi <Bharat.Gandhi-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns information about whats changed in Bank Data
 */
function whatsChangedInBankData (node, step) {
	//checking if any bank account is removed
	var changeInfo = "";
	var newBankAccount = new java.util.HashSet("");
	var mainWSBankAccounts = new java.util.HashSet("");
	var approvedWSBankAccounts = new java.util.HashSet("");
	var mainWSBankReferences = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToBankAccount"));
	for(var i=0; i<mainWSBankReferences.size(); i++) {
		var bankObj = mainWSBankReferences.get(i).getTarget();
		mainWSBankAccounts.add(bankObj.getID());
	}
	var approvedWSBankReferences = step.executeInWorkspace("Approved", function(step) {
											var emptyArrayList = new java.util.ArrayList();
											var approvedObj = step.getObjectFromOtherManager(node);
											if(approvedObj) {
												return approvedObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToBankAccount"));
											}
											return emptyArrayList;
							});
	for(var i=0; i<approvedWSBankReferences.size(); i++) {
		var approvedBankObj = approvedWSBankReferences.get(i).getTarget();
		approvedWSBankAccounts.add(approvedBankObj.getID());
	}
	for (var i = approvedWSBankAccounts.iterator(); i.hasNext(); ) {
		var approvedWSBankAccount = i.next();
		if(!mainWSBankAccounts.contains(approvedWSBankAccount)) {
			approvedWSBankAccountObj = step.getEntityHome().getEntityByID(approvedWSBankAccount);
			approvedWSBankAccountNumber = approvedWSBankAccountObj.getValue("AT_NumberOfBankAccount").getSimpleValue();
			changeInfo += "Bank Account '" + approvedWSBankAccountNumber + "' has been removed\n";
		}
	}
	//checking if a new bank account is added
	for (var i = mainWSBankAccounts.iterator(); i.hasNext(); ) {
		var mainWSBankAccount = i.next();
		if(!approvedWSBankAccounts.contains(mainWSBankAccount)) {
			newBankAccount.add(mainWSBankAccount);
			mainWSBankAccountObj = step.getEntityHome().getEntityByID(mainWSBankAccount);
			mainWSBankAccountNumber = mainWSBankAccountObj.getValue("AT_NumberOfBankAccount").getSimpleValue();
			changeInfo += "Bank Account '" + mainWSBankAccountNumber + "' has been added\n";
		}
	}
	//checking for changes in a particular bank account
	var bankAccounts = new java.util.HashSet("");
	var numberOfBankAccounts = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToBankAccount")).size();
	for(var i=0; i<numberOfBankAccounts; i++) {
		bankAccounts.add(node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToBankAccount")).get(i).getTarget().getID());
	}
	var itr = bankAccounts.iterator();
	while (itr.hasNext()) {
		bankAccountID = itr.next();
		var bankAccountObj = step.getEntityHome().getEntityByID(bankAccountID);
		var unApprovedObjects = bankAccountObj.getNonApprovedObjects();
		for (var i = unApprovedObjects.iterator(); i.hasNext(); ) {
			var unApprovedBankObject = i.next();
			if(unApprovedBankObject && unApprovedBankObject instanceof com.stibo.core.domain.partobject.ValuePartObject && !newBankAccount.contains(bankAccountID)){
				changeInfo += "The field " + "'" + step.getAttributeHome().getAttributeByID(unApprovedBankObject.getAttributeID()).getName() + "'" + " is changed in the Bank Account with ID " + "'" + step.getEntityHome().getEntityByID(bankAccountID).getID() + "'. Previous value - " + getAttrValuesFromApprovedWS(bankAccountObj, step, unApprovedBankObject.getAttributeID()) + ". New Value - " + getAttributeValue(bankAccountObj, unApprovedBankObject.getAttributeID()) + "\n";
			}
		}
	}
	return changeInfo;
}	

/**
 * @desc check for change in data containers
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-6269
 * @author Bharat Gandhi <Bharat.Gandhi-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns information about whats changed in the data containers
 */

function whatsChangedInSupplierGeneralData (node, step) {
	var changeInfo = "";
	//address changes
	var addressReference = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToAddress"));
	if(!addressReference.isEmpty()) {
		var addressID = addressReference.get(0).getTarget().getID();
		var addressObj = step.getEntityHome().getEntityByID(addressID);
		var unApprovedAddressObjects = addressObj.getNonApprovedObjects();
		for (var i = unApprovedAddressObjects.iterator(); i.hasNext(); ) {
			var unApprovedAddressObject = i.next();
			if(unApprovedAddressObject && unApprovedAddressObject instanceof com.stibo.core.domain.partobject.ValuePartObject){
				var mainAttributeValue =getAttributeValue(addressObj, unApprovedAddressObject.getAttributeID());
				var approvedAttributeValue=getAttrValuesFromApprovedWS(addressObj, step, unApprovedAddressObject.getAttributeID());
				if(mainAttributeValue!=approvedAttributeValue){
					changeInfo += "The field " + "'" + step.getAttributeHome().getAttributeByID(unApprovedAddressObject.getAttributeID()).getName() + "'" + " is changed in the address section. Previous value - " + approvedAttributeValue+ ". New Value - " + mainAttributeValue + "\n";
				}
			}
		}
	}
	//supplier attribute and references changes
	var unApprovedSupplierObjects = node.getNonApprovedObjects();
	var changedDCIDs = new java.util.HashSet("");
	var refTypeArr = []
	var mainArr = []
	var appArr = []
	for (var i = unApprovedSupplierObjects.iterator(); i.hasNext(); ) {
		var unApprovedSupplierObject = i.next();
		
		if(unApprovedSupplierObject && unApprovedSupplierObject instanceof com.stibo.core.domain.partobject.ValuePartObject){
			
			var generalAttributeID = unApprovedSupplierObject.getAttributeID();
			var mainAttributeValue =getAttributeValue(node, unApprovedSupplierObject.getAttributeID());
			var approvedAttributeValue =getAttrValuesFromApprovedWS(node, step, unApprovedSupplierObject.getAttributeID());
			if(mainAttributeValue!=approvedAttributeValue && !"AT_SUPL_ChangeRequestNumber".equals(generalAttributeID) && !"AT_SUPL_CreationRequestNo".equals(generalAttributeID) && !"AT_VatNumber".equals(generalAttributeID) && !"AT_NIP".equals(generalAttributeID)) {
				changeInfo += "The field " + "'" + step.getAttributeHome().getAttributeByID(generalAttributeID).getName() + "'" + " is changed. Previous value - " + approvedAttributeValue + ". New Value - " +mainAttributeValue + "\n";
			}
		}
		else if(unApprovedSupplierObject && unApprovedSupplierObject instanceof com.stibo.core.domain.partobject.datacontainer.DataContainerPartObject) {
			changedDCIDs.add(unApprovedSupplierObject.getDataContainerTypeID());
		}
		else if(unApprovedSupplierObject && unApprovedSupplierObject instanceof com.stibo.core.domain.partobject.EntityReferencePartObject && !("REF_SupplierToSupplierCompanyCode".equals(unApprovedSupplierObject.getReferenceType()) || "REF_SupplierToSupplierPurchasingData".equals(unApprovedSupplierObject.getReferenceType()) || "REF_SupplierToBankAccount".equals(unApprovedSupplierObject.getReferenceType()))) {
			var referenceType = unApprovedSupplierObject.getReferenceType();
			if(!refTypeArr.includes(referenceType) && !mainArr.includes(getReferenceTargetIDs(node, step, referenceType).sort(sortAlphaNum)) && !appArr.includes(getReferenceTargetIDsFromApprovedWS(node, step, referenceType).sort(sortAlphaNum))){
				var refName =  step.getReferenceTypeHome().getReferenceTypeByID(referenceType).getName();
				var approvedRefValue = getReferenceTargetIDsFromApprovedWS(node, step, referenceType);
				var mainRefValue = getReferenceTargetIDs(node, step, referenceType);
				if(mainRefValue.length>0 && approvedRefValue.length>0) {
					if (!isEqual(mainRefValue, approvedRefValue)){
						changeInfo += "The value for " + refName +" is changed from '" + getReferenceTargetNamesFromApprovedWS(node, step, referenceType) + "' to " + getReferenceTargetNames(node, step, referenceType) + "\n";
					}
				}
				else if(mainRefValue.length == 0) {
					changeInfo += "The value for " + refName +" is changed from '" + getReferenceTargetNamesFromApprovedWS(node, step, referenceType) + "' to 'null'" ;
				}
				else if (approvedRefValue.length == 0){
					changeInfo += "The value for " + refName +" is changed from 'null' to '" + getReferenceTargetNames(node, step, referenceType) + "'\n";	
				}
			}
			refTypeArr.push(referenceType)
			mainArr.push(getReferenceTargetIDs(node, step, referenceType).sort(sortAlphaNum))
			appArr.push(getReferenceTargetIDsFromApprovedWS(node, step, referenceType).sort(sortAlphaNum))
		}
	}
	var hashSetItr = changedDCIDs.iterator();
	while (hashSetItr.hasNext()) {
		var changedDCID = hashSetItr.next();
		if("ATC_FaxNumbers".equals(changedDCID)) {
			var mainDCRows = getDataContainerRowsInMainWorkspace(node, step, changedDCID);
			var approvedDCRows = getDataContainerRowsInApprovedWS(node, step, changedDCID);
			var dataContainers = node.getDataContainerByTypeID(changedDCID).getDataContainers();
			for (var i = approvedDCRows.iterator(); i.hasNext(); ) {
				var approvedDCRow = i.next();
				if(!mainDCRows.contains(approvedDCRow)) {
					changeInfo += "Fax Number '" + approvedDCRow.getValue("AT_FaxNumber").getSimpleValue() + "' is removed from Fax Numbers section\n";
				}
			}
			var itr = dataContainers.iterator();
			while (itr.hasNext()){
				var dcObject = itr.next().getDataContainerObject();
				var isNewEntry=!approvedDCRows.contains(dcObject);
				if(isNewEntry) {
					changeInfo += "A new entry with Fax Number '" + dcObject.getValue("AT_FaxNumber").getSimpleValue() + "' is added in the Fax Numbers section\n";
				}
					var attributes = step.getAttributeGroupHome().getAttributeGroupByID("ATG_SUPL_CommunicationInformation").getAllAttributes();
					var attributeItr = attributes.iterator();
					while(attributeItr.hasNext()) {
						attributeObject = attributeItr.next();
						attributeID = attributeObject.getID();
						attributeName = attributeObject.getName();
						var mainAttributeValue = dcObject.getValue(attributeID).getSimpleValue();
						var approvedAttributeValue = getAttributeValueFromDCRowInApprovedWS (node, step, changedDCID, attributeID, dcObject);
						if (mainAttributeValue != approvedAttributeValue && !("AT_FaxNumber".equals(attributeID) && isNewEntry)) {
								changeInfo += attributeName + " is changed from '" + approvedAttributeValue + "' to '" + mainAttributeValue + "' in the Fax Numbers section with Fax Number - " + dcObject.getValue("AT_FaxNumber").getSimpleValue() + "\n";
						}
					}
			}
		}
		else if("ATC_EmailAddress".equals(changedDCID)) {
			var mainDCRows = getDataContainerRowsInMainWorkspace(node, step, changedDCID);
			var approvedDCRows = getDataContainerRowsInApprovedWS(node, step, changedDCID);
			var dataContainers = node.getDataContainerByTypeID(changedDCID).getDataContainers();
			for (var i = approvedDCRows.iterator(); i.hasNext(); ) {
				var approvedDCRow = i.next();
				if(!mainDCRows.contains(approvedDCRow)) {
					changeInfo += "Email Address '" + approvedDCRow.getValue("AT_EmailAddress").getSimpleValue() + "' is removed from Email Address section\n";
				}
			}
			var itr = dataContainers.iterator();
			while (itr.hasNext()){
				var dcObject = itr.next().getDataContainerObject();
				var isNewEntry=!approvedDCRows.contains(dcObject);
				if (isNewEntry) {
					changeInfo += "A new entry with Email Address '" + dcObject.getValue("AT_EmailAddress").getSimpleValue() + "' is added in the Email Address section\n";
				}
				var attributes = step.getAttributeGroupHome().getAttributeGroupByID("ATG_TECH_EmailAddressesAttributes").getAllAttributes();
				var attributeItr = attributes.iterator();
				while(attributeItr.hasNext()) {
					attributeObject = attributeItr.next();
					attributeID = attributeObject.getID();
					attributeName = attributeObject.getName();
					var mainAttributeValue = dcObject.getValue(attributeID).getSimpleValue();
					var approvedAttributeValue = getAttributeValueFromDCRowInApprovedWS (node, step, changedDCID, attributeID, dcObject);
					if (mainAttributeValue != approvedAttributeValue && !("AT_EmailAddress".equals(attributeID) && isNewEntry)) {
						changeInfo += attributeName + " is changed from '" + approvedAttributeValue + "' to '" + mainAttributeValue + "' in the Email Addresses section with Email Address - " + dcObject.getValue("AT_EmailAddress").getSimpleValue() + "\n";
							
					}
				}
			}
		}
		else if("ATC_InternetAddress".equals(changedDCID)) {
			var mainDCRows = getDataContainerRowsInMainWorkspace(node, step, changedDCID);
			var approvedDCRows = getDataContainerRowsInApprovedWS(node, step, changedDCID);
			var dataContainers = node.getDataContainerByTypeID(changedDCID).getDataContainers();
			for (var i = approvedDCRows.iterator(); i.hasNext(); ) {
				var approvedDCRow = i.next();
				if(!mainDCRows.contains(approvedDCRow)) {
					changeInfo += "Internet Address '" + approvedDCRow.getValue("AT_InternetAddress").getSimpleValue() + "' is removed from Internet Address section\n";
				}
			}
			var itr = dataContainers.iterator();
			while (itr.hasNext()){
				var dcObject = itr.next().getDataContainerObject();
				var isNewEntry=!approvedDCRows.contains(dcObject);
				if (isNewEntry) {
					changeInfo += "A new entry with Internet Address '" + dcObject.getValue("AT_InternetAddress").getSimpleValue() + "' is added in the Internet Address section\n";
				}
				var attributes = step.getAttributeGroupHome().getAttributeGroupByID("ATG_TECH_InternetAddressesAttributes").getAllAttributes();
				var attributeItr = attributes.iterator();
				while(attributeItr.hasNext()) {
					attributeObject = attributeItr.next();
					attributeID = attributeObject.getID();
					attributeName = attributeObject.getName();
					var mainAttributeValue = dcObject.getValue(attributeID).getSimpleValue();
					var approvedAttributeValue = getAttributeValueFromDCRowInApprovedWS (node, step, changedDCID, attributeID, dcObject);
					if (mainAttributeValue != approvedAttributeValue && !("AT_InternetAddress".equals(attributeID) && isNewEntry)) {
						changeInfo += attributeName + " is changed from '" + approvedAttributeValue + "' to '" + mainAttributeValue + "' in the Internet Addresses section with Internet Address - " + dcObject.getValue("AT_InternetAddress").getSimpleValue() + "\n";
							
					}
				}
			}
		}
		else if("ATC_TelephoneNumbers".equals(changedDCID)) {
			var mainDCRows = getDataContainerRowsInMainWorkspace(node, step, changedDCID);
			var approvedDCRows = getDataContainerRowsInApprovedWS(node, step, changedDCID);
			var dataContainers = node.getDataContainerByTypeID(changedDCID).getDataContainers();
			for (var i = approvedDCRows.iterator(); i.hasNext(); ) {
				var approvedDCRow = i.next();
				if(!mainDCRows.contains(approvedDCRow)) {
					changeInfo += "Telephone Number '" + approvedDCRow.getValue("AT_TelephoneNumber").getSimpleValue() + "' is removed from Telephone Number section\n";
				}
			}
			var itr = dataContainers.iterator();
			while (itr.hasNext()){
				var dcObject = itr.next().getDataContainerObject();
				var isNewEntry=!approvedDCRows.contains(dcObject);
				if (isNewEntry) {
					changeInfo += "A new entry with Telephone Number '" + dcObject.getValue("AT_TelephoneNumber").getSimpleValue() + "' is added in the Telephone Number section\n";
				     
				}
				var attributes = step.getAttributeGroupHome().getAttributeGroupByID("ATG_SUPL_CommunicationInformation").getAllAttributes();
				var attributeItr = attributes.iterator();
				while(attributeItr.hasNext()) {
					attributeObject = attributeItr.next();
					attributeID = attributeObject.getID();
					attributeName = attributeObject.getName();
					var mainAttributeValue = dcObject.getValue(attributeID).getSimpleValue();
					var approvedAttributeValue = getAttributeValueFromDCRowInApprovedWS (node, step, changedDCID, attributeID, dcObject);
					if (mainAttributeValue != approvedAttributeValue && !("AT_TelephoneNumber".equals(attributeID) && isNewEntry)) {
						changeInfo += attributeName + " is changed from '" + approvedAttributeValue + "' to '" + mainAttributeValue + "' in the Telephone Numbers section with Telephone Number - " + dcObject.getValue("AT_TelephoneNumber").getSimpleValue() + "\n";	
					}
				}
			}
		}
		else if("ATC_MobileNumbers".equals(changedDCID)) {
			var mainDCRows = getDataContainerRowsInMainWorkspace(node, step, changedDCID);
			var approvedDCRows = getDataContainerRowsInApprovedWS(node, step, changedDCID);
			var dataContainers = node.getDataContainerByTypeID(changedDCID).getDataContainers();
			for (var i = approvedDCRows.iterator(); i.hasNext(); ) {
				var approvedDCRow = i.next();
				if(!mainDCRows.contains(approvedDCRow)) {
					changeInfo += "Mobile Number '" + approvedDCRow.getValue("AT_MobileNumber").getSimpleValue() + "' is removed from Mobile Number section\n";
				}
			}
			var itr = dataContainers.iterator();
			while (itr.hasNext()){
				var dcObject = itr.next().getDataContainerObject();
				var isNewEntry=!approvedDCRows.contains(dcObject);
				if (isNewEntry) {
					changeInfo += "A new entry with Mobile Number '" + dcObject.getValue("AT_MobileNumber").getSimpleValue() + "' is added in the Mobile Number section\n";
				}
				var attributes = step.getAttributeGroupHome().getAttributeGroupByID("ATG_SUPL_CommunicationInformation").getAllAttributes();
				var attributeItr = attributes.iterator();
				while(attributeItr.hasNext()) {
					attributeObject = attributeItr.next();
					attributeID = attributeObject.getID();
					attributeName = attributeObject.getName();
					var mainAttributeValue = dcObject.getValue(attributeID).getSimpleValue();
					var approvedAttributeValue = getAttributeValueFromDCRowInApprovedWS (node, step, changedDCID, attributeID, dcObject);
					if (mainAttributeValue != approvedAttributeValue && !("AT_MobileNumber".equals(attributeID) && isNewEntry)) {
						changeInfo += attributeName + " is changed from '" + approvedAttributeValue + "' to '" + mainAttributeValue + "' in the Mobile Numbers section having Mobile Number - " + dcObject.getValue("AT_MobileNumber").getSimpleValue() + "\n";
					}
				}
			}
		}
		// Below code we will remove - TAX_DC_REMOVAL
		/*else if("ATC_TaxInformation".equals(changedDCID)) {
			var mainDCRows = getDataContainerRowsInMainWorkspace(node, step, changedDCID);
			var approvedDCRows = getDataContainerRowsInApprovedWS(node, step, changedDCID);
			var dataContainers = node.getDataContainerByTypeID(changedDCID).getDataContainers();
			for (var i = approvedDCRows.iterator(); i.hasNext(); ) {
				var approvedDCRow = i.next();
				if(!mainDCRows.contains(approvedDCRow)) {
					changeInfo += "Tax Number '" + approvedDCRow.getValue("AT_TaxNumber").getSimpleValue() + "' is removed from Tax Number section\n";
				}
			}
			var itr = dataContainers.iterator();
			while (itr.hasNext()){
				var dcObject = itr.next().getDataContainerObject();
				var isNewEntry=!approvedDCRows.contains(dcObject);
				if (isNewEntry) {
					changeInfo += "A new entry with Tax Number '" + dcObject.getValue("AT_TaxNumber").getSimpleValue() + "' is added in the Tax Information section\n";
				}
				else {
					var attributes = step.getAttributeGroupHome().getAttributeGroupByID("ATG_TECH_TaxInformationAttributes").getAllAttributes();
					var attributeItr = attributes.iterator();
					while(attributeItr.hasNext()) {
						attributeObject = attributeItr.next();
						attributeID = attributeObject.getID();
						attributeName = attributeObject.getName();
						var mainAttributeValue = dcObject.getValue(attributeID).getSimpleValue();
						var approvedAttributeValue =getAttributeValueFromDCRowInApprovedWS (node, step, changedDCID, attributeID, dcObject);
						if (mainAttributeValue != approvedAttributeValue&& !("AT_TaxNumber".equals(attributeID) && isNewEntry)) {
							changeInfo += attributeName + " is changed from '" + approvedAttributeValue + "' to '" + mainAttributeValue + "' in the Tax Information section having Tax Number - " + dcObject.getValue("AT_TaxNumber").getSimpleValue() + "\n";
						}
					}
				}
			}
		}*/
		else if("ATC_AdditionalTexts".equals(changedDCID)) {
			var mainDCRows = getDataContainerRowsInMainWorkspace(node, step, changedDCID);
			var approvedDCRows = getDataContainerRowsInApprovedWS(node, step, changedDCID);
			var dataContainers = node.getDataContainerByTypeID(changedDCID).getDataContainers();
			for (var i = approvedDCRows.iterator(); i.hasNext(); ) {
				var approvedDCRow = i.next();
				if(!mainDCRows.contains(approvedDCRow)) {
					changeInfo += "Additional Text ID'" + approvedDCRow.getValue("AT_SUPL_TextDescription").getSimpleValue() + "' is removed from Additional Text section\n";
				}
			}
			var itr = dataContainers.iterator();
			while (itr.hasNext()){
				var dcObject = itr.next().getDataContainerObject();
				var isNewEntry=!approvedDCRows.contains(dcObject);
				if (isNewEntry) {
					changeInfo += "A new entry with Additional Text ID '" + dcObject.getValue("AT_SUPL_TextDescription").getSimpleValue() + "' is added in the Additional Text section\n";
				}
				var attributes = step.getAttributeGroupHome().getAttributeGroupByID("ATG_SUPL_AdditionalTextsAttributes").getAllAttributes();
				var attributeItr = attributes.iterator();
				while(attributeItr.hasNext()) {
					attributeObject = attributeItr.next();
					attributeID = attributeObject.getID();
					attributeName = attributeObject.getName();
					var mainAttributeValue = dcObject.getValue(attributeID).getSimpleValue();
					var approvedAttributeValue = getAttributeValueFromDCRowInApprovedWS (node, step, changedDCID, attributeID, dcObject);
					if (mainAttributeValue != approvedAttributeValue && !("AT_SUPL_TextDescription".equals(attributeID) && isNewEntry)) {
					   changeInfo += attributeName + " is changed from '" + approvedAttributeValue + "' to '" + mainAttributeValue + "' in the Additional Text section " + dcObject.getValue("AT_SUPL_TextDescription").getSimpleValue() + "\n";
				   	}
				}
			}
		}			

	}
	return changeInfo;
}


/**
 * @desc function to display changes done in supplier in tabular form
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-11538
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns html function
 */

function displayCCAndPOChanges (node, step, referenceID) {
	var newCC = new java.util.HashSet("");
	var newPO = new java.util.HashSet("");
	var changeInfo = "";
	changeInfo += "<html><table style=\"border-collapse:collapse;border:none;\">";
	changeInfo += "<tr><td style=\"padding: 8px;width: 233.75pt;border: 1pt solid rgb(0, 0, 0);background: rgb(0, 96, 128);\"><p style=\"font-family:'arial';color:rgb(255, 255, 255);font-size:17px;text-align:center;'\"><strong>Field Name</strong></p></td>";
	changeInfo += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(0, 96, 128);\"><p style=\"font-family:'arial';color:rgb(255, 255, 255);font-size:17px;text-align:center;'\"><strong>Previous Value</strong></p></td>";
	changeInfo += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(0, 96, 128);\"><p style=\"font-family:'arial';color:rgb(255, 255, 255);font-size:17px;text-align:center;'\"><strong>New Value</strong></p></td></tr>";
	var unApprovedObjects = node.getNonApprovedObjects();
	for (var i = unApprovedObjects.iterator(); i.hasNext(); ) {
		var unApprovedObject = i.next();
		if(unApprovedObject) {
			if (unApprovedObject instanceof com.stibo.core.domain.partobject.EntityReferencePartObject && "REF_SupplierToSupplierCompanyCode".equals(referenceID) && unApprovedObject.getReferenceType() == "REF_SupplierToSupplierCompanyCode") {
				newCC.add(unApprovedObject.getTargetID());
				changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Company Code" + "</p></td>";
				changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + " " + "</p></td>";
				changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + step.getEntityHome().getEntityByID(unApprovedObject.getTargetID()).getName() + "</p></td></tr>";
			}
			else if (unApprovedObject instanceof com.stibo.core.domain.partobject.EntityReferencePartObject && "REF_SupplierToSupplierPurchasingData".equals(referenceID) && unApprovedObject.getReferenceType() == "REF_SupplierToSupplierPurchasingData") {
				newPO.add(unApprovedObject.getTargetID());
				changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Purchasing Organisation" + "</p></td>";
				changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + " " + "</p></td>";
				changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + step.getEntityHome().getEntityByID(unApprovedObject.getTargetID()).getName() + "</p></td></tr>";
			}
		}
	}
	
	//case 2 : changes within a particular CC or PO...
	var refObjs = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID(referenceID));
	for(var i=0; i<refObjs.size(); i++) {
		var refObj = refObjs.get(i).getTarget();
		var refObjID = refObj.getID();
		var refObjTypeID = refObj.getObjectType().getID();
		var refTypeArr = []
		var mainArr = []
		var appArr = []
		if("SupplierCompanyCode".equals(refObjTypeID)) {
			var changedDCIDs = new java.util.HashSet("");
			var unApprovedCC = refObj.getNonApprovedObjects();
			for (var k = unApprovedCC.iterator(); k.hasNext(); ) {
				var unApprovedCCObject = k.next();
				if(unApprovedCCObject && unApprovedCCObject instanceof com.stibo.core.domain.partobject.ValuePartObject && !newCC.contains(refObjID)){
					var mainAttributeValue= getAttributeValue(refObj, unApprovedCCObject.getAttributeID());
					var approvedAttributeValue= getAttrValuesFromApprovedWS(refObj, step, unApprovedCCObject.getAttributeID());
					var approvedValue = approvedAttributeValue == null?"":approvedAttributeValue;
					var mainValue = mainAttributeValue == null?"":mainAttributeValue;
					if(mainAttributeValue!=approvedAttributeValue){
						changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + step.getAttributeHome().getAttributeByID(unApprovedCCObject.getAttributeID()).getName() + " (Company Code : " + step.getEntityHome().getEntityByID(refObjID).getName() + ")" + "</p></td>";
						changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + approvedValue + "</p></td>";
						changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + mainValue + "</p></td></tr>";
					}
				}
				else if (unApprovedCCObject && unApprovedCCObject instanceof com.stibo.core.domain.partobject.datacontainer.DataContainerPartObject && !"Not in Approved workspace".equals(refObj.getApprovalStatus())) {
					      changedDCIDs.add(unApprovedCCObject.getDataContainerTypeID());
				}
				else if (unApprovedCCObject && unApprovedCCObject instanceof com.stibo.core.domain.partobject.EntityReferencePartObject){
					var CCodeArray = ["REF_SupplierCompanyCodeToSupplier", "REF_DunningRecipient", "REF_SupplierCCToHeadOffice"]
					if (CCodeArray.includes(unApprovedCCObject.getReferenceType()+"")){
						var referenceType = unApprovedCCObject.getReferenceType();
						if(!refTypeArr.includes(referenceType) && !mainArr.includes(getReferenceTargetIDs(refObj, step, referenceType).sort(sortAlphaNum)) && !appArr.includes(getReferenceTargetIDsFromApprovedWS(refObj, step, referenceType).sort(sortAlphaNum))){
							var refName =  step.getReferenceTypeHome().getReferenceTypeByID(referenceType).getName();
							var approvedRefValue = getReferenceTargetIDsFromApprovedWS(refObj, step, referenceType);
							var mainRefValue = getReferenceTargetIDs(refObj, step, referenceType);
							if(mainRefValue.length>0 && approvedRefValue.length>0) {
								if (!isEqual(mainRefValue, approvedRefValue)){
									changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Supplier Company Code Data : "+ refName + " ("+step.getEntityHome().getEntityByID(refObjID).getName()+" )</p></td>";
									changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + getReferenceTargetNamesFromApprovedWS(refObj, step, referenceType) + "</p></td>";
									changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + getReferenceTargetNames(refObj, step, referenceType) + "</p></td></tr>";
								}
							}
							else if(mainRefValue.length == 0) {
								changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Supplier Company Code Data : " + refName + " ("+step.getEntityHome().getEntityByID(refObjID).getName()+" )</p></td>";
								changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + getReferenceTargetNamesFromApprovedWS(refObj, step, referenceType) + "</p></td>";
								changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "" + "</p></td></tr>";
							}
							else if(approvedRefValue.length == 0) {
								changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Supplier Company Code Data : " + refName + " ("+step.getEntityHome().getEntityByID(refObjID).getName()+" )</p></td>";
								changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "" + "</p></td>";
								changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + getReferenceTargetNames(refObj, step, referenceType) + "</p></td></tr>";
							}
						}
						refTypeArr.push(referenceType)
						mainArr.push(getReferenceTargetIDs(refObj, step, referenceType).sort(sortAlphaNum))
						appArr.push(getReferenceTargetIDsFromApprovedWS(refObj, step, referenceType).sort(sortAlphaNum))
					}
				}
			}
			var hashSetItr = changedDCIDs.iterator();
			while (hashSetItr.hasNext()) {
				var changedDCID = hashSetItr.next();
				if("ATC_WithHoldingTaxData".equals(changedDCID)){
					var mainDCRows = getDataContainerRowsInMainWorkspace(refObj, step, changedDCID);
							var approvedDCRows = getDataContainerRowsInApprovedWS(refObj, step, changedDCID);
							var dataContainers = refObj.getDataContainerByTypeID(changedDCID).getDataContainers();
							for (var i = approvedDCRows.iterator(); i.hasNext(); ) {
								var approvedDCRow = i.next();
								if(!mainDCRows.contains(approvedDCRow)) {
									changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "withholding tax " + " (Company Code : " + step.getEntityHome().getEntityByID(refObjID).getName() + ")" + "</p></td>";
									changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + approvedDCRow.getValue("AT_SuplWithholdingTaxType").getSimpleValue() + "</p></td>";
									changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "" + "</p></td></tr>";
								}
							}
							var itr = dataContainers.iterator();
							while (itr.hasNext()){
								var dcObject = itr.next().getDataContainerObject();
								if (!approvedDCRows.contains(dcObject)) {
									changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "withholding tax " + " (Company Code : " + step.getEntityHome().getEntityByID(refObjID).getName() + ")" + "</p></td>";
									changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "" + "</p></td>";
									changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + dcObject.getValue("AT_SuplWithholdingTaxType").getSimpleValue() + "</p></td></tr>";
								}
								else {
									var attributes = step.getAttributeGroupHome().getAttributeGroupByID("ATG_WithholdingTaxDCAttributes").getAllAttributes();
									var attributeItr = attributes.iterator();
									while(attributeItr.hasNext()) {
										attributeObject = attributeItr.next();
										attributeID = attributeObject.getID();
										attributeName = attributeObject.getName();
										var mainAttributeValue = dcObject.getValue(attributeID).getSimpleValue();
										var approvedAttributeValue = getAttributeValueFromDCRowInApprovedWS (refObj, step, changedDCID, attributeID, dcObject);
										var approvedValue = approvedAttributeValue == null?"":approvedAttributeValue;
										var mainValue = mainAttributeValue == null?"":mainAttributeValue;
										if (mainAttributeValue != approvedAttributeValue) {
											changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "withholding tax type : " + dcObject.getValue("AT_SuplWithholdingTaxType").getSimpleValue() +" : "+attributeName+ " (Company Code : " + step.getEntityHome().getEntityByID(refObjID).getName() + ")" + "</p></td>";
											changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + approvedValue + "</p></td>";
											changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + mainValue + "</p></td></tr>";
										}
									}
								}
							}
				}
				else if("ATC_AdditionalTexts".equals(changedDCID)) {
					var mainDCRows = getDataContainerRowsInMainWorkspace(refObj, step, changedDCID);
					var approvedDCRows = getDataContainerRowsInApprovedWS(refObj, step, changedDCID);
					var dataContainers = refObj.getDataContainerByTypeID(changedDCID).getDataContainers();
					for (var i = approvedDCRows.iterator(); i.hasNext(); ) {
						var approvedDCRow = i.next();
						if(!mainDCRows.contains(approvedDCRow)) {
							changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Additional Text" + "</p></td>";
							changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + approvedDCRow.getValue("AT_CC_TextDescription").getSimpleValue() + "</p></td>";
							changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "" + "</p></td></tr>";
						}
					}
					var itr = dataContainers.iterator();
					while (itr.hasNext()){
						var dcObject = itr.next().getDataContainerObject();
						var isNewEntry=!approvedDCRows.contains(dcObject);
						if(isNewEntry) {
							changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Additional Text" + "</p></td>";
							changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "" + "</p></td>";
							changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + dcObject.getValue("AT_CC_TextDescription").getSimpleValue() + "</p></td></tr>";
						}
						var attributes = step.getAttributeGroupHome().getAttributeGroupByID("ATG_CC_AdditionalTextsAttributes").getAllAttributes();
						var attributeItr = attributes.iterator();
						while(attributeItr.hasNext()) {
							attributeObject = attributeItr.next();
							attributeID = attributeObject.getID();
							attributeName = attributeObject.getName();
							var mainAttributeValue = dcObject.getValue(attributeID).getSimpleValue();
							var approvedAttributeValue = getAttributeValueFromDCRowInApprovedWS (refObj, step, changedDCID, attributeID, dcObject);
							var approvedValue = approvedAttributeValue == null?"":approvedAttributeValue;
							var mainValue = mainAttributeValue == null?"":mainAttributeValue;
							if (mainAttributeValue != approvedAttributeValue && !("AT_CC_TextDescription".equals(attributeID) && isNewEntry)) {
								changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + attributeName + " (Additional Text : " + dcObject.getValue("AT_CC_TextDescription").getSimpleValue() + ")" + "</p></td>";
								changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + approvedValue + "</p></td>";
								changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + mainValue + "</p></td></tr>";
							}
						}
					}
				}
			}
			
		}
		else if("SupplierPurchasingData".equals(refObjTypeID)) {
			var changedDCIDs = new java.util.HashSet("");
			var unApprovedPO = refObj.getNonApprovedObjects();
			for (var k = unApprovedPO.iterator(); k.hasNext(); ) {
				var unApprovedPOObject = k.next();
				if(unApprovedPOObject && unApprovedPOObject instanceof com.stibo.core.domain.partobject.ValuePartObject && !newPO.contains(refObjID)) {
					var mainAttributeValue= getAttributeValue(refObj, unApprovedPOObject.getAttributeID());
					var approvedAttributeValue= getAttrValuesFromApprovedWS(refObj, step, unApprovedPOObject.getAttributeID());
					var approvedValue = approvedAttributeValue == null?"":approvedAttributeValue;
					var mainValue = mainAttributeValue == null?"":mainAttributeValue;
					if(mainAttributeValue!=approvedAttributeValue){
						if (unApprovedPOObject.getAttributeID() == "AT_AdditionalSupplierID"){
							changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Manufacturing Plant" + " (Purchasing Org : " + step.getEntityHome().getEntityByID(refObjID).getName() + ")" + "</p></td>";
							changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + approvedValue + "</p></td>";
							changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + mainValue + "</p></td></tr>";
						}
						else{
							changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + step.getAttributeHome().getAttributeByID(unApprovedPOObject.getAttributeID()).getName() + " (Purchasing Org : " + step.getEntityHome().getEntityByID(refObjID).getName() + ")" + "</p></td>";
							changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + approvedValue + "</p></td>";
							changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + mainValue + "</p></td></tr>";
						}
					}
				}
				else if (unApprovedPOObject && unApprovedPOObject instanceof com.stibo.core.domain.partobject.datacontainer.DataContainerPartObject && !"Not in Approved workspace".equals(refObj.getApprovalStatus())) {
				     changedDCIDs.add(unApprovedPOObject.getDataContainerTypeID());    
				}
				else if (unApprovedPOObject && unApprovedPOObject instanceof com.stibo.core.domain.partobject.ValuePartObject && unApprovedPOObject.getAttributeID() == "AT_AdditionalSupplierID"){
					var mainAttributeValue= getAttributeValue(refObj, unApprovedPOObject.getAttributeID());
					var approvedAttributeValue= getAttrValuesFromApprovedWS(refObj, step, unApprovedPOObject.getAttributeID());
					var approvedValue = approvedAttributeValue == null?"":approvedAttributeValue;
					var mainValue = mainAttributeValue == null?"":mainAttributeValue;
					if(mainAttributeValue!=approvedAttributeValue){
						changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Manufacturing Plant" + " (Purchasing Org : " + step.getEntityHome().getEntityByID(refObjID).getName() + ")" + "</p></td>";
						changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + approvedValue + "</p></td>";
						changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + mainValue + "</p></td></tr>";
					}
				}
			}
			var hashSetItr = changedDCIDs.iterator();
			while (hashSetItr.hasNext()) {
				var changedDCID = hashSetItr.next();
				if("ATC_AdditionalTexts".equals(changedDCID)) {
					var mainDCRows = getDataContainerRowsInMainWorkspace(refObj, step, changedDCID);
					var approvedDCRows = getDataContainerRowsInApprovedWS(refObj, step, changedDCID);
					var dataContainers = refObj.getDataContainerByTypeID(changedDCID).getDataContainers();
					for (var i = approvedDCRows.iterator(); i.hasNext(); ) {
						var approvedDCRow = i.next();
						if(!mainDCRows.contains(approvedDCRow)) {
							changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Additional Text" + "</p></td>";
							changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + approvedDCRow.getValue("AT_PO_TextDescription").getSimpleValue() + "</p></td>";
							changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "" + "</p></td></tr>";
						}
					}
					var itr = dataContainers.iterator();
					while (itr.hasNext()){
						var dcObject = itr.next().getDataContainerObject();
						var isNewEntry=!approvedDCRows.contains(dcObject);
						if(isNewEntry) {
							changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Additional Text" + "</p></td>";
							changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "" + "</p></td>";
							changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + dcObject.getValue("AT_PO_TextDescription").getSimpleValue() + "</p></td></tr>";
						}
						var attributes = step.getAttributeGroupHome().getAttributeGroupByID("ATG_PO_AdditionalTextsAttributes").getAllAttributes();
						var attributeItr = attributes.iterator();
						while(attributeItr.hasNext()) {
							attributeObject = attributeItr.next();
							attributeID = attributeObject.getID();
							attributeName = attributeObject.getName();
							var mainAttributeValue = dcObject.getValue(attributeID).getSimpleValue();
							var approvedAttributeValue = getAttributeValueFromDCRowInApprovedWS (refObj, step, changedDCID, attributeID, dcObject);
							var approvedValue = approvedAttributeValue == null?"":approvedAttributeValue;
							var mainValue = mainAttributeValue == null?"":mainAttributeValue;
							if (mainAttributeValue != approvedAttributeValue && !("AT_PO_TextDescription".equals(attributeID) && isNewEntry)) {
								changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + attributeName + " (Additional Text : " + dcObject.getValue("AT_PO_TextDescription").getSimpleValue() + ")" + "</p></td>";
								changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + approvedValue + "</p></td>";
								changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + mainValue + "</p></td></tr>";
							}
						}
					}
				}
			}
		}
	}
	return changeInfo + "</table></html>";
}

function displayBankDataChanges (node, step) {
	//checking if any bank account is removed
	var changeInfo = "";
	var newBankAccount = new java.util.HashSet("");
	var mainWSBankAccounts = new java.util.HashSet("");
	var approvedWSBankAccounts = new java.util.HashSet("");
	var mainWSBankReferences = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToBankAccount"));
	for(var i=0; i<mainWSBankReferences.size(); i++) {
		var bankObj = mainWSBankReferences.get(i).getTarget();
		mainWSBankAccounts.add(bankObj.getID());
	}
	var approvedWSBankReferences = step.executeInWorkspace("Approved", function(step) {
											var emptyArrayList = new java.util.ArrayList();
											var approvedObj = step.getObjectFromOtherManager(node);
											if(approvedObj) {
												return approvedObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToBankAccount"));
											}
											return emptyArrayList;
							});
	for(var i=0; i<approvedWSBankReferences.size(); i++) {
		var approvedBankObj = approvedWSBankReferences.get(i).getTarget();
		approvedWSBankAccounts.add(approvedBankObj.getID());
	}
	changeInfo += "<html><table style=\"border-collapse:collapse;border:none;\">";
	changeInfo += "<tr><td style=\"padding: 8px;width: 233.75pt;border: 1pt solid rgb(0, 0, 0);background: rgb(0, 96, 128);\"><p style=\"font-family:'arial';color:rgb(255, 255, 255);font-size:17px;text-align:center;'\"><strong>Field Name</strong></p></td>";
	changeInfo += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(0, 96, 128);\"><p style=\"font-family:'arial';color:rgb(255, 255, 255);font-size:17px;text-align:center;'\"><strong>Previous Value</strong></p></td>";
	changeInfo += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(0, 96, 128);\"><p style=\"font-family:'arial';color:rgb(255, 255, 255);font-size:17px;text-align:center;'\"><strong>New Value</strong></p></td></tr>";
	for (var i = approvedWSBankAccounts.iterator(); i.hasNext(); ) {
		var approvedWSBankAccount = i.next();
		if(!mainWSBankAccounts.contains(approvedWSBankAccount)) {
			approvedWSBankAccountObj = step.getEntityHome().getEntityByID(approvedWSBankAccount);
			approvedWSBankAccountNumber = approvedWSBankAccountObj.getValue("AT_NumberOfBankAccount").getSimpleValue();
			changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\"> Bank Account </p></td>";
			changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + approvedWSBankAccountNumber + "</p></td>";
			changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + " " + "</p></td></tr>";
		}
	}
	//checking if a new bank account is added
	for (var i = mainWSBankAccounts.iterator(); i.hasNext(); ) {
		var mainWSBankAccount = i.next();
		if(!approvedWSBankAccounts.contains(mainWSBankAccount)) {
			newBankAccount.add(mainWSBankAccount);
			mainWSBankAccountObj = step.getEntityHome().getEntityByID(mainWSBankAccount);
			mainWSBankAccountNumber = mainWSBankAccountObj.getValue("AT_NumberOfBankAccount").getSimpleValue();
			changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\"> Bank Account</p></td>";
			changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + " " + "</p></td>";
			changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + mainWSBankAccountNumber + "</p></td></tr>";
		}
	}
	//checking for changes in a particular bank account
	var bankAccounts = new java.util.HashSet("");
	var numberOfBankAccounts = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToBankAccount")).size();
	for(var i=0; i<numberOfBankAccounts; i++) {
		bankAccounts.add(node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToBankAccount")).get(i).getTarget().getID());
	}
	var itr = bankAccounts.iterator();
	while (itr.hasNext()) {
		bankAccountID = itr.next();
		var bankAccountObj = step.getEntityHome().getEntityByID(bankAccountID);
		var unApprovedObjects = bankAccountObj.getNonApprovedObjects();
		for (var i = unApprovedObjects.iterator(); i.hasNext(); ) {
			var unApprovedBankObject = i.next();
			if(unApprovedBankObject && unApprovedBankObject instanceof com.stibo.core.domain.partobject.ValuePartObject && !newBankAccount.contains(bankAccountID)){
				changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + step.getAttributeHome().getAttributeByID(unApprovedBankObject.getAttributeID()).getName() + " (Bank Account : " + step.getEntityHome().getEntityByID(bankAccountID).getID() + ")" + "</p></td>";
				changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + getAttrValuesFromApprovedWS(bankAccountObj, step, unApprovedBankObject.getAttributeID()) + "</p></td>";
				changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + getAttributeValue(bankAccountObj, unApprovedBankObject.getAttributeID()) + "</p></td></tr>";
			}
		}
	}
	return changeInfo + "</table></html>";
}


function displaySupplierGeneralDataChanges (node, step) {
	var changeInfo = "";
	changeInfo += "<html><table style=\"border-collapse:collapse;border:none;\">";
	changeInfo += "<tr><td style=\"padding: 8px;width: 233.75pt;border: 1pt solid rgb(0, 0, 0);background: rgb(0, 96, 128);\"><p style=\"font-family:'arial';color:rgb(255, 255, 255);font-size:17px;text-align:center;'\"><strong>Field Name</strong></p></td>";
	changeInfo += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(0, 96, 128);\"><p style=\"font-family:'arial';color:rgb(255, 255, 255);font-size:17px;text-align:center;'\"><strong>Previous Value</strong></p></td>";
	changeInfo += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(0, 96, 128);\"><p style=\"font-family:'arial';color:rgb(255, 255, 255);font-size:17px;text-align:center;'\"><strong>New Value</strong></p></td></tr>";
	//address changes
	var addressReference = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToAddress"));
	if(!addressReference.isEmpty()) {
		var addressID = addressReference.get(0).getTarget().getID();
		var addressObj = step.getEntityHome().getEntityByID(addressID);
		var unApprovedAddressObjects = addressObj.getNonApprovedObjects();
		for (var i = unApprovedAddressObjects.iterator(); i.hasNext(); ) {
			var unApprovedAddressObject = i.next();
			if(unApprovedAddressObject && unApprovedAddressObject instanceof com.stibo.core.domain.partobject.ValuePartObject){
				var mainAttributeValue =getAttributeValue(addressObj, unApprovedAddressObject.getAttributeID());
				var approvedAttributeValue=getAttrValuesFromApprovedWS(addressObj, step, unApprovedAddressObject.getAttributeID());
				var approvedValue = approvedAttributeValue == null?"":approvedAttributeValue;
				var mainValue = mainAttributeValue == null?"":mainAttributeValue;
				if(mainAttributeValue!=approvedAttributeValue){	
					changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Supplier Address : " + step.getAttributeHome().getAttributeByID(unApprovedAddressObject.getAttributeID()).getName() + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + approvedValue + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + mainValue + "</p></td></tr>";
				}
			}
		}
	}
	//supplier attribute and references changes
	var unApprovedSupplierObjects = node.getNonApprovedObjects();
	var changedDCIDs = new java.util.HashSet("");
	var refTypeArr = []
	var mainArr = []
	var appArr = []
	for (var i = unApprovedSupplierObjects.iterator(); i.hasNext(); ) {
		var unApprovedSupplierObject = i.next();
		if(unApprovedSupplierObject && unApprovedSupplierObject instanceof com.stibo.core.domain.partobject.ValuePartObject){
			var generalAttributeID = unApprovedSupplierObject.getAttributeID();
			var mainAttributeValue = getAttributeValue(node, unApprovedSupplierObject.getAttributeID());
			var approvedAttributeValue = getAttrValuesFromApprovedWS(node, step, unApprovedSupplierObject.getAttributeID());
			var approvedValue = approvedAttributeValue == null?"":approvedAttributeValue;
			var mainValue = mainAttributeValue == null?"":mainAttributeValue;
			if(mainAttributeValue!=approvedAttributeValue && !"AT_SUPL_ChangeRequestNumber".equals(generalAttributeID) && !"AT_SUPL_CreationRequestNo".equals(generalAttributeID) && !"AT_VatNumber".equals(generalAttributeID) && !"AT_NIP".equals(generalAttributeID)) {
				changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Supplier General Data : " + step.getAttributeHome().getAttributeByID(generalAttributeID).getName() + "</p></td>";
				changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + approvedValue + "</p></td>";
				changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + mainValue + "</p></td></tr>";
			}
		}
		else if(unApprovedSupplierObject && unApprovedSupplierObject instanceof com.stibo.core.domain.partobject.datacontainer.DataContainerPartObject) {
			changedDCIDs.add(unApprovedSupplierObject.getDataContainerTypeID());
		}
		else if(unApprovedSupplierObject && unApprovedSupplierObject instanceof com.stibo.core.domain.partobject.EntityReferencePartObject && !("REF_SupplierToSupplierCompanyCode".equals(unApprovedSupplierObject.getReferenceType()) || "REF_SupplierToSupplierPurchasingData".equals(unApprovedSupplierObject.getReferenceType()) || "REF_SupplierToBankAccount".equals(unApprovedSupplierObject.getReferenceType()))) {
			var referenceType = unApprovedSupplierObject.getReferenceType();
			if(!refTypeArr.includes(referenceType) && !mainArr.includes(getReferenceTargetIDs(node, step, referenceType).sort(sortAlphaNum)) && !appArr.includes(getReferenceTargetIDsFromApprovedWS(node, step, referenceType).sort(sortAlphaNum))){
				var refName =  step.getReferenceTypeHome().getReferenceTypeByID(referenceType).getName();
				var approvedRefValue = getReferenceTargetIDsFromApprovedWS(node, step, referenceType);
				var mainRefValue = getReferenceTargetIDs(node, step, referenceType);
				if(mainRefValue.length>0 && approvedRefValue.length>0) {
					if (!isEqual(mainRefValue, approvedRefValue)){
						changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Supplier General Data : " + refName + "</p></td>";
						changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + getReferenceTargetNamesFromApprovedWS(node, step, referenceType) + "</p></td>";
						changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + getReferenceTargetNames(node, step, referenceType) + "</p></td></tr>";
					}
				}
				else if(mainRefValue.length == 0) {
					changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Supplier General Data : " + refName + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + getReferenceTargetNamesFromApprovedWS(node, step, referenceType) + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "" + "</p></td></tr>";
				}
				else if(approvedRefValue.length == 0) {
					changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Supplier General Data : " + refName + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "" + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + getReferenceTargetNames(node, step, referenceType) + "</p></td></tr>";
				}
			}
			refTypeArr.push(referenceType)
			mainArr.push(getReferenceTargetIDs(node, step, referenceType).sort(sortAlphaNum))
			appArr.push(getReferenceTargetIDsFromApprovedWS(node, step, referenceType).sort(sortAlphaNum))
		}
	}
	var hashSetItr = changedDCIDs.iterator();
	while (hashSetItr.hasNext()) {
		var changedDCID = hashSetItr.next();
		if("ATC_FaxNumbers".equals(changedDCID)) {
			var mainDCRows = getDataContainerRowsInMainWorkspace(node, step, changedDCID);
			var approvedDCRows = getDataContainerRowsInApprovedWS(node, step, changedDCID);
			var dataContainers = node.getDataContainerByTypeID(changedDCID).getDataContainers();
			for (var i = approvedDCRows.iterator(); i.hasNext(); ) {
				var approvedDCRow = i.next();
				if(!mainDCRows.contains(approvedDCRow)) {
					changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Fax Number" + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + approvedDCRow.getValue("AT_FaxNumber").getSimpleValue() + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "" + "</p></td></tr>";
				}
			}
			var itr = dataContainers.iterator();
			while (itr.hasNext()){
				var dcObject = itr.next().getDataContainerObject();
				var isNewEntry=!approvedDCRows.contains(dcObject);
				if(isNewEntry) {
					changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Fax Number" + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "" + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + dcObject.getValue("AT_FaxNumber").getSimpleValue() + "</p></td></tr>";
				}
				var attributes = step.getAttributeGroupHome().getAttributeGroupByID("ATG_SUPL_CommunicationInformation").getAllAttributes();
				var attributeItr = attributes.iterator();
				while(attributeItr.hasNext()) {
					attributeObject = attributeItr.next();
					attributeID = attributeObject.getID();
					attributeName = attributeObject.getName();
					var mainAttributeValue = dcObject.getValue(attributeID).getSimpleValue();
					var approvedAttributeValue = getAttributeValueFromDCRowInApprovedWS (node, step, changedDCID, attributeID, dcObject);
					var approvedValue = approvedAttributeValue == null?"":approvedAttributeValue;
					var mainValue = mainAttributeValue == null?"":mainAttributeValue;
					if (mainAttributeValue != approvedAttributeValue && !("AT_FaxNumber".equals(attributeID) && isNewEntry)) {
						changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + attributeName + " (Fax number : " + dcObject.getValue("AT_FaxNumber").getSimpleValue() + ")" + "</p></td>";
						changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + approvedValue + "</p></td>";
						changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + mainValue + "</p></td></tr>";
					}
				}
			}
		}
		else if("ATC_EmailAddress".equals(changedDCID)) {
			var mainDCRows = getDataContainerRowsInMainWorkspace(node, step, changedDCID);
			var approvedDCRows = getDataContainerRowsInApprovedWS(node, step, changedDCID);
			var dataContainers = node.getDataContainerByTypeID(changedDCID).getDataContainers();
			for (var i = approvedDCRows.iterator(); i.hasNext(); ) {
				var approvedDCRow = i.next();
				if(!mainDCRows.contains(approvedDCRow)) {
					changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Email Address" + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + approvedDCRow.getValue("AT_EmailAddress").getSimpleValue() + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "" + "</p></td></tr>";
				}
			}
			var itr = dataContainers.iterator();
			while (itr.hasNext()){
				var dcObject = itr.next().getDataContainerObject();
				var isNewEntry=!approvedDCRows.contains(dcObject);
				if(isNewEntry) {
					changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Email Address" + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "" + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + dcObject.getValue("AT_EmailAddress").getSimpleValue() + "</p></td></tr>";
				}
				var attributes = step.getAttributeGroupHome().getAttributeGroupByID("ATG_TECH_EmailAddressesAttributes").getAllAttributes();
				var attributeItr = attributes.iterator();
				while(attributeItr.hasNext()) {
					attributeObject = attributeItr.next();
					attributeID = attributeObject.getID();
					attributeName = attributeObject.getName();
					var mainAttributeValue = dcObject.getValue(attributeID).getSimpleValue();
					var approvedAttributeValue = getAttributeValueFromDCRowInApprovedWS (node, step, changedDCID, attributeID, dcObject);
					var approvedValue = approvedAttributeValue == null?"":approvedAttributeValue;
					var mainValue = mainAttributeValue == null?"":mainAttributeValue;
					if (mainAttributeValue != approvedAttributeValue && !("AT_EmailAddress".equals(attributeID) && isNewEntry)) {
						changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + attributeName + " (Email Address : " + dcObject.getValue("AT_EmailAddress").getSimpleValue() + ")" + "</p></td>";
						changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + approvedValue + "</p></td>";
						changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + mainValue + "</p></td></tr>";
					}
				}
			}
		}
		else if("ATC_InternetAddress".equals(changedDCID)) {
			var mainDCRows = getDataContainerRowsInMainWorkspace(node, step, changedDCID);
			var approvedDCRows = getDataContainerRowsInApprovedWS(node, step, changedDCID);
			var dataContainers = node.getDataContainerByTypeID(changedDCID).getDataContainers();
			for (var i = approvedDCRows.iterator(); i.hasNext(); ) {
				var approvedDCRow = i.next();
				if(!mainDCRows.contains(approvedDCRow)) {
					changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Internet Address" + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + approvedDCRow.getValue("AT_InternetAddress").getSimpleValue() + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "" + "</p></td></tr>";
				}
			}
			var itr = dataContainers.iterator();
			while (itr.hasNext()){
				var dcObject = itr.next().getDataContainerObject();
				var isNewEntry=!approvedDCRows.contains(dcObject);
				if(isNewEntry) {
					changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Internet Address" + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "" + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + dcObject.getValue("AT_InternetAddress").getSimpleValue() + "</p></td></tr>";
				}
				var attributes = step.getAttributeGroupHome().getAttributeGroupByID("ATG_TECH_InternetAddressesAttributes").getAllAttributes();
				var attributeItr = attributes.iterator();
				while(attributeItr.hasNext()) {
					attributeObject = attributeItr.next();
					attributeID = attributeObject.getID();
					attributeName = attributeObject.getName();
					var mainAttributeValue = dcObject.getValue(attributeID).getSimpleValue();
					var approvedAttributeValue = getAttributeValueFromDCRowInApprovedWS (node, step, changedDCID, attributeID, dcObject);
					var approvedValue = approvedAttributeValue == null?"":approvedAttributeValue;
					var mainValue = mainAttributeValue == null?"":mainAttributeValue;
					if (mainAttributeValue != approvedAttributeValue && !("AT_InternetAddress".equals(attributeID) && isNewEntry)) {
						changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + attributeName + " (Internet Address : " + dcObject.getValue("AT_InternetAddress").getSimpleValue() + ")" + "</p></td>";
						changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + approvedValue + "</p></td>";
						changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + mainValue + "</p></td></tr>";
					}
				}
			}
		}
		else if("ATC_TelephoneNumbers".equals(changedDCID)) {
			var mainDCRows = getDataContainerRowsInMainWorkspace(node, step, changedDCID);
			var approvedDCRows = getDataContainerRowsInApprovedWS(node, step, changedDCID);
			var dataContainers = node.getDataContainerByTypeID(changedDCID).getDataContainers();
			for (var i = approvedDCRows.iterator(); i.hasNext(); ) {
				var approvedDCRow = i.next();
				if(!mainDCRows.contains(approvedDCRow)) {
					changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Telephone Number" + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + approvedDCRow.getValue("AT_TelephoneNumber").getSimpleValue() + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "" + "</p></td></tr>";
				}
			}
			var itr = dataContainers.iterator();
			while (itr.hasNext()){
				var dcObject = itr.next().getDataContainerObject();
				var isNewEntry=!approvedDCRows.contains(dcObject);
				if(isNewEntry) {
					changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Telephone Number" + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "" + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + dcObject.getValue("AT_TelephoneNumber").getSimpleValue() + "</p></td></tr>";
				}
				var attributes = step.getAttributeGroupHome().getAttributeGroupByID("ATG_SUPL_CommunicationInformation").getAllAttributes();
				var attributeItr = attributes.iterator();
				while(attributeItr.hasNext()) {
					attributeObject = attributeItr.next();
					attributeID = attributeObject.getID();
					attributeName = attributeObject.getName();
					var mainAttributeValue = dcObject.getValue(attributeID).getSimpleValue();
					var approvedAttributeValue = getAttributeValueFromDCRowInApprovedWS (node, step, changedDCID, attributeID, dcObject);
					var approvedValue = approvedAttributeValue == null?"":approvedAttributeValue;
					var mainValue = mainAttributeValue == null?"":mainAttributeValue;
					if (mainAttributeValue != approvedAttributeValue && !("AT_TelephoneNumber".equals(attributeID) && isNewEntry)) {
						changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + attributeName + " (Telephone Number : " + dcObject.getValue("AT_TelephoneNumber").getSimpleValue() + ")" + "</p></td>";
						changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + approvedValue + "</p></td>";
						changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + mainValue + "</p></td></tr>";
					}
				}
			}
		}
		else if("ATC_MobileNumbers".equals(changedDCID)) {
			var mainDCRows = getDataContainerRowsInMainWorkspace(node, step, changedDCID);
			var approvedDCRows = getDataContainerRowsInApprovedWS(node, step, changedDCID);
			var dataContainers = node.getDataContainerByTypeID(changedDCID).getDataContainers();
			for (var i = approvedDCRows.iterator(); i.hasNext(); ) {
				var approvedDCRow = i.next();
				if(!mainDCRows.contains(approvedDCRow)) {
					changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Mobile Number" + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + approvedDCRow.getValue("AT_MobileNumber").getSimpleValue() + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "" + "</p></td></tr>";
				}
			}
			var itr = dataContainers.iterator();
			while (itr.hasNext()){
				var dcObject = itr.next().getDataContainerObject();
				var isNewEntry=!approvedDCRows.contains(dcObject);
				if(isNewEntry) {
					changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Mobile Number" + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "" + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + dcObject.getValue("AT_MobileNumber").getSimpleValue() + "</p></td></tr>";
				}
				var attributes = step.getAttributeGroupHome().getAttributeGroupByID("ATG_SUPL_CommunicationInformation").getAllAttributes();
				var attributeItr = attributes.iterator();
				while(attributeItr.hasNext()) {
					attributeObject = attributeItr.next();
					attributeID = attributeObject.getID();
					attributeName = attributeObject.getName();
					var mainAttributeValue = dcObject.getValue(attributeID).getSimpleValue();
					var approvedAttributeValue = getAttributeValueFromDCRowInApprovedWS (node, step, changedDCID, attributeID, dcObject);
					var approvedValue = approvedAttributeValue == null?"":approvedAttributeValue;
					var mainValue = mainAttributeValue == null?"":mainAttributeValue;
					if (mainAttributeValue != approvedAttributeValue && !("AT_MobileNumber".equals(attributeID) && isNewEntry)) {
						changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + attributeName + " (Mobile Number : " + dcObject.getValue("AT_MobileNumber").getSimpleValue() + ")" + "</p></td>";
						changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + approvedValue + "</p></td>";
						changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + mainValue + "</p></td></tr>";
					}
				}
			}
		}
		// Below code we will remove - TAX_DC_REMOVAL
		/*else if("ATC_TaxInformation".equals(changedDCID)) {
			var mainDCRows = getDataContainerRowsInMainWorkspace(node, step, changedDCID);
			var approvedDCRows = getDataContainerRowsInApprovedWS(node, step, changedDCID);
			var dataContainers = node.getDataContainerByTypeID(changedDCID).getDataContainers();
			for (var i = approvedDCRows.iterator(); i.hasNext(); ) {
				var approvedDCRow = i.next();
				if(!mainDCRows.contains(approvedDCRow)) {
					changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Tax Number" + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + approvedDCRow.getValue("AT_TaxNumber").getSimpleValue() + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "" + "</p></td></tr>";
				}
			}
			var itr = dataContainers.iterator();
			while (itr.hasNext()){
				var dcObject = itr.next().getDataContainerObject();
				var isNewEntry=!approvedDCRows.contains(dcObject);
				if(isNewEntry) {
					changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Tax Number" + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">"+" "+" </p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + dcObject.getValue("AT_TaxNumber").getSimpleValue() + "</p></td></tr>";
				}
				var attributes = step.getAttributeGroupHome().getAttributeGroupByID("ATG_TECH_TaxInformationAttributes").getAllAttributes();
				var attributeItr = attributes.iterator();
				while(attributeItr.hasNext()) {
					attributeObject = attributeItr.next();
					attributeID = attributeObject.getID();
					attributeName = attributeObject.getName();
					var mainAttributeValue = dcObject.getValue(attributeID).getSimpleValue();
					var approvedAttributeValue =getAttributeValueFromDCRowInApprovedWS (node, step, changedDCID, attributeID, dcObject);
					var approvedValue=approvedAttributeValue == null?"":approvedAttributeValue;
					var mainValue = mainAttributeValue == null?"":mainAttributeValue;
					if (mainAttributeValue != approvedAttributeValue && !("AT_TaxNumber".equals(attributeID) && isNewEntry)) {
						changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + attributeName + " (Tax Number : " + dcObject.getValue("AT_TaxNumber").getSimpleValue() + ")" + "</p></td>";
						changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" +approvedValue+"</p></td>";
						changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + mainValue + "</p></td></tr>";
					}
				}
				
			}
		}*/
		
		else if("ATC_AdditionalTexts".equals(changedDCID)) {
			var mainDCRows = getDataContainerRowsInMainWorkspace(node, step, changedDCID);
			var approvedDCRows = getDataContainerRowsInApprovedWS(node, step, changedDCID);
			var dataContainers = node.getDataContainerByTypeID(changedDCID).getDataContainers();
			for (var i = approvedDCRows.iterator(); i.hasNext(); ) {
				var approvedDCRow = i.next();
				if(!mainDCRows.contains(approvedDCRow)) {
					changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Text ID / Description" + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + approvedDCRow.getValue("AT_SUPL_TextDescription").getSimpleValue() + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "" + "</p></td></tr>";
				}
			}
			var itr = dataContainers.iterator();
			while (itr.hasNext()){
				var dcObject = itr.next().getDataContainerObject();
				var isNewEntry=!approvedDCRows.contains(dcObject);
				if(isNewEntry) {
					changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "Text ID / Description" + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + "" + "</p></td>";
					changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + dcObject.getValue("AT_SUPL_TextDescription").getSimpleValue() + "</p></td></tr>";
				}
				var attributes = step.getAttributeGroupHome().getAttributeGroupByID("ATG_SUPL_AdditionalTextsAttributes").getAllAttributes();
				var attributeItr = attributes.iterator();
				while(attributeItr.hasNext()) {
					attributeObject = attributeItr.next();
					attributeID = attributeObject.getID();
					attributeName = attributeObject.getName();
					var mainAttributeValue = dcObject.getValue(attributeID).getSimpleValue();
					var approvedAttributeValue = getAttributeValueFromDCRowInApprovedWS (node, step, changedDCID, attributeID, dcObject);
					var approvedValue = approvedAttributeValue == null?"":approvedAttributeValue;
					var mainValue = mainAttributeValue == null?"":mainAttributeValue;
					if (mainAttributeValue != approvedAttributeValue && !("AT_SUPL_TextDescription".equals(attributeID) && isNewEntry)) {
						changeInfo += "<tr><td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(179, 237, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + attributeName + " (Text ID / Description : " + dcObject.getValue("AT_SUPL_TextDescription").getSimpleValue() + ")" + "</p></td>";
						changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + approvedValue + "</p></td>";
						changeInfo += "<td style=\"padding: 8px;border: 1pt solid rgb(0, 0, 0);background: rgb(255, 255, 255);\"><p style=\"font-family:'arial';font-size:15px;text-align:center;'\">" + mainValue + "</p></td></tr>";
					}
				}
			}
		}	
		
	}
	return changeInfo;
}

/**
 * @desc function to fetch all the changes in supplier
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-7651/7652
 * @author Bharat Gandhi <Bharat.Gandhi-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object (supplier)
 * @returns information about whats changed in the supplier
 */

function displayWhatsChangedInSupplier(node, step) {
	var changeInfo = "";
	var bankChanges = whatsChangedInBankData(node, step);
	var generalDataChanges = whatsChangedInSupplierGeneralData (node, step);
	var companyCodeChanges = whatsChangedInSupplierChildren(node, step, "REF_SupplierToSupplierCompanyCode");
	var purchOrgChanges = whatsChangedInSupplierChildren(node, step, "REF_SupplierToSupplierPurchasingData");
	if(bankChanges) {
		changeInfo += bankChanges;
	}
	if(generalDataChanges) {
		changeInfo += generalDataChanges;
	}
	if(companyCodeChanges) {
		changeInfo += companyCodeChanges;
	}
	if(purchOrgChanges) {
		changeInfo += purchOrgChanges;
	}
	return changeInfo;
}

/**
 * @desc approve request and supplier 
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-6801
 * @author Bharat Gandhi <Bharat.Gandhi-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns 
 */

function approveNodeAndReferences(node, step) {
	var references = node.getReferences().asList();
	for(var i =0;i<references.size();i++) {
		var referenceTarget = references.get(i).getTarget();
		var objectTypeID = referenceTarget.getObjectType().getID();
		if(objectTypeID != "D&B_Type")
		{
			if(!"pdfFile".equals(objectTypeID)) {
				var refTargetParent = referenceTarget.getParent();
				if("Not in Approved workspace".equals(refTargetParent.getApprovalStatus())) {
					refTargetParent.approve();
				}	
			}
		referenceTarget.approve();
		setMajorRevision(referenceTarget, step, "Supplier Marker");
		}
	}
	node.approve();
	setMajorRevision(node, step, "Supplier Marker");
}

function approveRequestAndSupplier(node, step) {
	var supplierObj = getSupplierFromRequest(node, step);
	supplierObj.getValue("AT_IsSupplierApproved").setLOVValueByID("Y");
	supplierObj.getValue("AT_AuthorizationGroup").setLOVValueByID("STEP");
	var currentDateTime = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date());
	node.getValue("AT_RequestApprovalDate").setSimpleValue(currentDateTime);
	supplierObj.approve(); //This is to approve unapproved links
	supplierObj.getValue("AT_SupplierLastApprovedOn").setSimpleValue(currentDateTime);
	approveNodeAndReferences(node, step);	
	approveNodeAndReferences(supplierObj, step);	
	node.approve();
}

function approveAdditionalSuppliers(node, step) {
	var additionalSupplierReference = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_RequestToAdditionalSuppliers"));
	var currentDateTime = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date());
	for(var i=0; i<additionalSupplierReference.size(); i++) {
		var additionalSupplierObj = additionalSupplierReference.get(i).getTarget();
		additionalSupplierObj.getValue("AT_AuthorizationGroup").setLOVValueByID("STEP");
		additionalSupplierObj.getValue("AT_IsSupplierApproved").setLOVValueByID("Y");
		additionalSupplierObj.getValue("AT_SupplierLastApprovedOn").setSimpleValue(currentDateTime);
		approveNodeAndReferences(additionalSupplierObj, step);
	}
}

/**
 * @desc remove reference from supplier in Creation WF
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-7567
 * @author Bharat Gandhi <Bharat.Gandhi-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns 
 */

function removeReferenceInCreationWF (node, step) {
	var references = node.getReferences().asList();
	for(var i=0;i<references.size();i++) {
		var referenceTarget = references.get(i).getTarget();
		if("Not in Approved workspace".equals(referenceTarget.getApprovalStatus())) {
			references.get(i).delete();
			var targetReferencedBy = referenceTarget.getReferencedBy();
			if(targetReferencedBy.isEmpty()) {
				var targetReferences = referenceTarget.getReferences().asList();
				for(var j=0; j<targetReferences.size(); j++) {
					targetReferences.get(j).delete();
				}
				referenceTarget.delete();
			}
		}
		else {
			references.get(i).delete();
		}
	}
}

/**
 * @desc remove reference from supplier in Change WF
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-7567
 * @author Bharat Gandhi <Bharat.Gandhi-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns 
 */

function removeReferenceInChangeWF (node, step) {
	var references = node.getReferences().asList();
	for(var i=0;i<references.size();i++) {
		var referenceTarget = references.get(i).getTarget();
		if("Not in Approved workspace".equals(referenceTarget.getApprovalStatus())) {
			references.get(i).delete();
			var targetReferencedBy = referenceTarget.getReferencedBy();
			if(targetReferencedBy.isEmpty()) {
				var targetReferences = referenceTarget.getReferences().asList();
				for(var j=0; j<targetReferences.size(); j++) {
					targetReferences.get(j).delete();
				}
				referenceTarget.delete();
			}
		}
		else {
			revertToLastMajorRevision (referenceTarget, step, "Supplier Marker");
		}
	}
}

function rejectAdditionalSupplierInCreationRequest(node, step) {
	var additionalSupplierReference = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_RequestToAdditionalSuppliers"));
	for(var i=0; i<additionalSupplierReference.size(); i++) {
		var additionalSupplierObj = additionalSupplierReference.get(i).getTarget();
		additionalSupplierReference.get(i).delete();
		removeReferenceInCreationWF(additionalSupplierObj, step);
		additionalSupplierObj.delete();
	}
}

function rejectAdditionalSupplierInChangeRequest(node, step) {
	var additionalSupplierReference = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_RequestToAdditionalSuppliers"));
	for(var i=0; i<additionalSupplierReference.size(); i++) {
		var additionalSupplierObj = additionalSupplierReference.get(i).getTarget();
		removeReferenceInChangeWF(additionalSupplierObj, step);
		revertToLastMajorRevision (additionalSupplierObj, step, "Supplier Marker");
	}
}

/**
 * @desc function to add partner functions based on alternative payee in supplier purchasing organization
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-7929
 * @author Bharat Gandhi <Bharat.Gandhi-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns 
 */

/*function addAltPayeePartnerFunctionAtPO(node, step) {
	var alternativePayeeRef = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierAlternativePayee"));
	var purchasingOrgs = node.getChildren();
	for(var i=0; i<purchasingOrgs.size(); i++) {
		var childObj = purchasingOrgs.get(i);
		var childObjTypeID = childObj.getObjectType().getID();
		if("SupplierPurchasingData".equals(childObjTypeID)) {
			if(!alternativePayeeRef.isEmpty()) {
				var alternativePayee = alternativePayeeRef.get(0).getTarget();
				var alternativePayeeID = alternativePayee.getID();
				var partnerFunctionRef = childObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierPurchasingDataToSupplier"));
				if(!partnerFunctionRef.isEmpty()) {
					for(var j=0; j<partnerFunctionRef.size(); j++) {
						var targets = partnerFunctionRef.get(j).getTarget();
						var targetsID = targets.getID();
						var attrValue = partnerFunctionRef.get(j).getValue("AT_SuplPartnerFunction").getSimpleValue();
						var attrValueHashSet = convertSplitValueToHashSet (attrValue, "<multisep/>");
						if(attrValue && alternativePayeeID.equals(targetsID) && attrValue.indexOf("Alternative Payee") == -1) {
							try{
								var reference = childObj.createReference(alternativePayee, "REF_SupplierPurchasingDataToSupplier");
								reference.getValue("AT_SuplPartnerFunction").addLOVValueByID("AZ");
							}
							catch(e) {
								partnerFunctionRef.get(j).getValue("AT_SuplPartnerFunction").addLOVValueByID("AZ");
							}
						}
						if(attrValue && attrValue.indexOf("Alternative Payee") != -1 && !alternativePayeeID.equals(targetsID)) {
							partnerFunctionRef.get(j).getValue("AT_SuplPartnerFunction").setSimpleValue(null);
							attrValueHashSet.remove("Alternative Payee");
							var itr = attrValueHashSet.iterator();
							while(itr.hasNext()){
								var curr = itr.next();
								partnerFunctionRef.get(j).getValue("AT_SuplPartnerFunction").addValue(curr);
							}
							try{
								var reference = childObj.createReference(alternativePayee, "REF_SupplierPurchasingDataToSupplier");
								reference.getValue("AT_SuplPartnerFunction").addLOVValueByID("AZ");
							}
							catch(e) {
								//do nothing
							}
						}
						if(attrValue && attrValue.indexOf("Alternative Payee") == -1 && !alternativePayeeID.equals(targetsID)) {
							try {
								var reference = childObj.createReference(alternativePayee, "REF_SupplierPurchasingDataToSupplier");
								reference.getValue("AT_SuplPartnerFunction").addLOVValueByID("AZ");
							}
							catch(e) {
								//do nothing
							}
						}
					}
				}
				else {
					var reference = childObj.createReference(alternativePayee, "REF_SupplierPurchasingDataToSupplier");
					reference.getValue("AT_SuplPartnerFunction").addLOVValueByID("AZ");
				}
			}
			else{
				var partnerFunctionRef = childObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierPurchasingDataToSupplier"));
				if(!partnerFunctionRef.isEmpty()) {
					for(var k=0; k<partnerFunctionRef.size(); k++) {
						//var targets = partnerFunctionRef.get(i).getTarget();
						//var targetsID = targets.getID();
						var attrValue = partnerFunctionRef.get(k).getValue("AT_SuplPartnerFunction").getSimpleValue();
						var attrValueHashSet = convertSplitValueToHashSet (attrValue, "<multisep/>");
						if(attrValue && attrValue.indexOf("Alternative Payee") != -1) {
							partnerFunctionRef.get(k).getValue("AT_SuplPartnerFunction").setSimpleValue(null);
							attrValueHashSet.remove("Alternative Payee");
							var itr = attrValueHashSet.iterator();
							while(itr.hasNext()){
								var curr = itr.next();
								partnerFunctionRef.get(k).getValue("AT_SuplPartnerFunction").addValue(curr);
							}
						}
					}
				}
			}
			var partnerFunctionRef = childObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierPurchasingDataToSupplier"));
			if(!partnerFunctionRef.isEmpty()) {
				for(var l=0; l<partnerFunctionRef.size(); l++) {
					var attrValue = partnerFunctionRef.get(l).getValue("AT_SuplPartnerFunction").getSimpleValue();
					if(!attrValue) {
						partnerFunctionRef.get(l).delete();
					}
				}
			}
		}
	}
}*/ //commenting for future use

/**
 * @desc function to check risk catagory of supplier
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-5531
 * @author Bharat Gandhi <Bharat.Gandhi-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns 
 */

function checkSupplierRiskCatagory(node, step) {
	var info = "";
	var addressID = getReferenceTargetID (node, step, "REF_SupplierToAddress");
	if(addressID) {
		var addressObj = step.getEntityHome().getEntityByID(addressID);
		var supplierCountry = addressObj.getValue("AT_Country").getID();
		var countryObjID = "CNTRY_" + supplierCountry;
		var countryObj = step.getEntityHome().getEntityByID(countryObjID);
		var supplierCountryRiskCatagory = countryObj.getValue("AT_RiskCategory").getID();
		if("Y".equals(supplierCountryRiskCatagory)) {
			info += "Dear AML Team, do you agree to set up the supplier " + node.getName() + " for the country " + countryObj.getName();
		}
	}
	return info;
}

/**
 * @desc function to send mail to AML officer(if needed) in creation of risky supplier
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-5531
 * @author Bharat Gandhi <Bharat.Gandhi-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {Mail Home} mailer
 * @param {Request Object} requestID
 * @returns 
 */

function sendMailToRequesterForAMLCaseCreationWF(node, step, mailer, supplierID) {
	var supplierObj = step.getEntityHome().getEntityByID(supplierID);
	 var sapId = supplierObj.getValue("AT_SAPR3Reference").getSimpleValue();
	var userID = step.getCurrentUser().getID();
	var userDetails = getUserDetails(step, userID);
	var userEmail = userDetails.userEmail;
	var suplGlobalVariables = step.getClassificationHome().getClassificationByID("SupplierVariables");
	var systemURL = suplGlobalVariables.getValue("AT_SystemURL").getSimpleValue();var requestURL=systemURL+"webui/SupplierWebUI#contextID=Global&workspaceID=Main&selection="+node.getID()+"&nodeType=entity";
	var requestURL=systemURL+"webui/SupplierWebUI#contextID=Global&workspaceID=Main&selection="+node.getID()+"&nodeType=entity";
	var supplierURL=systemURL+"webui/SupplierWebUI#contextID=Global&workspaceID=Main&screen=DetailScreen_Supplier&selection="+supplierObj.getID()+"&nodeType=entity&selectedTab=450412263.0&displayMode=126510176.0";
	var requestLink="<a href="+requestURL+">"+node.getID()+" </a>";
	var supplierLInk="<a href="+ supplierURL + ">" + supplierObj.getID() +" ( SAP ID : " + sapId + ")" + " </a>";
	var subject = "Request waiting for Approval";
	var body =  "Hi All, <br>";
	body += "The request " + requestLink + " with supplier " + supplierLInk + " is waiting for your approval.<br>";
	body += "Thanks & Regards,<br>Supplier Master Data Team";
	sendMail(mailer, userEmail, subject, body);
}

/**
 * @desc function to check risk catagory of bank and supplier and add comments accordingly
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-5531
 * @author Bharat Gandhi <Bharat.Gandhi-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns 
 */

function checkSupplierAndBankRiskCatagory(node, step) {
	var info = "";
	var addressID = getReferenceTargetID (node, step, "REF_SupplierToAddress");
	if(addressID) {
		//Supplier Country and Risk Catagory
		var addressObj = step.getEntityHome().getEntityByID(addressID);
		var supplierCountry = addressObj.getValue("AT_Country").getID();
		var countryObjID = "CNTRY_" + supplierCountry;
		var countryObj = step.getEntityHome().getEntityByID(countryObjID);
		var supplierCountryRiskCatagory = countryObj.getValue("AT_RiskCategory").getID();
		
		// Bank Country and Risk Catagory
		var newBankAccount = new java.util.HashSet("");
		var bankReferences = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToBankAccount"));
		var itr = bankReferences.iterator();
		while (itr.hasNext()){
			var bankAccount = itr.next().getTarget();
			if("Not in Approved workspace".equals(bankAccount.getApprovalStatus())) {
				newBankAccount.add(bankAccount);
			}
		}
		var itr1 = newBankAccount.iterator();
		while(itr1.hasNext()) {
			var bankAccountObj = itr1.next();
			var bank = bankAccountObj.getParent();
			var bankCountry = bank.getValue("AT_Country").getID();
			if(!supplierCountry.equals(bankCountry)) {
				var bankCountryID = "CNTRY_" + bankCountry;
				var countryObj = step.getEntityHome().getEntityByID(bankCountryID);
				var bankCountryRiskCatagory = countryObj.getValue("AT_RiskCategory").getID();
				var lookupFrom = supplierCountryRiskCatagory + "_" + bankCountryRiskCatagory;
				var lookupTableID = "LT_SupplierAMLConditions";
				var comment = getLookupValue(step, lookupFrom, lookupTableID);
				if(comment) {
					var bankAccNumber = bankAccountObj.getValue("AT_NumberOfBankAccount").getSimpleValue();
					var bankCountry = bank.getValue("AT_Country").getSimpleValue();
					var supplierCountry = addressObj.getValue("AT_Country").getSimpleValue();
					var supplierName = node.getName();
					if(bankAccNumber) {
						comment = comment.replace("[bank account]", bankAccNumber);
					}
					if(bankCountry) {
						comment = comment.replace("[bank country]", bankCountry);
					}
					if(supplierCountry) {
						comment = comment.replace("[supplier country]", supplierCountry);
					}
					if(supplierName) {
						comment = comment.replace("[supplier]", supplierName);
					}
				}
				info += comment + "\n";
			}
		}
	}
	return info;
}

/**
 * @desc function to validate partner functions for SUAD
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-7930
 * @author Bharat Gandhi <Bharat.Gandhi-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns 
 */

function SUADPartnerFunctionValidation(node, step) {
	var info = "";
	var partnerFunctionsNotAllowed = new java.util.HashSet("");
	partnerFunctionsNotAllowed.add("Alternative Payee"); partnerFunctionsNotAllowed.add("Regional carrier"); partnerFunctionsNotAllowed.add("Manufacturer"); partnerFunctionsNotAllowed.add("Vendor"); partnerFunctionsNotAllowed.add("Forwarding agent"); partnerFunctionsNotAllowed.add("Contract address"); partnerFunctionsNotAllowed.add("Goods supplier"); partnerFunctionsNotAllowed.add("Vendor declaration");
	var partnerFunctionReferences = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierPurchasingDataToSupplier"));
	for(var i=0;i<partnerFunctionReferences.size();i++) {
		var partnerFunctionReferenceObj = partnerFunctionReferences.get(i);
		var partnerFunctionTargetSupplierID = partnerFunctionReferenceObj.getTarget().getID();
		var targetSupplier = step.getEntityHome().getEntityByID(partnerFunctionTargetSupplierID);
		var accountGroup = targetSupplier.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToAccountGrp"));
		if(!accountGroup.isEmpty()) {
			var accountGrpObjID = accountGroup.get(0).getTarget().getID();
			var partnerFunction = partnerFunctionReferenceObj.getValue("AT_SuplPartnerFunction").getSimpleValue();
			var partnerFunctionHashSet = convertSplitValueToHashSet (partnerFunction, "<multisep/>");
			if("ACG_SUAD".equals(accountGrpObjID)) {
				if(!partnerFunctionHashSet.size() == 0) {
					for (var j = partnerFunctionHashSet.iterator(); j.hasNext(); ) {
						var partnerFunction = j.next();
						if(partnerFunctionsNotAllowed.contains(partnerFunction)) {
							info += "It is not allowed to assign SUAD (" + partnerFunctionTargetSupplierID + ") as a reference vendor for partner function " + partnerFunction + "\n";
						}
					}
				}
			}
		}
	}
	return info;
}



/**
 * @desc function to assign the local specialist for email and fax changes
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-6815
 * @author Bharat Gandhi <Bharat.Gandhi-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns 
 */

function PONotToBeConsideredInEmailAndFaxChanges(node, step, referenceID) {
	var PONotToBeConsidered = new java.util.HashSet("");
	var supplierObj = getSupplierFromRequest(node, step);
	if(supplierObj) {
		var childObjects = supplierObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID(referenceID));
		var itr = childObjects.iterator();
		while (itr.hasNext()) {
			childObject = itr.next();
			var childObj = childObject.getTarget();
			var childObjTypeID = childObj.getObjectType().getID();
			if("SupplierPurchasingData".equals(childObjTypeID)) {
				var supplierCategory = childObj.getValue("AT_SupplierCategory").getSimpleValue();
				var partnerFunctionReferences = childObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierPurchasingDataToSupplier"));
				for(var i=0;i<partnerFunctionReferences.size();i++) {
					var partnerFunctionReferenceObj = partnerFunctionReferences.get(i);
					var partnerFunctionTargetSupplierID = partnerFunctionReferenceObj.getTarget().getID();
					var targetSupplier = step.getEntityHome().getEntityByID(partnerFunctionTargetSupplierID);
					var accountGroup = targetSupplier.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToAccountGrp"));
					if(!accountGroup.isEmpty()) {
						var accountGrpObjID = accountGroup.get(0).getTarget().getID();
						var partnerFunction = partnerFunctionReferenceObj.getValue("AT_SuplPartnerFunction").getSimpleValue();
						var partnerFunctionHashSet = convertSplitValueToHashSet (partnerFunction, "<multisep/>");
						if(("direct".equals(supplierCategory) || "direct/indirect".equals(supplierCategory) || "direct/indirect/OEM".equals(supplierCategory) || "direct/OEM".equals(supplierCategory)) && "ACG_SUAD".equals(accountGrpObjID) && partnerFunctionHashSet.contains("Ordering address")) {
							PONotToBeConsidered.add(childObj.getID());
						}
					}
				}
			}
		}
	}
	return PONotToBeConsidered;
}

/**
 * @desc get bank accounts which are already in use
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-4704
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns 
 */

function getAlreadyUsedBankAccounts(node, step) {
	var alreadyUsedBankAccounts = [];
	var bankReferences = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToBankAccount"));
		var attributeValues = [];
		var itr = bankReferences.iterator();
		while (itr.hasNext()){
			var bankAccount = itr.next().getTarget();
			var bankAccountNumber = bankAccount.getValue("AT_NumberOfBankAccount").getSimpleValue();
			if(bankAccountNumber) {
				var isBankAccountIsAlreadyUsed = validateBankAccount(bankAccount, step, bankAccountNumber);
				if(isBankAccountIsAlreadyUsed) {
					alreadyUsedBankAccounts.push(bankAccountNumber);
				}
			}
		}
		return alreadyUsedBankAccounts;
}

/**
 * @desc Check if more than one account is added having same account number
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-4704
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {currentBankAccount} Currrent bank account
 * @param {bankAccountNumber} Bank Account Number
 * @returns 
 */

function validateBankAccount(currentBankAccount, step, bankAccountNumber) {
	var bankAccounts = getObjectsByAttributeValueAndObjectType (step, "BankAccount", "AT_NumberOfBankAccount", bankAccountNumber);
	for (var i=0; i<bankAccounts.length; i++) {
		var bankAccount = bankAccounts[i];
		var isCurrentBankAccount = (currentBankAccount.getID() == bankAccount.getID());
		if(!isCurrentBankAccount) {
			var suppliers = bankAccount.getReferencedBy();
			var itr = suppliers.iterator();
			var count = 0;
			while(itr.hasNext()) {
				var references = itr.next();
				var referenceType = references.getReferenceType();
				if("REF_SupplierToBankAccount".equals(referenceType)) {
					count += 1;
				}
			}
			if(count >= 1) {
				return true;;
			}
		}
	}
	return false;
}

/**
 * @desc function to test TAX Mandatory field on select "Yes"
 * @link
 * @author Savita Mannalle <Savita.Mannalle-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns 
*/

// Below code we will remove - TAX_DC_REMOVAL
/*function validateTaxData(node, step, countryCode){
	var hasTaxNo = node.getValue("AT_SuppNotHaveTaxNo").getID();
	if("Y".equals(hasTaxNo)) {
		return true;
	}
	else {
		var countryToTaxNumberMap = {"PL": ["AT_NIP", "AT_VatNumber"]}
		var validAttributes = countryToTaxNumberMap[countryCode]
		if(validAttributes!=undefined){
			for(var i=0; i<validAttributes.length; i++){
				var attrID = validAttributes[i]
				node.getValue(attrID).deleteCurrent()
			}
		}
		var allTaxDataContainers = node.getDataContainerByTypeID("ATC_TaxInformation");
		allTaxDataContainers.deleteLocal();
	}
	return false;
}*/

/**
 * @desc function to validate all requster mandatory data.
 * @link
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns {String} Error Message String
*/
function checkRequesterMandatoryData(node, step) {
	var errorMessage = "";
	var countryCode = getAddressDetails(node, step, "REF_SupplierToAddress").countryCode;
	var taxLookupFrom = getLookupValue(step, (countryCode+"-AT_TaxCat"), "LT_MandatoryValues");
	var communicationError = validateCommunicationMethod(node, step);
	var taxError = ValidateTaxInformation(node, step);
	var requestError = checkPriority(node,step);
	var otherError = checkDescriptionForOther(node, step);
	var IN12FieldsError = getIN12FieldsErrorMessage(node, step);
	var countrySpecificErrors = triggerCountrySpecificValidations(node, step, "Supplier");
	var telephoneCheck = mandatoryCheckForDataContainer(step, node, "ATC_TelephoneNumbers", "AT_TelephoneNumber", "CountryCode");
	var mobileCheck = mandatoryCheckForDataContainer(step, node, "ATC_MobileNumbers", "AT_MobileNumber", "CountryCode");
	var faxCheck = mandatoryCheckForDataContainer(step, node, "ATC_FaxNumbers", "AT_FaxNumber", "CountryCode");
	var emailCheck = mandatoryCheckForDataContainer(step, node, "ATC_EmailAddress", "AT_EmailAddress", "NoCountryCode");
	var internetCheck = mandatoryCheckForDataContainer(step, node, "ATC_InternetAddress", "AT_InternetAddress", "NoCountryCode");
	var supplierHasTaxNo = getAttributeValue(node, "AT_SuppNotHaveTaxNo");
	var bankMandatoryAttributeList = ["AT_NumberOfBankAccount", "AT_PartnerBankType", "AT_OrderCurrency"];
	var isBankAccoutHasMandatoryData = checkReferenceMandatoryFields(node, step, "REF_SupplierToBankAccount", bankMandatoryAttributeList);
	if(communicationError) {
		errorMessage = communicationError;
	}
	
	if(telephoneCheck != true) {
		errorMessage += telephoneCheck+"\n";
	}
	if(mobileCheck != true){
		errorMessage += mobileCheck+"\n";
	}
	if(faxCheck != true) {
		errorMessage += faxCheck+"\n";
	}
	if(emailCheck != true) {
		errorMessage += emailCheck+"\n";
	}
	if(internetCheck != true) {
		errorMessage += internetCheck+"\n";
	}
	if(!supplierHasTaxNo ) { 
		errorMessage += "Missing value: Supplier has a tax number \n";
	}
	if(taxError != true) {
		errorMessage += taxError;
	}
	if(countrySpecificErrors) {
		errorMessage += countrySpecificErrors+"\n";
	}
	if(isBankAccoutHasMandatoryData != true) {
		errorMessage += isBankAccoutHasMandatoryData+"\n";
	}
	if(IN12FieldsError != ""){
		errorMessage += "[IN12FieldsErrorMsg]"+"\n";
	}
	return errorMessage;
}

/**
 * @desc function to test CASA Mandatory field 
 * @link
 * @author Savita Mannalle <Savita.Mannalle-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns 
*/
function validateCASA(node, step) {
	var hasCASA = getAttributeValue(node, "AT_CasaRelevant");
	var supplierVariant = getAttributeValue(node, "AT_SupplierVariant");
	var currentUserID = step.getCurrentUser().getID();
	var isPurchasingUser = isUserMemberOfUserGroup(step, "USG_SUPL_PO_AuthorizationGroups", currentUserID)
	var isMdStewardUser = isUserMemberOfUserGroup(step, "USG_SUPL_MDMSpecialist", currentUserID)
	var isSupplierIsInCreationWorkflow = node.getValue("AT_SUPL_CreationRequestNo").getSimpleValue();
	var isSupplierIsInChangeWorkflow = node.getValue("AT_SUPL_ChangeRequestNumber").getSimpleValue();

	if (node.getValue("AT_SUPL_ChangeRequestNumber").getSimpleValue() != null){
		var reqObj = step.getEntityHome().getEntityByID(node.getValue("AT_SUPL_ChangeRequestNumber").getSimpleValue())
		if(reqObj != null){
			var reqType = reqObj.getValue("AT_TypeOfChangeRequest").getID()
			if (isPurchasingUser && isSupplierIsInChangeWorkflow){
				
				if (reqType == "SVC"){
					if (hasCASA == null){
						return false
					}
					else {
						return true
					}
				}
				else {
					return true
				}
			}
			else {
				if (reqType == "SVC" && (("RS".equals(supplierVariant)) ||("Segment A - WPT".equals(supplierVariant)))){
					if (hasCASA == null){
						return false
					}
					else {
						return true
					}
				}
				else {
					return true
				}
			}
		}
	}
	else if (node.getValue("AT_SUPL_CreationRequestNo").getSimpleValue() != null){
		
		var reqObj = step.getEntityHome().getEntityByID(node.getValue("AT_SUPL_CreationRequestNo").getSimpleValue())
		if(reqObj != null){
			var reqType = reqObj.getValue("AT_ChangeRequestWFType").getID()
			
			if (isPurchasingUser && isSupplierIsInCreationWorkflow){
				
				if (reqType == "Segment A+C Creation"){
					if (hasCASA == null){
						return false
					}
					else {
						return true
					}
				}
				else {
					return true
				}
			}
			else if (isMdStewardUser && isSupplierIsInCreationWorkflow){
				
				if (reqType == "Segment A+C Creation"){
					if (hasCASA == null){
						return false
					}
					else {
						return true
					}
				}
				else {
					return true
				}
			}
			else {
				return true
			}	
		}
	}
	else {
		
		return true
	}
}



/**
 * @desc function to validate country specific validations
 * @link
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {String} supplierOrCustomer is validation is for Supplier or Customer. Input values (Supplier, Customer)
 * @returns {String} Error Message String
 */
function triggerCountrySpecificValidations(node, step, supplierOrCustomer) {
	var validationLookupTableID = "LT_RegexCheck";
	var errorMessageLookupTableID = "LT_ErrorMessages";
	var mandatoryLookupTableID = "LT_MandatoryValues";
	var addressRefID = "Supplier".equals(supplierOrCustomer) ? "REF_SupplierToAddress" : "REF_CustomerToAddress";
	var countryCode = getAddressDetails(node, step, addressRefID).countryCode;
	var supplierHasTaxNo = node.getValue("AT_SuppNotHaveTaxNo").getSimpleValue();
	var validateFlag = true;
	if(!supplierHasTaxNo || "No".equals(supplierHasTaxNo)) {
		validateFlag = false;
	}
	var taxMandatoryValues = getLookupValue(step, (countryCode+"-AT_TaxCat"), mandatoryLookupTableID);
	var isPostalCodeValid = validatePostalCode(node, step, (countryCode+"-PostCode"), validationLookupTableID, errorMessageLookupTableID, addressRefID, "AT_PostCode");
	var isPOBoxPostalCodeValid = validatePostalCode(node, step, (countryCode+"-POBoxPostalCode"), validationLookupTableID, errorMessageLookupTableID, addressRefID, "AT_POBoxPostalCode");
	//var areTaxNumbersValid = checkTaxInformation(node, step, countryCode, taxMandatoryValues, validateFlag);
	var isBankDetailsValid = validateBankAccountDetails(node, step, countryCode, validationLookupTableID, errorMessageLookupTableID);
	var isTelephoneNoValid = validateDataContainerAttribute(step, node, "ATC_TelephoneNumbers", "AT_TelephoneNumber", "AT_CountryDialingCode", validationLookupTableID, errorMessageLookupTableID);
	var isMobileNoValid = validateDataContainerAttribute(step, node, "ATC_MobileNumbers", "AT_MobileNumber", "AT_CountryDialingCode", validationLookupTableID, errorMessageLookupTableID);
	var isFaxNoValid = validateDataContainerAttribute(step, node, "ATC_FaxNumbers", "AT_FaxNumber", "AT_CountryDialingCode", validationLookupTableID, errorMessageLookupTableID);
	var errorMessage = "";
	if(isPostalCodeValid !=true) {
		errorMessage= isPostalCodeValid+"\n";
	}
	if(isPOBoxPostalCodeValid !=true) {
		errorMessage+= isPOBoxPostalCodeValid+"\n";
	}
	if(isTelephoneNoValid !=true) {
		errorMessage+= isTelephoneNoValid+"\n";
	}
	if(isMobileNoValid !=true) {
		errorMessage+= isMobileNoValid+"\n";
	}
	if(isFaxNoValid !=true) {
		errorMessage+= isFaxNoValid+"\n";
	}
	/*if(areTaxNumbersValid !=true) {
		errorMessage+= areTaxNumbersValid+"\n";
	}	*/
	if(isBankDetailsValid !=true) {
		errorMessage+= isBankDetailsValid+"\n";
	}
	return errorMessage;
}

/**
 * @desc function to validate postal code
 * @link
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {String} lookupFrom value key for the lookup table.
 * @param {String} validationLookupTableID ID of the validation lookup table.
 * @param {String} errorMessageLookupTableID ID of the error message lookup table.
 * @param {String} addressRefID ID of the address reference.
 * @param {String} postCodeAttributeID ID of the post code attribute. ex  AT_PostCode or AT_POBoxPostalCode
 * @returns {String/Boolean} Error Message String if error else True
 */
function validatePostalCode(node, step, lookupFrom, validationLookupTableID, errorMessageLookupTableID, addressRefID, postCodeAttributeID) {
	var validationRegex = getLookupValue(step, lookupFrom, validationLookupTableID);
	if(validationRegex) {
		var postcode = getSingleReferenceAttributeValue(node, step, addressRefID, postCodeAttributeID);
		if(postcode && !postcode.match(validationRegex)) {
			var error = getLookupValue(step, lookupFrom, errorMessageLookupTableID);
			error = error.replace("replace", postcode);
			return error;
		}
	}
	return true;
}

/**
 * @desc function to validate Mobile Numbers
 * @link
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {String} countryCode country code of the supplier or customer.
 * @param {String} validationLookupTableID ID of the validation lookup table.
 * @param {String} errorMessageLookupTableID ID of the error message lookup table.
 * @returns {String/Boolean} Error Message String if error else True
 */
function validateMobileNumbers(node, step, countryCode, validationLookupTableID, errorMessageLookupTableID) {
	var mobileNumbers = getAttributeValuesInDC(node, step, "ATC_MobileNumbers", "AT_MobileNumber");
	var lookupFrom = countryCode+"-MobileNumber";
	var hasErrors = false;
	var validationRegex = getLookupValue(step, lookupFrom, validationLookupTableID);
	if(validationRegex) {
		var invalidNumbers = [];
		for(var i=0;i<mobileNumbers.length;i++) {
			var mobileNumber = mobileNumbers[i];
			if(!mobileNumber.match(validationRegex)) {
				invalidNumbers.push(mobileNumber);
				hasErrors = true;
			}
		}
		if(hasErrors) {
			var error = getLookupValue(step, lookupFrom, errorMessageLookupTableID);
			error = error.replace("replace", invalidNumbers.join(", "));
			return error;
		}
	}
	return true;
}

/**
 * @desc function to validate Telephone Numbers
 * @link
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {String} countryCode country code of the supplier or customer.
 * @param {String} validationLookupTableID ID of the validation lookup table.
 * @param {String} errorMessageLookupTableID ID of the error message lookup table.
 * @returns {String/Boolean} Error Message String if error else True
 */
function validateTelephoneNumbers(node, step, countryCode, validationLookupTableID, errorMessageLookupTableID) {
	var telephoneNumbers = getAttributeValuesInDC(node, step, "ATC_TelephoneNumbers", "AT_TelephoneNumber");
	var lookupFrom = countryCode+"-TelephoneNumber";
	var hasErrors = false;
	var validationRegex = getLookupValue(step, lookupFrom, validationLookupTableID);
	if(validationRegex) {
		var invalidNumbers = [];
		for(var i=0;i<telephoneNumbers.length;i++) {
			var telephoneNumber = telephoneNumbers[i];
			if(!telephoneNumber.match(validationRegex)) {
				invalidNumbers.push(telephoneNumber);
				hasErrors = true;
			}
		}
		if(hasErrors) {
			var error = getLookupValue(step, lookupFrom, errorMessageLookupTableID);
			error = error.replace("replace", invalidNumbers.join(", "));
			return error;
		}
	}
	return true;
}

/**
 * @desc function to validate Fax Numbers
 * @link
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {String} countryCode country code of the supplier or customer.
 * @param {String} validationLookupTableID ID of the validation lookup table.
 * @param {String} errorMessageLookupTableID ID of the error message lookup table.
 * @returns {String/Boolean} Error Message String if error else True
 */
function validateFaxNumbers(node, step, countryCode, validationLookupTableID, errorMessageLookupTableID) {
	var faxNumbers = getAttributeValuesInDC(node, step, "ATC_FaxNumbers", "AT_FaxNumber");
	var lookupFrom = countryCode+"-FaxNumber";
	var hasErrors = false;
	var validationRegex = getLookupValue(step, lookupFrom, validationLookupTableID);
	if(validationRegex) {
		var invalidNumbers = [];
		for(var i=0;i<faxNumbers.length;i++) {
			var faxNumber = faxNumbers[i];
			if(!faxNumber.match(validationRegex)) {
				invalidNumbers.push(faxNumber);
				hasErrors = true;
			}
		}
		if(hasErrors) {
			var error = getLookupValue(step, lookupFrom, errorMessageLookupTableID);
			error = error.replace("replace", invalidNumbers.join(", "));
			return error;
		}
	}
	return true;
}

/**
 * @desc function to validate if a particular user can initiate a change request or not
 * @link
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {Attributed value parameter} typeOfChangeRequest Type of Change request
 * @returns {Boolean}
 */
function isValidRequestType(node, step, typeOfChangeRequest) {
	var currentUserID = step.getCurrentUser().getID();
	var supplierVariant = node.getValue("AT_SupplierVariant").getID();
	var isAccountingUser = isUserMemberOfUserGroup(step, "USG_SUPL_AccountDataSpecialist", currentUserID) || isUserMemberOfUserGroup(step, "USG_SUPL_CC_AuthorizationGroups", currentUserID);
	var isPurchasingUser = isUserMemberOfUserGroup(step, "USG_SUPL_PurchasingSpecialist", currentUserID) || isUserMemberOfUserGroup(step, "USG_SUPL_PO_AuthorizationGroups", currentUserID);
     if(isAccountingUser && ("POD".equals(typeOfChangeRequest) || "Segment A+C Creation".equals(typeOfChangeRequest) || "SUPL supplier without payment transactions".equals(typeOfChangeRequest))) {
     	return false;
     }
     if(isPurchasingUser && ("BD".equals(typeOfChangeRequest) || "CCD".equals(typeOfChangeRequest) || "GDBD".equals(typeOfChangeRequest) || "BDCCD".equals(typeOfChangeRequest) || "Segment A+B Creation".equals(typeOfChangeRequest))) {
     	return false;
     }
     if((isPurchasingUser || isAccountingUser) && ("Segment A + C- WPT".equals(supplierVariant))) {
     	if("BD".equals(typeOfChangeRequest) || "CCD".equals(typeOfChangeRequest)) {
     		return false;
     	}
     }
	 if((isPurchasingUser || isAccountingUser) && ("Segment A - WPT".equals(supplierVariant))) {
     	if("BD".equals(typeOfChangeRequest) || "CCD".equals(typeOfChangeRequest)) {
     		return false;
     	}
     }
     if((isPurchasingUser ) && ("Segment A - WPT".equals(supplierVariant))) {
     	if(!("GD".equals(typeOfChangeRequest) ||"DEL".equals(typeOfChangeRequest) || "SVC".equals(typeOfChangeRequest))) {
     		return false;
     	}
      }
	  if(isPurchasingUser && "SVC".equals(typeOfChangeRequest)){ 
     	if("Segment A + C- WPT".equals(supplierVariant)) {
     		return true;
     	}
     	else if(!"Segment A - WPT".equals(supplierVariant)) {
			return false;
     	}
	 }
     if(isAccountingUser && "SVC".equals(typeOfChangeRequest)){ 
     	
			return false;
	 } 
	return true;
}
/**
 * @desc function to validate Data Container 
 * @link
 * @author Savita Mannalle <Savita.Mannalle-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {String} lookupFrom value key for the lookup table.
 * @param {String} validationLookupTableID ID of the validation lookup table.
 * @param {String} errorMessageLookupTableID ID of the error message lookup table.
 * @param {String} dataContainerID ID of the Communication data containers ex-ATC_TelephoneNumbers
 * @param {String} attributeID attributes of the datacontainer
 */
function validateDataContainerAttribute(step, node, dataContainerID, attributeID, attrCountryDiallingCode, validationLookupTableID, errorMessageLookupTableID){
	var dc = node.getDataContainerByTypeID(dataContainerID).getDataContainers();
	var errorMessage = "";
	var itr = dc.iterator();
	while(itr.hasNext()){
		var dcObj = itr.next().getDataContainerObject();
		
			var countryDiallingCode = dcObj.getValue(attrCountryDiallingCode).getID();
			var attributeValue = dcObj.getValue(attributeID).getSimpleValue();
			var hasErrors = false;
			if(countryDiallingCode){
				var lookupFrom = countryDiallingCode+"-"+attributeID;
				var attributeValidationRegex = getLookupValue(step, lookupFrom, validationLookupTableID);

				if(attributeValue && attributeValidationRegex != null && !attributeValue.match(attributeValidationRegex)) {
					var error =  getLookupValue(step, lookupFrom, errorMessageLookupTableID); 
					error = error.replace("valueReplace", attributeValue);
					error = error.replace("countryReplace", countryDiallingCode);
					errorMessage += error+"\n";
				}
				
			}	
			else {
				return true;
			}		
	}
	if(errorMessage != ""){
			return errorMessage.trim();
		}
	return true;
}

/**
 * @desc function to validate Check sum digit in the Tax information
 * @link
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {String} taxCatvalueID Tax Category LOV value ID.
 * @param {String} countryCode country code of the supplier or customer.
 * @returns {Boolean} returns True if checksum digit is valid else false.
 */
/*function validateCheckSumDigit(node, step, taxCatvalueID, countryCode) {
	//var taxNumber = getTaxDetails(node, step, taxCatvalueID);
	var taxNumber = getAttributeValue(node, "AT_TaxNumber1");
	if(taxNumber) {
		var weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
		var taxNumberWithoutSplChar = taxNumber.replace("-", "");
		var taxNumberArray = taxNumberWithoutSplChar.split("");
		var total = 0;
		for (var i=0;i<taxNumberArray.length-1;i++) {
			var taxDigit = Number(taxNumberArray[i]);
			var weight = weights[i];
			var muti = taxDigit * weight;
			total = total+muti
		}
		var mod11 = total % 11;
		var tenthDigit = Number(taxNumberWithoutSplChar.slice(9,10));
		if(tenthDigit != mod11) {
			return false;
		}
	}
	return true;
}*/

function validateCheckSumDigitFromAttributes(node, step, countryCode) {
	var taxNumber = null
	if(countryCode == "PL"){
		taxNumber = node.getValue("AT_TaxNumber1").getSimpleValue()
		if(taxNumber) {
			var weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
			var taxNumberWithoutSplChar = taxNumber.replace("-", "");
			var taxNumberArray = taxNumberWithoutSplChar.split("");
			var total = 0;
			for (var i=0;i<taxNumberArray.length-1;i++) {
				var taxDigit = Number(taxNumberArray[i]);
				var weight = weights[i];
				var muti = taxDigit * weight;
				total = total+muti
			}
			var mod11 = total % 11;
			var tenthDigit = Number(taxNumberWithoutSplChar.slice(9,10));
			if(tenthDigit != mod11) {
				return false;
			}
		}
	}
	if(countryCode == "IN"){
		var fullGSTIN = node.getValue("AT_TaxNumber3").getSimpleValue();
		if(fullGSTIN){
			fullGSTIN = node.getValue("AT_TaxNumber3").getSimpleValue().trim();
			var providedChecksum = fullGSTIN.slice(-1);
			var GSTINWithoutChecksum = fullGSTIN.slice(0, 14);
			
			var multipliers = [1, 2];
			var sum = 0;

			for (var i = 0; i < 14; i++) {
				var code = getLookupValue(step, GSTINWithoutChecksum.charAt(i), "LT_IndiaCheckSumChatacter");
				var multiplier = multipliers[i % 2];
				var product = code * multiplier;
				var quotient = Math.floor(product / 36);
				var remainder = product % 36;
				var hash = quotient + remainder;
				sum += hash;
			}

			var remainder = sum % 36;
			var checksumCode = 36 - remainder;
			var checksumDigit = null;
			if(remainder == 0 && checksumCode == 36){
				// If the sum obtained is divisible by 36 and the checksum code is "0" then we assign the checksumDigit with "0" as an exception.
				checksumDigit = "0";
			}
			else{
				checksumDigit = getLookupValue(step, checksumCode, "LT_IndiaCheckSumChatacter");
			}
			return checksumDigit == providedChecksum;
		}		
	}
	return true;
}


/**
 * @desc function to set Sap Per Reference
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-8599
 * @author Tomcy Thankachan <TOMCY.THANKACHAN-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object (Request)
 * @returns
 */
function setSapPerReference(node,step){
	var supplierObj = getSupplierFromRequest(node, step);
	var permittedPayee=hasReferenceTarget(supplierObj,step,"REF_SupplierToSupplierPermittedPayee");
	if(permittedPayee) {
	supplierObj.getValue("AT_SpecPerReference").setLOVValueByID("Y");
	}
	else{
	supplierObj.getValue("AT_SpecPerReference").setLOVValueByID("N");
	}
}
/**
 * @desc function to valdate Country and ERS
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-8957
 * @author Tomcy Thankachan <TOMCY.THANKACHAN-ext@bshg.com>
 * @param {Node} supplierObj current object (Supplier)
 * @param {Step} step Step manager
 * @returns returns true if the country is ES/DE and ERS is yes else false
 */
 
function validateCountryAndERS(supplierObj,step){
	var country = supplierObj.getValue("AT_TempCountry").getID();
	if(country=="ES" || country=="DE"){
	var ERS ="";
	var POReferences = supplierObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierPurchasingData"));
		for(var i=0 ; i<POReferences.size() ; i++) {
			var POReferenceObj = POReferences.get(i).getTarget();
			ERS = POReferenceObj.getValue("AT_EvaluatedReceiptSettlement").getID();
			if(ERS=="Y"){
				return true;
			}
		}
		return false;
	}
}

/**
 * @desc function to check Telephone Number And Fax Number Changes
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-8953
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-14272
 * @author Tomcy Thankachan <TOMCY.THANKACHAN-ext@bshg.com> 
 * @param {Node} node Current object (Supplier)
 * @param {Step} step Step manager
 * @returns
 */
function checkTelephoneEmailAndFaxChanges(node,step){
	var mainWSFax = null;
	var mainWSTelephoneNumber=null;
	var mainWSEmail=null;
	//Checking default Telephone Number Change
	var defaultTelephoneNumberDCFromApproveWS = getDCObjectFromApprovedWS(node, step, "ATC_TelephoneNumbers","AT_DefaultFlag", "Yes");
	var defaultTelephoneNumberDC =getDataContainerbyAttrValue(node, step,"ATC_TelephoneNumbers","AT_DefaultFlag","Yes");
	if(defaultTelephoneNumberDCFromApproveWS==null && defaultTelephoneNumberDC !=null){
		return true;
	}
	else if(defaultTelephoneNumberDCFromApproveWS) {
		var approvedWSTelephoneNumber = defaultTelephoneNumberDCFromApproveWS.getValue("AT_TelephoneNumber").getSimpleValue();
		if(defaultTelephoneNumberDC) {
			mainWSTelephoneNumber = defaultTelephoneNumberDC.getValue("AT_TelephoneNumber").getSimpleValue();
		}
		if(mainWSTelephoneNumber != approvedWSTelephoneNumber) {
			return true;
		} 
	}
	//Checking default Fax number Change.
	var defaultFaxNumberDCFromApproveWS = getDCObjectFromApprovedWS(node, step, "ATC_FaxNumbers","AT_DefaultFlag", "Yes");
	var defaultFaxNumberDC = getDataContainerbyAttrValue(node, step,"ATC_FaxNumbers","AT_DefaultFlag","Yes");
	if(defaultFaxNumberDCFromApproveWS==null && defaultFaxNumberDC !=null){
		return true;
	}
	else if(defaultFaxNumberDCFromApproveWS) {
		var approvedWSFax = defaultFaxNumberDCFromApproveWS.getValue("AT_FaxNumber").getSimpleValue();
		if(defaultFaxNumberDC) {
			mainWSFax = defaultFaxNumberDC.getValue("AT_FaxNumber").getSimpleValue();
		}
		if(mainWSFax != approvedWSFax) {
			return true;
		} 
	}
	//Checking default Email Address Change
	var defaultEmailAddressDCFromApprovedWS = getDCObjectFromApprovedWS(node, step, "ATC_EmailAddress", "AT_DefaultFlag", "Yes");
	var defaultEmailAddressDC = getDataContainerbyAttrValue(node, step, "ATC_EmailAddress", "AT_DefaultFlag","Yes");
	if(defaultEmailAddressDCFromApprovedWS==null && defaultEmailAddressDC !=null){
		return true;
	}
	else if(defaultEmailAddressDCFromApprovedWS) {
		var approvedWSEmail = defaultEmailAddressDCFromApprovedWS.getValue("AT_EmailAddress").getSimpleValue();
		if(defaultEmailAddressDC) {
			mainWSEmail = defaultEmailAddressDC.getValue("AT_EmailAddress").getSimpleValue();
		}
		if(mainWSEmail != approvedWSEmail) {
			return true;
	
		}
	}
	return false;
}

 /**
 * @desc function to check General Data Changes
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-14272
 * @author Tomcy Thankachan <TOMCY.THANKACHAN-ext@bshg.com> 
 * @param {Node} node Current object(Supplier)
 * @param {Step} step Step manager
 * @returns true if any changes happened in the addres or any supplier attributes
 */
 function generalDataChangesforattachment (node, step) {
	var changeInfo = "";
	//address changes
	var addressReference = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToAddress"));
	
	if(!addressReference.isEmpty()) {
		var addressID = addressReference.get(0).getTarget().getID();
		var addressObj = step.getEntityHome().getEntityByID(addressID);
		var unApprovedAddressObjects = addressObj.getNonApprovedObjects();
		for (var i = unApprovedAddressObjects.iterator(); i.hasNext(); ) {
			var unApprovedAddressObject = i.next();
			if(unApprovedAddressObject && unApprovedAddressObject instanceof com.stibo.core.domain.partobject.ValuePartObject){
				var mainAttributeValue =getAttributeValue(addressObj, unApprovedAddressObject.getAttributeID());
				var approvedAttributeValue=getAttrValuesFromApprovedWS(addressObj, step, unApprovedAddressObject.getAttributeID());
				if(mainAttributeValue!=approvedAttributeValue){
					return true;
				}
			}
		}
	}
	//Supplier attribute changes
	var unApprovedSupplierObjects = node.getNonApprovedObjects();
	for (var i = unApprovedSupplierObjects.iterator(); i.hasNext(); ) {
		var unApprovedSupplierObject = i.next();
		if(unApprovedSupplierObject && unApprovedSupplierObject instanceof com.stibo.core.domain.partobject.ValuePartObject){
			var generalAttributeID = unApprovedSupplierObject.getAttributeID();
			var mainAttributeValue =getAttributeValue(node, unApprovedSupplierObject.getAttributeID());
			var approvedAttributeValue =getAttrValuesFromApprovedWS(node, step, unApprovedSupplierObject.getAttributeID());
			if(mainAttributeValue!=approvedAttributeValue && !"AT_STDCommunicationMethod".equals(generalAttributeID) && !"AT_SUPL_ChangeRequestNumber".equals(generalAttributeID) && !"AT_SUPL_CreationRequestNo".equals(generalAttributeID)) {
				return true;
			}
		}
	}
	return false;
}
/**
 * @desc function to send re-block deadline postpone mail to requester
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-9284
 * @author Tomcy Thankachan <TOMCY.THANKACHAN-ext@bshg.com>
 * @param {Node} node Current object (Request)
 * @param {Step} step Step manager
 * @param {Mail Home} mailer
 * @returns
 */

function sendReblockDeadlinePostponeMailToRequestor(node, step, mailer) {
	var userID = node.getValue("AT_RequestorAssignee").getSimpleValue();
	var requesterUser = step.getUserHome().getUserByID(userID);
	var requestonBehalfOf = node.getValue("AT_RequestCreatedOnBehalfOf").getSimpleValue();
	if(requesterUser){
		var userDetails = getUserDetails(step, userID);
		var userEmail = userDetails.userEmail;
		var userName = userDetails.userName;
		var supplierObj = getSupplierFromRequest(node, step);
		var linkDetails = getMailLinks(node, step);
		var smdtLink =  linkDetails.SmdLink;
		var suplGlobalVariables = step.getClassificationHome().getClassificationByID("SupplierVariables");
		var comments = node.getValue("AT_Comments").getSimpleValue();
		if(comments) {
			comments = comments.replace("<multisep/>","<br>");
		}
		var sapId = supplierObj.getValue("AT_SAPR3Reference").getSimpleValue();
		var systemURL = suplGlobalVariables.getValue("AT_SystemURL").getSimpleValue();
		var requestURL = systemURL + "webui/SupplierWebUI#contextID=en_US&workspaceID=Main&selection="+node.getID()+"&nodeType=entity&workflowID=WF_SupplierChange&stateID=CH_TemporarilyUnblocked&bbadf.inv=0&selectedTab=705419466.1_2378723593.0&displayMode=126510176.0";
		var supplierURL=systemURL+"webui/SupplierWebUI#contextID=Global&workspaceID=Main&screen=DetailScreen_Supplier&selection="+supplierObj.getID()+"&nodeType=entity&selectedTab=450412263.0&displayMode=126510176.0";
		var requestLink="<a href="+requestURL+">"+node.getID()+" </a>";
		var supplierLInk="<a href="+supplierURL+">"+supplierObj.getID()+" </a>";
		var deadline = node.getWorkflowInstanceByID("WF_SupplierChange").getTaskByID("CH_TemporarilyUnblocked").getDeadline();
			var subject = "Re-block deadline for the Supplier [" + supplierObj.getID() +" ( SAP ID: "+ sapId + ")" + supplierObj.getName() +" ] has been extended";
			var body = "<html><head>";
				body+=  "Dear "+userName+",<br><br>";
				body+= "Re-block deadline for the Supplier [ "+supplierLInk+" , "+supplierObj.getName()+" ] stacked to the request "+requestLink+" has been extended by 3 days<br><br>";
				body+= "The revised deadline is " + deadline + "<br><br>";
				body+= "<br><br>Thanks & Regards,<br>Supplier Master Data Team"; 
				body+= "<br><a href="+smdtLink+">Our Website"; 
		
			
		if(requestonBehalfOf) {
			sendMailWithCC(mailer, userEmail, requestonBehalfOf, subject, body);
		}
		else {
			sendMail(mailer, userEmail, subject, body);
		}
	}
}

/**
 * @desc function to send re-block mail to requester
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-9284
 * @author Tomcy Thankachan <TOMCY.THANKACHAN-ext@bshg.com>
 * @param {Node} node Current object (Request)
 * @param {Step} step Step manager
 * @param {Mail Home} mailer
 * @returns
 */

function sendReblockMailToRequestor(node, step, mailer) {
	var userID = node.getValue("AT_RequestorAssignee").getSimpleValue();
	var requesterUser = step.getUserHome().getUserByID(userID);
	var requestonBehalfOf = node.getValue("AT_RequestCreatedOnBehalfOf").getSimpleValue();
	if(requesterUser){
		var userDetails = getUserDetails(step, userID);
		var userEmail = userDetails.userEmail;
		var userName = userDetails.userName;
		var supplierObj = getSupplierFromRequest(node, step);
		var linkDetails = getMailLinks(node, step);
		var smdtLink =  linkDetails.SmdLink;
		var suplGlobalVariables = step.getClassificationHome().getClassificationByID("SupplierVariables");
		var comments = node.getValue("AT_Comments").getSimpleValue();
		if(comments) {
			comments = comments.replace("<multisep/>","<br>");
		}
		var sapId = supplierObj.getValue("AT_SAPR3Reference").getSimpleValue();
		var systemURL = suplGlobalVariables.getValue("AT_SystemURL").getSimpleValue();
		var requestURL = systemURL + "webui/SupplierWebUI#contextID=Global&workspaceID=Main&selection="+node.getID()+"&nodeType=entity";
		var supplierURL=systemURL+"webui/SupplierWebUI#contextID=Global&workspaceID=Main&screen=DetailScreen_Supplier&selection="+supplierObj.getID()+"&nodeType=entity&selectedTab=450412263.0&displayMode=126510176.0";
		var requestLink="<a href="+requestURL+">"+node.getID()+" </a>";
		var supplierLInk="<a href="+supplierURL+">"+supplierObj.getID()+" </a>";
			var subject = "Supplier ["+ supplierObj.getID() +" ( SAP ID: " + sapId + ")" + supplierObj.getName() +" ] has been re-blocked";
			var body = "<html><head>";
				body+=  "Dear "+userName+",<br><br>";
				body+= "The Supplier [ "+supplierLInk+" , "+supplierObj.getName()+" ] stacked to the request "+requestLink+" has been re-blocked<br><br>";
				body+= "<br><br>Thanks & Regards,<br>Supplier Master Data Team"; 
				body+= "<br><a href="+smdtLink+">Our Website"; 
		
			
		if(requestonBehalfOf) {
			sendMailWithCC(mailer, userEmail, requestonBehalfOf, subject, body);
		}
		else {
			sendMail(mailer, userEmail, subject, body);
		}
	}
}
/**
 * @desc function to set CompanyCode and PO Status as In Change
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-9284
 * @author Tomcy Thankachan <TOMCY.THANKACHAN-ext@bshg.com>
 * @param {Node} Current object
 * @param {Step} step Step manager
 * @returns
 */
function setCCPOStatus(node,step){
	var currentStatus=node.getApprovalStatus();
	var selectedObjectID=node.getID();
	var splitValue = selectedObjectID.split("-");
	var supplierID = splitValue[0]; 
	var supplierObj = step.getEntityHome().getEntityByID(supplierID);
	var changeRequestNumber=supplierObj.getValue("AT_SUPL_ChangeRequestNumber").getSimpleValue();
	if(changeRequestNumber && "Partly approved".equals(currentStatus)){
		node.getValue("AT_SupplierWFStatus").setLOVValueByID("In_Change");
	}
}

/**
 * @desc function to set CompanyCode and PO Status as Approved
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-9284
 * @author Tomcy Thankachan <TOMCY.THANKACHAN-ext@bshg.com>
 * @param {Node} supplierObj Current object (Supplier)
 * @param {Step} step Step manager
 * @returns
 */

function setCCPOApproveStatus(supplierObj,step){
	var CCReferences = supplierObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierCompanyCode"));
	var POReferences = supplierObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierPurchasingData"));
	var currentStatus=null;
	for(var i=0 ; i<CCReferences.size() ; i++) {
		var CCObj = CCReferences.get(i).getTarget();
		currentStatus = CCObj.getApprovalStatus();
	     CCObj.getValue("AT_SupplierWFStatus").setLOVValueByID("Approved");;
	 }
	for(var i=0 ; i<POReferences.size() ; i++) {
		var POObj = POReferences.get(i).getTarget();
		currentStatus = POObj.getApprovalStatus();
	    	POObj.getValue("AT_SupplierWFStatus").setLOVValueByID("Approved");
	}
}
/**
 * @desc function to Check Exceptions for Autoapproval
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-9387
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-11580
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-15772
 * @author Tomcy Thankachan <TOMCY.THANKACHAN-ext@bshg.com>
 * @param {Node} node Current object(Request)
 * @param {Step} step Step manager
 * @returns true if any exception for auto approval happened
 */
function checkExceptionsForCCPOAutoApproval(node, step){
	var typeOfChangeRequest = node.getValue("AT_TypeOfChangeRequest").getID();
	var supplierObj = getSupplierFromRequest(node, step);
	//Exception 1 :CCD or POD type of request and if  there is any value in the field "Trading Partner"
	var tradingPartner = supplierObj.getValue("AT_TradingPartner").getSimpleValue();
	if(tradingPartner!=null){
		return true;
	}
	if(typeOfChangeRequest && "POD".equals(typeOfChangeRequest)){
	//Exception 2 : (POD) Returns vendor & customer
		var POReferences = supplierObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierPurchasingData"));
		for(var i=0 ; i<POReferences.size() ; i++) {
			var POObj = POReferences.get(i).getTarget();
			var returnsVendor = POObj.getValue("AT_ReturnsVendor").getID();
			if("Y".equals(returnsVendor)){
				return true;
			}
		}
	// Exception 3:(POD) Manufacturing plant
		var addtionalSuppliers = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_RequestToAdditionalSuppliers"));
		if(!addtionalSuppliers.isEmpty()) {
			return true;
		}
	//Exception 4:(POD) Incoterms other than 4 standard CPT, DAP, FCA, FOB
		var compareMainAndApproved = compareAttributeValuesForReference(supplierObj, step, "REF_SupplierToSupplierPurchasingData", "AT_IncoTerms");
		var incoTerms="";
		var POReferences = supplierObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierPurchasingData"));
		for(var i=0 ; i<POReferences.size() ; i++) {
			var POObj = POReferences.get(i).getTarget();
			incoTerms = POObj.getValue("AT_IncoTerms").getID();
			if((compareMainAndApproved || "Not in Approved workspace".equals(POObj.getApprovalStatus()))&& !("CPT".equals(incoTerms) || "DAP".equals(incoTerms) || "FCA".equals(incoTerms) || "FOB".equals(incoTerms))) {
				return true;
			}
		}
		
	//Exception 5 :POD  Payment terms
		for(var i=0 ; i<POReferences.size() ; i++) {
			var POReferenceObj = POReferences.get(i).getTarget();			
			var termsOfPaymentDayRange = POReferenceObj.getValue("AT_TermsOfPaymentDayRange").getID();
			var isTermsOfPaymentDayRangeChanged = compareMainAndApprovedWsValues(POReferenceObj, step, "AT_TermsOfPaymentDayRange");
			if((isTermsOfPaymentDayRangeChanged || "Not in Approved workspace".equals(POReferenceObj.getApprovalStatus())) && ("More than 60 days".equals(termsOfPaymentDayRange) || "Less than 30 days".equals(termsOfPaymentDayRange))){
				return true;
			}
		}
	}
	else if(typeOfChangeRequest && "CCD".equals(typeOfChangeRequest)){
	//Exception 6:it is obligatory to attach a document related to Witholding tax attributes "Exemption From" and "Exemption To
		var isExemptionFromExemptionToAdded =checkExemptionFromExemptionTo(supplierObj, step);
		if(isExemptionFromExemptionToAdded){
			return true;
		}
	}
return false;
}

/**
 * @desc function to Validate National version attributes
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-5525
 * @author Bhoomika Katti <Bhoomika.Katti-ext@bshg.com>
 * @param {Node} node Current object(Supplier)
 * @param {Step} step Step manager
 */

function validateNationalVersionAttr(node, step) {
    var errorMessage = "";
    var suplNationalVersion = node.getValue("AT_DoesSupplierHaveANationalVersion").getSimpleValue();
    if ("Yes".equals(suplNationalVersion)) {
        var nationalName = getAttributeValue(node, "AT_NationalName1");
        var nationalLanguage = getAttributeValue(node, "AT_NationalVersionLanguage");
        var nationalCity = getAddressDetails(node, step, "REF_SupplierToAddress").nationalCity;
        var nationalStreet = getAddressDetails(node, step, "REF_SupplierToAddress").nationalStreet;

        if (!nationalName) {
            errorMessage = "Missing value: National Name 1\n";
        }
        if (!nationalLanguage) {
            errorMessage += "Missing value: National Version Language\n";
        }
        if (!nationalCity) {
            errorMessage += "Missing value: National City\n";
        }
        if (!nationalStreet) {
            errorMessage += "Missing value: National Street\n";
        }
    }
    
    return errorMessage;
    
}

/**
 * @desc function to Check Partner Function OrderingAddress and Vendor
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-9814
 * @author Tomcy Thankachan <TOMCY.THANKACHAN-ext@bshg.com>
 * @param {Node} node Current object
 * @param {Step} step Step manager
 * @returns
 */
function validatePFOrderingAddressAndVendor(node, step) {
var errorMessage = "";
var OACount =0,vendorCount=0;
var partnerFunref = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierPurchasingDataToSupplier"));
	for(var j=0; j<partnerFunref.size();j++){
		var flag = false;
		var supRef = partnerFunref.get(j);
		var supObj = supRef.getTarget();
		var supPartFun = supRef.getValue("AT_SuplPartnerFunction").getSimpleValue();
		if(supPartFun != null) {
			if(supPartFun.indexOf("Vendor")!=-1){
				vendorCount++;
			}
			if(supPartFun.indexOf("Ordering address")!=-1){
				OACount++;
			}
		}
		if(vendorCount>1){
			errorMessage+= "It is not possible to add 'Vendor' partner function twice! \n";
		}
		if(OACount>1){
			errorMessage+= "It is not possible to add 'Ordering Address' partner function twice! \n";
		}
	}
	return errorMessage;
}

/**
 * @desc function to check duplicate value in withholding Tax Type
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-10229
 * @author Tomcy Thankachan <TOMCY.THANKACHAN-ext@bshg.com>
 * @param {Node} node Current object
 * @param {Step} step Step manager
 * @returns
 */
function validateWHTaxType(node,step){ 
var dataContainers = node.getDataContainerByTypeID("ATC_WithHoldingTaxData").getDataContainers();
var storeWHTaxType = new java.util.HashSet();
var errorMessage="";
var itr = dataContainers.iterator();
	while (itr.hasNext()){
		var dcObject = itr.next().getDataContainerObject();
		var withHoldingTaxType = dcObject.getValue("AT_SuplWithholdingTaxType").getSimpleValue();
		if(withHoldingTaxType!=null && storeWHTaxType.contains(withHoldingTaxType)){
			errorMessage+= "Duplicates of 'With T.Type' field are not allowed, please provide another value.\n";
		}
		else{
			storeWHTaxType.add(withHoldingTaxType);
		}
	}
	return errorMessage;
}

/**
 * @desc function to check Withholding Tax ExemptionFrom and ExemptionTo
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-10229
 * @author Tomcy Thankachan <TOMCY.THANKACHAN-ext@bshg.com>
 * @param {Node} supplierObj Current object (Supplier)
 * @param {Step} step Step manager
 * @returns
 */
function checkExemptionFromExemptionTo(supplierObj,step) {
	var changedDCIDs = new java.util.HashSet("");
	var CCReferences = supplierObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierCompanyCode"));
	for(var j=0 ; j<CCReferences.size() ; j++) {
		var CCObj = CCReferences.get(j).getTarget();
		var unApprovedCCObjects = CCObj.getNonApprovedObjects();
		for (var i = unApprovedCCObjects.iterator(); i.hasNext(); ) {
			var unApprovedCCObject = i.next();
		
			if(unApprovedCCObject && unApprovedCCObject instanceof com.stibo.core.domain.partobject.datacontainer.DataContainerPartObject) {
				changedDCIDs.add(unApprovedCCObject.getDataContainerTypeID());
			}
		}
		var hashSetItr = changedDCIDs.iterator();
		
		while (hashSetItr.hasNext()) {
			var changedDCID = hashSetItr.next();
			if("ATC_WithHoldingTaxData".equals(changedDCID)) { 
				var mainDCRows = getDataContainerRowsInMainWorkspace(CCObj, step, changedDCID);
				var approvedDCRows = getDataContainerRowsInApprovedWS(CCObj, step, changedDCID);
				var dataContainers = CCObj.getDataContainerByTypeID(changedDCID).getDataContainers();
				var itr = dataContainers.iterator();
				while (itr.hasNext()){
					var dcObject = itr.next().getDataContainerObject();
					if (!approvedDCRows.contains(dcObject)) {
						var exemptionFrom = dcObject.getValue("AT_SuplExemptionStartDate").getSimpleValue();
						var exemptionTo = dcObject.getValue("AT_SuplExemptionEndDate").getSimpleValue();
						if(exemptionFrom || exemptionTo){
							return true;
						}
					}
					
				}
				
			}
		}
	}
	return false;
}

/**
 * @desc function to check changes in bank data
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-12504
 * @author Tomcy Thankachan <TOMCY.THANKACHAN-ext@bshg.com> 
 * @param {Node} node Current object 
 * @param {Step} step Step manager
 * @returns
 */
function isBankDetailsChangedForAttachment(node, step){
 	var supplierObj = getSupplierFromRequest(node, step);
	var changeInfo = "";
	var newBankAccount = new java.util.HashSet("");
	var mainWSBankAccounts = new java.util.HashSet("");
	var approvedWSBankAccounts = new java.util.HashSet("");
	var mainWSBankReferences = supplierObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToBankAccount"));
	for(var i=0; i<mainWSBankReferences.size(); i++) {
		var bankObj = mainWSBankReferences.get(i).getTarget();
		mainWSBankAccounts.add(bankObj.getID());
	}
	var approvedWSBankReferences = step.executeInWorkspace("Approved", function(step) {
											var emptyArrayList = new java.util.ArrayList();
											var approvedObj = step.getObjectFromOtherManager(supplierObj);
											if(approvedObj) {
												return approvedObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToBankAccount"));
											}
											return emptyArrayList;
							});
	for(var i=0; i<approvedWSBankReferences.size(); i++) {
		var approvedBankObj = approvedWSBankReferences.get(i).getTarget();
		approvedWSBankAccounts.add(approvedBankObj.getID());
	}
	for (var i = mainWSBankAccounts.iterator(); i.hasNext(); ) {
		var mainWSBankAccount = i.next();
		if(!approvedWSBankAccounts.contains(mainWSBankAccount)) {
			newBankAccount.add(mainWSBankAccount);
			return true;
		}
	}
	//checking for changes in a particular bank account other than partner function field
	var bankAccounts = new java.util.HashSet("");
	var numberOfBankAccounts = supplierObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToBankAccount")).size();
	for(var i=0; i<numberOfBankAccounts; i++) {
		bankAccounts.add(supplierObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToBankAccount")).get(i).getTarget().getID());
	}
	var itr = bankAccounts.iterator();
	while (itr.hasNext()) {
		bankAccountID = itr.next();
		var bankAccountObj = step.getEntityHome().getEntityByID(bankAccountID);
		var unApprovedObjects = bankAccountObj.getNonApprovedObjects();
		for (var i = unApprovedObjects.iterator(); i.hasNext(); ) {
			var unApprovedBankObject = i.next();
			if(unApprovedBankObject && unApprovedBankObject instanceof com.stibo.core.domain.partobject.ValuePartObject && !newBankAccount.contains(bankAccountID)){
				var attributeID = unApprovedBankObject.getAttributeID();
				if(!"AT_PartnerBankType".equals(attributeID)){
					var approvedAttributeValue=getAttrValuesFromApprovedWS(bankAccountObj, step, attributeID);
					var mainAttributeValue = getAttributeValue(bankAccountObj, unApprovedBankObject.getAttributeID());
					if (mainAttributeValue != approvedAttributeValue) {
						return true;
					}
				}
			}
		}
	}
return false;
}
/**
 * @desc function to check Alternative Payee Changes
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-12504
 * @author Tomcy Thankachan <TOMCY.THANKACHAN-ext@bshg.com> 
 * @param {Node} supplierObj Current object (Supplier)
 * @param {Step} step Step manager
 * @returns
 */
function checkAlternativePayeeChanges(supplierObj, step, referenceID){
	var mainAlternativePayee = getReferenceTargetID(supplierObj, step, referenceID);
	var approvedAlternativePayee = getReferenceTargetIDFromApprovedWS(supplierObj, step, referenceID);
	if(mainAlternativePayee != approvedAlternativePayee) {
		return true;
	}
return false
}
/**
 * @desc function to check incoterms value
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-10996
 * @author Tomcy Thankachan <TOMCY.THANKACHAN-ext@bshg.com> 
 * @param {Node} node Current object (Supplier)
 * @param {Step} step Step manager
 * @returns true if incoterm changed
 */

function incotermCheck(node,step){
	var compareMainAndApproved = compareAttributeValuesForReference(node, step, "REF_SupplierToSupplierPurchasingData", "AT_IncoTerms");
		var incoTerms="";
		var POReferences = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierPurchasingData"));
		for(var i=0 ; i<POReferences.size() ; i++) {
			var POObj = POReferences.get(i).getTarget();
			incoTerms = POObj.getValue("AT_IncoTerms").getID();
			if((compareMainAndApproved || "Not in Approved workspace".equals(POObj.getApprovalStatus()))&& !("CPT".equals(incoTerms) || "DAP".equals(incoTerms) || "FCA".equals(incoTerms) || "FOB".equals(incoTerms))) {
				return true;
			}
		}
	return false;
}

/**
 * @desc function to check For any changes/addition of RohsReach email address
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-13605
 * @author Tomcy Thankachan <TOMCY.THANKACHAN-ext@bshg.com> 
 * @param {Node} node Current object (Request)
 * @param {Step} step Step manager
 * @param {MailHome} mailer Mail Home
 * @returns 
 */
function rohsReachEmailAdressChange(node, step,mailer) {
	var supplierObj = getSupplierFromRequest(node, step);
    	var flag = false;
	var newMailIdList = new java.util.HashSet("");
	var workflowType = node.getValue("AT_ChangeRequestWFType").getID();
	var changeRequestType = node.getValue("AT_TypeOfChangeRequest").getID();
    	var mainDCRows = getDCObjectListFromMainWS(supplierObj, step, "ATC_EmailAddress", "AT_EmailComment", "RoHS/REACH");
    	var approvedDCRows = getDCObjectListFromApprovedWS(supplierObj, step, "ATC_EmailAddress", "AT_EmailComment", "RoHS/REACH");
    	var completeApprovedDCRows = getDataContainerRowsInApprovedWS(supplierObj, step, "ATC_EmailAddress");
	var completeMainDCRows = getDataContainerRowsInMainWorkspace(supplierObj, step, "ATC_EmailAddress");
    	var info = "";
	  	info += "<br><html><table style=\"border-collapse:collapse;border:none;\">";
          info += "<tr><td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>Previous Value</strong></p></td>";
          info += "<td style=\"padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(222, 222, 222);\"><p style=\"font-family:'arial';color:black;font-size:17px;text-align:center;'\"><strong>New Value</strong></p></td>";
     //checking email id with RohsReach note Added in the creation request       
	if(!mainDCRows.isEmpty() && ("Segment A+C Creation".equals(workflowType)||"Segment A+B Creation".equals(workflowType))){
		flag = true;
		for (var i = mainDCRows.iterator(); i.hasNext();) {
        		var mainDCRow = i.next();
        		var mainValue=mainDCRow.getValue("AT_EmailAddress").getSimpleValue();       		
             	info += "<tr><td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\"> did not exist </p></td>";
			info += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + mainValue + "</p></td></tr>";
		}
	}
	else if("GD".equals(changeRequestType)||"GDBD".equals(changeRequestType)){
		
    		for (var i = approvedDCRows.iterator(); i.hasNext();) {
        		var approvedDCRow = i.next();
        		//checking email id with RohsReach note removed
			if (!mainDCRows.contains(approvedDCRow) && !completeMainDCRows.contains(approvedDCRow)) {
				flag = true;
				var removedMailId=approvedDCRow.getValue("AT_EmailAddress").getSimpleValue();
             	 	info += "<tr><td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\"> "+removedMailId+" </p></td>";
				info += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\"> Removed </p></td></tr>";
        		}
				//Checking email id that is not changed but removed the RoHS/REACH note 
        		if(!mainDCRows.contains(approvedDCRow) && completeMainDCRows.contains(approvedDCRow)){
				flag = true;
        			var approvedAttributeValue = getAttributeValueFromDCRowInApprovedWS (supplierObj, step, "ATC_EmailAddress", "AT_EmailAddress", approvedDCRow);        			
             	 	info += "<tr><td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\"> "+approvedAttributeValue+" </p></td>";
				info += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\"> Removed RoHS/REACH note from the E-mail Address: ["+approvedAttributeValue+"] </p></td></tr>";
        		}
    		}
   		for (var i = mainDCRows.iterator(); i.hasNext();) {
        		var mainDCRow = i.next();
        		var mainValue=mainDCRow.getValue("AT_EmailAddress").getSimpleValue();
        		var approvedAttributeValue =getAttributeValueFromDCRowInApprovedWS (supplierObj, step, "ATC_EmailAddress", "AT_EmailAddress", mainDCRow);
			//checking email id with RohsReach note Added
			if (!approvedDCRows.contains(mainDCRow) && !completeApprovedDCRows.contains(mainDCRow)) {
            		flag = true;
            		newMailIdList.add(mainValue);            		
             	 	info += "<tr><td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\"> did not exist </p></td>";
				info += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\">" + mainValue + "</p></td></tr>";
        		}
        		//Checking email id that is not changed but added the note as RohsReach
        		if (!approvedDCRows.contains(mainDCRow) && completeApprovedDCRows.contains(mainDCRow)) {
            		flag = true;        
             	 	info += "<tr><td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\"> "+approvedAttributeValue+"  </p></td>";
				info += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\"> Added RoHS/REACH note to the E-mail Address: ["+mainValue+"]</p></td></tr>";
        		}
       		//checking email id with RohsReach note got changed
			if(approvedDCRows.contains(mainDCRow) && mainValue!=approvedAttributeValue && !newMailIdList.contains(mainValue)){
       			flag = true;        			
             	 	info += "<tr><td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\"> "+approvedAttributeValue+" </p></td>";
				info += "<td style=\"border: 1pt solid black;background: white;\"><p style=\"font-size:15px;text-align:center;'\"> "+mainValue+" </p></td></tr>";
       		}
    		}
	}
	info +="</table>";
   	if(flag==true){
		sendRoHSREACHEmailChangeNotification(node, step, mailer,info);
   	}
}


/**
 * @desc function to send email notification When any changes/addition/Removal of RohsReach email address happens
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-13605
 * @author Tomcy Thankachan <TOMCY.THANKACHAN-ext@bshg.com> 
 * @param {Node} node Current object (Request)
 * @param {Step} step Step manager
 * @param {MailHome} mailer Mail Home
 * @returns 
 */

function sendRoHSREACHEmailChangeNotification(node, step, mailer,info) {
	var userID = node.getValue("AT_RequestorAssignee").getSimpleValue();
	var requesterUser = step.getUserHome().getUserByID(userID);
	var workflowType = node.getValue("AT_ChangeRequestWFType").getID();
	var changeRequestType = node.getValue("AT_TypeOfChangeRequest").getID();
	if(requesterUser){
		var userDetails = getUserDetails(step, userID);
		var userEmail = userDetails.userEmail;
		var userName = userDetails.userName;
		var supplierObj = getSupplierFromRequest(node, step);
		var sapId = supplierObj.getValue("AT_SAPR3Reference").getSimpleValue();
		var linkDetails = getMailLinks(node, step);
		var smdtLink =  linkDetails.SmdLink;
		var suplGlobalVariables = step.getClassificationHome().getClassificationByID("SupplierVariables");
		var subject="";
		var body="";
		var systemURL = suplGlobalVariables.getValue("AT_SystemURL").getSimpleValue();
		var supplierURL=systemURL+"webui/SupplierWebUI#contextID=Global&workspaceID=Main&screen=DetailScreen_Supplier&selection="+supplierObj.getID()+"&nodeType=entity&selectedTab=450412263.0&displayMode=126510176.0";
		var supplierLInk="<a href="+supplierURL+">"+supplierObj.getID()+" </a>";
		var lookupTableID = "LT_LocalSpecialistMailTemplates";
		var toList = getLookupValue(step, "RoHS_REACH_mail_list", lookupTableID);
		if("Segment A+C Creation".equals(workflowType)||"Segment A+B Creation".equals(workflowType)){
			subject = "Attention! Creation of a supplier ["+ supplierObj.getID()+ " ( SAP ID:  " + sapId + " ) " + supplierObj.getName() + " ] with RoHS/REACH email";
 			body = "<html><head>";
				body+= "Hi,<br><br>";
				body+="User ["+userName+" , "+userEmail+"]  has created a supplier [ "+supplierLInk+" , "+supplierObj.getName()+" ] with RoHS/REACH email address <br><br>";
				body+=info;
				body+= "<br><br>Thanks & Regards,<br>Supplier Master Data Team"; 
				body+= "<br><a href="+smdtLink+">Our Website";
   		}
   		if("GD".equals(changeRequestType)||"GDBD".equals(changeRequestType)){
   			subject = "Attention! Change for RoHS/REACH email for supplier [" +supplierObj.getID()+ " ( SAP ID:  " + sapId + " ) " + supplierObj.getName()+" ]";
   			body = "<html><head>";
				body+= "Hi,<br><br>";
				body+="User ["+userName+" , "+userEmail+"] has made a change for RoHS/REACH email address for supplier [ "+supplierLInk+" , "+supplierObj.getName()+" ] <br><br>"
				body+=info;
				body+= "<br><br>Thanks & Regards,<br>Supplier Master Data Team"; 
				body+= "<br><a href="+smdtLink+">Our Website"; 	
   		}
		sendMail(mailer, toList, subject, body);		
	}
}
/**
 * @desc function to check the partner Bank Mandatory value 0001
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-15447
 * @author Tomcy Thankachan <TOMCY.THANKACHAN-ext@bshg.com> 
 * 
 * @returns 
 */
function partnerBankMandatoryValueCheck(bankReference,partnerBank) {
	var count = 0;
	if(!bankReference.isEmpty()) {
		for(var j=0; j<bankReference.size(); j++) {
			var tempBankObj = bankReference.get(j).getTarget();
			var tempPartnerBankType = tempBankObj.getValue("AT_PartnerBankType").getSimpleValue();
			if(tempPartnerBankType != null && partnerBank == tempPartnerBankType) {
				count+=1;
			}
		}
	}
	if(count==0 || count > 1) {
		return true;
	}
	return false;
}
/**
 * @desc function to reset value of Payment Day Range
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-16605
 * @author Tomcy Thankachan <TOMCY.THANKACHAN-ext@bshg.com> 
 * @param {Node} node Current object 
 * @param {Step} step Step manager
 * @returns 
 */
function checkPayementTermandDayRangeValue(node,step){
	if(!"Not in Approved workspace".equals(node.getApprovalStatus())){
		var termsOfPayment = node.getValue("AT_TermsOfPayment").getSimpleValue();
		var termsOfPaymentDayRange = node.getValue("AT_TermsOfPaymentDayRange").getID();
		var unApprovedAttributeList = new java.util.HashSet();
		var isTermsOfPaymentChanged =compareMainAndApprovedWsValues(node, step, "AT_TermsOfPayment");
		var unApprovedPOs=node.getNonApprovedObjects();
		for (var k = unApprovedPOs.iterator(); k.hasNext(); ) {
			var unApprovedPOObject = k.next();
			if(unApprovedPOObject && unApprovedPOObject instanceof com.stibo.core.domain.partobject.ValuePartObject){
				var attrId=unApprovedPOObject.getAttributeID();
				unApprovedAttributeList.add(attrId);
			}
		}
		if(isTermsOfPaymentChanged && !unApprovedAttributeList.contains("AT_TermsOfPaymentDayRange")){
			node.getValue("AT_TermsOfPaymentDayRange").deleteCurrent();
		}
	}
}
/**
 * @desc function to send Reblock Reminder Mail To Requestor
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-11606
 * @author Tomcy Thankachan <TOMCY.THANKACHAN-ext@bshg.com> 
 * @param {Node} node Current object 
 * @param {Step} step Step manager
 * @param {MailHome} mailer Mail Home
 * @returns 
 */
function  sendReblockReminderMailToRequestor(node, step, mailer) {
	var userID = node.getValue("AT_RequestorAssignee").getSimpleValue();
	var requesterUser = step.getUserHome().getUserByID(userID);
	var requestonBehalfOf = node.getValue("AT_RequestCreatedOnBehalfOf").getSimpleValue();
	if(requesterUser){
		var userDetails = getUserDetails(step, userID);
		var userEmail = userDetails.userEmail;
		var userName = userDetails.userName;
		var supplierObj = getSupplierFromRequest(node, step);
		var sapId = supplierObj.getValue("AT_SAPR3Reference").getSimpleValue();
		var linkDetails = getMailLinks(node, step);
		var smdtLink =  linkDetails.SmdLink;
		var suplGlobalVariables = step.getClassificationHome().getClassificationByID("SupplierVariables");
		var systemURL = suplGlobalVariables.getValue("AT_SystemURL").getSimpleValue();
		var requestURL = systemURL + "webui/SupplierWebUI#contextID=en_US&workspaceID=Main&selection="+node.getID()+"&nodeType=entity&workflowID=WF_SupplierChange&stateID=CH_TemporarilyUnblocked&bbadf.inv=0&selectedTab=705419466.1_2378723593.0&displayMode=126510176.0";
		var supplierURL=systemURL+"webui/SupplierWebUI#contextID=Global&workspaceID=Main&screen=DetailScreen_Supplier&selection="+supplierObj.getID()+"&nodeType=entity&selectedTab=450412263.0&displayMode=126510176.0";
		var requestLink="<a href="+requestURL+">"+node.getID()+" </a>";
		var supplierLInk="<a href="+supplierURL+">"+supplierObj.getID()+" </a>";
		var deadline = node.getWorkflowInstanceByID("WF_SupplierChange").getTaskByID("CH_TemporarilyUnblocked").getDeadline();
			var subject = "Reminder! Supplier ["+ supplierObj.getID() + " ( " + " SAP ID : " + sapId + " ) " + supplierObj.getName()+ " ] is going to be re-blocked tomorrow";
			var body = "<html><head>";
				body+=  "Dear "+userName+",<br><br>";
				body+= 	"Supplier [ "+supplierLInk+" , "+supplierObj.getName()+" ] which has been temporarily unblocked by you, is going to be re-blocked tomorrow. If needed, you can postpone the deadline by entering your request "+requestLink+"  and clicking 'Postpone re-blocking' button, otherwise it will be automatically re-blocked."
				body+= "<br><br>Thanks & Regards,<br>Supplier Master Data Team"; 
				body+= "<br><a href="+smdtLink+">Our Website"; 	
		if(requestonBehalfOf) {
			sendMailWithCC(mailer, userEmail, requestonBehalfOf, subject, body);
		}
		else {
			sendMail(mailer, userEmail, subject, body);
		}
	}
}
/**
 * @desc function to validate Manufacturing Plant
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-17263
 * @author Tomcy Thankachan <TOMCY.THANKACHAN-ext@bshg.com> 
 * @param {Node} node Current object (Purchasing Organization)
 * @param {Step} step Step manager
 * @returns boolean true if there is no Manufacturing Plant
 */
function validateManufacturingPlant(node, step, isSupplierAddrSameAsFactoryAddr, isCreateNewManufactPlant) {
	var partnerFunctionReferences = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierPurchasingDataToSupplier"));
	var pfList = new java.util.HashSet();
	var isSupplierAddrSameAsFactoryAddr = node.getValue("AT_IsSupplierAddrSameAsFactoryAddr").getID();
	var isCreateNewManufactPlant= node.getValue("AT_IsNewManuFactPlantNeeded").getID();
	for(var i=0;i<partnerFunctionReferences.size();i++) {
		var reference = partnerFunctionReferences.get(i);
		var partnerFun = reference.getValue("AT_SuplPartnerFunction").getSimpleValue();
		if(partnerFun!= null && partnerFun.indexOf("Manufacturing plant") != -1){
			pfList.add(partnerFun);
		}
	}
	if("N".equals(isSupplierAddrSameAsFactoryAddr) && "N".equals(isCreateNewManufactPlant) && !pfList.contains("Manufacturing plant")){
		return true;
	}
	return false;
}
/**
 * @desc function to validate China Custom Fields
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-9773
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-5532
 * @author Tomcy Thankachan <TOMCY.THANKACHAN-ext@bshg.com> 
 * @param {Node} node Current object (Supplier)
 * @param {Step} step Step manager
 * @returns boolean true if there is no value in export Certificates and Business License Type
 */
function validateCNCustomFields (node, step) {
	var errorMessage = "";
	var countryCode = getAddressDetails(node, step, "REF_SupplierToAddress").countryCode;
	var exportCertificates = getAttributeValue(node, "AT_ExportLicense");
	var businessLicenseType = node.getValue("AT_BusinessLicenseType").getID();
	var businessLicenseExpireDate = getAttributeValue(node, "AT_BusinessLicenseExpireDate");
	if("CN".equals(countryCode) && exportCertificates == null){
		errorMessage = "Missing value: Export License\n";
	}
	if("CN".equals(countryCode) && businessLicenseType == null){
		errorMessage += "Missing value: Business License Type\n";
	}
	if("CN".equals(countryCode) &&  "S".equals(businessLicenseType) && businessLicenseExpireDate == null){
		errorMessage += "Missing value: Business License Expire Date\n";
	}
return errorMessage;
}
/**
 * @desc function to set Busines License Expire Date Value to null
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-5532
 * @author Tomcy Thankachan <TOMCY.THANKACHAN-ext@bshg.com> 
 * @param {Node} node Current object (Supplier)
 * @param {Step} step Step manager
 * @returns 
 */
function CheckBusinessLicenseTypeValues (node, step) {
	var countryCode = getAddressDetails(node, step, "REF_SupplierToAddress").countryCode;
	var businessLicenseType = node.getValue("AT_BusinessLicenseType").getID();
	if("CN".equals(countryCode) && ( "L".equals(businessLicenseType) || "N".equals(businessLicenseType))){
		node.getValue("AT_BusinessLicenseExpireDate").setSimpleValue(null);
	}
}
/**
 * @desc function to Set Default flag and Mandatory for Telephone
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-9889
 * @author Tomcy Thankachan <TOMCY.THANKACHAN-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns
 */
function autoPopulateContactData(node, step){
	var telephoneCheck = populateCountryDiallingCodeAndDefaultFlag(node,step, "ATC_TelephoneNumbers", "AT_TelephoneNumber", "CountryCode");
	var mobileCheck = populateCountryDiallingCodeAndDefaultFlag(node,step, "ATC_MobileNumbers", "AT_MobileNumber", "CountryCode");
	var faxCheck = populateCountryDiallingCodeAndDefaultFlag(node,step, "ATC_FaxNumbers", "AT_FaxNumber", "CountryCode");
	var emailCheck = populateCountryDiallingCodeAndDefaultFlag(node,step, "ATC_EmailAddress", "AT_EmailAddress", "NoCountryCode");
	var internetCheck = populateCountryDiallingCodeAndDefaultFlag(node, step,"ATC_InternetAddress", "AT_InternetAddress", "NoCountryCode");
}
/**
 * @desc function to Set Default flag and Mandatory for Telephone
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-9889
 * @author Tomcy Thankachan <TOMCY.THANKACHAN-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {String} dataContainerID ID of the Communication data containers ex-ATC_TelephoneNumbers
 * @param {String} attributeID attributes of the datacontainer
 * @returns
 */
function populateCountryDiallingCodeAndDefaultFlag (node , step, dataContainerID, attributeID,checkCountryCode){
	var supplierCountryCode = getAddressDetails(node, step, "REF_SupplierToAddress").countryCode;
	var dc = node.getDataContainerByTypeID(dataContainerID).getDataContainers();
	var itr = dc.iterator();
	var count=0;
	while(itr.hasNext()){
		var dcObj = itr.next().getDataContainerObject();
			var countryDiallingCode = dcObj.getValue("AT_CountryDialingCode").getSimpleValue();
			var defaultFlag = dcObj.getValue("AT_DefaultFlag").getID();
			if(checkCountryCode == "CountryCode"){
				if(!countryDiallingCode) {
					dcObj.getValue("AT_CountryDialingCode").setLOVValueByID(supplierCountryCode);
				}
			}
			if(defaultFlag == "Y"){
				count++;
			}
			if(count==0 && (dc.size()==1) ){
				dcObj.getValue("AT_DefaultFlag").setLOVValueByID("Y");
			}
	}
}
/**
 * @desc function to check Telephone Number And Fax Number Changes
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-20010
 * @author Tomcy Thankachan <TOMCY.THANKACHAN-ext@bshg.com> 
 * @param {Node} node Current object (Request)
 * @param {Step} step Step manager
 * @param vatResponse 
 */
function setVatResponseRecord(requestObj,step,vatResponse){
	var existingVatResponseRecord = requestObj.getValue("AT_VatServiceResponseRecord").getSimpleValue();
	if(existingVatResponseRecord && !existingVatResponseRecord.includes(vatResponse)) {
		var revisedVatResposerecord = vatResponse + "<multisep/>" + existingVatResponseRecord;
		setAttributeValue(requestObj, "AT_VatServiceResponseRecord", revisedVatResposerecord);
	}
	else if(existingVatResponseRecord==null){
		setAttributeValue(requestObj, "AT_VatServiceResponseRecord", vatResponse);
	}
}
/**
 * @desc function to set VAT number
 * @link
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {String} countryCode country code of the supplier or customer.
 * @param {String} taxNumber valid tax number.
 * @returns
 */
// Below code we will remove - TAX_DC_REMOVAL
/*function setVatNumber(node, step, countryCode, taxNumber) {
	var vatNumber = countryCode+taxNumber;
	deleteLocalDataContainerRow(node, step, "ATC_TaxInformation", "AT_TaxCat", "VAT Number"); //delete already populated VAT number if VAT number is added
	newDataContainerRow = createDataCointainerByKeyAttribute(node, step, "ATC_TaxInformation", "AT_TaxCat", "VAT Number");
	newDataContainerRow.getValue("AT_TaxNumber").setSimpleValue(vatNumber);
}*/

/**
 * @desc function to set VAT number
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-3647}
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {GWEP} vatGateWay bind to the VAT checker endpoint.
 * @param {String} countryCode Country Code of the supplier.
 * @param {String} inputVatNumber Valid VAT number generated after TAX validations Code of the supplier.
 * @returns
 */
function setVatResponseFromVS(node, step, vatGateWay, countryCode, inputVatNumber) {
	var serviceBodyText='{ "vatNumber": "' + inputVatNumber + '","countryCode": "' + countryCode +  '" }';
	try {
		var result=vatGateWay.post().pathElements("http","rb.bsh.mdm.vat.check.EXT").body(serviceBodyText).invoke();
		result = JSON.parse(result)
		result["vatNumber"] = countryCode + inputVatNumber;
		node.getValue("AT_VatServiceResponse").setSimpleValue(JSON.stringify(result));
	}
	catch(e) {
		node.getValue("AT_VatServiceResponse").setSimpleValue("Error Response");
	}
}

/**
 * @desc function to fetch tax number for the given tax category
 * @link
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {String} countryCode country code of the supplier or customer.
 * @param {String} taxNumber valid tax number.
 * @returns {String} returns value of the tax number else null
 */
// Below code we will remove - TAX_DC_REMOVAL
/*function getTaxDetails(node, step, taxCatvalueID) {
	var dataContainers = node.getDataContainerByTypeID("ATC_TaxInformation").getDataContainers();
	var itr = dataContainers.iterator();
	while (itr.hasNext()){
		var dcObject = itr.next().getDataContainerObject();
		var dcAttrCat = dcObject.getValue("AT_TaxCat").getSimpleValue();
		if(taxCatvalueID.equals(dcAttrCat)) {
			return dcObject.getValue("AT_TaxNumber").getSimpleValue();
		}
	}
	return null;
}*/

/**
 * @desc function to Set Bank Master Data on Bank Account level
 * @link
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {Object} bank Bank Master object.
 * @returns
 */
function setBankDetailsOnAccount(node, step, bank) {
	var bankAttributes = ["AT_SWIFT", "AT_BankName", "AT_BankNumber", "AT_BankKey", "AT_BankBranch", "AT_BankGroup", "AT_Country", "AT_IBANRule", "AT_CheckDigitCalcMethod", 
						  "AT_DeletionIndicator", "AT_FormatFileBank", "AT_PostofficeBankCurAcct", "AT_PostOfficeBankCurracctNum"];
	var bankDetails = "";
	for(var i=0;i<bankAttributes.length;i++) {
		var bankAttributeID = bankAttributes[i];
		var bankAttributeName = step.getAttributeHome().getAttributeByID(bankAttributeID).getName();
		var bankAttributeValue = bank.getValue(bankAttributeID).getSimpleValue();
		if(!bankAttributeValue) {
			bankAttributeValue = "";
		}
		bankDetails = bankDetails + bankAttributeName +" : "+ bankAttributeValue +"\n";
	}
	if(bankDetails) {
		node.getValue("AT_BankDetails").setSimpleValue(bankDetails);
	}
	
}

/**
 * @desc function to Set Default flag and Mandatory for Telephone
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-4179
 * @author Manisha Kunku <Manisha.kunku-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {String} dataContainerID ID of the Communication data containers ex-ATC_TelephoneNumbers
 * @param {String} attributeID attributes of the datacontainer
 * @param {String} checkCountryCode country code of the supplier
 * @returns
 */
function mandatoryCheckForDataContainer(step, node, dataContainerID, attributeID, checkCountryCode){
	var dc = node.getDataContainerByTypeID(dataContainerID).getDataContainers();
	var count = 0;
	var flag = false;
	var errorMessage = "";
	var supplierCountryCode = getAddressDetails(node, step, "REF_SupplierToAddress").countryCode;
	var countryCodeName = step.getAttributeHome().getAttributeByID("AT_CountryDialingCode").getName();
	var attributeName = step.getAttributeHome().getAttributeByID(attributeID).getName();
	var defaultFlagName = step.getAttributeHome().getAttributeByID("AT_DefaultFlag").getName();
	var itr = dc.iterator();
	while(itr.hasNext()){
		var dcObj = itr.next().getDataContainerObject();
		if(checkCountryCode == "CountryCode"){
			var countryDiallingCode = dcObj.getValue("AT_CountryDialingCode").getSimpleValue();
			var attributeValue = dcObj.getValue(attributeID).getSimpleValue();
			var defaultFlag = dcObj.getValue("AT_DefaultFlag").getID();
			if(!attributeValue){
			   flag = true; 
			}
		}
		else{
			var attributeValue = dcObj.getValue(attributeID).getSimpleValue();
			var defaultFlag = dcObj.getValue("AT_DefaultFlag").getID();
			if(!attributeValue){
			   flag = true; 
			}
		}
		if(defaultFlag == "Y"){
			count++;
		}
	}
	if(flag == true){
		errorMessage = "Missing value: "+attributeName+".\n";
	}
	if((count > 1 || count == 0) && (dc.size() > 1)){
		errorMessage += "Missing value: "+defaultFlagName+" (Warning: only one for all "+attributeName+")";
	}
	if(errorMessage != ""){
		return errorMessage;
	}
	return true;
}
/**
 * @desc function to Mandatory for BankAccountBumber and PartnerBankType
 * @link
 * @author Manisha Kunku <Manisha.kunku-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {referenceID} ID of the defined reference between the two objects
 * @returns
 */
function checkReferenceMandatoryFields(node, step, referenceID, mandatoryAttributeList) {
	var errorMessage = "";
	var references = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID(referenceID));
	if (!references.isEmpty()){
		for(var i=0; i<references.size(); i++) {
			var referenceTarget = references.get(i).getTarget();
			for(var j=0;j<mandatoryAttributeList.length;j++) {
				var attributeID = mandatoryAttributeList[j];
				var attributeName = step.getAttributeHome().getAttributeByID(attributeID).getName();
				var attributeValue = referenceTarget.getValue(attributeID).getSimpleValue();
				if(!attributeValue) {
					errorMessage = errorMessage + "Missing Value: "+attributeName+" for "+referenceTarget.getName()+"\n";
				}
			}
		}
		
	}else{
		return true;
	}
	if(errorMessage != ""){
		return errorMessage;
	}
	return true;
}

/**
 * @desc function to Partner Functions 
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-6587
 * @author Manisha Kunku <Manisha.kunku-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns
 */
function supplierPartnerFunctionValidations(node, step) {	
	var cHashSet = new java.util.HashSet("");
	var fHashSet = new java.util.HashSet("");
	var error = "";
	var supplierID = node.getID().slice(0, node.getID().indexOf("-"));
	var supplierObj = step.getEntityHome().getEntityByID(supplierID);
	var supplierName = supplierObj.getName();
	var SupplierAcctGrpRef = supplierObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToAccountGrp"));
	var partnerFunctionRef = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierPurchasingDataToSupplier"));
	
	if (!SupplierAcctGrpRef.isEmpty()) {
		var accountGrpObj = SupplierAcctGrpRef.get(0).getTarget();
		var MandatoryAttrValue = accountGrpObj.getValue("AT_SuplMandatoryPartnerFunction").getSimpleValue();
		var NonChangeableAttrValue = accountGrpObj.getValue("AT_SuplNonChangebleManPartnerFunction").getSimpleValue();
		var MandatoryAttrValuesHashSet = convertSplitValueToHashSet (MandatoryAttrValue, "<multisep/>");
		var NonChangeableAttrValuesHashSet = convertSplitValueToHashSet (NonChangeableAttrValue, "<multisep/>");
	}
	if (!partnerFunctionRef.isEmpty()){
		for(var i=0; i<partnerFunctionRef.size(); i++){
			var targets = partnerFunctionRef.get(i).getTarget();
			var targetsID = targets.getID();
			var attValues = partnerFunctionRef.get(i).getValue("AT_SuplPartnerFunction").getSimpleValue();
			if(attValues){
				var split = attValues.split("<multisep/>");
				for(var j=0;j<split.length;j++){
					var value1 = split[j];
					cHashSet.add(value1);
				}
				if(targetsID == supplierID){
						var userEnteredParent = convertSplitValueToHashSet (attValues, "<multisep/>");
				}
				if(targetsID != supplierID){
						var userEnteredNonParent = convertSplitValueToHashSet (attValues, "<multisep/>");
				}
			}
			else{
				error += "Please add at least one partner function for the supplier '"+targets.getID()+"' or remove the supplier.\n";
			}
		}
	}
	
	if(userEnteredParent && NonChangeableAttrValuesHashSet && !userEnteredParent.containsAll(NonChangeableAttrValuesHashSet)){
		var arrayH = userEnteredParent.toArray();
		for(var a=0; a<arrayH.length;a++){
			NonChangeableAttrValuesHashSet.remove(arrayH[a]);
		}
		error += "Please link the Partners " + NonChangeableAttrValuesHashSet + " to the supplier '"+supplierName+ "'. \n";
	}
	
	if(MandatoryAttrValuesHashSet && cHashSet && !cHashSet.containsAll(MandatoryAttrValuesHashSet)){
		var arrayH1 = cHashSet.toArray();
		for(var b=0; b<arrayH1.length;b++){
			MandatoryAttrValuesHashSet.remove(arrayH1[b]);
		}
		if(NonChangeableAttrValuesHashSet){
			var arrayH2 = NonChangeableAttrValuesHashSet.toArray();
			for(var d=0; d<arrayH2.length;d++){
				MandatoryAttrValuesHashSet.remove(arrayH2[d]);
			}
		}
		var arrayH5 = MandatoryAttrValuesHashSet.toArray();
		if(arrayH5.length>0){
			error += "Please add the partners " + MandatoryAttrValuesHashSet + " as they are mandatory.\n";
		}
	}
	
	if(userEnteredNonParent && NonChangeableAttrValuesHashSet){
		var itr = userEnteredNonParent.iterator();
		while(itr.hasNext()){
			var curr = itr.next();
			if(NonChangeableAttrValuesHashSet.contains(curr)){
				fHashSet.add(curr);
			}
		}
		var arrayH4 = fHashSet.toArray();
		if(arrayH4.length>0){
			error += "Please remove "+ fHashSet + " from other supplier as it is valid only for '"+supplierName+ "'.\n";
		}
	}
	return error;
}

/**
 * @desc function to Partner Functions for Supplier is there PO or not 
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-5673
 * @author Manisha Kunku <Manisha.kunku-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns
 */
 
function isPartnerPOExtended(node, step) {
var errorMessage = "";
var supplierID = node.getID().slice(0, node.getID().indexOf("-"));
var purchasingOrg = node.getValue("AT_PurchasingOrganization").getSimpleValue();
var partnerFunref = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierPurchasingDataToSupplier"));
	for(var j=0; j<partnerFunref.size();j++){
		var flag = false;
		var supRef = partnerFunref.get(j);
		var supObj = supRef.getTarget();
		var supPartFun = supRef.getValue("AT_SuplPartnerFunction").getSimpleValue();
		if(supPartFun != null) {
			if(supplierID != supObj.getID() && supPartFun.indexOf("Goods supplier") != -1){
				var refObjs = supObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierPurchasingData"));
				for(var i=0; i<refObjs.size(); i++) {
					var refObj = refObjs.get(i).getTarget();
					var purOrg = refObj.getValue("AT_PurchasingOrganization").getSimpleValue();
					if(purchasingOrg == purOrg){
						flag = true;
						break
					}
				}
				if(flag == false){
					errorMessage+= "Supplier '"+supObj.getID()+"' must be firstly extended for the purchasing organization '"+purchasingOrg+"'.\n";
				}
			}
		}
	}
	return errorMessage;
}

/**
 * @desc function to Populate Goods Supplier and Ordering address values. 
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-7506
 * @author Manisha Kunku <Manisha.kunku-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns
 */
function populateGoodsSupplierAndOrderingAddress(node, step) {
	var goodsSupplierID = null;
	var orderingAddressSupplierID = null;
	var partnerFunctionReferences = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierPurchasingDataToSupplier"));
	for(var i=0;i<partnerFunctionReferences.size();i++) {
		var partnerFunctionReferenceObj = partnerFunctionReferences.get(i);
		var partnerFunctionTargetSupplierID = partnerFunctionReferenceObj.getTarget().getID();
		var partnerFunction = partnerFunctionReferenceObj.getValue("AT_SuplPartnerFunction").getSimpleValue();
		if(partnerFunction && partnerFunction.indexOf("Goods supplier") != -1) {
			goodsSupplierID = partnerFunctionTargetSupplierID;
		}
		else if(partnerFunction && partnerFunction.indexOf("Ordering address") != -1) {
			orderingAddressSupplierID = partnerFunctionTargetSupplierID;
		}
	}
	node.getValue("AT_GoodsSupplier").setSimpleValue(goodsSupplierID);
	node.getValue("AT_OrderingAddress").setSimpleValue(orderingAddressSupplierID);
}

/**
 * @desc function to Validate for BankAccount Details
 * @link
 * @author Savita Kandgule <Savita.Mannalle-ext@bshg.com>
 * @param {Step} step Step manager.
 * @param {Node} node current object.
 * @param {String} countryCode country code of the supplier.
 * @param {String} validationLookupTableID ID of the validation lookup table.
 * @param {String} errorMessageLookupTableID ID of the error message lookup table.
 * @returns
 */
 function validateBankAccountDetails(node, step, countryCode, validationLookupTableID, errorMessageLookupTableID){
	var ref = step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToBankAccount");
	var bankReference = node.getReferences(ref);
	if (!bankReference.isEmpty()){
		var  errorMessage = "";
		var partnerBankMandatoryValue=partnerBankMandatoryValueCheck(bankReference,"0001");
		for(var i=0; i<bankReference.size(); i++) {
			var bankAccObj = bankReference.get(i).getTarget();
			
			var bankObj = bankAccObj.getParent();
			var bankAccountNo = bankAccObj.getValue("AT_NumberOfBankAccount").getSimpleValue();
			var iban = bankAccObj.getValue("AT_IBAN").getSimpleValue();
			var bankControlKey = bankAccObj.getValue("AT_BankControlKey").getSimpleValue();
			var partnerBank = bankAccObj.getValue("AT_PartnerBankType").getSimpleValue();
			var accountHolderName = bankAccObj.getValue("AT_AccountHolderName").getSimpleValue();
			var collectionAuthorization = bankAccObj.getValue("AT_CollectionAuthorization").getSimpleValue();
			var bankCountryName = bankObj.getValue("AT_Country").getSimpleValue();
			var bankCountryCode = bankObj.getValue("AT_Country").getLOVValue().getID();
			var bankNumber = bankObj.getValue("AT_BankNumber").getSimpleValue();
			var currency = bankObj.getValue("AT_OrderCurrency").getSimpleValue();
						
			var bankAccountNoLookUpFrom = bankCountryCode+"-NumberOfBankAccount";
			var bankNumberNoLookUpFrom = bankCountryCode+"-AT_BankNumber";
			var ibanLookUpFrom = bankCountryCode+"-IBAN";
			var bankControlKeyLookUpFrom = bankCountryCode+"-BankControlKey";
			var partnerBankLookUpFrom = bankCountryCode+"-PartnerBankType";
			var currencyLookUpFrom = bankCountryCode+"-currency";
			
			var bankAccountNoValidationRegex = getLookupValue(step, bankAccountNoLookUpFrom, validationLookupTableID);
			var bankNumberValidationRegex = getLookupValue(step, bankNumberNoLookUpFrom, validationLookupTableID);
			var ibanValidationRegex = getLookupValue(step, ibanLookUpFrom, validationLookupTableID);
			var bankControlKeyValidationRegex = getLookupValue(step, bankControlKeyLookUpFrom, validationLookupTableID);
			var partnerBankValidationRegex = getLookupValue(step, partnerBankLookUpFrom, validationLookupTableID);
			var currencyValidationRegex = getLookupValue(step, currencyLookUpFrom , validationLookupTableID);
			
			
			var partnerBankAlreadyAdded = isPartnerBankAlreadyAdded(partnerBank);
			if(bankNumber && bankNumberValidationRegex != null && !bankNumber.match(bankNumberValidationRegex)) {
				var error =  getLookupValue(step, bankNumberNoLookUpFrom, errorMessageLookupTableID);
				errorMessage = error+" for "+ bankCountryName +"\n";
			}if(bankAccountNo && bankAccountNoValidationRegex != null && !bankAccountNo.match(bankAccountNoValidationRegex)) {
				var error =  getLookupValue(step, bankAccountNoLookUpFrom, errorMessageLookupTableID);
				errorMessage = error+" for "+ bankCountryName +"\n";
			}if(iban && ibanValidationRegex != null && !iban.match(ibanValidationRegex)) {
				var error =  getLookupValue(step, ibanLookUpFrom, errorMessageLookupTableID);
				errorMessage += error+"\n";
			}if(bankControlKey && bankControlKeyValidationRegex != null && !bankControlKey.match(bankControlKeyValidationRegex)){
				var error1 =  getLookupValue(step, bankControlKeyLookUpFrom, errorMessageLookupTableID);
				errorMessage+= error1+"\n";
			}if(partnerBank && partnerBankValidationRegex != null && !partnerBank.match(partnerBankValidationRegex) && i>=0){
				var error2 =  getLookupValue(step, partnerBankLookUpFrom, errorMessageLookupTableID);
				errorMessage+= error2+"\n";	
			}if(partnerBankAlreadyAdded) {
				errorMessage+="Partner Bank Type "+partnerBank+"is already added, we can't have duplicate partner bank type values "+bankAccObj.getName()+"\n";
			}if(currency && currencyValidationRegex != null && !Currency.match(currencyValidationRegex) && i>0){
				var error =  getLookupValue(step, CurrencyLookUpFrom, errorMessageLookupTableID);
				errorMessage += error+"\n";
			}if(!accountHolderName && (countryCode == "IN" || bankCountryCode == "IN")) {
				var attrName = step.getAttributeHome().getAttributeByID("AT_AccountHolderName").getName();
				errorMessage += "Missing value: Bank "+attrName+" Name\n";
			}
		}
		if(partnerBankMandatoryValue){
			errorMessage+="\n Please verify Partner Bank Type values for bank details! Exactly one bank entry should be marked with Partner Bank Type '0001'\n";
		}
		
	}else{
		return true;
	}
	if(errorMessage != ""){
		return errorMessage;
	}
	return true;
	
	function isPartnerBankAlreadyAdded(partnerBank) {
		var count = 0;
		if(!bankReference.isEmpty()) {
			for(var j=0; j<bankReference.size(); j++) {
				var tempBankObj = bankReference.get(j).getTarget();
				var tempPartnerBankType = tempBankObj.getValue("AT_PartnerBankType").getSimpleValue();
				if(tempPartnerBankType != null && partnerBank == tempPartnerBankType) {
					count+=1;
				}
			}
		}
		if(count > 1) {
			return true;
		}
		return false;
   }
}


/**
 * @desc function to Display Error Message.
 * @link
 * @author Manisha Kunku <Manisha.kunku-ext@bshg.com>
 * @param {Node} node current object
 * @param {Step} step Step manager
 * @returns
 */

function displayErrorMessage (node, step) {
	var name1 = getAttributeValue(node, "AT_Name1");
	var addressValues = getAddressDetails(node, step, "REF_SupplierToAddress");
	var isCasaRelevant = validateCASA(node, step);
	var country = addressValues.country;
	var countryCode = getAddressDetails(node, step, "REF_SupplierToAddress").countryCode;
	var region = addressValues.region;
	var city = addressValues.city;
	var postCode = addressValues.postCode;
	var street = addressValues.street;
	var poBox = addressValues.poBox;
	var poBoxPostCode = addressValues.poBoxPostCode;
	var stdCommunicationMethod = getAttributeValue(node, "AT_STDCommunicationMethod");
	var mandatoryErrors = checkRequesterMandatoryData(node, step);
	var referenceErrors = checkSupplierRefIsApprovedOrNot (node, step);
	var currentDateTime = new java.text.SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date());
	var objdate = node.getValue("AT_LastExtReview").getSimpleValue();
	var validateCNFields = validateCNCustomFields (node, step);
	var validateNationalVersion= validateNationalVersionAttr(node, step);
	var areNameLengthsValid = isLengthValidForName1Name2Name3Name4(node, step);
	var country = node.getValue("AT_TempCountry").getSimpleValue();
	var suplGovtEnt = node.getValue("AT_Supplier_is_a_governmental_entity").getSimpleValue();
	var govtEnt = node.getValue("AT_TaxNumber2").getSimpleValue();
	var errorFlag = "";
		
		if(!isCasaRelevant ) { 	
			errorFlag += "Missing value : CASA Relevant\n";
		}
		if(!name1) {
			errorFlag += "Missing value: Name 1\n";
		}
		if(!country) {
			errorFlag += "Missing value: Country\n";
		}
		if(countryCode=="DE" && !region ) {
			errorFlag += "Missing value: Region\n";
		}
		if(!city) {
			errorFlag += "Missing value: City\n";
		}
		if(!poBox) {
			if(country == "Turkey" && suplGovtEnt == "Yes" && govtEnt == "ICRA"){
				errorFlag += "";
			}
			else {
				if(!postCode) {
					errorFlag += "Missing value: Postal Code\n";
				}
				if(!street) {
					errorFlag += "Missing value: Street or PO Box information\n";
				}
			}		
		}
		else if(!street) {
			if(country == "Turkey" && suplGovtEnt == "Yes" && govtEnt == "ICRA"){
				errorFlag += "";
			}
			else{
				if(!poBox) {
					errorFlag += "Missing value: Street or PO Box information\n";
				}
				if(!poBoxPostCode) {
					errorFlag += "Missing value: POX Box Postal Code\n";
				}
			}
		}
		if(!stdCommunicationMethod) {
			errorFlag += "Missing value: Standard Communication Method\n";
		}
		if(mandatoryErrors) {
	        errorFlag += mandatoryErrors;
          }
		if(referenceErrors) {
	        errorFlag += referenceErrors;
          }
		if(objdate > currentDateTime){
	        errorFlag += "Invalid value: Last date of validation. Cannot select future date\n";
          }
		if(validateCNFields) {
	        errorFlag += validateCNFields;
		}
		if(validateNationalVersion) {
			errorFlag += validateNationalVersion;
		}
		if(areNameLengthsValid != true){
			errorFlag += areNameLengthsValid+"\n";
		}
          return errorFlag;
}

/**
 * @desc function to populate fraud case on supplier by searching in Fraud Supplier Hierarchy.
 * @link
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Node} node current object
 * @param {Step} step Step manager
 * @param {Object} supplier Supplier object.
 * @returns
 */
function populateFraudCaseOnSupplier(node, step, supplier) {
	var attributesToCheck = ["AT_SAPR3Reference", "AT_Name1", "AT_TaxNumber", "AT_IBAN"];
	for(var i=0;i<attributesToCheck.length;i++) {
		var attributeID = attributesToCheck[i];
		var attributeValue = supplier.getValue(attributeID).getSimpleValue();
		if(attributeValue) {
			var fraudSuppliers = getObjectsByAttributeValueAndObjectType (step, "FraudSupplier", attributeID, attributeValue);
			if(fraudSuppliers.length > 0 ) {
				var fraudSupplier = fraudSuppliers[0];
				var typeOfFraudCase = fraudSupplier.getValue("AT_TypeOfFraudCase").getID();
				if(typeOfFraudCase) {
					supplier.getValue("AT_TypeOfFraudCase").setLOVValueByID(typeOfFraudCase);
				}
				break;
			}
		}
	}
}

/**
 * @desc function to send a Fraud case mail to all users when selecting any of the value in Fraud case LOV.
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-3985
 * @author Manisha Kunku <Manisha.Kunku-ext@bshg.com>
 * @param {Node} node current object
 * @param {Step} step Step manager
 * @param {Object} mailer Mail Home
 * @returns
 */
function sendFraudDetailsMail(node, step, mailer) {
	var suplGlobalVariables = step.getClassificationHome().getClassificationByID("SupplierVariables");
	var devSystemURL = suplGlobalVariables.getValue("AT_SystemURL").getSimpleValue();
	var toList = suplGlobalVariables.getValue("AT_DL_StiboSuppliers").getSimpleValue();
	var fraudSupplierID = node.getID();
	var name1 = node.getValue("AT_Name1").getSimpleValue() ? node.getValue("AT_Name1").getSimpleValue() : "No Info";
	var taxNumber = node.getValue("AT_TaxNumber").getSimpleValue() ?  node.getValue("AT_TaxNumber").getSimpleValue() : "No Info";
	var iban = node.getValue("AT_IBAN").getSimpleValue() ? node.getValue("AT_IBAN").getSimpleValue() : "No Info";
	var sapId = node.getValue("AT_SAPR3Reference").getSimpleValue();
	var swift = node.getValue("AT_SWIFT").getSimpleValue()? node.getValue("AT_SWIFT").getSimpleValue() : "No Info";
	var typeOfFraudCase = node.getValue("AT_TypeOfFraudCase").getID();
	var fraudSupplierLink = devSystemURL + "webui/SupplierWebUI#contextID=en_US&workspaceID=Main&screen=DetailScreen_FraudSupplier&selection="+fraudSupplierID+"&nodeType=entity";
	var subject = "This is about Fraud case.";
	var body =  "Hi All, <br><br>";
	body+= "<Strong>Attention !!</Strong><br><br>";
	
	if("PF".equals(typeOfFraudCase)) {
		body+= "There is a <Strong>Potential fraud</Strong> on the following supplier<br><br>";
	}
	else if("RF".equals(typeOfFraudCase)) {
		body+= "There is a <Strong>Registered fraud</Strong> on the following supplier<br><br>";
	}
	else {
		body+= "We’ve received information about <Strong>fraudulent bank accounts</Strong> from Data Sharing Community (CDQ). This bank account is not used on any of BSH suppliers.<br><br>";
	}
	
	body+= "<Strong>Stibo ID: </Strong>"+fraudSupplierID+"<br>";
	body+= "<Strong>SAP ID: </Strong>"+sapId+"<br>";
	body+= "<Strong>Name: </Strong>"+name1+"<br>";
	body+= "<Strong>Tax Number: </Strong>"+taxNumber+"<br>";
	body+= "<Strong>IBAN: </Strong>"+iban+"<br>";
	body+= "<Strong>SWIFT: </Strong>"+swift+"<br><br>";	
	body+= "Please <a href="+fraudSupplierLink+">click here </a> to find out more<br><br>";
	body+= "Thanks & Regards,<br>Supplier Master Data Team";
	
	if(toList){
	   sendMail(mailer, toList, subject, body);
	}

}

/**
 * @desc function to check manadatory fields for Purchasing Organizations.
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-4968}
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Node} node current object (Purchasing Organization)
 * @param {Step} step Step manager
 */
function checkPOMandatoryData(node, step, suppObj) {
	var errorMessage = "";
	var poID = node.getID().split("-")[1];
	var supplierCountryID = getAddressDetails(suppObj, step, "REF_SupplierToAddress").countryCode;
	var supplierCategory = node.getValue("AT_SupplierCategory").getSimpleValue();
	var isSupplierAddrSameAsFactoryAddr = node.getValue("AT_IsSupplierAddrSameAsFactoryAddr").getSimpleValue();
	var purchasingOrg = node.getValue("AT_PurchasingOrganization").getSimpleValue();
	var termsOfPayment = node.getValue("AT_TermsOfPayment").getSimpleValue();
	var termsOfPaymentDayRange = node.getValue("AT_TermsOfPaymentDayRange").getID();
	var orderCurrency = node.getValue("AT_OrderCurrency").getSimpleValue();
	var incoTerms = node.getValue("AT_IncoTerms").getSimpleValue();
	var incoTerms2 = node.getValue("AT_IncoTerms2").getSimpleValue();
	var Purchasingblock = node.getValue("AT_PurchBlockForPurchOrg").getSimpleValue();
	var reasonForblockage = node.getValue("AT_ReasonForBlockage").getSimpleValue();
	var isCreateNewManufactPlant= node.getValue("AT_IsNewManuFactPlantNeeded").getSimpleValue();
	var isManuFacturingPlantNeeded = validateManufacturingPlant(node, step,isSupplierAddrSameAsFactoryAddr,isCreateNewManufactPlant)
	var returnsVendorFlag = node.getValue("AT_ReturnsVendor").getID();

	if(!supplierCategory) {
		errorMessage += "Missing value: Supplier Category\n";
	}
	if(("direct".equals(supplierCategory) || "direct/indirect".equals(supplierCategory) || "direct/indirect/OEM".equals(supplierCategory) || "direct/OEM".equals(supplierCategory)) && !isSupplierAddrSameAsFactoryAddr) {
		errorMessage += "Missing value: Is Supplier Address Same As Factory Address\n";
	}
	if(("direct".equals(supplierCategory) || "direct/indirect".equals(supplierCategory) || "direct/indirect/OEM".equals(supplierCategory) || "direct/OEM".equals(supplierCategory)) && "N".equals(isSupplierAddrSameAsFactoryAddr) && !isCreateNewManufactPlant) {
		errorMessage += "Missing value: Do you want to create a new manufacturing plant\n";
	}
	if(!purchasingOrg) {
		errorMessage += "Missing value: Purchasing Organization\n";
	}
	if("Yes".equals(Purchasingblock) && !reasonForblockage) {
		errorMessage += "Missing Value: Reason for blockage\n";
	}
	if(!termsOfPayment) {
		errorMessage += "Missing value: Terms Of Payment\n";
	}
	if(!termsOfPaymentDayRange && supplierCountryID == "PL") {
		errorMessage += "Missing value: Terms Of Payment Day Range\n";
	}
	else {
		
		if("More than 60 days".equals(termsOfPaymentDayRange)) {
			var isThisSupplierBigCompany = node.getValue("AT_IsThisSupplierBigCompany").getID();
			if(!isThisSupplierBigCompany) {
				errorMessage += "Missing Value: Is this supplier big company\n";
			}
			else if("N".equals(isThisSupplierBigCompany)) {
				errorMessage += "It is not allowed to set payment terms longer than 60 days for small or medium companies\n";
			}
			else if("Y".equals(isThisSupplierBigCompany)) {
				var isSupplierDeclarationFormAttached = hasReferenceTarget(node, step, "REF_SupplierDeclarationForm");
				if(!isSupplierDeclarationFormAttached) {
					errorMessage += "Missing attachment: Supplier Declaration Form\n";
				}
			}
		}
		else if("Less than 30 days".equals(termsOfPaymentDayRange)) {
			var isSupplierDeclarationFormAttached = hasReferenceTarget(node, step, "REF_SupplierDeclarationForm");
				if(!isSupplierDeclarationFormAttached) {
					errorMessage += "Missing attachment: Supplier Declaration Form\n";
				}
		}
	}
	if(!orderCurrency) {
		errorMessage += "Missing value: Order Currency\n";
	}
	if(!incoTerms) {
		errorMessage += "Missing value: IncoTerms\n";
	}
	if(!incoTerms2) {
		errorMessage += "Missing value: IncoTerms2\n";
	}
	if("Y".equals(returnsVendorFlag)) {
		var isPOMarkedForReturnsVendor = isLOVValueExist(step, "LOV_ValidPOsForReturnsVendor", poID);
		if(!isPOMarkedForReturnsVendor){
			errorMessage += "Returns vendor is not allowed for purchasing organization "+poID+", In case of questions please contact Supplier Master Data team\n";
		}
	}
	if(isManuFacturingPlantNeeded){
		errorMessage +="You've indicated that the address of the factory is not the same as the address of the supplier given in 'General Data' section, but there is no manufacturing plant assigned. Please create a new manufacturing plant by changing the answer to the second question to 'Yes' or assign an existing supplier as manufacturing plant, by editing 'Partner functions' section in the 'Purchasing Data' tab."
	}
	return errorMessage;
}

/**
 * @desc function to check manadatory fields for Company Codes.
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-5314}
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Node} node current object (Company Code)
 * @param {Step} step Step manager
 */
function checkCCMandatoryData(node, step) {
	var errorMessage = "";
	var reconciliationAcc = node.getValue("AT_ReconciliationAccount").getSimpleValue();
	var paymentMethod = node.getValue("AT_SuplPaymentMethods").getSimpleValue();
	var termsOfPayment = node.getValue("AT_TermsOfPayment").getSimpleValue();
	var paymentBlock = node.getValue("AT_SuplPaymentBlock").getSimpleValue();
	var reasonForPayBlock = node.getValue("AT_ReasonForPaymentBlock").getSimpleValue();
	var postingBlock = node.getValue("AT_SuplPostingBlockForCompanyCode").getSimpleValue();
	var reasonForPosBlock = node.getValue("AT_ReasonForPostingBlock").getSimpleValue();
	var checkWHTaxType=validateWHTaxType(node,step);
	var isDunningRecipientAdded = hasReferenceTarget(node,step,"REF_DunningRecipient");
	var DunningProcedure = node.getValue("AT_SuplDunningProcedure").getSimpleValue();
	var isCCodeSameInAllRefSuppErrMsg = validateCCodeForReferencedSupplier(node, step);

	if(!reconciliationAcc) {
		errorMessage += "Missing value: Reconciliation Account\n";
	}
	if(!paymentMethod) {
		errorMessage += "Missing value: Payment Methods\n";
	}
	if(!termsOfPayment) {
		errorMessage += "Missing value: Terms of Payment\n";
	}
	/* Disabling validation as its not required for segment B
	else {
		var termsOfPaymentDayRange = node.getValue("AT_TermsOfPaymentDayRange").getID();
		if("More than 60 days".equals(termsOfPaymentDayRange)) {
			var isThisSupplierBigCompany = node.getValue("AT_IsThisSupplierBigCompany").getID();
			if(!isThisSupplierBigCompany) {
				errorMessage += "Missing Value: Is this supplier big company (description of big company need to be added)\n";
			}
			else if("N".equals(isThisSupplierBigCompany)) {
				errorMessage += "It is not allowed to set payment terms longer than 60 days for small or medium companies\n";
			}
			else if("Y".equals(isThisSupplierBigCompany)) {
				var isSupplierDeclarationFormAttached = hasReferenceTarget(node, step, "REF_SupplierDeclarationForm");
				if(!isSupplierDeclarationFormAttached) {
					errorMessage += "Missing attachment: Supplier Declaration Form\n";
				}
			}
		}
		else if("Less than 30 days".equals(termsOfPaymentDayRange)) {
			var isSupplierDeclarationFormAttached = hasReferenceTarget(node, step, "REF_SupplierDeclarationForm");
				if(!isSupplierDeclarationFormAttached) {
					errorMessage += "Missing attachment: Supplier Declaration Form\n";
				}
		}
	}
	*/
	if(paymentBlock && !reasonForPayBlock) {
		errorMessage += "Missing Value: Reason for Payment Block\n";
	}
	if("Yes".equals(postingBlock) && !reasonForPosBlock) {
		errorMessage += "Missing Value: Reason for Posting Block\n";
	}
	if(checkWHTaxType){
		errorMessage += checkWHTaxType;
	}
	if(isDunningRecipientAdded && !DunningProcedure) {
		errorMessage += "Missing Value:Dunning Recipient has been defined, therefore please complete 'Dunning Procedure' field\n";
	}
	if (isCCodeSameInAllRefSuppErrMsg != ""){
		errorMessage += isCCodeSameInAllRefSuppErrMsg+"\n";
	}
return errorMessage;
}

/**
 * @desc function to validate Purchasing Organizations data.
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-4968}
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Node} node current object (Purchasing Organization)
 * @param {Step} step Step manager
 * @return boolean returns true if all company code data provided else false
 */
function validatePurchasingOrgData(node, step) {
	var workflowType = node.getValue("AT_ChangeRequestWFType").getID();
	var changeRequestType = node.getValue("AT_TypeOfChangeRequest").getID();
	if("Segment A+C Creation".equals(workflowType) || "SUPL supplier without payment transactions".equals(workflowType) || "Segment C Extension".equals(workflowType) || "POD".equals(changeRequestType)) {
	var supplierObj = getSupplierFromRequest(node, step);
		if(supplierObj) {
			var arePOsAdded = areReferenceAdded(supplierObj, step, "REF_SupplierToSupplierPurchasingData");
			if(!arePOsAdded) {
				return false;
			}
			else {
				var refObjs = supplierObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierPurchasingData"));
				for(var i=0; i<refObjs.size(); i++) {
					var refObj = refObjs.get(i).getTarget();
					var partnerFunctionErrors = supplierPartnerFunctionValidations(refObj, step);
					var purchasingOrgErrors = checkPOMandatoryData(refObj, step, supplierObj);
					var SUADPartnerFunctionValidations = SUADPartnerFunctionValidation(refObj, step);
					if(purchasingOrgErrors || partnerFunctionErrors || SUADPartnerFunctionValidations) {
						return false;
					}
				}
			}
		}
	}
	return true;
}

/**
 * @desc function to validate company codes data.
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-5314}
 * @author Savita Mannalle <Savita.Mannalle-ext@bshg.com>
 * @param {Node} node current object (Company Code)
 * @param {Step} step Step manager
 * @return boolean returns true if all company code data provided else false
 */
function validateCompanyCodeData(node, step) {
	var workflowType = node.getValue("AT_ChangeRequestWFType").getID();
	var changeRequestType = node.getValue("AT_TypeOfChangeRequest").getID();
	if("Segment A+B Creation".equals(workflowType) || "CCD".equals(changeRequestType) || "BDCCD".equals(changeRequestType)) {
		var supplierObj = getSupplierFromRequest(node, step);
		if(supplierObj) {
			var areCCsAdded = areReferenceAdded(supplierObj, step, "REF_SupplierToSupplierCompanyCode");
			if(!areCCsAdded) {
				return false;
			}
			else {
				var refObjs = supplierObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierCompanyCode"));
				for(var i=0; i<refObjs.size(); i++) {
					var refObj = refObjs.get(i).getTarget();
					var companyCodeErrors = checkCCMandatoryData(refObj, step);
					if(companyCodeErrors) {
						return false;
					}
				}
			}
		}
	}
	return true;
}

/**
 * @desc function to get supplier object from request object
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-4968}
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Node} node current object (Request)
 * @param {Step} step Step manager
 */
function getSupplierFromRequest(node, step) {
	var requestReference = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_RequestToSupplier"));
	if (!requestReference.isEmpty()) {
		var supplier = requestReference.get(0).getTarget();
		return supplier;
	}
	return null;
}

/**
 * @desc function to Display Error Message using in change workflow.
 * @link
 * @author Manisha Kunku <Manisha.kunku-ext@bshg.com>
 * @param {Node} node current object
 * @param {Step} step Step manager
 * @returns
 */
function displayErrorMessageData (node, step) {
	var name1 = getAttributeValue(node, "AT_Name1");
	var addressValues = getAddressDetails(node, step, "REF_SupplierToAddress");
	var isCasaRelevant = validateCASA(node, step);
	var country = addressValues.country;
	var city = addressValues.city;
	var postCode = addressValues.postCode;
	var street = addressValues.street;
	var poBox = addressValues.poBox;
	var poBoxPostCode = addressValues.poBoxPostCode;
	var stdCommunicationMethod = getAttributeValue(node, "AT_STDCommunicationMethod");
	var currentDateTime = new java.text.SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date());
	var objdate = node.getValue("AT_LastExtReview").getSimpleValue();
	var mandatoryErrors = checkRequesterMandatory(node, step);
	var referenceErrors = checkSupplierRefIsApprovedOrNot (node, step);
	var validateNationalVersion= validateNationalVersionAttr(node, step);
	var areNameLengthsValid = isLengthValidForName1Name2Name3Name4(node, step);
	var country = node.getValue("AT_TempCountry").getSimpleValue();
	var suplGovtEnt = node.getValue("AT_Supplier_is_a_governmental_entity").getSimpleValue();
	var govtEnt = node.getValue("AT_TaxNumber2").getSimpleValue();
	var errorFlag = "";
	    
		if(!isCasaRelevant ) { 	
		  errorFlag += "Missing value : CASA Relevant\n";
		}
		if(!name1) {
			errorFlag = "Missing value: Name 1\n";
		}
		if(!country) {
			errorFlag += "Missing value: Country\n";
		}
		if(!city) {
			errorFlag += "Missing value: City\n";
		}
		if(!poBox) {
			if(country == "Turkey" && suplGovtEnt == "Yes" && govtEnt == "ICRA"){
				errorFlag += "";
			}
			else {
				if(!postCode) {
					errorFlag += "Missing value: Postal Code\n";
				}
				if(!street) {
					errorFlag += "Missing value: Street or PO Box information\n";
				}
			}			
		}
		else if(!street) {
			if(country == "Turkey" && suplGovtEnt == "Yes" && govtEnt == "ICRA"){
				errorFlag += "";
			}
			else {
				if(!poBox) {
					errorFlag += "Missing value: Street or PO Box information\n";
				}
				if(!poBoxPostCode) {
					errorFlag += "Missing value: POX Box Postal Code\n";
				}
			}
		}
		if(!stdCommunicationMethod) {
			errorFlag += "Missing value: Standard Communication Method\n";
		}
		if(objdate > currentDateTime){
	        errorFlag += "Invalid value: Last date of validation. Cannot select future date\n";
        }
        if(mandatoryErrors) {
	        errorFlag += mandatoryErrors;
        }
		if(referenceErrors) {
	        errorFlag += referenceErrors;
        }
        if(validateNationalVersion) {
			errorFlag += validateNationalVersion;
		}
		if(areNameLengthsValid != true){
			errorFlag += areNameLengthsValid+"\n";
		}
		return errorFlag;
		
}


/**
 * @desc function to validate all requster mandatory data except Bank errors using in change workflow.
 * @link
 * @author Manisha Kunku <Manisha.Kunku-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns {String} Error Message String
*/

function checkRequesterMandatory(node, step) {
	var errorMessage = "";
	var countryCode = getAddressDetails(node, step, "REF_SupplierToAddress").countryCode;
	var taxLookupFrom = getLookupValue(step, (countryCode+"-AT_TaxCat"), "LT_MandatoryValues");
	var communicationError = validateCommunicationMethod(node, step);
	var taxError = ValidateTaxInformation(node, step);
	var requestError = checkPriority(node,step);
	var otherError = checkDescriptionForOther(node, step);
	var IN12FieldsError = getIN12FieldsErrorMessage(node, step);
	var countrySpecificErrors = triggerCountrySpecificValidations(node, step, "Supplier");
	var telephoneCheck = mandatoryCheckForDataContainer(step, node, "ATC_TelephoneNumbers", "AT_TelephoneNumber", "CountryCode");
	var mobileCheck = mandatoryCheckForDataContainer(step, node, "ATC_MobileNumbers", "AT_MobileNumber", "CountryCode");
	var faxCheck = mandatoryCheckForDataContainer(step, node, "ATC_FaxNumbers", "AT_FaxNumber", "CountryCode");
	var emailCheck = mandatoryCheckForDataContainer(step, node, "ATC_EmailAddress", "AT_EmailAddress", "NoCountryCode");
	var internetCheck = mandatoryCheckForDataContainer(step, node, "ATC_InternetAddress", "AT_InternetAddress", "NoCountryCode");
	var supplierHasTaxNo = getAttributeValue(node, "AT_SuppNotHaveTaxNo");
	if(communicationError) {
		errorMessage = communicationError+"\n";
	}
	
	if(telephoneCheck != true) {
		errorMessage += telephoneCheck+"\n";
	}
	if(mobileCheck != true){
		errorMessage += mobileCheck+"\n";
	}
	if(faxCheck != true) {
		errorMessage += faxCheck+"\n";
	}
	if(emailCheck != true) {
		errorMessage += emailCheck+"\n";
	}
	if(internetCheck != true) {
		errorMessage += internetCheck+"\n";
	}
	if(!supplierHasTaxNo ) { 
		errorMessage += "Missing value: Supplier has a tax number \n";
	}
	if(taxError != true) {
		errorMessage += taxError+"\n";
	}
	if(countrySpecificErrors) {
		errorMessage += countrySpecificErrors+"\n";
	}
	if(IN12FieldsError != ""){
		errorMessage += "[IN12FieldsErrorMsg]"+"\n";
	}
	return errorMessage;
}

/**
 * @desc function to check the references the target is approved or not.
 * @link
 * @author Manisha Kunku <Manisha.Kunku-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {String} supplierOrCustomer is validation is for Supplier or Customer. Input values (Supplier, Customer)
*/
function checkSupplierRefIsApprovedOrNot (node, step) {
	var info = "";
	var references = node.getReferences().asList();
	for(var i =0;i<references.size();i++) {
		var referenceTarget = references.get(i).getTarget();
		if("Supplier".equals(referenceTarget.getObjectType().getID())) {
			if("Not in Approved workspace".equals(referenceTarget.getApprovalStatus())) {
				info += "The supplier " + referenceTarget.getID() + " cannot be used as a reference for " + references.get(i).getReferenceType().getName() + " because it is never been approved .\n";
			}
		}
	}
	return info;
}

/**
 * @desc function to check the partner function reference the target is approved or not.
 * @link
 * @author Manisha Kunku <Manisha.Kunku-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {String} supplierOrCustomer is validation is for Supplier or Customer. Input values (Supplier, Customer)
*/
function checkPartnerFunctionSupplier (node, step) {
	var info = "";
	var supplierID = node.getID().slice(0, node.getID().indexOf("-"));
	var partnerFunctionReferences = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierPurchasingDataToSupplier"));
	for(var i=0;i<partnerFunctionReferences.size();i++) {
		var reference = partnerFunctionReferences.get(i);
		var referenceTarget = reference.getTarget();
		var partnerFun = reference.getValue("AT_SuplPartnerFunction").getSimpleValue();
		if (partnerFun&& !supplierID.equals(referenceTarget.getID()) && partnerFun.indexOf("Manufacturing plant") == -1) {
			if("Not in Approved workspace".equals(referenceTarget.getApprovalStatus())) {
				info += "The supplier " + referenceTarget.getID() + " cannot be used as a partner function because it is never been approved.\n";
			}
		}
	}
	return info;
}

/**
 * @desc function to validate Bank errors in Change workflow.
 * @link
 * @author Manisha Kunku <Manisha.Kunku-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {String} supplierOrCustomer is validation is for Supplier or Customer. Input values (Supplier, Customer)
*/

function validateBankAccountData(node, step, supplierOrCustomer) {
	var validationLookupTableID = "LT_RegexCheck";
	var errorMessageLookupTableID = "LT_ErrorMessages";
	var addressRefID = "Supplier".equals(supplierOrCustomer) ? "REF_SupplierToAddress" : "REF_CustomerToAddress";
	var countryCode = getAddressDetails(node, step, addressRefID).countryCode;
	var isBankDetailsValid = validateBankAccountDetails(node, step, countryCode, validationLookupTableID, errorMessageLookupTableID);
	var ref = step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToBankAccount");
	var  errorMessage = "";
	var bankMandatoryAttributeList = ["AT_NumberOfBankAccount", "AT_PartnerBankType", "AT_OrderCurrency"];
	var referenceErrors = checkSupplierRefIsApprovedOrNot(node, step);
	var isBankAccoutHasMandatoryData = checkReferenceMandatoryFields(node, step, "REF_SupplierToBankAccount", bankMandatoryAttributeList);
	if(isBankAccoutHasMandatoryData != true) {
		errorMessage = isBankAccoutHasMandatoryData+"\n";
	}
	if(isBankDetailsValid !=true) {
		errorMessage+= isBankDetailsValid+"\n";
	}
	if(referenceErrors) {
		errorMessage += referenceErrors;
	}
	return errorMessage;
}

/**
 * @desc function populate local specialists on request object
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-6170}
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-6171}
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Node} node request object.
 * @param {Step} step Step manager.
 * @param {String} referenceID ID of supplier to company code OR supplier purchasing organization ex: REF_SupplierToSupplierPurchasingData or REF_SupplierToSupplierCompanyCode
 * @param {String} masterReferenceID ID of reference connecting supplier CC or PO to master entity. ex : REF_SuplCompanyCodeToCompanyCodeMaster or REF_SupplierPOToPOMaster
 */
function populateLocalSpecialists(node, step, referenceID, masterReferenceID) {
	var supplierObj = getSupplierFromRequest(node, step);
	if(supplierObj) {
		var childObjects = supplierObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID(referenceID));
		for(var i=0; i<childObjects.size(); i++) {
			var childObj = childObjects.get(i).getTarget();
			var isLSActionRequired = isLocalSpecialistActionRequired(node, step, childObj);
			if(isLSActionRequired) {
				var localSpecialistID = getSingleReferenceAttributeValueID(childObj, step, masterReferenceID, "AT_LocalSpecialist");
				var localSpecialistName = getSingleReferenceAttributeValue(childObj, step, masterReferenceID, "AT_LocalSpecialist");
				if(localSpecialistID){
					createLocalspecialistDCRow(node, step, childObj, masterReferenceID, "AT_LocalSpecialist", "AT_BackupLocalSpecialist", "PMACT");
				}
			}				
		}
	}	
}

/**
 * @desc function to assign the local specialist for email and fax changes
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-10651
 * @author Bharat Gandhi <Bharat.Gandhi-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {String} referenceID ID of supplier to company code OR supplier purchasing organization ex: REF_SupplierToSupplierPurchasingData or REF_SupplierToSupplierCompanyCode
 * @param {String} masterReferenceID ID of reference connecting supplier CC or PO to master entity. ex : REF_SuplCompanyCodeToCompanyCodeMaster or REF_SupplierPOToPOMaster
 * @returns 
 */
function populateEmailAndFaxChangeLocalSpecialists(node, step, referenceID, masterReferenceID) {
	var PONotToBeConsidered = PONotToBeConsideredInEmailAndFaxChanges(node, step, referenceID);
	var supplierObj = getSupplierFromRequest(node, step);
	if(supplierObj) {
		var childObjects = supplierObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID(referenceID));
		for(var i=0; i<childObjects.size(); i++) {
			var childObj = childObjects.get(i).getTarget();
			var childObjTypeID = childObj.getObjectType().getID();
			if("SupplierPurchasingData".equals(childObjTypeID)) {
				if(!PONotToBeConsidered.contains(childObj.getID())) {
					var isLSActionRequired = isLocalSpecialistActionRequired(node, step, childObj);
					if(isLSActionRequired) {
						var localSpecialistID = getSingleReferenceAttributeValueID(childObj, step, masterReferenceID, "AT_LocalSpecialist");
						var localSpecialistName = getSingleReferenceAttributeValue(childObj, step, masterReferenceID, "AT_LocalSpecialist");
						if(localSpecialistID){
							createLocalspecialistDCRow(node, step, childObj, masterReferenceID, "AT_LocalSpecialist", "AT_BackupLocalSpecialist", "PMACT");
						}
					}
				}
			}
		}
	}
}

/**
 * @desc function to assign the local specialist of only the changed company code
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-10651
 * @author Bharat Gandhi <Bharat.Gandhi-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @param {String} referenceID ID of supplier to company code OR supplier purchasing organization ex: REF_SupplierToSupplierPurchasingData or REF_SupplierToSupplierCompanyCode
 * @param {String} masterReferenceID ID of reference connecting supplier CC or PO to master entity. ex : REF_SuplCompanyCodeToCompanyCodeMaster or REF_SupplierPOToPOMaster
 * @returns 
 */

function populateSpecificCompanyCodeLocalSpecialists(node, step, referenceID, masterReferenceID) {
	var supplierObj = getSupplierFromRequest(node, step);
	if(supplierObj) {
		var childObjects = supplierObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID(referenceID));
		for(var i=0; i<childObjects.size(); i++) {
			var childObj = childObjects.get(i).getTarget();
			var childObjTypeID = childObj.getObjectType().getID();
			if("SupplierCompanyCode".equals(childObjTypeID)) {
				var unApprovedCC = childObj.getNonApprovedObjects();
				for (var k = unApprovedCC.iterator(); k.hasNext(); ) {
					var unApprovedCCObject = k.next();
					if(unApprovedCCObject && unApprovedCCObject instanceof com.stibo.core.domain.partobject.EntityReferencePartObject && unApprovedCCObject.getReferenceType() == "REF_SupplierCompanyCodeToSupplier") {
						var isLSActionRequired = isLocalSpecialistActionRequired(node, step, childObj);
						if(isLSActionRequired) {
							var localSpecialistID = getSingleReferenceAttributeValueID(childObj, step, masterReferenceID, "AT_LocalSpecialist");
							var localSpecialistName = getSingleReferenceAttributeValue(childObj, step, masterReferenceID, "AT_LocalSpecialist");
							if(localSpecialistID){
								createLocalspecialistDCRow(node, step, childObj, masterReferenceID, "AT_LocalSpecialist", "AT_BackupLocalSpecialist", "PMACT");
							}
						}				
					}
				}
			}
		}
	}	
}

/**
 * @desc function populate local specialists on request object
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-12102}
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-12028}
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Node} node request object.
 * @param {Step} step Step manager.
 */
function populateLocalSpecialistsForDeletionRequest(node, step) {
	var supplierObj = getSupplierFromRequest(node, step);
	if(supplierObj) {
		var childObjects = [];
		var companyCodes = supplierObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierCompanyCode"));
		for(var i=0; i<companyCodes.size(); i++) {
			childObjects.push(companyCodes.get(i).getTarget());
		}
		var purchasingOrgs = supplierObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierPurchasingData"));
		for(var j=0; j<purchasingOrgs.size(); j++) {
			childObjects.push(purchasingOrgs.get(j).getTarget());
		}
		if(childObjects.length > 0) {
			for(var k=0; k<childObjects.length; k++) {
				var childObj = childObjects[k];
				var masterReferenceID = "SupplierCompanyCode".equals(childObj.getObjectType().getID()) ? "REF_SuplCompanyCodeToCompanyCodeMaster" : "REF_SupplierPOToPOMaster";
				var localSpecialistID = getSingleReferenceAttributeValueID(childObj, step, masterReferenceID, "AT_LocalSpecialist");
				if(localSpecialistID){
					createLocalspecialistDCRow(node, step, childObj, masterReferenceID, "AT_LocalSpecialist", "AT_BackupLocalSpecialist", "PMACT");
				}
				var isPurchasingOrg = "SupplierPurchasingData".equals(childObj.getObjectType().getID());
				if(isPurchasingOrg) {
					var npmLocalSpecialistID = getSingleReferenceAttributeValueID(childObj, step, masterReferenceID, "AT_LocalSpecialist_NPM");
					if(npmLocalSpecialistID){
						createLocalspecialistDCRow(node, step, childObj, masterReferenceID, "AT_LocalSpecialist_NPM", "AT_BackupLocalSpecialist_NPM", "NPM");
					}
					var orderCenterLocalSpecialistID = getSingleReferenceAttributeValueID(childObj, step, masterReferenceID, "AT_LocalSpecialist_OrderCenter");
					if(orderCenterLocalSpecialistID){
						createLocalspecialistDCRow(node, step, childObj, masterReferenceID, "AT_LocalSpecialist_OrderCenter", "AT_BackupLocalSpecialist_OrderCenter", "OC");
					}					
				}			
			}
		}
	}	
}

/**
 * @desc function populate local specialists on request object
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-12102}
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-12028}
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Node} node request object.
 * @param {Step} step Step manager.
 * @param {Object} CcOrPoObj supplier comapany code or supplier purchasing Org object.
 * @param {String} masterReferenceID ID of reference connecting supplier CC or PO to master entity. ex : REF_SuplCompanyCodeToCompanyCodeMaster or REF_SupplierPOToPOMaster
 * @param {String} localSpecialistAttrID ID of attribute of the local speicialist group ex AT_LocalSpecialist, AT_LocalSpecialist_NPM, AT_LocalSpecialist_OrderCenter
 * @param {String} backupLocalSpecialistAttrID ID of attribute of the backup local speicialist group ex AT_BackupLocalSpecialist, AT_BackupLocalSpecialist_NPM, AT_BackupLocalSpecialist_OrderCenter
  * @param {String} keyPrefix prefix value for generating data container key for specific local specilist row ex : PMACT, NPM, OC
 */
function createLocalspecialistDCRow(node, step, CcOrPoObj, masterReferenceID, localSpecialistAttrID, backupLocalSpecialistAttrID, keyPrefix) {
	var localSpecialistID = getSingleReferenceAttributeValueID(CcOrPoObj, step, masterReferenceID, localSpecialistAttrID);
	var backuplocalSpecialistID = getSingleReferenceAttributeValueID(CcOrPoObj, step, masterReferenceID, backupLocalSpecialistAttrID);
	var  localSpecEmail = getUserDetails(step, localSpecialistID).userEmail;
	var  backuplocalSpecEmail = getUserDetails(step, backuplocalSpecialistID).userEmail;
	var CcOrPoObjID = CcOrPoObj.getID(); 
	var cmpnyCodeORPurgOrgName = CcOrPoObj.getName()+" ("+CcOrPoObj.getID()+")";
	var dcKeyAttributeValue = keyPrefix+"_"+CcOrPoObjID.slice(CcOrPoObjID.indexOf("-")+1)+"_"+localSpecialistID+"_"+backuplocalSpecialistID;
	try {
		var existingLocalSpecEmail = node.getValue("AT_AllLocalSpecialists").getSimpleValue();
		var existingBackuplocalSpecEmail = node.getValue("AT_AllLocalSpecialistsBackup").getSimpleValue();
		if(existingLocalSpecEmail && existingLocalSpecEmail.indexOf(localSpecEmail)==-1 ){
			node.getValue("AT_AllLocalSpecialists").setSimpleValue(existingLocalSpecEmail + "<multisep/>" + localSpecEmail);	
		}
		else if(!existingLocalSpecEmail){
			node.getValue("AT_AllLocalSpecialists").setSimpleValue(localSpecEmail);
		}
		if(existingBackuplocalSpecEmail && existingBackuplocalSpecEmail.indexOf(backuplocalSpecEmail)==-1 ){
			node.getValue("AT_AllLocalSpecialistsBackup").setSimpleValue(existingBackuplocalSpecEmail + "<multisep/>" + backuplocalSpecEmail);	
		}
		else if(!existingBackuplocalSpecEmail){
			node.getValue("AT_AllLocalSpecialistsBackup").setSimpleValue(backuplocalSpecEmail);
		}
		var isDcRowAlreadyCreated = getDataContainerbyAttrValue(node, step, "ATC_LocalSpecialistStatus", "AT_LocalSpecialistKey", dcKeyAttributeValue);
		if(!isDcRowAlreadyCreated){
			var dcRowObj = createDataCointainerByKeyAttribute(node, step, "ATC_LocalSpecialistStatus", "AT_LocalSpecialistKey", dcKeyAttributeValue);
			dcRowObj.getValue("AT_LocalSpecialistAction").setLOVValueByID("Pending Approval");
			dcRowObj.getValue("AT_CCORPO").setSimpleValue(cmpnyCodeORPurgOrgName);
			dcRowObj.getValue(localSpecialistAttrID).setLOVValueByID(localSpecialistID);
			dcRowObj.getValue(backupLocalSpecialistAttrID).setLOVValueByID(backuplocalSpecialistID);
			
			var currentDateTime = new java.text.SimpleDateFormat("yyyy-MM-dd hh:mm:ss").format(new java.util.Date());
			var currentUserID = step.getCurrentUser().getID();
			var isCurrentUserIsLocalSpecialist = currentUserID.equals(localSpecialistID) || currentUserID.equals(backuplocalSpecialistID);
			if(isCurrentUserIsLocalSpecialist) {
				dcRowObj.getValue("AT_LocalSpecialistAction").setLOVValueByID("Auto Approved");
				dcRowObj.getValue("AT_LSApprovedRejectedBy").setLOVValueByID("System Approved");
				dcRowObj.getValue("AT_LSApprovalRejectionDate").setSimpleValue(currentDateTime);
			}
		}
	}
	catch(e) {
	//ignoring uniquekeyconstaint exception
	logger.info("Exception in Populate Local specialist function "+ e);
	}
}

/**
 * @desc function to check if local specialist request need to be auto approved
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-6170}
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-6171}
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Node} node request object.
 * @param {Step} step Step manager.
 * @param {Object} ccOrPO supplier companyCode or supplier Purchasing Organization object
 */
function isLocalSpecialistActionRequired(node, step, ccOrPO) {
	var objectTypeID = ccOrPO.getObjectType().getID();
	if("SupplierCompanyCode".equals(objectTypeID)) {
		var paymentBlock = ccOrPO.getValue("AT_SuplPaymentBlock").getSimpleValue();
		var posttingBlock = ccOrPO.getValue("AT_SuplPostingBlockForCompanyCode").getSimpleValue();
		if(paymentBlock && posttingBlock) {
			return false;
		}
	}
	else if("SupplierPurchasingData".equals(objectTypeID)) {
		var purchasingBlock = ccOrPO.getValue("AT_PurchBlockForPurchOrg").getID();
		var supplierCategory = ccOrPO.getValue("AT_SupplierCategory").getID();
		var invalidSupplierCategory = !supplierCategory || "NPM".equals(supplierCategory) || "NPM/OEM".equals(supplierCategory) || "OEM".equals(supplierCategory);
		if("Marked".equals(purchasingBlock) || invalidSupplierCategory) {
			return false;
		}
	}
return true;
}

/**
 * @desc function to approve or reject local specialists requests.
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-12102}
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-12028}
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Node} node request object.
 * @param {Step} step Step manager.
 * @param {webUIContext} webUIContext bind
 * @param {String} actionType local specialist action type ex: Approved or Rejected
 */
function triggerLocalSpecialistActions(node, step, webUIContext, actionType) {
	var userID = step.getCurrentUser().getID();
	var dcRowObjs = [];
	var localSpecialistDCs = node.getDataContainerByTypeID("ATC_LocalSpecialistStatus").getDataContainers();
	var itr = localSpecialistDCs.iterator();
	while (itr.hasNext()){
		var localSpecialistDCRowObj = itr.next().getDataContainerObject();
		var dcKeyAttributeValue = localSpecialistDCRowObj.getValue("AT_LocalSpecialistKey").getSimpleValue();
		if(dcKeyAttributeValue.indexOf(userID) != -1) {
			dcRowObjs.push(localSpecialistDCRowObj);
		}
	
	}
	if(dcRowObjs.length > 0) {
		var currentDateTime = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date());
		webUIContext.showAlert("INFO","Success","Request "+actionType);
			
		for(var i=0;i<dcRowObjs.length;i++) {
			var dcRowObj = dcRowObjs[i];
			dcRowObj.getValue("AT_LocalSpecialistAction").setSimpleValue(actionType);
			dcRowObj.getValue("AT_LSApprovedRejectedBy").setLOVValueByID(userID);
			dcRowObj.getValue("AT_LSApprovalRejectionDate").setSimpleValue(currentDateTime);
		}
		var userComments = "Rejected".equals(actionType) ? "Request Rejected by local specialist" : "Request Approved by all local specialists";
		var inputComments = getAttributeValue(node, "AT_UserComments")
		if (inputComments){
			setUserComments(node, step, inputComments)
		}
		
		var isRqPendingForApproval = getDataContainerbyAttrValueID(node, step, "ATC_LocalSpecialistStatus", "AT_LocalSpecialistAction", "Pending Approval");
		 if("Rejected".equals(actionType) || !isRqPendingForApproval) {
			setUserComments(node, step, userComments);
			if (node.isInState("WF_SupplierChange", "CH_LocalSpecialistApprovalPending")) {
				node.getWorkflowInstanceByID("WF_SupplierChange").getTaskByID("CH_LocalSpecialistApprovalPending").triggerByID("submit", "Request submitted to SSC by Local Specialist");
			}
			else if (node.isInState("WF_SupplierChange", "CH_LocalSpecialistClarificationPending")) {
				node.getWorkflowInstanceByID("WF_SupplierChange").getTaskByID("CH_LocalSpecialistClarificationPending").triggerByID("submit", "Request re-submitted to SSC by Local Specialist");
			}
			if (node.isInState("WF_AMLAndLocalSpecialistActions", "AMLAndLS_LocalSpecialistApprovalPending")) {
				node.getWorkflowInstanceByID("WF_AMLAndLocalSpecialistActions").getTaskByID("AMLAndLS_LocalSpecialistApprovalPending").triggerByID("submit", "Request submitted to SSC by Local Specialist");
			}
			else if (node.isInState("WF_AMLAndLocalSpecialistActions", "AMLAndLS_LocalSpecialistClarificationPending")) {
				node.getWorkflowInstanceByID("WF_AMLAndLocalSpecialistActions").getTaskByID("AMLAndLS_LocalSpecialistClarificationPending").triggerByID("ssc.localSpecialistSubmit", "Request re-submitted to SSC by Local Specialist");
			}
		}
	
		webUIContext.navigate("homepage", null);
	}
	else {
		webUIContext.showAlert("INFO","Error","You are not authorized to take this action");
	}
}

/**
 * @desc function to trigger local specialist notifications based on priority.
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-6168}
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-6169}
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Node} node current object (request object)
 * @param {Step} step Step manager
 * @param {MailHome} mailer Mail Home
 */
function triggerLocalSpecialistNotifications(node, step, mailer) {
	var dataContainerID = "ATC_LocalSpecialistStatus";
	var isLocalSpltsPopulated = isDataContainerHasValue(node, dataContainerID);
	if(isLocalSpltsPopulated) {
		var currentDateTime = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
		var isNormalRequest = "Normal".equals(node.getValue("AT_Priority").getSimpleValue());
		var isUrgentRequest = "Urgent".equals(node.getValue("AT_Priority").getSimpleValue());
		var onEntryDateTime = node.getValue("AT_LSOnEntryDateTime").getSimpleValue();
		if(onEntryDateTime) {
			var notificationCount = node.getValue("AT_LSNotificationCount").getSimpleValue();
			var firstReminderDateTime = addDaysToTextDate(onEntryDateTime, 1);
			var secondReminderDateTime = addDaysToTextDate(onEntryDateTime, 7);
			var thirdReminderDateTime = addDaysToTextDate(onEntryDateTime, 14);
			var lookupFrom0 = "0_Normal";
			var lookupFrom1 = "1_Normal";
			var lookupFrom2 = "2_Normal";
			var lookupFrom3 = "3_Normal";
			if(isUrgentRequest) {
				firstReminderDateTime = addDaysToTextDate(onEntryDateTime, 0.5);
				secondReminderDateTime = addDaysToTextDate(onEntryDateTime, 1);
				thirdReminderDateTime = addDaysToTextDate(onEntryDateTime, 2);
				
				var parsedDate = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(onEntryDateTime);
				var isThursday = parsedDate.getDay() ==4;
				var isFriday = parsedDate.getDay() == 5;
				if(isThursday) {
					thirdReminderDateTime = addDaysToTextDate(onEntryDateTime, 4);
				}
				if(isFriday) {
					secondReminderDateTime = addDaysToTextDate(onEntryDateTime, 3);
					thirdReminderDateTime = addDaysToTextDate(onEntryDateTime, 4);
				}

				lookupFrom0 = "0_Urgent";
				lookupFrom1 = "1_Urgent";
				lookupFrom2 = "2_Urgent";
				lookupFrom3 = "3_Urgent";
			}
			var lookupTableID = "LT_LocalSpecialistMailTemplates";
			if(!notificationCount) {
				sendMailToLocalSpecialists(node, step, mailer, lookupFrom0, lookupTableID, false);
				node.getValue("AT_LSNotificationCount").setSimpleValue("1");
			}
			else if(currentDateTime >= firstReminderDateTime && notificationCount == 1) {
				sendMailToLocalSpecialists(node, step, mailer, lookupFrom1, lookupTableID, false);
				node.getValue("AT_LSNotificationCount").setSimpleValue("2");
			}
			else if(currentDateTime >= secondReminderDateTime && notificationCount == 2) {
				sendMailToLocalSpecialists(node, step, mailer, lookupFrom2, lookupTableID, false);
				node.getValue("AT_LSNotificationCount").setSimpleValue("3");
			}
			else if(currentDateTime >= thirdReminderDateTime && notificationCount == 3) {
				sendMailToLocalSpecialists(node, step, mailer, lookupFrom3, lookupTableID, true);
				node.getValue("AT_LSNotificationCount").setSimpleValue("4");
			}
		}	
		
	}
}

/**
 * @desc function to trigger local specialist notifications based on priority.
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-6168}
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-6169}
 * @author Guru Swami <Gurunath.Swami-ext@bshg.com>
 * @param {Node} node current object (request object)
 * @param {Step} step Step manager
 * @param {MailHome} mailer Mail Home
 * @param {String} lookupFrom from value to get the mapping lookup value.
 * @param {String} lookupTableID ID of the lookup table.
 * @param {boolean} isEscalationMail true if escalation mail need to be send else false.
 */
function sendMailToLocalSpecialists(node, step, mailer, lookupFrom, lookupTableID, isEscalationMail) {
	var dataContainers = node.getDataContainerByTypeID("ATC_LocalSpecialistStatus").getDataContainers();
	var itr = dataContainers.iterator();
	var emailIDs = [];
	while (itr.hasNext()){
		var dcRowObj = itr.next().getDataContainerObject();
		var approvalStatus = dcRowObj.getValue("AT_LocalSpecialistAction").getID();
		if("Pending Approval".equals(approvalStatus)) {
			var localSpecialistAttrIDs = ["AT_LocalSpecialist", "AT_BackupLocalSpecialist", "AT_LocalSpecialist_NPM", "AT_BackupLocalSpecialist_NPM", "AT_LocalSpecialist_OrderCenter", "AT_BackupLocalSpecialist_OrderCenter"];
			for(var i=0;i<localSpecialistAttrIDs.length;i++) {
				var localSpecialistAttrID = localSpecialistAttrIDs[i];
				var localSpecialistID =  dcRowObj.getValue(localSpecialistAttrID).getID();
				if(localSpecialistID) {
					var user = step.getUserHome().getUserByID(localSpecialistID);
					if(user) {
						var userMail = user.getEMail();
						if(userMail && !emailIDs.includes(userMail)) {
							emailIDs.push(userMail);
						}
					}
				}
			}
			
		}
	}
	var mailInfo = getLSMailDetails();
			var toList = emailIDs.join(";");
			var subject = mailInfo.subject;
			var body =   mailInfo.body;
			var ccList =   mailInfo.ccList;
			if(isEscalationMail) {
				sendMailWithCC(mailer, toList, ccList, subject, body)
			}
			else {
				sendMail(mailer, toList, subject, body);
			}
	function getLSMailDetails() {
		var lookupSubject = getLookupValue(step, (lookupFrom+"_sub"), lookupTableID);
		var requestWfType = node.getValue("AT_TypeOfChangeRequest").getSimpleValue();
		var supplierObj = getSupplierFromRequest(node, step);
		var countryCode = getAddressDetails(supplierObj, step, "REF_SupplierToAddress").countryCode;
		var requesterID = node.getValue("AT_RequestorAssignee").getSimpleValue();
		var requesterMail = step.getUserHome().getUserByID(requesterID).getEMail();
		
		lookupSubject = lookupSubject.replace("[supplierNumber]", supplierObj.getID());
		lookupSubject = lookupSubject.replace("[requestType]", requestWfType);
		lookupSubject = lookupSubject.replace("[countryCode]", countryCode);
		lookupSubject = lookupSubject.replace("[requestNumber]", node.getID());
		lookupSubject = lookupSubject.replace("[requesterMail]", requesterMail);
		lookupSubject = lookupSubject.replace("[supplierName]", supplierObj.getName());
		lookupSubject = lookupSubject.replace("[sapID]", supplierObj.getValue("AT_SAPR3Reference").getSimpleValue());
		
		var suplGlobalVariables = step.getClassificationHome().getClassificationByID("SupplierVariables");
		var systemURL = suplGlobalVariables.getValue("AT_SystemURL").getSimpleValue();
		var requestLink = systemURL+"webui/SupplierWebUI#contextID=Global&workspaceID=Main&screen=homepage";
		if (node.isInState("WF_SupplierChange", "CH_LocalSpecialistApprovalPending")) {
			var requestLink = systemURL + "webui/SupplierWebUI#screen=TaskListWF_LS&stateflow=WF_AMLAndLocalSpecialistActions&onlyMine=Group&state=AMLAndLS_LocalSpecialistApprovalPending&NodeDetailsOverlay.NodeType=Entity&NodeDetailsOverlay.Selection="+node.getID();
		}
		else if(node.isInState("WF_SupplierChange", "CH_LocalSpecialistClarificationPending")) {
			var requestLink = systemURL + "webui/SupplierWebUI#screen=TaskListWF_LS&stateflow=WF_AMLAndLocalSpecialistActions&onlyMine=Group&state=AMLAndLS_LocalSpecialistClarificationPending&NodeDetailsOverlay.NodeType=Entity&NodeDetailsOverlay.Selection="+node.getID();
		}
			requestLink = "<a href="+requestLink+">Click here </a>";
			
		var lookupBody = getLookupValue(step, (lookupFrom+"_body"), lookupTableID);
			lookupBody = lookupBody.replace("[requestNumber]", node.getID());
			lookupBody = lookupBody.replace("[supplierNumber]", supplierObj.getID());
			lookupBody = lookupBody.replace("[requestLink]", requestLink);
		
		var lookupCCList = getLookupValue(step, "escalationCCList", lookupTableID);
			lookupCCList = lookupCCList.replace("[requesterMail]", requesterMail);
			
		var mailDetails = 
		{
			subject : lookupSubject,
			body : lookupBody,
			ccList : lookupCCList
		}
		return mailDetails;
	}
}

/**
 * @desc Clarification And Rejection Comments in SSC Review
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-7393
 * @author Amruta <Amruta.Tangade-ext@bshg-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns
 */

function setSSCReviewComments(node, step) {	
	var reasons =[];
	var clarificationReason = []
	var rejectionReason = []
	var userComments = "";
	var reasonForClarifications = node.getValue("AT_ReasonForClarification").getSimpleValue();
	var reasonForRejection = node.getValue("AT_ReasonForRejection").getSimpleValue();
	if(reasonForClarifications) {
		if(reasonForClarifications.indexOf("<multisep/>") != -1) {
			clarificationReason = reasonForClarifications.split("<multisep/>")
		}
		else {
			clarificationReason.push(reasonForClarifications);
		}
	}
	if(reasonForRejection) {
		if(reasonForRejection.indexOf("<multisep/>") != -1) {
			rejectionReason = reasonForRejection.split("<multisep/>")
		}
		else {
			rejectionReason.push(reasonForRejection);
		}
	}
	reasons = clarificationReason.concat(rejectionReason)
	for(var i=0; i<reasons.length; i++) {
		var reason = reasons[i];
		var note = getLookupValue(step, reason, "LT_SuplSSCNotes");
		if(note != null) {
			if (i == (reasons.length-1)){
				userComments += note + "."
			}
			else {
				userComments += note + ".\n\n"
			}
		}
	}
	node.getValue("AT_UserComments").setSimpleValue(userComments);
}

/**
 * @desc Request Attachments For Creation and change request type
 * @link 
 * @author Amruta <Amruta.Tangade-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns errorMessage
 */
function validateAttachments(node, step) {
	var errorMessage = "";
	var changeRequestType = node.getValue("AT_TypeOfChangeRequest").getSimpleValue();
	var supplierObj = getSupplierFromRequest(node, step);
	var currentUserID = step.getCurrentUser().getID();
	var isAccountingUser = isUserMemberOfUserGroup(step, "USG_SUPL_CC_AuthorizationGroups", currentUserID);
	var isPurchasingUser = isUserMemberOfUserGroup(step, "USG_SUPL_PO_AuthorizationGroups", currentUserID);
	var hasBankDocument = hasReferenceTarget(node, step, "REF_BankSupportingDocuments");
	var isAlternativePayee = checkAlternativePayeeChanges(supplierObj, step, "REF_SupplierToSupplierAlternativePayee") && (!hasBankDocument);
	var isPermittedPayee = (areReferencesRemovedForPermittedPayee(supplierObj, step) || areReferencesAddedToPermittedPayee(supplierObj, step) || isSupplierReplacedForPermittedPayee(supplierObj, step)) && (!hasBankDocument);
	var requestReference = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_RequestToSupplier"));
	if (!requestReference.isEmpty()) {
		var supplier = requestReference.get(0).getTarget();
        var supplierVariant = supplier.getValue("AT_SupplierVariant").getID();
	}
	var requestType = node.getValue("AT_ChangeRequestWFType").getSimpleValue();
	var hasGenrealAttachments = hasReferenceTarget(node, step, "REF_GeneralAttachments");
	var isGeneralDocRequiredInChange = validateCountryAndERS(supplierObj,step) ;
	var isCasaDocumentsRequired = node.isInWorkflow("WF_SupplierCreation") && "Y".equals(supplierObj.getValue("AT_CasaRelevant").getID()) && !hasReferenceTarget(node, step, "REF_CasaDocumentations");
	var isCasaRequiredinChange = node.isInWorkflow("WF_SupplierChange") &&"Y".equals(supplierObj.getValue("AT_CasaRelevant").getID())&& compareMainAndApprovedWsValues(supplierObj, step, "AT_CasaRelevant") && !hasReferenceTarget(node, step, "REF_CasaDocumentations");
	var isBankDocumentsRequired = isBankDetailsChangedForAttachment(node, step) && !hasBankDocument ;
	var hasBankDetails = isBankDetailsChangedForAttachment(node, step);
	var isCCAltPayeeChanged = compareReferenceTargetID(supplierObj, step, "SupplierCompanyCode", "REF_SupplierToSupplierCompanyCode", "REF_SupplierCompanyCodeToSupplier");
	var StandardCommMethodChanged = compareMainAndApprovedWsValues(supplierObj, step, "AT_STDCommunicationMethod");
	var isTelEmailFaxChanged = checkTelephoneEmailAndFaxChanges(supplierObj,step);
	var isGeneralDataChanged = generalDataChangesforattachment (supplierObj, step);
	var isExemptionFromExemptionToAdded = checkExemptionFromExemptionTo(supplierObj, step);
	var isIncoTermsChanged = incotermCheck(supplierObj,step);
	
	if((isAccountingUser || isPurchasingUser) && "Supplier Variant Change".equals(changeRequestType)) {
		if(!hasGenrealAttachments && "RS".equals(supplierVariant)) {
			errorMessage += "Missing attachment: General Attachment\n";
		}
	}
	if(!hasGenrealAttachments) {
			if((isAccountingUser || isPurchasingUser) && "Change General Data".equals(changeRequestType) && (isGeneralDataChanged || isTelEmailFaxChanged)){
					errorMessage += "Missing attachment: General Attachment\n";
			}
			if("Segment A + C Creation".equals(requestType) || "Segment A + B Creation".equals(requestType) || ("Change/Create/Block Purchasing Organization".equals(changeRequestType) && isIncoTermsChanged)) {
				errorMessage += "Missing attachment: General Attachment\n";
			}
			if(!(isAccountingUser || isPurchasingUser) && "Change General Data".equals(changeRequestType) && (isGeneralDataChanged || isTelEmailFaxChanged)) {
				errorMessage += "Missing attachment: General Attachment\n";
			}
			if(isPurchasingUser && (isGeneralDocRequiredInChange)) {
				errorMessage += "Missing attachment: General Attachment\n";
			}
			if("Change/Create/Block Company Code Data".equals(changeRequestType) && isExemptionFromExemptionToAdded) {
				errorMessage += "Missing attachment: General Attachment related to Witholding Tax Data is required.\n";
			}
	}   
	if(isCasaDocumentsRequired || isCasaRequiredinChange) {
		if(isPurchasingUser && ("Change General Data".equals(changeRequestType) || "Supplier Variant Change".equals(changeRequestType) || !changeRequestType)) {
				errorMessage += "Missing attachment: Casa Document Attachment\n";
		}
			if(!isPurchasingUser && ("Change General Data".equals(changeRequestType) || !changeRequestType)) {
				errorMessage += "Missing attachment: Casa Document Attachment\n";
			}
	}
    if(("Change/Create/Block Company Code Data".equals(changeRequestType) && (isAlternativePayee || isCCAltPayeeChanged))){
		if(!hasBankDocument){
			errorMessage += "Missing attachment: Bank Supporting Documents \n";
		}
	}
    if(isAccountingUser && !hasBankDocument && (isBankDocumentsRequired || isAlternativePayee || isPermittedPayee)) {
        if("Change Bank Details".equals(changeRequestType) || "Segment A Creation".equals(requestType) || "Segment A + B Creation".equals(requestType) || "Change General Data & Bank Details".equals(changeRequestType)  || "Change Bank & Company Code Details".equals(changeRequestType)) {
			errorMessage += "Missing attachment: Bank Supporting Documents \n";
		}
	}
   return errorMessage;
}

/**
 * @desc function to check all tab errors in creation workflow
 * @link 
 * @author Manisha <Manisha.Kunku-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns errorMessage
 */
function triggerRequestSubmitValidations(node, step) {
	var errorMessage = "";
	var changeRequestType = node.getValue("AT_TypeOfChangeRequest").getSimpleValue();
	var supplierObj = getSupplierFromRequest(node, step);
	var typeOfFraudCase = supplierObj.getValue("AT_TypeOfFraudCase").getID();
	var fraudCaseConfirmation = supplierObj.getValue("AT_FraudCaseConfirmation").getID();
	var isFraudSupplier = typeOfFraudCase && !"Y".equals(fraudCaseConfirmation);	
	var supplierDataErrors = displayErrorMessage(supplierObj, step);
	var additionalSupplierDataErrors = validateAddtionalSupplierData(node, step);
	var isPOHasAllRequiredData = validatePurchasingOrgData(node, step); //passing request object
	var isCCHasAllRequiredData = validateCompanyCodeData(node, step); //passing request object 
	var requestDataErrors = displayRequestErrors(node, step);
	var requestWFType = node.getValue("AT_ChangeRequestWFType").getSimpleValue();
     var isPurchasingOrgAllowed = node.getValue("AT_PurchasingOrganizationsAllowed").getSimpleValue();
     var isCreateNewManufactPlant= node.getValue("AT_IsNewManuFactPlantNeeded").getID();
	if(isFraudSupplier) {
		errorMessage += "<h4><font color='orange' >Attention !!</font><h4>, You are submitting fraud case supplier, please provide Fraud case confirmation before submitting the request.</h4>\n";
	}
	if(supplierDataErrors) {
		errorMessage += "Missing Segment : General Data mandatory fields\n";
	}
	
	if(!additionalSupplierDataErrors) {
		errorMessage += " Missing Segment : General Data for additional suppliers, please go to 'Manufacturing Plant' tab open and click on 'Manufacturing Plant Save Data' button to save the additional supplier data before submitting request \n";
	}
	if(!isPOHasAllRequiredData && (("SUPL supplier without payment transactions".equals(requestWFType) && "Segment A + C- without payment transactions".equals(isPurchasingOrgAllowed)) || ("Segment A + C Creation".equals(requestWFType)))) {
		errorMessage +="Missing Segment : Purchasing Organization OR Missing Purchasing Organization Mandatory Fields\n";
	}
	
	if(!isCCHasAllRequiredData) {
		errorMessage +="Missing Segment : Company Code OR Missing Company Code Mandatory Fields\n";
	}
	if(requestDataErrors) {
		if(!("Segment A + C Creation".equals(requestWFType) || "SUPL supplier without payment transactions".equals(requestWFType))){
			if(requestDataErrors["AntiFraudError"] != ""){
				errorMessage +="Missing Segment : Anti-fraud data\n";
			}
			if(requestDataErrors["RequestTabError"] != ""){
				errorMessage +="Missing Segment : Request Data Missing Fields\n";
			}
		}
		else{
			if(requestDataErrors["RequestTabError"] != ""){
				errorMessage +="Missing Segment : Request Data Missing Fields\n";
			}
		}
	}
	return errorMessage;
}

/**
 * @desc function to check all tab errors in changge workflow
 * @link 
 * @author Manisha <Manisha.Kunku-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns errorMessage
 */
function triggerChangeRequestSubmitValidations(node, step) {
	var errorMessage = "";
	var changeRequestType = node.getValue("AT_TypeOfChangeRequest").getID();
	var supplierObj = getSupplierFromRequest(node, step);
	var typeOfFraudCase = supplierObj.getValue("AT_TypeOfFraudCase").getID();
	var fraudCaseConfirmation = supplierObj.getValue("AT_FraudCaseConfirmation").getID();
	var isFraudSupplier = typeOfFraudCase && !"Y".equals(fraudCaseConfirmation);	
	var supplierDataErrors = displayErrorMessageData(supplierObj, step);
	var additionalSupplierDataErrors = validateAddtionalSupplierData(node, step);
	var bankErrors = validateBankAccountData(supplierObj, step, "Supplier");
	var isPOHasAllRequiredData = validatePurchasingOrgData(node, step); //passing request object
	var isCCHasAllRequiredData = validateCompanyCodeData(node, step); //passing request objecty
	var requestDataErrors = displayRequestErrors(node, step);
	var isCreateNewManufactPlant= node.getValue("AT_IsNewManuFactPlantNeeded").getID();
     
	if(isFraudSupplier && "GD".equals(changeRequestType)) {
		errorMessage += "<h4><font color='orange' >Attention !!</font><h4>, You are submitting fraud case supplier, please provide Fraud case confirmation before submitting the request.</h4>\n";
	}
	if(supplierDataErrors && "GD".equals(changeRequestType)) {
		errorMessage += "Missing Segment : General Data mandatory fields\n";
	}

	if(supplierDataErrors && ("BDCCD".equals(changeRequestType) || "CCD".equals(changeRequestType))) {
		errorMessage += supplierDataErrors;
	}
	
	if(!additionalSupplierDataErrors) {
		errorMessage += "Missing Segment : General Data for additional suppliers, please go to 'Manufacturing Plant' tab open and click on 'Manufacturing Plant Save Data' button to save the additional supplier data before submitting request \n";
	}
	if(bankErrors && ("BD".equals(changeRequestType) || "GDBD".equals(changeRequestType) || "BDCCD".equals(changeRequestType))) {
		errorMessage += "Missing Segment : Bank Data OR Bank Data Mandatory Fields\n";	
	}
	if(!isPOHasAllRequiredData && "POD".equals(changeRequestType)) {
		errorMessage +="Missing Segment : Purchasing Organization OR Missing Purchasing Organization Mandatory Fields\n";
	}
	if(!isCCHasAllRequiredData && ("CCD".equals(changeRequestType) || "BDCCD".equals(changeRequestType))) {
		errorMessage +="Missing Segment : Company Code OR Missing Company Code Mandatory Fields\n";
	}
	if(requestDataErrors != undefined) {
		if(!("POD".equals(changeRequestType) || "DEL".equals(changeRequestType) || "TU".equals(changeRequestType))){
			if(requestDataErrors["AntiFraudError"] != ""){
				errorMessage +="Missing Segment : Anti-fraud data\n";
			}
			if(requestDataErrors["RequestTabError"] != ""){
				errorMessage +="Missing Segment : Request Data Missing Fields\n";
			}
		}
		else{
			if(requestDataErrors["RequestTabError"] != ""){
				errorMessage +="Missing Segment : Request Data Missing Fields\n";
			}
		}
	}
	return errorMessage;
}

/**
 * @desc function to check Request tab mandatory values.
 * @link 
 * @author Manisha <Manisha.Kunku-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node current object
 * @returns errorMessage
 */
function displayRequestErrors(node, step) {
var mailer = step.getHome(com.stibo.mail.home.MailHome);
var errorMessage = {
	"RequestTabError":"",
	"AntiFraudError":""
};
var changeRequestType = node.getValue("AT_TypeOfChangeRequest").getID();
var creationRequestType = node.getValue("AT_ChangeRequestWFType").getSimpleValue();
var isPurchasingOrgAllowed = node.getValue("AT_PurchasingOrganizationsAllowed").getSimpleValue();
var reasonForCreation = node.getValue("AT_ReasonForCreation").getSimpleValue();
var supplierObj = getSupplierFromRequest(node, step);
var urgentRequestError = checkPriority(node,step);
var deletionRequestErrors = checkReasonForBlockage(node, step);
var attachmentErrors = validateAttachments(node, step, supplierObj, changeRequestType);
var riskCatagoryComments = checkSupplierAndBankRiskCatagory(supplierObj, step);
var supplierRiskCategoryComments = checkSupplierRiskCatagory(supplierObj, step);
var numberOfBankDataChanges = supplierObj.getValue("AT_BankChangesIn90Days").getSimpleValue();
var supplierBusiness = node.getValue("AT_TypeOfSupplierBusiness").getSimpleValue();
var reasonForTemporalUnblocking = node.getValue("AT_ReasonForTemporalUnblocking").getSimpleValue();
var isBankDataChangeRequest = "BD".equals(changeRequestType) || "BDCCD".equals(changeRequestType) || "GDBD".equals(changeRequestType);
var reqAttributesForAntiFraudForm = getRequiredAttributesAntiFraudConditionally(node,step);
var areAllMandatoryAntiFraudAttributesFilled = validateMandatoryAttributes(node, step, reqAttributesForAntiFraudForm);
var reqAttachmentsForAntiFraudForm = getRequiredAttachmentsAntiFraudConditionally(node,step);
var areAllMandatoryAntiFraudAttachmentsFilled = validateMandatoryAttachments(node, step, reqAttachmentsForAntiFraudForm);


if(("Segment A + B Creation".equals(creationRequestType) && supplierRiskCategoryComments && !supplierBusiness) || (("Change Bank Details".equals(changeRequestType) || "Segment A + B Creation".equals(creationRequestType)) && riskCatagoryComments && (riskCatagoryComments.indexOf("which is classified under 'Risky' catagory") != -1) && !supplierBusiness)) {
	errorMessage["RequestTabError"] += "Missing Value : Type Of Supplier's Business\n";
}
if(("Segment A Creation".equals(creationRequestType) || "Segment A + C Creation".equals(creationRequestType)) && supplierRiskCategoryComments && !supplierBusiness) {
	errorMessage["RequestTabError"] += "Missing Value : Type Of Supplier's Business\n";
}
if(isBankDataChangeRequest && !supplierBusiness && numberOfBankDataChanges >= 3) {
	errorMessage["RequestTabError"] += "Missing Value : Type Of Supplier's Business\n";
	errorMessage["RequestTabError"] += "The change that you want to maintain is the "+(Number(numberOfBankDataChanges)+1)+"th one within the last 3 months. According to the AML policy this is considered as risky. Please fill in the Type Of Supplier's Business field\n";
}
if("TU".equals(changeRequestType) && !reasonForTemporalUnblocking ){
	errorMessage["RequestTabError"] += "Missing Value : Reason for Temporal Unblocking\n";
}
if("SUPL supplier without payment transactions".equals(creationRequestType) && (!isPurchasingOrgAllowed)) {
	errorMessage["RequestTabError"] += "Missing Value : Purchasing Organization Allowed\n";
}
if("SUPL supplier without payment transactions".equals(creationRequestType) && (!reasonForCreation)) {
	errorMessage["RequestTabError"] += "Missing Value : Reason For Creation\n";
}
if(urgentRequestError) {
	errorMessage["RequestTabError"] += urgentRequestError+"\n";
}
if(attachmentErrors) {
	errorMessage["RequestTabError"] += attachmentErrors+"\n";
}
if(deletionRequestErrors) {
	errorMessage["RequestTabError"] += deletionRequestErrors+"\n";
}
if(areAllMandatoryAntiFraudAttributesFilled != true) {
	errorMessage["AntiFraudError"] += "Missing Value : Anti-Fraud Data (Save & reload screen if Anti-fraud tab is not visible) \n";
}
if(areAllMandatoryAntiFraudAttachmentsFilled != true) {
	errorMessage["AntiFraudError"] += "Missing Value : Anti-Fraud Data (Save & reload screen if Anti-fraud tab is not visible) \n";
}

return errorMessage;
}

/**
 * @desc function to initiate a new change request for first bank account.
 * @link  {https://issuetracking.bsh-sdd.com/browse/MDMPB-8523}
 * @author Amruta Tangade <Amruta.Tangade-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node request object
*/
function validateAddtionalSupplierData(node, step) {
	var suppliers = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_RequestToAdditionalSuppliers"));
	for(var i=0; i<suppliers.size(); i++){
		supplierObj = suppliers.get(i).getTarget();
		var supplierDataErrors = displayErrorMessage(supplierObj, step);
		if(supplierDataErrors) {
			return false;
		}
	}
	return true;
}

function setNameValuesOnAdditionalSupplier(node, step) {
	var additionalSupplierID = "A_"+node.getID();
	var additionalSuppliername1 = node.getValue("AT_Name1").getSimpleValue();
	if(additionalSuppliername1) {
		var nameSplitArray = splitStringByCharLength(String(name1), 35);
		for(i=0; i<nameSplitArray.length; i++) {
			setAttributeValue(node, "AT_Name"+(i+1), nameSplitArray[i]);
		}
		node.setName(getAttributeValue(node, "AT_Name1"));
	}
}

function populateNumberOfBankDataChangesInLast90Days(node, step, supplierObj) {
	var creationRequestType = node.getValue("AT_ChangeRequestWFType").getID();
	var changeRequestType = node.getValue("AT_TypeOfChangeRequest").getID();
	var numberOfBankDataChanges = supplierObj.getValue("AT_BankChangesIn90Days").getSimpleValue();
	var changeLog = node.getValue("AT_DisplayWhatsChangedForSupplier").getSimpleValue();
	if(creationRequestType && !changeRequestType) {
		var isBankDataAddedInCreationRq = hasReferenceTarget(supplierObj, step, "REF_SupplierToBankAccount");
		if(isBankDataAddedInCreationRq) {
			numberOfBankDataChanges = Number(numberOfBankDataChanges) + 1;
			supplierObj.getValue("AT_BankChangesIn90Days").setSimpleValue(numberOfBankDataChanges);
			supplierObj.getValue("AT_IsBankAcctAddedInCR").setLOVValueByID("Y");
			supplierObj.getValue("AT_LastBankDataCH").setSimpleValue(node.getID());
		}
	}
	else {
		var isBankDataChangeRequest = "BD".equals(changeRequestType) || "BDCCD".equals(changeRequestType) || "GDBD".equals(changeRequestType);
		if(isBankDataChangeRequest) {
			var isBankDataChangeLogGenerated = isBankDataCreatedOrChanged();	
			if(isBankDataChangeLogGenerated) {
				var lastBankChangeRequestID = supplierObj.getValue("AT_LastBankDataCH").getSimpleValue();
				var lastBankChangeRequestObj = lastBankChangeRequestID ? step.getEntityHome().getEntityByID(lastBankChangeRequestID) : null;
				if(lastBankChangeRequestObj) {
					var currentDateTime = new Date();
					var requestCreationTime = lastBankChangeRequestObj.getValue("AT_RequestCreatedTime").getSimpleValue();
					requestCreationTime = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(requestCreationTime);
					var diffrenceInTime = currentDateTime.getTime() - requestCreationTime.getTime();
					var diffrenceInDays = diffrenceInTime / (1000 * 60 * 60 * 24);
					if(diffrenceInDays <= 90) {
						numberOfBankDataChanges = Number(numberOfBankDataChanges) + 1;
						supplierObj.getValue("AT_BankChangesIn90Days").setSimpleValue(numberOfBankDataChanges);
						supplierObj.getValue("AT_LastBankDataCH").setSimpleValue(node.getID());
					}
					else {
						supplierObj.getValue("AT_BankChangesIn90Days").setSimpleValue("0");
					}
					
				}
				else {
					numberOfBankDataChanges = Number(numberOfBankDataChanges) + 1;
					supplierObj.getValue("AT_BankChangesIn90Days").setSimpleValue(numberOfBankDataChanges);
					supplierObj.getValue("AT_LastBankDataCH").setSimpleValue(node.getID());
				}
			}			
		}
	}
	
	function isBankDataCreatedOrChanged() {
		var searchPhrases = ["Bank Account", "Bank Account No", "IBAN", "Permitted Payee", "Alternative Payee"];
		for(var i=0;i<searchPhrases.length;i++) {
			var searchPhrase = searchPhrases[i];
			if(changeLog) {
				if(changeLog.indexOf(searchPhrase) != -1) {
					return true;
				}
			}
		}
		return false;
	}
}

/**
 * @desc function to get SAP R3 Reference number from Gateway Endpoint
 * @link  {https://issuetracking.bsh-sdd.com/browse/MDMPB-14595}
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {supplierObj} supplier object
*/
function getSAPR3Number(supplierObj, step, gw){
	var requestBody = {}
	var addressData = getAddressDetails(supplierObj, step, "REF_SupplierToAddress");
	var telephoneNumber = "";
	var telephoneDataContainer = getDataContainerbyAttrValueID(supplierObj, step, "ATC_TelephoneNumbers", "AT_DefaultFlag", "Y");
	if(telephoneDataContainer){
		telephoneNumber = telephoneDataContainer.getValue("AT_TelephoneNumber").getSimpleValue();
	}
	var mobileNumber = "";
	var mobileDataContainer = getDataContainerbyAttrValueID(supplierObj, step, "ATC_MobileNumbers", "AT_DefaultFlag", "Y")
	if(mobileDataContainer){
		mobileNumber = mobileDataContainer.getValue("AT_MobileNumber").getSimpleValue();
	}
	var faxNumber = "";
	var faxDataContainer = getDataContainerbyAttrValueID(supplierObj, step, "ATC_FaxNumbers", "AT_DefaultFlag", "Y")
	if(faxDataContainer){
		faxNumber = faxDataContainer.getValue("AT_FaxNumber").getSimpleValue();
	}
	var searchterm = supplierObj.getValue("AT_SearchTerm").getSimpleValue();
	
	requestBody.stepid = supplierObj.getID()+"";
	requestBody.name1 = supplierObj.getID()+"";
	requestBody.searchterm = searchterm+"";
	requestBody.street = addressData.street ? addressData.street+"" : addressData.poBox+"";
	requestBody.postalcode = addressData.postCode+"";
	requestBody.city = addressData.city+"";
	requestBody.countryCode = addressData.countryCode+"";
	requestBody.telephoneNumber = telephoneNumber+"";
	requestBody.mobileNumber = mobileNumber+"";
	requestBody.faxNumber = faxNumber+"";
	requestBody.district = addressData.district+"";
	requestBody.region = addressData.regionID+"";
	requestBody.poBox = addressData.poBox+"";
	requestBody.poBoxpostalcode = addressData.poBoxPostCode+"";
	requestBody.poBoxcity = addressData.poBoxCity+"";
	var stringBody = JSON.stringify(requestBody);
	var response = null
	try {
		response = gw.post().pathElements("http","rb.bsh.mdm.supp.getsuppid.stepx").body(stringBody).invoke()
	}
	catch (e){
		var existingValue = supplierObj.getValue("AT_SAPR3Response").getSimpleValue()
		var newValue = "Error occurred: "+e+", "+existingValue
		supplierObj.getValue("AT_SAPR3Response").setSimpleValue(newValue)
		log.info("getSAPR3Number : Error occurred: "+e)
	}
	return response;
}
/**
 * @desc function to check if SAP ID is recieved succesfully and trigger approval else keep it for manual update
 * @link  {https://issuetracking.bsh-sdd.com/browse/MDMPB-14595}
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {node} request object
 * @param {gw} step gateway endpoint
 * @param {webUIContext} Web UI Context from Bind
*/
function checkSAPIDandTriggerForApproval(node, step, gw, webUIContext) {
	var supplierObj = getSupplierFromRequest(node, step)
	var sapR3RefVal = supplierObj.getValue("AT_SAPR3Reference").getSimpleValue()
	var sscState = step.getWorkflowHome().getWorkflowByID("WF_SupplierReview").getStateByID("SSCReview");
	if (sapR3RefVal != null && allAdditionalSuppliersHaveSAPID(node, step)) {
		node.getWorkflowInstanceByID("WF_SupplierReview").getTaskByID("SSCReview").triggerByID("submit", "Submitted to MD Intern Check Pending")
		webUIContext.showAlert("INFO", "Success", "Request Approved");
		webUIContext.navigate("TaskList_RQ_SSCReview", null, sscState);
	} 
	else if (sapR3RefVal != null && !allAdditionalSuppliersHaveSAPID(node, step)){
		var errorOccured = setAdditionalSuppliersSAPID(node, step, gw)
		if (!errorOccured){
			node.getWorkflowInstanceByID("WF_SupplierReview").getTaskByID("SSCReview").triggerByID("submit", "Submitted to MD Intern Check Pending")
			webUIContext.showAlert("INFO", "Success", "Request Approved");
			webUIContext.navigate("TaskList_RQ_SSCReview", null, sscState);
		}
		else {
			node.getWorkflowInstanceByID("WF_SupplierReview").getTaskByID("SSCReview").triggerByID("submit", "Request Not Approved by SSC, Failed to get SAP ID")
			webUIContext.showAlert("WARNING", "Failed to get SAP R3 ID for Additional Suppliers", "Request Not Approved. Please enter SAP R3 Id manually in the next step. Error: "+response.errormessage);
			webUIContext.navigate("TaskList_RQ_SSCReview", null, sscState);
		}
	}
	else 
	{
		var response = getSAPR3Number(supplierObj, step, gw)
		if (response != null) {
			var existingValue = supplierObj.getValue("AT_SAPR3Response").getSimpleValue()
			var newValue = response+", "+existingValue
			supplierObj.getValue("AT_SAPR3Response").setSimpleValue(newValue)
			response = JSON.parse(response)
			var sapID = ""
			if (response.result != undefined) {
				sapID = response.result
				supplierObj.getValue("AT_SAPR3Reference").setSimpleValue(sapID)
				var errorOccured = setAdditionalSuppliersSAPID(node, step, gw)
				if (!errorOccured){
					node.getWorkflowInstanceByID("WF_SupplierReview").getTaskByID("SSCReview").triggerByID("submit", "Submitted to MD Intern Check Pending")
					webUIContext.showAlert("INFO", "Success", "Request Approved");
					webUIContext.navigate("TaskList_RQ_SSCReview", null, sscState);
				}
				else {
					node.getWorkflowInstanceByID("WF_SupplierReview").getTaskByID("SSCReview").triggerByID("submit", "Request Not Approved by SSC, Failed to get SAP ID")
					webUIContext.showAlert("WARNING", "Failed to get SAP R3 ID for Additional Suppliers", "Request Not Approved. Please enter SAP R3 Id manually in the next step. Error: "+response.errormessage);
					webUIContext.navigate("TaskList_RQ_SSCReview", null, sscState);
				}
				
			} 
			else if (response.errormessage != undefined) {
				node.getWorkflowInstanceByID("WF_SupplierReview").getTaskByID("SSCReview").triggerByID("submit", "Request Not Approved by SSC, Failed to get SAP ID")
				webUIContext.showAlert("WARNING", "Failed to get SAP R3 ID", "Request Not Approved. Please enter SAP R3 Id manually in the next step. Error: "+response.errormessage);
                webUIContext.navigate("TaskList_RQ_SSCReview", null, sscState);
            }
        }
		else {
			node.getWorkflowInstanceByID("WF_SupplierReview").getTaskByID("SSCReview").triggerByID("submit", "Request Not Approved by SSC, Failed to get SAP ID")
			webUIContext.showAlert("WARNING", "Failed to get SAP R3 ID", "Request Not Approved. Please enter SAP R3 Id manually in the next step");
			webUIContext.navigate("TaskList_RQ_SSCReview", null, sscState);
		}
	}
}

/**
 * @desc function to check if SAP ID is recieved for additional suppliers
 * succesfully and trigger approval else push it for manual update
 * @link  {https://issuetracking.bsh-sdd.com/browse/MDMPB-14892}
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {node} request object
 * @param {gw} step gateway endpoint
*/
function setAdditionalSuppliersSAPID(node, step, gw) {
	var additionalSupplierRefs = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_RequestToAdditionalSuppliers"))
	var errorOccured = false
	if (additionalSupplierRefs.size()>0){
		for(var i=0; i<additionalSupplierRefs.size(); i++){
			supplierObj = additionalSupplierRefs.get(i).getTarget()
			var response = getSAPR3Number(supplierObj, step, gw)
			if (response != null) {
				supplierObj.getValue("AT_SAPR3Response").setSimpleValue(response)
				response = JSON.parse(response)
				var sapID = ""
				if (response.result != undefined) {
					sapID = response.result
					supplierObj.getValue("AT_SAPR3Reference").setSimpleValue(sapID)
				} 
				else if (response.errormessage != undefined) {
					errorOccured = true
		       	}
		   	}
			else {
				errorOccured = true
			}
		}
	}
	return errorOccured
}
/**
 * @desc function to check if all additional suppliers has SAP ID or not
 * @link  {https://issuetracking.bsh-sdd.com/browse/MDMPB-14595}
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {node} request object
*/
function allAdditionalSuppliersHaveSAPID(node, step) {
	var b = true
	var additionalSupplierRefs = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_RequestToAdditionalSuppliers"))
	if (additionalSupplierRefs.size()>0){
		for(var i=0; i<additionalSupplierRefs.size(); i++){
			supplierObj = additionalSupplierRefs.get(i).getTarget()
			if (supplierObj.getValue("AT_SAPR3Reference").getSimpleValue() == null){
				b = false
				break
			}
		}
	}
	return b
}
// ------ comments to be added
function getReferenceTargetIDs(node, step, referenceID){
	var targetIDs = []
	var entityReference = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID(referenceID));
	if (entityReference.size() > 0){
		for (var i=0; i<entityReference.size(); i++){
			targetIDs.push(entityReference.get(i).getTarget().getID())
		}
	}
	return targetIDs
}

function getReferenceTargetIDsFromApprovedWS(node, step, referenceID){
	var approvedReferenceTargetIDs = []
	approvedReferenceTargetIDs = step.executeInWorkspace("Approved", function(step) {
								var approvedObj = step.getObjectFromOtherManager(node);
								if(approvedObj) {
									var referenceTargetIDs = getReferenceTargetIDs (approvedObj, step, referenceID);
									return referenceTargetIDs
								}
								return approvedReferenceTargetIDs
	});
	return approvedReferenceTargetIDs
}
function getReferenceTargetNames(node, step, referenceID){
	var targetNames = []
	var entityReference = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID(referenceID));
	if (entityReference.size() > 0){
		for (var i=0; i<entityReference.size(); i++){
			targetNames.push(entityReference.get(i).getTarget().getName() + "(" + entityReference.get(i).getTarget().getID() + ")")
		}
	}
	return targetNames
}

function getReferenceTargetNamesFromApprovedWS(node, step, referenceID){
	var approvedReferenceTargetNames = []
	approvedReferenceTargetNames = step.executeInWorkspace("Approved", function(step) {
								var approvedObj = step.getObjectFromOtherManager(node);
								if(approvedObj) {
									var referenceTargetNames = getReferenceTargetNames (approvedObj, step, referenceID);
									return referenceTargetNames
								}
								return approvedReferenceTargetNames
	});
	return approvedReferenceTargetNames
}
function sortAlphaNum(a, b) {
	var reA = /[^a-zA-Z]/g;
	var reN = /[^0-9]/g;
  	var aA = a+"".replace(reA, "");
  	var bA = b+"".replace(reA, "");
  	if (aA === bA) {
    		var aN = parseInt(a+"".replace(reN, ""), 10);
    		var bN = parseInt(b+"".replace(reN, ""), 10);
    		return aN === bN ? 0 : aN > bN ? 1 : -1;
  	} 
  	else {
    		return aA > bA ? 1 : -1;
  	}
}
function isEqual(a,b)
{    
	if(a.length!=b.length)
		return false;
    	else
    	{
		for(var i=0;i<a.length;i++)
			if(a[i]!=b[i])
	      		return false;
		return true;
    	}
}

/**
 * @desc function to check if the referenced supplier is already extended to this particular company code, where it is being assigned to.
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-14981}
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @param {Node} node current object (Company Code)
 * @param {Step} step Step manager
 */
function validateCCodeForReferencedSupplier(node, step){
	var errMsg = ""
	var refsToValidate = ["REF_SupplierCompanyCodeToSupplier", "REF_DunningRecipient", "REF_SupplierCCToHeadOffice"]
	var mainCCode = node.getID().split("-")[1]
	refsToValidate.forEach(function (refID, pos){
		if (node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID(refID)).size() > 0){
			var supID = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID(refID)).get(0).getTarget().getID()
			var supName = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID(refID)).get(0).getTarget().getName()
			var extendedCCObject = step.getEntityHome().getEntityByID(supID+"-"+mainCCode)
			if(extendedCCObject == null){
				errMsg += "The supplier "+supName+"("+supID+") you're trying to assign for '"+step.getReferenceTypeHome().getReferenceTypeByID(refID).getName()+"' is not extended to Company Code: "+mainCCode+" [company code where the user is assigning the supplier].\n"
			}
		}
	})
	return errMsg == ""?"": "<br></br>"+errMsg+" Please assign it firstly and then continue with this request."
}

/**
 * @desc function to check if the user has performed the action. 
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-9342, https://issuetracking.bsh-sdd.com/browse/MDMPB-9539, https://issuetracking.bsh-sdd.com/browse/MDMPB-9540, https://issuetracking.bsh-sdd.com/browse/MDMPB-9541}
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @param {Node} node current object (Request)
 * @param {Step} step Step manager
 * @param {userAction} Refet to LOV_UserActionStatus
 */
function userHasAlreadyPerformedtheAction(node, step, userAction){
	var values = node.getValue("AT_UserActionStatus").getValues().toArray()
	for(var i=0; i<values.length; i++){
		if(values[i].getID().equals(userAction)){
			return true
		}
	}
	return false
}
/**
 * @desc function to check if a value is present in multivalue attribute. 
 * @link Generic function
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @param {Node} node current object (Request)
 * @param {Step} step Step manager
 * @param {attrID} Multivalue attribute ID
 * @param {checkValue} value to find
 */
function ifValuePresentInMultivalueAttribute(node, step, attrID, checkValue){
	var values = node.getValue(attrID).getValues().toArray()
	for(var i=0; i<values.length; i++){
		if(values[i].getValue().equals(checkValue)){
			return true
		}
	}
	return false
}

/**
 * @desc function to send notification to the accounting users about change of payment terms on the purchasing side. 
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-12454}
 * @param {Node} node current object (Request)
 * @param {Step} step Step manager
 * @param {attrID} Multivalue attribute ID
 */
function sendMailToAccountingUsersOnPaymentTermsChanges(node, step, mailer){
	var suppObj = getSupplierFromRequest(node, step)
	var suppID = suppObj.getID()
	var suppName = suppObj.getName()
	var sapId = suppObj.getValue("AT_SAPR3Reference").getSimpleValue();
	var suplGlobalVariables = step.getClassificationHome().getClassificationByID("SupplierVariables")
	var systemURL = suplGlobalVariables.getValue("AT_SystemURL").getSimpleValue()
	var supplierURL = systemURL+"webui/SupplierWebUI#contextID=Global&workspaceID=Main&screen=DetailScreen_Supplier&selection="+suppObj.getID()+"&nodeType=entity&selectedTab=450412263.0&displayMode=126510176.0";
	var purchOrgList = getReferenceTargetIDs(suppObj, step, "REF_SupplierToSupplierPurchasingData")
	var body =  "Hello team,</br></br>Payment terms for supplier <a href='"+supplierURL+"'>"+suppID+"</a> - <strong>'"+suppName+"'</strong> has been changed for following Purchasing Organisation(s):</br>"
	var content = ""
	var table = "<html><table style='border-collapse:collapse;border:none;'>"
	table += "<tr><td style='padding: 8px;width: 233.75pt;border: 1pt solid rgb(0, 0, 0);background: rgb(230, 230, 230);'><p style='font-family:'arial';color:rgb(255, 255, 255);font-size:17px;text-align:center;'><strong>Purchasing Organisation</strong></p></td>"
	table += "<td style='padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(230, 230, 230);'><p style='font-family:'arial';color:rgb(255, 255, 255);font-size:17px;text-align:center;'><strong>Old Value</strong></p></td>"
	table += "<td style='padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: rgb(230, 230, 230);'><p style='font-family:'arial';color:rgb(255, 255, 255);font-size:17px;text-align:center;'><strong>New Value</strong></p></td></tr>"
	var countryID = getSingleReferenceAttributeValueID(suppObj, step, "REF_SupplierToAddress", "AT_Country")
	var countryObj = step.getEntityHome().getEntityByID("CNTRY_"+countryID)
	var toList = countryObj.getValue("AT_PayablesEmailAccUsers").getSimpleValue()
	var subject = "Note: payment terms change for supplier "+ suppID + " ( SAP ID : " + sapId + " ) " + " - "+suppName 
	purchOrgList.forEach(function (purhOrgID, index) {
		var purchOrgObj = step.getEntityHome().getEntityByID(purhOrgID)
		var appPurchOrgObj = approvednode(purchOrgObj, step)
		if(purchOrgObj && appPurchOrgObj){
			var mainWSPaymentTerms = purchOrgObj.getValue("AT_TermsOfPayment").getSimpleValue()
			var appWSPaymentTerms = appPurchOrgObj.getValue("AT_TermsOfPayment").getSimpleValue()
			if (mainWSPaymentTerms != appWSPaymentTerms){				
				content += "<tr><td style='padding: 8px;width: 233.75pt;border: 1pt solid rgb(0, 0, 0);background: white;'><p style='font-family:'arial';color:rgb(255, 255, 255);font-size:15px;text-align:center;'>"+appPurchOrgObj.getName()+"</p></td>"
				content += "<td style='padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: white;'><p style='font-family:'arial';color:rgb(255, 255, 255);font-size:15px;text-align:center;'>"+appWSPaymentTerms+"</p></td>"
				content += "<td style='padding: 8px;width: 155.8pt;border: 1pt solid rgb(0, 0, 0);background: white;'><p style='font-family:'arial';color:rgb(255, 255, 255);font-size:15px;text-align:center;'>"+mainWSPaymentTerms+"</p></td></tr>"
			}
		}
	})
	table += content+"</table></html>"
	body+= table+"</br></br>Thanks & Regards,</br>Supplier Master Data Team"
	if(content!=""){
		sendMail(mailer, toList, subject, body)
	}
}

/**
 * @desc function to perform Actions and set deadline accordingly if Internal Quality Check is Required. 
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-9946}
 * @param {Node} node current object (Request)
 * @param {Step} step Step manager
 */
function performActionsIfInternalQualityCheckIsRequired(node, step){
	var suppObj = getSupplierFromRequest(node, step)
	var creationType = node.getValue("AT_ChangeRequestWFType").getSimpleValue() == null? null : node.getValue("AT_ChangeRequestWFType").getID()
	var changeType = node.getValue("AT_TypeOfChangeRequest").getSimpleValue() == null? null : node.getValue("AT_TypeOfChangeRequest").getID()
	if(!creationType){
		// will work only for change requests
		var addressReference = suppObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToAddress"));
		var isAddressPOBoxFieldsChanged = null
		if(!addressReference.isEmpty()) {
			var addressID = addressReference.get(0).getTarget().getID();
			var addressObj = step.getEntityHome().getEntityByID(addressID);
			isAddressPOBoxFieldsChanged = compareMainApprovedAttrValues(addressObj, step, ["AT_City","AT_Country","AT_District","AT_HouseNumber","AT_PostCode","AT_Region","AT_Street","AT_Street2","AT_Street3","AT_Street4","AT_PoBox", "AT_PoBoxCity", "AT_POBoxCountry", "AT_POBoxPostalCode", "AT_POBoxPostalCode", "AT_POBoxWithoutNumber"])
		}
		var isNameTaxNumChanged = compareMainApprovedAttrValues(suppObj, step, ["AT_Name1","AT_Name2","AT_Name3","AT_Name4","AT_SuppNotHaveTaxNo"])
		var isTelephoneNumDCChanged = compareMainAppDataContainers(suppObj, step, "ATC_TelephoneNumbers", "ATG_TECH_TelephoneNumbersAttributes")
		var isEmailDCChanged = compareMainAppDataContainers(suppObj, step, "ATC_EmailAddress", "ATG_TECH_EmailAddressesAttributes")
		var isFaxDCChanged = compareMainAppDataContainers(suppObj, step, "ATC_FaxNumbers", "ATG_TECH_FaxNumbersAttributes")
		// Below code we will remove - TAX_DC_REMOVAL
		//var isTaxDCChanged = compareMainAppDataContainers(suppObj, step, "ATC_TaxInformation", "ATG_TECH_TaxInformationAttributes")
	
		var isGenSegAltPayeeChanged = compareMainAppReferenceValues(suppObj, step, "REF_SupplierToSupplierAlternativePayee")
		var isGenSegPermtdPayeeChanged = compareMainAppReferenceValues(suppObj, step, "REF_SupplierToSupplierPermittedPayee")
		var isAccSegAltPayeeChanged = false
		var refCCObjs = suppObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierCompanyCode"))
		for(var i=0; i<refCCObjs.size(); i++) {
			var CCObj = refCCObjs.get(i).getTarget()
			if(compareMainAppReferenceValues(CCObj, step, "REF_SupplierCompanyCodeToSupplier")){
				isAccSegAltPayeeChanged = true
			}
		}
	}
	
	if(creationType){
		var nextWorkingDay = getNextWorkingDay(2);
		if (node.isInState("WF_MDInternWorklist", "MDInternWorklist_ToBeChecked")) {
			node.getTaskByID("WF_MDInternWorklist", "MDInternWorklist_ToBeChecked").setDeadline(nextWorkingDay)
		}
		return true
	}
	// Below code we will remove - TAX_DC_REMOVAL
	//else if(isAddressPOBoxFieldsChanged || isNameTaxNumChanged || isTelephoneNumDCChanged || isEmailDCChanged || isFaxDCChanged || isTaxDCChanged){
	else if(isAddressPOBoxFieldsChanged || isNameTaxNumChanged || isTelephoneNumDCChanged || isEmailDCChanged || isFaxDCChanged){
		
		var nextWorkingDay = getNextWorkingDay(2);
		if (node.isInState("WF_MDInternWorklist", "MDInternWorklist_ToBeChecked")) {
			node.getTaskByID("WF_MDInternWorklist", "MDInternWorklist_ToBeChecked").setDeadline(nextWorkingDay)
		}
		return true
	}
	else{
		if(changeType == "BDCCD" || changeType == "BD" || changeType == "GDBD"){
			
			var nextWorkingDay = getNextWorkingDay(1);
			if (node.isInState("WF_MDInternWorklist", "MDInternWorklist_ToBeChecked")) {
				node.getTaskByID("WF_MDInternWorklist", "MDInternWorklist_ToBeChecked").setDeadline(nextWorkingDay)
			}
			return true
		}
		if(changeType == "GD"){
			if(isGenSegAltPayeeChanged || isGenSegPermtdPayeeChanged){
				
				var nextWorkingDay = getNextWorkingDay(1);
				if (node.isInState("WF_MDInternWorklist", "MDInternWorklist_ToBeChecked")) {
					node.getTaskByID("WF_MDInternWorklist", "MDInternWorklist_ToBeChecked").setDeadline(nextWorkingDay)
				}
				return true
			}	
		}
		if(changeType == "CCD"){
			if(isAccSegAltPayeeChanged){
				var nextWorkingDay = getNextWorkingDay(1);
				if (node.isInState("WF_MDInternWorklist", "MDInternWorklist_ToBeChecked")) {
					node.getTaskByID("WF_MDInternWorklist", "MDInternWorklist_ToBeChecked").setDeadline(nextWorkingDay)
				}
				
				return true
			}	
		}
	}
	return false
}

/**
 * @desc function for Copying POs and CCs while blocking a supplier (duplicate/change of legal form) 
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-11072}
 * @param {Node} node current object (Request)
 * @param {Step} step Step manager
 * @param {bsh} bsh BSH Toolbox
 */
function copyCCPODataWhileBlockingSupplier(node, step, bsh){
	var suppObjToDel = getSupplierFromRequest(node, step)
	var suppObjIDToDel = suppObjToDel.getID()
	var duplicatedSuppliers = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplier"))
	var compCodesToCopy = getReferenceTargetIDs(suppObjToDel, step, "REF_SupplierToSupplierCompanyCode")
	var purchOrgsToCopy = getReferenceTargetIDs(suppObjToDel, step, "REF_SupplierToSupplierPurchasingData")
	for(var i=0;i<duplicatedSuppliers.size();i++){
		var duplicatedSuppObj = duplicatedSuppliers.get(i).getTarget()
		var duplicatedSuppObjID = duplicatedSuppliers.get(i).getTarget().getID()
		var compCodes = getReferenceTargetIDs(duplicatedSuppObj, step, "REF_SupplierToSupplierCompanyCode")
		var purchOrgs = getReferenceTargetIDs(duplicatedSuppObj, step, "REF_SupplierToSupplierPurchasingData")
		var compCodesToCreate = getDifferenceElements(compCodes, compCodesToCopy)
		var purchOrgsToCreate = getDifferenceElements(purchOrgs, purchOrgsToCopy)
		for(var a=0;a<compCodesToCreate.length;a++){
			var newCCID = duplicatedSuppObjID+"-"+compCodesToCreate[a]
			var existingCCID = suppObjIDToDel+"-"+compCodesToCreate[a]
			if(step.getEntityHome().getEntityByID(newCCID) == null){
				//Clone and Create and Link
				var ccSource = step.getEntityHome().getEntityByID(existingCCID)
				var newCCObj = bsh.duplicate(ccSource, null, newCCID, false)
				newCCObj.setName(newCCID.split("-")[1]);
				duplicatedSuppObj.createReference(newCCObj, "REF_SupplierToSupplierCompanyCode")
				var ccMaster = step.getEntityHome().getEntityByID(newCCID.split("-")[1])
				newCCObj.createReference(ccMaster, "REF_SuplCompanyCodeToCompanyCodeMaster")
			}
		}
		for(var a=0;a<purchOrgsToCreate.length;a++){
			var newPOID = duplicatedSuppObjID+"-"+purchOrgsToCreate[a]
			var existingPOID = suppObjIDToDel+"-"+purchOrgsToCreate[a]
			if(step.getEntityHome().getEntityByID(newPOID) == null){
				//Clone and Create and Link
				var poSource = step.getEntityHome().getEntityByID(existingPOID)
				var newPOObj = bsh.duplicate(poSource, null, newPOID, false)
				newPOObj.setName(newPOID.split("-")[1]);
				duplicatedSuppObj.createReference(newPOObj, "REF_SupplierToSupplierPurchasingData")
				var poMaster = step.getEntityHome().getEntityByID("PO_"+newPOID.split("-")[1])
				newPOObj.createReference(poMaster, "REF_SupplierPOToPOMaster")
			}
		}
	}
}


/**
 * @desc function to get the difference between two arrays 
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @param {a1} first array
 * @param {a2} second array
 */
function getDifferenceElements(a1, a2) {
	var a = [], diff = []
	for (var i = 0; i < a1.length; i++) {
		a[a1[i].split("-")[1]] = true
	}
	for (var i = 0; i < a2.length; i++) {
		if (a[a2[i].split("-")[1]]) {
			delete a[a2[i].split("-")[1]]
		} 
		else {
			a[a2[i].split("-")[1]] = true
		}
	}
	for (var k in a) {
		diff.push(k)
	}
	return diff
}


/**
 * @desc function to validate country specific tax information
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-19096}
 * @param {Node} node current object (Request)
 * @param {Step} step Step manager
 */
function ValidateTaxInformation(node, step){
	var hasTaxNo = node.getValue("AT_SuppNotHaveTaxNo").getID();
	var countryCode = getAddressDetails(node, step, "REF_SupplierToAddress").countryCode;
	var errMsg = "";
	var mandateTaxAttrList = []
	if("Y".equals(hasTaxNo)) {
		if(countryCode == "PL"){
			mandateTaxAttrList = ["AT_TaxNumber1"];
			for(var i=0; i<mandateTaxAttrList.length; i++){
				var attrID = mandateTaxAttrList[i];
				var validationRegexTax = getLookupValue(step, countryCode+"-"+attrID, "LT_RegexCheck");
				var attrVal = node.getValue(attrID).getSimpleValue();
				var attributeName = step.getAttributeHome().getAttributeByID(attrID).getName()
				if(!attrVal){
					errMsg = errMsg + "Missing attribute values: "+ "NIP number" + "\n";
				}
				else{
					var checkSumError = validateCheckSumDigitFromAttributes(node, step, countryCode);
					if(!attrVal.match(validationRegexTax)){
						var error = getLookupValue(step, countryCode+"-"+attrID, "LT_ErrorMessages");
						errMsg = errMsg + error + "\n"
					}
					if(checkSumError != true){
						errMsg = errMsg + "Checksum validation failed, please enter valid NIP Number" + "\n"
					}
				}
			}
		}
		else if(countryCode == "DE"){
			mandateTaxAttrList = ["AT_TaxNumber","AT_VatNumber"];
			var found = false
			for(var i=0; i<mandateTaxAttrList.length; i++){
				var attrID = mandateTaxAttrList[i];
				var validationRegexTax = getLookupValue(step, countryCode+"-"+attrID, "LT_RegexCheck");
				var attrVal = node.getValue(attrID).getSimpleValue();
				if(attrVal && !attrVal.match(validationRegexTax)){
					var error = getLookupValue(step, countryCode+"-"+attrID, "LT_ErrorMessages");
					errMsg = errMsg + error + "\n"
				}
			}
			if(!(node.getValue("AT_TaxNumber").getSimpleValue() || node.getValue("AT_VatNumber").getSimpleValue())){
				if(!node.getValue("AT_TaxNumber").getSimpleValue()){
					errMsg = errMsg + "Missing attribute values: "+ step.getAttributeHome().getAttributeByID("AT_TaxNumber").getName()+"/"+step.getAttributeHome().getAttributeByID("AT_VatNumber").getName()+"\n";
				}
				else{
					errMsg = errMsg + "Missing attribute values: "+ step.getAttributeHome().getAttributeByID("AT_TaxNumber").getName()+"/"+step.getAttributeHome().getAttributeByID("AT_VatNumber").getName()+"\n"
				}
			}
		}
		else if(countryCode == "ES" || countryCode == "ESC"){
			mandateTaxAttrList = ["AT_TaxNumber1", "AT_TaxNumber4", "AT_VatNumber"];
			for(var i=0; i<mandateTaxAttrList.length; i++){
				var attrID = mandateTaxAttrList[i];
				var attrVal = node.getValue(attrID).getSimpleValue();
				var validationRegexTax = getLookupValue(step, countryCode+"-"+attrID, "LT_RegexCheck");
				if(attrID == "AT_TaxNumber1" && !attrVal){
					var error = "Missing attribute values: CIF/NIF Number";
					errMsg = errMsg + error + "\n"
				}
				if(attrVal && !attrVal.match(validationRegexTax)){
					var error = getLookupValue(step, countryCode+"-"+attrID, "LT_ErrorMessages");
					errMsg = errMsg + error + "\n";
				}
			}
		}
		if(countryCode == "TR"){
			var flag = false;
			mandateTaxAttrList = ["AT_TaxNumber1","AT_TaxNumber4","AT_TaxNumber2"];
			for(var i=0; i<mandateTaxAttrList.length; i++){
				var attrID = mandateTaxAttrList[i];
				if(attrID == "AT_TaxNumber2"){
					var suplGovtEnt = node.getValue("AT_Supplier_is_a_governmental_entity").getSimpleValue();
					var suplSolProp = node.getValue("AT_Supplier_is_a_sole_proprietorship").getSimpleValue()
					if(suplGovtEnt == "Yes" && suplSolProp == "Yes"){
						var flag = true;
						errMsg = errMsg + "Either of 'Supplier is a governmental entity' and 'Supplier is a sole proprietorship' can be set to 'Yes'." + "\n"
					}
					else if((suplGovtEnt == "No" && suplSolProp == "No") || (suplGovtEnt == null && suplSolProp == null) || (suplGovtEnt == "No" && suplSolProp == null) || (suplGovtEnt == null && suplSolProp == "No") ){
						node.getValue(attrID).setSimpleValue(null);
					}		
					else if((suplGovtEnt == "Yes" && suplSolProp == "No") || (suplGovtEnt == "Yes" && suplSolProp == null)){
						var flag = true;
						var ref = step.getReferenceTypeHome().getReferenceTypeByID("REF_RequestToSupplier");
						var reqList = node.queryReferencedBy(ref).asList(1);
						if(reqList.size() >=1){
							var requestNode = reqList.get(0).getSource();
						}
						if(requestNode.isInWorkflow("WF_SupplierReview")){						
							if(node.getValue(attrID).getSimpleValue() == null){
								errMsg = errMsg + "Missing values: Governmental entity" + "\n"
							}
							else{
								var govtEnt = node.getValue("AT_TaxNumber2").getSimpleValue();
								node.getValue("AT_TaxNumber2").setSimpleValue(govtEnt);
							}
						}
						else{
							node.getValue(attrID).setSimpleValue("ICRA");
						}
					}
					else if((suplSolProp == "Yes" && suplGovtEnt == "No") || (suplSolProp == "Yes" && suplGovtEnt == null)){
						var flag = true;
						var validationRegexTax = getLookupValue(step, countryCode+"-"+attrID, "LT_RegexCheck");
						var attrVal = node.getValue(attrID).getSimpleValue();
						if(!attrVal){
							errMsg = errMsg + "Missing values: T.C. Kimlik No." + "\n"					
						}
						else if(attrVal && !attrVal.match(validationRegexTax)){
							var error = getLookupValue(step, countryCode+"-"+attrID, "LT_ErrorMessages");
							errMsg = errMsg + error + "\n"
						}							
					}
				}
				else if(attrID == "AT_TaxNumber4"){
					var attrVal = node.getValue(attrID).getSimpleValue();
					if(attrVal){
						if(attrVal.length() > 18){
							errMsg = errMsg + "Invalid value for Vergi Dairesi, should have maximun length of 18 alphanumeric characters only." + "\n"							
						}
						var flag = true;
					}
				}
				else{
					var validationRegexTax = getLookupValue(step, countryCode+"-"+attrID, "LT_RegexCheck");
					var attrVal = node.getValue(attrID).getSimpleValue();
					if(attrVal && !attrVal.match(validationRegexTax)){
						var error = getLookupValue(step, countryCode+"-"+attrID, "LT_ErrorMessages");
						errMsg = errMsg + error + "\n"						
					}
					if(attrVal){
						var flag = true;
					}
				}
			}
			if(!flag){
				errMsg = errMsg + "Please provide a value for at least one of the fields: 'Vergi Numarası', 'Vergi Dairesi', 'Supplier is a governmental entity', 'Supplier is a sole proprietorship'" + "\n"
			}
		}
		if(countryCode == "IN"){
			mandateTaxAttrList = ["AT_TaxNumber3"];
			for(var i=0; i<mandateTaxAttrList.length; i++){
				var attrID = mandateTaxAttrList[i];
				var validationRegexTax = getLookupValue(step, countryCode+"-"+attrID, "LT_RegexCheck");
				var attrVal = node.getValue(attrID).getSimpleValue();
				if(!attrVal){
					errMsg = errMsg + "Missing attribute values: "+ "GST Number" + "\n";
				}
				else{
					var checkSumError = validateCheckSumDigitFromAttributes(node, step, countryCode);
					if(!attrVal.match(validationRegexTax)){
						var error = getLookupValue(step, countryCode+"-"+attrID, "LT_ErrorMessages");
						errMsg = errMsg + error + "\n"
					}
					if(checkSumError != true){
						errMsg = errMsg + "Checksum validation failed, please enter valid GST Number" + "\n"
					}
				}
			}
		}
		if(countryCode == "CN"){
			mandateTaxAttrList = ["AT_TaxNumber3","AT_TaxNumber5"];
			var flag = false;
			for(var i=0; i<mandateTaxAttrList.length; i++){
				var attrID = mandateTaxAttrList[i];
				var validationRegexTax = getLookupValue(step, countryCode+"-"+attrID, "LT_RegexCheck");
				var attrVal = node.getValue(attrID).getSimpleValue();
				if(attrVal){
					var flag = true;
					if(attrVal && !attrVal.match(validationRegexTax)){
						var error = getLookupValue(step, countryCode+"-"+attrID, "LT_ErrorMessages");
						errMsg = errMsg + error + "\n"
					}
				}
			}
			if(!flag){
				errMsg = errMsg + "Please provide a value for at least one of the fields: 'Unified Social Credit Code', 'Tax Identification Number'" + "\n"
			}
		}
	}
	else {
		//delete attrs
		var allTaxAttrs = step.getAttributeGroupHome().getAttributeGroupByID("ATG_AllTaxNumbers").getAttributes().toArray();
		if(allTaxAttrs.length>0){
			for(var i=0; i<allTaxAttrs.length; i++){
				var attrID = allTaxAttrs[i].getID();
				node.getValue(attrID).setSimpleValue(null);
			}
		}
		return true
	}
	return errMsg == "" ? true: errMsg;
}


/**
 * @desc function to create country specific tax data in data container
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-19096}
 * @param {Node} node current object (Request)
 * @param {Step} step Step manager
 */
// Below code we will remove - TAX_DC_REMOVAL
function createCountrySpecificTaxDataContainerByTaxCat(node, step, countryCode){
	var countryToTaxNumberMap = {
								"PL": ["AT_TaxNumber1", "AT_VatNumber"], 
								"DE": ["AT_TaxNumber", "AT_VatNumber"],
								"ES": ["AT_TaxNumber1", "AT_TaxNumber4", "AT_VatNumber"], 
								"ESC": ["AT_TaxNumber", "AT_TaxNumber4", "AT_VatNumber"]
							}
	var validAttributes = countryToTaxNumberMap[countryCode]
	if(validAttributes != undefined){
		for(var i=0; i<validAttributes.length; i++){
			var attrID = validAttributes[i]
			var value = node.getValue(attrID).getSimpleValue()
			if(attrID == "AT_TaxNumber"){
				var existingDataContainerRow = getDataContainerbyAttrValueID(node, step, "ATC_TaxInformation", "AT_TaxCat", "Tax Number at Responsible Tax Authority")
				if(existingDataContainerRow != null){
					var existingValue = existingDataContainerRow.getValue("AT_TaxNumber").getSimpleValue()
					if(value && value != existingValue){	
						// delete row
						deleteLocalDataContainerRow(node, step, "ATC_TaxInformation", "AT_TaxCat", "Tax Number at Responsible Tax Authority");
						var newDataContainerRow = createDataCointainerByKeyAttribute(node, step, "ATC_TaxInformation", "AT_TaxCat", "Tax Number at Responsible Tax Authority")
						newDataContainerRow.getValue("AT_TaxNumber").setSimpleValue(value)
					}
				}
				else if(value){
					var newDataContainerRow = createDataCointainerByKeyAttribute(node, step, "ATC_TaxInformation", "AT_TaxCat", "Tax Number at Responsible Tax Authority")
					newDataContainerRow.getValue("AT_TaxNumber").setSimpleValue(value)
				}
				else{
					deleteLocalDataContainerRow(node, step, "ATC_TaxInformation", "AT_TaxCat", "Tax Number at Responsible Tax Authority");
				}
			}
			else if(attrID == "AT_TaxNumber1"){
				var existingDataContainerRow = getDataContainerbyAttrValueID(node, step, "ATC_TaxInformation", "AT_TaxCat", "Tax Number 1")
				if(existingDataContainerRow != null){
					var existingValue = existingDataContainerRow.getValue("AT_TaxNumber").getSimpleValue()
					if(value && value != existingValue){	
						// delete row
						deleteLocalDataContainerRow(node, step, "ATC_TaxInformation", "AT_TaxCat", "Tax Number 1");
						var newDataContainerRow = createDataCointainerByKeyAttribute(node, step, "ATC_TaxInformation", "AT_TaxCat", "Tax Number 1")
						newDataContainerRow.getValue("AT_TaxNumber").setSimpleValue(value)
					}
				}
				else if(value){
					var newDataContainerRow = createDataCointainerByKeyAttribute(node, step, "ATC_TaxInformation", "AT_TaxCat", "Tax Number 1")
					newDataContainerRow.getValue("AT_TaxNumber").setSimpleValue(value)
				}
				else{
					deleteLocalDataContainerRow(node, step, "ATC_TaxInformation", "AT_TaxCat", "Tax Number 1");
				}
			}
			else if (attrID == "AT_VatNumber"){
				var existingDataContainerRow = getDataContainerbyAttrValueID(node, step, "ATC_TaxInformation", "AT_TaxCat", "VAT Number")
				if(existingDataContainerRow != null){
					var existingValue = existingDataContainerRow.getValue("AT_TaxNumber").getSimpleValue()
					if(value && value != existingValue){
						// delete row
						deleteLocalDataContainerRow(node, step, "ATC_TaxInformation", "AT_TaxCat", "VAT Number");
						var newDataContainerRow = createDataCointainerByKeyAttribute(node, step, "ATC_TaxInformation", "AT_TaxCat", "VAT Number")
						newDataContainerRow.getValue("AT_TaxNumber").setSimpleValue(value)
					}
				}
				else if(value){
					var newDataContainerRow = createDataCointainerByKeyAttribute(node, step, "ATC_TaxInformation", "AT_TaxCat", "VAT Number")
					newDataContainerRow.getValue("AT_TaxNumber").setSimpleValue(value)
				}
				else{
					deleteLocalDataContainerRow(node, step, "ATC_TaxInformation", "AT_TaxCat", "VAT Number ");
				}
			}
			else if(attrID == "AT_TaxNumber4"){
				var existingDataContainerRow = getDataContainerbyAttrValueID(node, step, "ATC_TaxInformation", "AT_TaxCat", "Tax Number 4")
				if(existingDataContainerRow != null){
					var existingValue = existingDataContainerRow.getValue("AT_TaxNumber").getSimpleValue()
					if(value && value != existingValue){	
						// delete row
						deleteLocalDataContainerRow(node, step, "ATC_TaxInformation", "AT_TaxCat", "Tax Number 4");
						var newDataContainerRow = createDataCointainerByKeyAttribute(node, step, "ATC_TaxInformation", "AT_TaxCat", "Tax Number 4")
						newDataContainerRow.getValue("AT_TaxNumber").setSimpleValue(value)
					}
				}
				else if(value){
					var newDataContainerRow = createDataCointainerByKeyAttribute(node, step, "ATC_TaxInformation", "AT_TaxCat", "Tax Number 4")
					newDataContainerRow.getValue("AT_TaxNumber").setSimpleValue(value)
				}
				else{
					deleteLocalDataContainerRow(node, step, "ATC_TaxInformation", "AT_TaxCat", "Tax Number 4");
				}
			}
		}
	}
}

function getIN12FieldsErrorMessage(node, step){
	var errMsg = ""
	var suppToSuppCCRefType = step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierCompanyCode");
	var suppToSuppCCReferences = node.getReferences(suppToSuppCCRefType).toArray();
	var countryID = node.getValue("AT_TempCountry").getID()
	var availableCCs = suppToSuppCCReferences.map(function(reference) { 
		return reference.getTarget().getID().split("-")[1]+""
	});
	var isIN12CompanyCodePresent = availableCCs.includes("IN12")
	var isMSMEData = node.getValue("AT_MSMEData").getSimpleValue() == null?"N":node.getValue("AT_MSMEData").getID();
	
	if(countryID == "IN"){
		if(isMSMEData == "Y"){
			var mandatoryAttrs = ["AT_MSMEData", "AT_MSMERegistrationDate", "AT_MSMERegistrationNumber", "AT_PanNumber", "AT_PanReference"]
		}
		else{
			var mandatoryAttrs = ["AT_MSMEData", "AT_PanNumber", "AT_PanReference"]
		}
	}
	else {
		if(isMSMEData == "Y"){
			var mandatoryAttrs = ["AT_MSMEData", "AT_MSMERegistrationDate", "AT_MSMERegistrationNumber"]
		}
		else{
			var mandatoryAttrs = ["AT_MSMEData"]
		}
	}
	
	if(isIN12CompanyCodePresent){
		for(var i=0; i<mandatoryAttrs.length; i++){
			var value = node.getValue(mandatoryAttrs[i]).getSimpleValue()
			if(value == null){
				var errMsg = errMsg + "Missing attribute: " + step.getAttributeHome().getAttributeByID(mandatoryAttrs[i]).getName() + "</br>";
			}
			if(value != null && mandatoryAttrs[i] == "AT_PanNumber"){
				var validationRegexTax = getLookupValue(step, "IN-AT_PanNumber", "LT_RegexCheck");
				if(!value.match(validationRegexTax)){
					var error = getLookupValue(step, "IN-AT_PanNumber", "LT_ErrorMessages");
					errMsg = errMsg + error + "\n"
				}
			}
		}
	}
	return errMsg
}


/**
 * @desc function populate local specialists on request object
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-9483}
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @param {node} node is Supplier object.
 * @param {step} Step manager.
 */
function populateConsolidatedSupplierCategory(node, step){
	var categoryMap = {
		"PM" : "direct",
		"NPM" : "indirect",
		"OEM" : "OEM"
	}
	var allPOCategories = []
	var uniquePOCategories = []
	var poRefType = step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierPurchasingData");
	var poRefs = node.getReferences(poRefType).toArray();
	if(poRefs.length>0){
		var availablePOCategories = poRefs.map(function(reference) { 
			return reference.getTarget().getValue("AT_SupplierCategory").getID()
		});
		
		availablePOCategories.forEach(function(element){
			if(element){
				if (element.indexOf("/")>-1){
					for(var j=0; j<element.split("/").length; j++)
			                allPOCategories.push(element.split("/")[j]);
				}
				else {
					allPOCategories.push(element)
				}
			}
		});
		
		allPOCategories.forEach(function(element, position){
		    	if(!uniquePOCategories.includes(element)){
				uniquePOCategories.push(element)
			}
		});
		node.getValue("AT_ConsolidatedSupplierCategory").deleteCurrent()
		uniquePOCategories.forEach(function(value){
		    	node.getValue("AT_ConsolidatedSupplierCategory").addValue(value + " (" + categoryMap[value] + ")")
		});
	}
	
	return uniquePOCategories;
}

/**
 * @desc function populate local specialists on request object
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-19776}
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @param {node} node is Supplier object.
 * @param {step} Step manager.
 */
function populateWhatsChangedByRequesterForMDInterns(node, step){
	var display = "";
	var companyCodeChanges = whatsChangedInSupplierChildren(node, step, "REF_SupplierToSupplierCompanyCode");
	var purchOrgChanges = whatsChangedInSupplierChildren(node, step, "REF_SupplierToSupplierPurchasingData");
	var bankChanges = whatsChangedInBankData(node, step);
	var supplierGeneralDataChanges = whatsChangedInSupplierGeneralData (node, step);
	if(supplierGeneralDataChanges) {
		display += displaySupplierGeneralDataChanges (node, step);
	}
	if(companyCodeChanges) {
		display += displayCCAndPOChanges (node, step, "REF_SupplierToSupplierCompanyCode");
	}
	if(purchOrgChanges) {
		display += displayCCAndPOChanges (node, step, "REF_SupplierToSupplierPurchasingData");
	}
	if(bankChanges) {
		display += displayBankDataChanges (node, step);
	}
	if(!supplierGeneralDataChanges && !companyCodeChanges && !purchOrgChanges && !bankChanges) {
		display += "<h3><span style= color:red>No changes made.</span></h3>";
	}
	display = display.replace(/<|>/g, function(m) {
	    return m === '<' ? '<lt/>' : '<gt/>';
	})
	return display;
}

/**
 * @desc This function validates the length of Names and Nation Names of the supplier(Name 1, Name 2, National Name 1, National Name 2, etc).
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-20729}
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @param {node} node is Supplier object.
 * @param {step} Step manager.
 */
function isLengthValidForName1Name2Name3Name4(node, step){
	var errMsg = ""
	var name1 = node.getValue("AT_Name1").getSimpleValue();
	var name2 = node.getValue("AT_Name2").getSimpleValue();
	var name3 = node.getValue("AT_Name3").getSimpleValue();
	var name4 = node.getValue("AT_Name4").getSimpleValue();
	var nationalName1 = node.getValue("AT_NationalName1").getSimpleValue();
	var nationalName2 = node.getValue("AT_NationalName2").getSimpleValue();
	var nationalName3 = node.getValue("AT_NationalName3").getSimpleValue();
	var nationalName4 = node.getValue("AT_NationalName4").getSimpleValue();
	
	if(name1 && name1.length()>35){
		errMsg = errMsg + "Length of '"+step.getAttributeHome().getAttributeByID("AT_Name1").getName()+"' cannot exceed 35 characters.\n"
	}
	if(name2 && name2.length()>35){
		errMsg = errMsg + "Length of '"+step.getAttributeHome().getAttributeByID("AT_Name2").getName()+"' cannot exceed 35 characters.\n"
	}
	if(name3 && name3.length()>35){
		errMsg = errMsg + "Length of '"+step.getAttributeHome().getAttributeByID("AT_Name3").getName()+"' cannot exceed 35 characters.\n"
	}
	if(name4 && name4.length()>35){
		errMsg = errMsg + "Length of '"+step.getAttributeHome().getAttributeByID("AT_Name4").getName()+"' cannot exceed 35 characters.\n"
	}
	if(nationalName1 && nationalName1.length()>35){
		errMsg = errMsg + "Length of '"+step.getAttributeHome().getAttributeByID("AT_NationalName1").getName()+"' cannot exceed 35 characters.\n"
	}
	if(nationalName2 && nationalName2.length()>35){
		errMsg = errMsg + "Length of '"+step.getAttributeHome().getAttributeByID("AT_NationalName2").getName()+"' cannot exceed 35 characters.\n"
	}
	if(nationalName3 && nationalName3.length()>35){
		errMsg = errMsg + "Length of '"+step.getAttributeHome().getAttributeByID("AT_NationalName3").getName()+"' cannot exceed 35 characters.\n"
	}
	if(nationalName4 && nationalName4.length()>35){
		errMsg = errMsg + "Length of '"+step.getAttributeHome().getAttributeByID("AT_NationalName4").getName()+"' cannot exceed 35 characters.\n"
	}
	return errMsg==""?true:errMsg
}

/**
 * @desc function to get all required attributes for Anti-fraud form conditionally
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-20609}
 * @param {Node} node current object (Request)
 * @param {Step} step Step manager
 */
function getRequiredAttributesAntiFraudConditionally(node, step) {
	var list = [];
	var changeRequestType = node.getValue("AT_TypeOfChangeRequest").getID();
	var creationRequestType = node.getValue("AT_ChangeRequestWFType").getID();
	var suppObj = getSupplierFromRequest(node, step);
	var currentUserID = step.getCurrentUser().getID();
	var isAccountingUser = isUserMemberOfUserGroup(step, "USG_SUPL_CC_AuthorizationGroups", currentUserID);
	var isDevUser = isUserMemberOfUserGroup(step, "usg_developSystem", currentUserID);
	var sscUser = isUserMemberOfUserGroup(step, "USG_SUPL_MDMSpecialist", currentUserID);
	var hasBankDocument = hasReferenceTarget(node, step, "REF_BankSupportingDocuments");
	var isAltPayeeChangedCC = isAlternativePayeeChangedInCC(suppObj, step, "REF_SupplierToSupplierCompanyCode");
	var isAlternativePayeeChanged = checkAlternativePayeeChanges(suppObj, step, "REF_SupplierToSupplierAlternativePayee");
	var isPermittedPayeeChanged = (areReferencesRemovedForPermittedPayee(suppObj, step) || areReferencesAddedToPermittedPayee(suppObj, step) || isSupplierReplacedForPermittedPayee(suppObj, step));
	var isBankChangeRequest = "GDBD".equals(changeRequestType) || "BDCCD".equals(changeRequestType) || "BD".equals(changeRequestType)
	var isBankCreationRequest = "Segment A+B Creation".equals(creationRequestType)
	var isBankDataPresent = suppObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToBankAccount")).toArray().length > 0;
	if (((isAccountingUser || isDevUser) && !sscUser) || node.isInState("WF_SupplierReview", "End")){
		if (isBankCreationRequest && isBankDataPresent) {
			list.push("AT_DocRecvdViaEmail");
			list.push("AT_DocApprovedByRequester");
			var isDocRecvdViaMail = node.getValue("AT_DocRecvdViaEmail").getID();
			if (isDocRecvdViaMail != null && isDocRecvdViaMail == "Y") {
				var proofInbCommAuthAttrs = ["AT_ConfExeReplyToValidNoRisk", "AT_ConfExeSpamTestValidNoRisk"];
				list = list.concat(proofInbCommAuthAttrs);
			}
			list.push("AT_ConfSecSrcContSuppInitBSHEmpVia");
			var secSourceConfirmation = node.getValue("AT_ConfSecSrcContSuppInitBSHEmpVia").getID();
			if (secSourceConfirmation == "Fax") {
				var faxConfValidationAttrs = ["AT_ConfRcvdConfViaFax", "AT_ContactDataSrcFax"];
				list = list.concat(faxConfValidationAttrs);
				var faxConfRcvdVia = node.getValue("AT_ConfRcvdConfViaFax").getID();
				if (faxConfRcvdVia == "Email") {
					list.push("AT_PrevVerifMethodsNotExecuted");
				}
			} else if (secSourceConfirmation == "OfficialRegister") {
				list.push("AT_ConfBnkAccContDataAppearsOffclReg");
			} else if (secSourceConfirmation == "Phone") {
				var phoneConfValidationAttrs = ["AT_ConfRcvdConfViaPhone", "AT_DateTimeCallWithSupplier", "AT_ContactDataSrcPhone"];
				list = list.concat(phoneConfValidationAttrs);
				var phoneConfRcvdVia = node.getValue("AT_ConfRcvdConfViaPhone").getID();
				if (phoneConfRcvdVia == "Email") {
					list.push("AT_ConfNotRecvdViaPhoneFax");
					list.push("AT_NameOfBusinessPartnrChngConf");
					list.push("AT_SurnameOfBusinessPartnrChngConf");
				} else if (phoneConfRcvdVia == "BussPartRef") {
					list.push("AT_ConfirmationReceived");
				} else if (phoneConfRcvdVia == "Fax"){
					list.push("AT_NameOfBusinessPartnrChngConf");
					list.push("AT_SurnameOfBusinessPartnrChngConf");
				} else if (phoneConfRcvdVia == "Phone"){
					list.push("AT_NameOfBusinessPartnrChngConf");
					list.push("AT_SurnameOfBusinessPartnrChngConf");
				}
			} else if (secSourceConfirmation == "PhoneBSHInt") {
				var phoneBSHIntAttrs = ["AT_NameOfBSHPersonChngConf", "AT_SurnameOfBSHPersonChngConf", "AT_DateTimeCallWithBSHEmp"];
				list = list.concat(phoneBSHIntAttrs);
			}
			list.push("AT_ConfAnriFraudProcReq");
		} else if (isBankCreationRequest && !isBankDataPresent) {
			list.push("AT_DocApprovedByRequester");
			list.push("AT_ConfAnriFraudProcReq");
		} else if (isBankChangeRequest && isBankChangeInvolved(node, step)) {
			list.push("AT_DocRecvdViaEmail");
			var isDocRecvdViaMail = node.getValue("AT_DocRecvdViaEmail").getID();
			if (isDocRecvdViaMail != null && isDocRecvdViaMail == "Y") {
				var proofInbCommAuthAttrs = ["AT_ConfExeReplyToValidNoRisk", "AT_ConfExeSpamTestValidNoRisk"];
				list = list.concat(proofInbCommAuthAttrs);
			}
			list.push("AT_ConfSecSrcContSuppInitBSHEmpVia");
			var secSourceConfirmation = node.getValue("AT_ConfSecSrcContSuppInitBSHEmpVia").getID();
			if (secSourceConfirmation == "Fax") {
				var faxConfValidationAttrs = ["AT_ConfRcvdConfViaFax", "AT_ContactDataSrcFax"];
				list = list.concat(faxConfValidationAttrs);
				var faxConfRcvdVia = node.getValue("AT_ConfRcvdConfViaFax").getID();
				if (faxConfRcvdVia == "Email") {
					list.push("AT_PrevVerifMethodsNotExecuted");
				}
			} else if (secSourceConfirmation == "OfficialRegister") {
				list.push("AT_ConfBnkAccContDataAppearsOffclReg");
			} else if (secSourceConfirmation == "Phone") {
				var phoneConfValidationAttrs = ["AT_ConfRcvdConfViaPhone", "AT_DateTimeCallWithSupplier", "AT_ContactDataSrcPhone"];
				list = list.concat(phoneConfValidationAttrs);
				var phoneConfRcvdVia = node.getValue("AT_ConfRcvdConfViaPhone").getID();
				if (phoneConfRcvdVia == "Email") {
					list.push("AT_ConfNotRecvdViaPhoneFax");
					list.push("AT_NameOfBusinessPartnrChngConf");
					list.push("AT_SurnameOfBusinessPartnrChngConf");
				} else if (phoneConfRcvdVia == "BussPartRef") {
					list.push("AT_ConfirmationReceived");
				} else if (phoneConfRcvdVia == "Fax"){
					list.push("AT_NameOfBusinessPartnrChngConf");
					list.push("AT_SurnameOfBusinessPartnrChngConf");
				} else if (phoneConfRcvdVia == "Phone"){
					list.push("AT_NameOfBusinessPartnrChngConf");
					list.push("AT_SurnameOfBusinessPartnrChngConf");
				}
			} else if (secSourceConfirmation == "PhoneBSHInt") {
				var phoneBSHIntAttrs = ["AT_NameOfBSHPersonChngConf", "AT_SurnameOfBSHPersonChngConf", "AT_DateTimeCallWithBSHEmp"];
				list = list.concat(phoneBSHIntAttrs);
			}
			list.push("AT_ConfAnriFraudProcReq");
		} else if (!isBankChangeRequest && isNonBankChangeInvolved(node, step)) {
			if (("GD".equals(changeRequestType) && (isAlternativePayeeChanged || isPermittedPayeeChanged)) || ("CCD".equals(changeRequestType) && isAltPayeeChangedCC) || "SVC".equals(changeRequestType)) {
				list.push("AT_DocRecvdViaEmail");
				var isDocRecvdViaMail = node.getValue("AT_DocRecvdViaEmail").getID();
				if (isDocRecvdViaMail != null && isDocRecvdViaMail == "Y") {
					var proofInbCommAuthAttrs = ["AT_ConfExeReplyToValidNoRisk", "AT_ConfExeSpamTestValidNoRisk"];
					list = list.concat(proofInbCommAuthAttrs);
				}
				list.push("AT_ConfSecSrcContSuppInitBSHEmpVia");
				var secSourceConfirmation = node.getValue("AT_ConfSecSrcContSuppInitBSHEmpVia").getID();
				if (secSourceConfirmation == "Fax") {
					var faxConfValidationAttrs = ["AT_ConfRcvdConfViaFax", "AT_ContactDataSrcFax"];
					list = list.concat(faxConfValidationAttrs);
					var faxConfRcvdVia = node.getValue("AT_ConfRcvdConfViaFax").getID();
					if (faxConfRcvdVia == "Email") {
						list.push("AT_PrevVerifMethodsNotExecuted");
					}
				} else if (secSourceConfirmation == "OfficialRegister") {
					list.push("AT_ConfBnkAccContDataAppearsOffclReg");
				} else if (secSourceConfirmation == "Phone") {
					var phoneConfValidationAttrs = ["AT_ConfRcvdConfViaPhone", "AT_DateTimeCallWithSupplier", "AT_ContactDataSrcPhone"];
					list = list.concat(phoneConfValidationAttrs);
					var phoneConfRcvdVia = node.getValue("AT_ConfRcvdConfViaPhone").getID();
					if (phoneConfRcvdVia == "Email") {
						list.push("AT_ConfNotRecvdViaPhoneFax");
						list.push("AT_NameOfBusinessPartnrChngConf");
						list.push("AT_SurnameOfBusinessPartnrChngConf");
					} else if (phoneConfRcvdVia == "BussPartRef") {
						list.push("AT_ConfirmationReceived");
					} else if (phoneConfRcvdVia == "Fax"){
						list.push("AT_NameOfBusinessPartnrChngConf");
						list.push("AT_SurnameOfBusinessPartnrChngConf");
					} else if (phoneConfRcvdVia == "Phone"){
						list.push("AT_NameOfBusinessPartnrChngConf");
						list.push("AT_SurnameOfBusinessPartnrChngConf");
					}
				} else if (secSourceConfirmation == "PhoneBSHInt") {
					var phoneBSHIntAttrs = ["AT_NameOfBSHPersonChngConf", "AT_SurnameOfBSHPersonChngConf", "AT_DateTimeCallWithBSHEmp"];
					list = list.concat(phoneBSHIntAttrs);
				}
			}
			list.push("AT_ConfAnriFraudProcReq");
		}
	}
	return list;
}

/**
 * @desc function to get all required attachments for Anti-fraud form conditionally
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-23606}
 * @param {Node} node current object (Request)
 * @param {Step} step Step manager
 */
function getRequiredAttachmentsAntiFraudConditionally(node, step) {
	var list = [];
	var changeRequestType = node.getValue("AT_TypeOfChangeRequest").getID();
	var creationRequestType = node.getValue("AT_ChangeRequestWFType").getID();
	var suppObj = getSupplierFromRequest(node, step);
	var currentUserID = step.getCurrentUser().getID();
	var isAccountingUser = isUserMemberOfUserGroup(step, "USG_SUPL_CC_AuthorizationGroups", currentUserID);
	var isDevUser = isUserMemberOfUserGroup(step, "usg_developSystem", currentUserID);
	var sscUser = isUserMemberOfUserGroup(step, "USG_SUPL_MDMSpecialist", currentUserID);
	var hasBankDocument = hasReferenceTarget(node, step, "REF_BankSupportingDocuments");
	var isAltPayeeChangedCC = isAlternativePayeeChangedInCC(suppObj, step, "REF_SupplierToSupplierCompanyCode");
	var isAlternativePayeeChanged = checkAlternativePayeeChanges(suppObj, step, "REF_SupplierToSupplierAlternativePayee");
	var isPermittedPayeeChanged = (areReferencesRemovedForPermittedPayee(suppObj, step) || areReferencesAddedToPermittedPayee(suppObj, step) || isSupplierReplacedForPermittedPayee(suppObj, step));
	var isBankChangeRequest = "GDBD".equals(changeRequestType) || "BDCCD".equals(changeRequestType) || "BD".equals(changeRequestType)
	var isBankCreationRequest = "Segment A+B Creation".equals(creationRequestType)
	var isBankDataPresent = suppObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToBankAccount")).toArray().length > 0;
	if (((isAccountingUser || isDevUser) && !sscUser) || node.isInState("WF_SupplierReview", "End")){
		if (isBankCreationRequest && isBankDataPresent) {
			list.push("REF_ScreenshotFromBusinessConfirmation");
			var secSourceConfirmation = node.getValue("AT_ConfSecSrcContSuppInitBSHEmpVia").getID();
			if (secSourceConfirmation == "Fax") {
				var faxConfRcvdVia = node.getValue("AT_ConfRcvdConfViaFax").getID();
				var contDataSrcfax = node.getValue("AT_ContactDataSrcFax").getID();
				if (faxConfRcvdVia == "Email") {
					list.push("REF_ScrnshotEmailConfHeadGBSLocAcc");
					list.push("REF_ScreenshotFromEmailConfirmation");
					if(contDataSrcfax == "PurchBussReq" || contDataSrcfax == "OfficialWebsite"){
						list.push("REF_ScreenshotOfContactDataSource");
					}
				}
				if (faxConfRcvdVia == "Fax") {
					list.push("REF_ScreenshotFromInboundOutbound");
					if(contDataSrcfax == "PurchBussReq" || contDataSrcfax == "OfficialWebsite"){
						list.push("REF_ScreenshotOfContactDataSource");
					}
				}
			} 
			else if (secSourceConfirmation == "OfficialRegister") {
				list.push("REF_ScreenshotFromOfficialRegister");
			} 
			else if (secSourceConfirmation == "Phone") {
				var phoneConfRcvdVia = node.getValue("AT_ConfRcvdConfViaPhone").getID();
				var contDataSrcPhone = node.getValue("AT_ContactDataSrcPhone").getID();
				if (phoneConfRcvdVia == "Email") {
					list.push("REF_ScrnshotEmailConfHeadGBSLocAcc");
					list.push("REF_ScreenshotFromEmailConfirmation");
					if(contDataSrcPhone == "PurchBussReq" || contDataSrcPhone == "OfficialWebsite"){
						list.push("REF_ScreenshotOfContactDataSource");
					}
				} 
				else if (phoneConfRcvdVia == "BussPartRef") {
					list.push("REF_ScreenshotWithTheConfirmation");
					if(contDataSrcPhone == "PurchBussReq" || contDataSrcPhone == "OfficialWebsite"){
						list.push("REF_ScreenshotOfContactDataSource");
					}
				} 
				else if (phoneConfRcvdVia == "Fax"){
					list.push("REF_ScreenshotOfFaxConfirmation");
					if(contDataSrcPhone == "PurchBussReq" || contDataSrcPhone == "OfficialWebsite"){
						list.push("REF_ScreenshotOfContactDataSource");
					}
				}
				else if(phoneConfRcvdVia == "Phone"){
					if(contDataSrcPhone == "PurchBussReq" || contDataSrcPhone == "OfficialWebsite"){
						list.push("REF_ScreenshotOfContactDataSource");
					}
				}
			}
		} 
		else if (isBankCreationRequest && !isBankDataPresent) {
			list.push("REF_ScreenshotFromBusinessConfirmation");
		} 
		else if (isBankChangeRequest && isBankChangeInvolved(node, step)) {
			var secSourceConfirmation = node.getValue("AT_ConfSecSrcContSuppInitBSHEmpVia").getID();
			if (secSourceConfirmation == "Fax") {
				var faxConfRcvdVia = node.getValue("AT_ConfRcvdConfViaFax").getID();
				var contDataSrcfax = node.getValue("AT_ContactDataSrcFax").getID();
				if (faxConfRcvdVia == "Email") {
					list.push("REF_ScrnshotEmailConfHeadGBSLocAcc");
					list.push("REF_ScreenshotFromEmailConfirmation");
					if(contDataSrcfax == "PurchBussReq" || contDataSrcfax == "OfficialWebsite"){
						list.push("REF_ScreenshotOfContactDataSource");
					}
				}
				if (faxConfRcvdVia == "Fax") {
					list.push("REF_ScreenshotFromInboundOutbound");
					if(contDataSrcfax == "PurchBussReq" || contDataSrcfax == "OfficialWebsite"){
						list.push("REF_ScreenshotOfContactDataSource");
					}
				}
			} 
			else if (secSourceConfirmation == "OfficialRegister") {
				list.push("REF_ScreenshotFromOfficialRegister");
			} 
			else if (secSourceConfirmation == "Phone") {
				var phoneConfRcvdVia = node.getValue("AT_ConfRcvdConfViaPhone").getID();
				var contDataSrcPhone = node.getValue("AT_ContactDataSrcPhone").getID();
				if (phoneConfRcvdVia == "Email") {
					list.push("REF_ScrnshotEmailConfHeadGBSLocAcc");
					list.push("REF_ScreenshotFromEmailConfirmation");
					if(contDataSrcPhone == "PurchBussReq" || contDataSrcPhone == "OfficialWebsite"){
						list.push("REF_ScreenshotOfContactDataSource");
					}
				} 
				else if (phoneConfRcvdVia == "BussPartRef") {
					list.push("REF_ScreenshotWithTheConfirmation");
					if(contDataSrcPhone == "PurchBussReq" || contDataSrcPhone == "OfficialWebsite"){
						list.push("REF_ScreenshotOfContactDataSource");
					}
				} 
				else if (phoneConfRcvdVia == "Fax"){
					list.push("REF_ScreenshotOfFaxConfirmation");
					if(contDataSrcPhone == "PurchBussReq" || contDataSrcPhone == "OfficialWebsite"){
						list.push("REF_ScreenshotOfContactDataSource");
					}
				}
				else if(phoneConfRcvdVia == "Phone"){
					if(contDataSrcPhone == "PurchBussReq" || contDataSrcPhone == "OfficialWebsite"){
						list.push("REF_ScreenshotOfContactDataSource");
					}
				}
			}
		} 
		else if (!isBankChangeRequest && isNonBankChangeInvolved(node, step)) {
			if (("GD".equals(changeRequestType) && (isAlternativePayeeChanged || isPermittedPayeeChanged)) || ("CCD".equals(changeRequestType) && isAltPayeeChangedCC) || "SVC".equals(changeRequestType)) {
				var secSourceConfirmation = node.getValue("AT_ConfSecSrcContSuppInitBSHEmpVia").getID();
				if (secSourceConfirmation == "Fax") {
					var faxConfRcvdVia = node.getValue("AT_ConfRcvdConfViaFax").getID();
					var contDataSrcfax = node.getValue("AT_ContactDataSrcFax").getID();
					if (faxConfRcvdVia == "Email") {
						list.push("REF_ScrnshotEmailConfHeadGBSLocAcc");
						list.push("REF_ScreenshotFromEmailConfirmation");
						if(contDataSrcfax == "PurchBussReq" || contDataSrcfax == "OfficialWebsite"){
							list.push("REF_ScreenshotOfContactDataSource");
						}
					}
					if (faxConfRcvdVia == "Fax") {
						list.push("REF_ScreenshotFromInboundOutbound");
						if(contDataSrcfax == "PurchBussReq" || contDataSrcfax == "OfficialWebsite"){
							list.push("REF_ScreenshotOfContactDataSource");
						}
					}
				} 
				else if (secSourceConfirmation == "OfficialRegister") {
					list.push("REF_ScreenshotFromOfficialRegister");
				} 
				else if (secSourceConfirmation == "Phone") {
					var phoneConfRcvdVia = node.getValue("AT_ConfRcvdConfViaPhone").getID();
					var contDataSrcPhone = node.getValue("AT_ContactDataSrcPhone").getID();
					if (phoneConfRcvdVia == "Email") {
						list.push("REF_ScrnshotEmailConfHeadGBSLocAcc");
						list.push("REF_ScreenshotFromEmailConfirmation");
						if(contDataSrcPhone == "PurchBussReq" || contDataSrcPhone == "OfficialWebsite"){
							list.push("REF_ScreenshotOfContactDataSource");
						}
					} 
					else if (phoneConfRcvdVia == "BussPartRef") {
						list.push("REF_ScreenshotWithTheConfirmation");
						if(contDataSrcPhone == "PurchBussReq" || contDataSrcPhone == "OfficialWebsite"){
							list.push("REF_ScreenshotOfContactDataSource");
						}
					} 
					else if (phoneConfRcvdVia == "Fax"){
						list.push("REF_ScreenshotOfFaxConfirmation");
						if(contDataSrcPhone == "PurchBussReq" || contDataSrcPhone == "OfficialWebsite"){
							list.push("REF_ScreenshotOfContactDataSource");
						}
					}
					else if(phoneConfRcvdVia == "Phone"){
						if(contDataSrcPhone == "PurchBussReq" || contDataSrcPhone == "OfficialWebsite"){
							list.push("REF_ScreenshotOfContactDataSource");
						}
					}
				}
			}
		}
	}
	return list;
}


/**
 * @desc function to check any bank change related change is made or not regarding Anti-fraud process.
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-20609}
 * @param {Node} node current object (Request)
 * @param {Step} step Step manager
 */
function isBankChangeInvolved(node, step) {
	var changeRequestType = node.getValue("AT_TypeOfChangeRequest").getID();
	var supplierObj = getSupplierFromRequest(node, step);
	var currentUserID = step.getCurrentUser().getID();
	var isAccountingUser = isUserMemberOfUserGroup(step, "USG_SUPL_CC_AuthorizationGroups", currentUserID);
	var isDevUser = isUserMemberOfUserGroup(step, "usg_developSystem", currentUserID);
	var sscUser = isUserMemberOfUserGroup(step, "USG_SUPL_MDMSpecialist", currentUserID);
	var hasBankDetails = isBankDetailsChangedForAttachment(node, step);
	var hasBankDocument = hasReferenceTarget(node, step, "REF_BankSupportingDocuments");
	var isTelEmailFaxChanged = checkTelephoneEmailAndFaxChanges(supplierObj, step);
	var isAltPayeeChangedCC = isAlternativePayeeChangedInCC(supplierObj, step, "REF_SupplierToSupplierCompanyCode");
	var isAlternativePayeeChanged = checkAlternativePayeeChanges(supplierObj, step, "REF_SupplierToSupplierAlternativePayee");
	var isPermittedPayeeChanged = (areReferencesRemovedForPermittedPayee(supplierObj, step) || areReferencesAddedToPermittedPayee(supplierObj, step) || isSupplierReplacedForPermittedPayee(supplierObj, step));

	if (((isAccountingUser || isDevUser) && !sscUser) || node.isInState("WF_SupplierReview", "End")){
		if ("BD".equals(changeRequestType)) {
			if (hasBankDetails || isAlternativePayeeChanged || isPermittedPayeeChanged) {
				return true;
			}
		} else if ("GDBD".equals(changeRequestType)) {
			if (hasBankDetails || (isTelEmailFaxChanged || isAlternativePayeeChanged || isPermittedPayeeChanged)) {
				return true;
			}
		} else if ("BDCCD".equals(changeRequestType)) {
			if (hasBankDetails || isAltPayeeChangedCC || isAlternativePayeeChanged || isPermittedPayeeChanged) {
				return true;
			}
		}
	}
	
	return false;
}

/**
 * @desc function to check any non-bank change related change is made or not regarding Anti-fraud process.
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-20609}
 * @param {Node} node current object (Request)
 * @param {Step} step Step manager
 */
function isNonBankChangeInvolved(node, step) {
	var changeRequestType = node.getValue("AT_TypeOfChangeRequest").getID();
	var supplierObj = getSupplierFromRequest(node, step);
	var currentUserID = step.getCurrentUser().getID();
	var hasBankDocument = hasReferenceTarget(node, step, "REF_BankSupportingDocuments");
	var isAccountingUser = isUserMemberOfUserGroup(step, "USG_SUPL_CC_AuthorizationGroups", currentUserID);
	var sscUser = isUserMemberOfUserGroup(step, "USG_SUPL_MDMSpecialist", currentUserID);
	var isTelEmailFaxChanged = checkTelephoneEmailAndFaxChanges(supplierObj, step);
	var isAltPayeeChangedCC = isAlternativePayeeChangedInCC(supplierObj, step, "REF_SupplierToSupplierCompanyCode");
	var isAlternativePayeeChanged = checkAlternativePayeeChanges(supplierObj, step, "REF_SupplierToSupplierAlternativePayee");
	var isPermittedPayeeChanged = (areReferencesRemovedForPermittedPayee(supplierObj, step) || areReferencesAddedToPermittedPayee(supplierObj, step) || isSupplierReplacedForPermittedPayee(supplierObj, step));
	var supplierVariant = supplierObj.getValue("AT_SupplierVariant").getID();
	var isDevUser = isUserMemberOfUserGroup(step, "usg_developSystem", currentUserID);

	if (((isAccountingUser || isDevUser) && !sscUser) || node.isInState("WF_SupplierReview", "End")){
		if ("GD".equals(changeRequestType) && (isTelEmailFaxChanged || isAlternativePayeeChanged || isPermittedPayeeChanged)) {
			return true;
		}
		if ("CCD".equals(changeRequestType) && isAltPayeeChangedCC) {
			return true;
		}
		if ("SVC".equals(changeRequestType) && "RS".equals(supplierVariant)) {
			return true;
		}
	}
	
	return false;
}

/**
 * @desc function to check if Alternative payee is changed on Company Code.
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-20609}
 * @param {Node} node current object (Request)
 * @param {Step} step Step manager
 */
function isAlternativePayeeChangedInCC(suppObj, step, refID) {
	var compCodes = suppObj.getReferences(step.getReferenceTypeHome().getReferenceTypeByID(refID)).toArray();
	for (var i = 0; i < compCodes.length; i++) {
		var ccObj = compCodes[i].getTarget();
		var mainAlternativePayee = getReferenceTargetID(ccObj, step, "REF_SupplierCompanyCodeToSupplier");
		var approvedAlternativePayee = getReferenceTargetIDFromApprovedWS(ccObj, step, "REF_SupplierCompanyCodeToSupplier");
		if (mainAlternativePayee != approvedAlternativePayee) {
			return true;
		}
	}
	return false;
}


/**
 * @desc function to check is the supplied attributes has value or not. Returns the list of empty attributes which should be filled.
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-20609}
 * @param {Node} node current object (Request)
 * @param {Step} step Step manager
 */
function validateMandatoryAttributes(node, step, attrIDList){
	var mandErrMsg = ""
	var count = 1
	for(var i=0; i<attrIDList.length; i++){
		var attrObj = step.getAttributeHome().getAttributeByID(attrIDList[i]);
		var attrValue = null
		if(attrObj.hasLOV()){
			attrValue = node.getValue(attrIDList[i]).getID();
		}
		else{
			attrValue = node.getValue(attrIDList[i]).getSimpleValue();
		}
		if(attrValue == null){
			mandErrMsg = mandErrMsg+"<b>"+(count++)+". Missing value:</b> "+step.getAttributeHome().getAttributeByID(attrIDList[i]).getName()+"\n";
		}
	}
	return mandErrMsg == ""?true:mandErrMsg
}

/**
 * @desc function to check if the required attachments are present or not. Returns the list of empty attachments which should be supplied.
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-20609}
 * @param {Node} node current object (Request)
 * @param {Step} step Step manager
 */
function validateMandatoryAttachments(node, step, attachmntIDList){
	var mandErrMsg = ""
	var count = 1
	for(var i=0; i<attachmntIDList.length; i++){

		var hasAttachment = hasReferenceTarget(node, step, attachmntIDList[i]);
		if(!hasAttachment){
			mandErrMsg = mandErrMsg+"<b>"+(count++)+". Missing attachment:</b> "+step.getReferenceTypeHome().getReferenceTypeByID(attachmntIDList[i]).getName()+"\n";
		}
	}
	return mandErrMsg == ""?true:mandErrMsg
}


/**
 * @desc function to delete unnecessary attributes if provided by user. Returns the list of deleted attributes IDs.
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-20609}
 * @param {Node} node current object (Request)
 * @param {Step} step Step manager
 */
function deleteAttrsWhichAreNotRequired(node, step){
	var attributesToKeep = getRequiredAttributesAntiFraudConditionally(node,step);
	var attributesToDelete = [];
	//log.info("attributesToKeep : "+attributesToKeep.length);
	var allAntiFraudAttrs = step.getAttributeGroupHome().getAttributeGroupByID("ATG_AntiFraudProcedureAttributes").getAttributes().toArray();
	//log.info("allAntiFraudAttrs : "+allAntiFraudAttrs.length);
	for(var i=0; i<allAntiFraudAttrs.length; i++){
		var found=false;
		for(var j=0; j<attributesToKeep.length; j++){
			if(allAntiFraudAttrs[i].getID() == attributesToKeep[j]){
				found = true
			}
		}
		if(!found){
			attributesToDelete.push(allAntiFraudAttrs[i].getID())
		}
	}
	//log.info("attributesToDelete : "+attributesToDelete.length);
	for(var k=0; k<attributesToDelete.length; k++){
		var attr = node.getValue(attributesToDelete[k]).setValue(null);
	}
	return attributesToDelete;
}

/**
 * @desc function to check and populate Yes/No on supplier level if Return Vendor set as Yes/No and retrun true/false.
 * @author Dipayan Singha Roy <Dipayan.Singha-ext@bshg.com>
 * @link {https://issuetracking.bsh-sdd.com/browse/MDMPB-25220}
 * @param {Node} node current object (Supplier)
 * @param {Step} step Step manager
 */
function populateReturnVendorFlagOnSupplierLevel(node, step){
	var flag = false;
	var purchOrgsRefs = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToSupplierPurchasingData")).toArray();
	purchOrgsRefs.forEach(function(ref){
		var purchOrgObj = ref.getTarget();
		var returnVendor = purchOrgObj.getValue("AT_ReturnsVendor").getID();
		if(returnVendor == "Y"){
			flag = true;
			node.getValue("AT_IsReturnVendorFlagged").setLOVValueByID("Y");
		}
	})
	return flag;
}









/*================================ Customer Specific Functions ===================================================*/
/**
 * @desc function to split the values based on a parameter and add it to a hashset.
 * @link
 * @author Harshit Sharma <Harshit.Sharma-ext@bshg.com>
 * @param {Node} node current object
 * @param {Step} step Step manager
 * @param {String} splitWith seperator value 
 * @param {String} value Value with some seperator
 * @returns
 */
function convertSplitValueToHashSet(value, splitWith){
	if(value){
		var splitValue = value.split(splitWith);
		var aHashSet = new java.util.HashSet("");
		for(var i=0; i<splitValue.length; i++){
			var val = splitValue[i]; 
			aHashSet.add(val);
		}
	}
	return aHashSet;
}

/**
 * @desc function to check the mandatory attributes.
 * @link
 * @author Harshit Sharma <Harshit.Sharma-ext@bshg.com>
 * @param {Node} node current object
 * @param {Step} step Step manager
 * @param {String} country country of the customer.
 * @param {String} looUpvalue Lookup table value.
 * @returns
 */
function mandatoryCheck(step, node, country, looUpvalue){
 	var error = "";
	var bHashSet = new java.util.HashSet("");
	var isNull = false;
	var dc = node.getDataContainerByTypeID("ATC_TaxInformation").getDataContainers();
	var itr = dc.iterator();
	while(itr.hasNext()){
		var dcObj = itr.next().getDataContainerObject();
		var taxCatValue = dcObj.getValue("AT_TaxCat").getSimpleValue();
		bHashSet.add(taxCatValue);
	}
	var HashSetValue = convertSplitValueToHashSet(looUpvalue, ",");
	logger.info("HashSetValue "+HashSetValue);
	logger.info("bHashSet "+bHashSet);
	if(HashSetValue && !bHashSet.containsAll(HashSetValue)){
		var arrayH= bHashSet.toArray();
		var str="";
		for(var k=0; k<arrayH.length;k++){
		 str=HashSetValue.remove(arrayH[k]);
		 
		}
		error = "Missing value: "+HashSetValue+" in the Tax Category under the Tax Information as its mandatory for "+country+"\n";
	}
	return error;
}

/**
 * @desc function to validate Tax information.
 * @link
 * @author Harshit Sharma <Harshit.Sharma-ext@bshg.com>
 * @param {Node} node current object
 * @param {Step} step Step manager
 * @param {String} countryCode country code of the customer.
 * @param {String} looUpvalue Lookup table value.
 * @param {String} validateFlag Flag check.
 * @returns
 */
// Below code we will remove - TAX_DC_REMOVAL
/*function checkTaxInformation(node, step, countryCode, looUpvalue, validateFlag) {
		if(validateFlag) {
			var errorMessage = "";
			var dataContainers = node.getDataContainerByTypeID("ATC_TaxInformation").getDataContainers();
			var itr = dataContainers.iterator();
			var HashSetValue = convertSplitValueToHashSet(looUpvalue, ",");
			while (itr.hasNext()){
				var dcObject = itr.next().getDataContainerObject();
				var dcAttrCat = dcObject.getValue("AT_TaxCat").getSimpleValue();
				var dcAttrNum = dcObject.getValue("AT_TaxNumber").getSimpleValue();
				var lookFrom = countryCode+"-"+dcAttrCat;
				var validationRegex = getLookupValue(step, lookFrom, "LT_RegexCheck");
				if(validationRegex && dcAttrNum) {
					if(!dcAttrNum.match(validationRegex)) {
						if(dcAttrCat && HashSetValue.contains(dcAttrCat)){
							var error = getLookupValue(step, lookFrom, "LT_ErrorMessages");
							errorMessage+= error+"\n";
						}
					}
				}else if(!dcAttrNum){
					errorMessage+= "Missing value: "+dcAttrCat+"\n";
				}
			}
			//exceptional check for Poland country
			if("PL".equals(countryCode) && !errorMessage) {
				var checkSumCheck = validateCheckSumDigit(node, step, "Tax Number 1", countryCode); // Tax Number 1 is the LOV ID for Tax Number 1 value
				if(checkSumCheck != true) {
					errorMessage+= "Checksum validation failed, please enter valid tax number 1";
				}
			}
			if(errorMessage) {
				return errorMessage;
			}
		}
		
	return true;
}*/

/**
 * @desc function to add colon to the unloading point attributes.
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-3728
 * @author Harshit Sharma <Harshit.Sharma-ext@bshg.com>
 * @param {Node} node current object
 * @param {Step} step Step manager
 * @param {String} unloadingPointAttributeGroup Unloading Points attribute groups
 * @returns
 */
function setUnloadingPoints(node, step, unloadingPointAttributeGroup){
	var group = step.getAttributeGroupHome().getAttributeGroupByID(unloadingPointAttributeGroup);
	if(group != null){
		var attArray = group.getAllAttributes().toArray();
		for(var k=0; k<attArray.length;k++){
			var AttrID = attArray[k].getID();
			if(!"AT_DefaultUnloadingPoint".equals(AttrID) && !"AT_UnloadingPoint".equals(AttrID) && !"AT_GoodReceivingHours".equals(AttrID)){
				var dcID = node.getDataContainerByTypeID("ATC_UnloadingPoints").getDataContainers();
				var dc = dcID.iterator();
				while(dc.hasNext()){
					var dataContainerObj = dc.next().getDataContainerObject();
						log.info("AttrID "+AttrID);
						var attributeValue = dataContainerObj.getValue(AttrID).getSimpleValue();
						if(attributeValue != null && !attributeValue.contains(":")){
							var valueWithColon = addSymbol(attributeValue,"colon");
							dataContainerObj.getValue(AttrID).setSimpleValue(valueWithColon);
						}
				}
			}
		}
	}
}

/**
 * @desc function to insert colon and Paranthasis between the string.
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-3728
 * @author Harshit Sharma <Harshit.Sharma-ext@bshg.com>
 * @param {String} attrValue Attribute value
 * @returns
 */
function addSymbol(attributeValue, symbolCheck){
	if(symbolCheck == "colon"){
		var attValue1 = attributeValue.slice(0, 2);
		var attValue2 = attributeValue.slice(2, 4);
	    var stringWithColon = attValue1+":";
	    var conncatColonString = stringWithColon.concat(attValue2);
	    return conncatColonString;
	}
	else {
		var attValue1 = attributeValue.slice(0, 1).trim();
		var attValue2 = attributeValue.slice(1, 10);
	    var stringWithParanthasis = "("+attValue1+")";
	    var conncatParanthasisString = stringWithParanthasis.concat(attValue2);
	    return conncatParanthasisString;
	}
}


/**
 * @desc function to sync the Account group attribute at WebUI with the reference in Workbench.
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-5629
 * @author Harish Nistala <Harish.Nistala-ext@bshg.com>
 * @param {Node} node current object
 * @param {Step} step Step manager
 * @param {String} accGrpValue Account Group attribute value on Customer level
 * @returns null/nothing
 */
function upsertAcctGrpReferenceForAcctGrpAttr(node, step, accGrpValue){
	if(accGrpValue){
		var accGrpID = "ACG_" +accGrpValue;
		var accGrpObj = step.getEntityHome().getEntityByID(accGrpID);
		var refPartnerFun = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_CustomerToAccountGrp"));
		if(!refPartnerFun.isEmpty()){
			var refAccountGrp = refPartnerFun.get(0).getTarget().getID();
			if(refAccountGrp != accGrpID){
				refPartnerFun.get(0).delete();
				node.createReference(accGrpObj, "REF_CustomerToAccountGrp");
			}
		}
		else{
			node.createReference(accGrpObj, "REF_CustomerToAccountGrp");
		}
	}
}
/**
 * @desc function to populate search term value in the webUI.
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-7392
 * @author Harish Nistala <Harish.Nistala-ext@bshg.com>
 * @param {Node} node current object
 * @param {Step} step Step manager
 * @param {String} attName Name 1 attribute value on Customer level
 * @param {String} attCity City attribute value on the target of Customer reference
 * @param {String} attSearchTerm Search term attribute value on Customer level
 * @param {String} reference Customer to Address reference on Customer level
 * @returns {String} Error Message String.
 */
function setSearchTermWithConcatenatedNameAndCity (node, step, attName, attCity, attSearchTerm, reference){
	var error = "";
	var name1 = node.getValue(attName).getSimpleValue();
	var entityref = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID(reference));
	if (!entityref.isEmpty()){
		var target = entityref.get(0).getTarget();
		var city = target.getValue(attCity).getSimpleValue();
	}
	if(name1 && city){
		var replaceSpaceName = name1.replaceAll(" ", "").toUpperCase();
		var nameString = replaceSpaceName.slice(0, 10);
		var replaceSpaceCity = city.replaceAll(" ", "").toUpperCase();
		var cityString = replaceSpaceCity.slice(0, 10);
		var concatSearchTerm = nameString + cityString;
		
		var searchTerm = node.getValue(attSearchTerm).getSimpleValue();
		if(searchTerm == null){
			node.getValue(attSearchTerm).setSimpleValue(concatSearchTerm);
		}
	}
	else{
		error = "Please fill both Name 1 and City.";
	}
	if(error != ""){
		return error;
	}
	return true;
}

/**
 * @desc function to set the value of Country Dialing Code in Data Container.
 * @link
 * @author Harshit Sharma <Harshit.Sharma-ext@bshg.com>
 * @param {Node} node current object
 * @param {String} countryID country code of the customer.
 * @param {String} dcID ID of the Communication data containers ATC_TelephoneNumbers
 * @returns
 */
 function setCountryDialingCode(node, countryID,dcID,attID){
	var isTelehoneNumAdded = isDataContainerHasValue(node, dcID);
	if(isTelehoneNumAdded){
		var dataContainers = node.getDataContainerByTypeID(dcID).getDataContainers();
		var itr = dataContainers.iterator();
		while (itr.hasNext()){
			var dataContainerObject = itr.next().getDataContainerObject();
			var dialingCodeValue = dataContainerObject.getValue(attID).getSimpleValue();
			if(!dialingCodeValue) {
				dataContainerObject.getValue(attID).setLOVValueByID(countryID);
						}
		}
	}
}

/**
 * @desc function to validate Tax information on customer level.
 * @link
 * @author Harshit Sharma <Harshit.Sharma-ext@bshg.com>
 * @param {Node} node current object
 * @param {Step} step Step manager
 * @param {String} countryCode country code of the customer.
 * @param {String} looUpvalue Lookup table value.
 * @param {String} validateFlag Flag check.
 * @returns
 */
function customerCheckTaxInformation(custObject, step, countryCode, looUpvalue, validateFlag) {
		if(validateFlag) {
			var errorMessage = "";
			var dataContainers = custObject.getDataContainerByTypeID("ATC_TaxInformation").getDataContainers();
			var itr = dataContainers.iterator();
			var HashSetValue = convertSplitValueToHashSet(looUpvalue, ",");
			while (itr.hasNext()){
				var dcObject = itr.next().getDataContainerObject();
				var dcAttrCat = dcObject.getValue("AT_TaxCat").getSimpleValue();
				var dcAttrNum = dcObject.getValue("AT_TaxNumber").getSimpleValue();
				var lookFrom = countryCode+"-"+dcAttrCat;
				var validationRegex = getLookupValue(step, lookFrom, "LT_RegexCheck");
				if(validationRegex && dcAttrNum) {
					if(!dcAttrNum.match(validationRegex)) {
						if(HashSetValue && dcAttrCat && HashSetValue.contains(dcAttrCat)){
							var error = getLookupValue(step, lookFrom, "LT_ErrorMessages");
							errorMessage+= error+"\n";
						}else{
							var error = getLookupValue(step, lookFrom, "LT_ErrorMessages");
							errorMessage+= error+"\n";
						}
					}
				}else if(!dcAttrNum){
					errorMessage+= "The value of Tax Number for "+dcAttrCat+" cannot be blank.\n";
				}
			}
			if(errorMessage) {
				return errorMessage;
			}
		}
		
	return true;
}

/**
 * @desc function to validate the mandatory data on customer level.
 * @link
 * @author Harshit Sharma <Harshit.Sharma-ext@bshg.com>
 * @param {Node} node current object
 * @param {Step} step Step manager
 * @returns
 */
function customerCheckMandatoryData(node, step){
	var errorMessage = "";
	var countryCode = getAddressDetails(node, step, "REF_CustomerToAddress").countryCode;
	var searchTermCheck = setSearchTermWithConcatenatedNameAndCity(node, step, "AT_Name1", "AT_City", "AT_SearchTerm", "REF_CustomerToAddress");
	var isPostalCodeValid = validatePostalCode(node, step, (countryCode+"-PostCode"), "LT_RegexCheck", "LT_ErrorMessages", "REF_CustomerToAddress", "AT_PostCode");
	var poBoxPostalCheck = poBoxMandatoryCheck(node, step);
	var isSalesTaxClassCheck = salesTaxClassificationCheck(node, step);
	var telephoneCheck = defaultFlagCheck(node, step, "ATC_TelephoneNumbers", "AT_TelephoneNumber", "AT_DefaultFlagCheckBox", true);
	var mobileCheck = defaultFlagCheck(node, step, "ATC_MobileNumbers", "AT_MobileNumber", "AT_DefaultFlagCheckBox", true);
	var emailCheck = defaultFlagCheck(node, step, "ATC_EmailAddress", "AT_EmailAddress", "AT_DefaultFlagCheckBox", true);
	var unloadingPointCheck = defaultFlagCheck(node, step, "ATC_UnloadingPoints", "AT_UnloadingPoint", "AT_DefaultUnloadingPoint", false);
	var telephone = validateDataContainerAttribute(step, node,"ATC_TelephoneNumbers", "AT_TelephoneNumber", "AT_CountryDialingCodePrefix", "LT_RegexCheck", "LT_ErrorMessages");
	var mobile = validateDataContainerAttribute(step, node,"ATC_MobileNumbers", "AT_MobileNumber", "AT_CountryDialingCodePrefix", "LT_RegexCheck", "LT_ErrorMessages");
	addBracketsInString(node, step, telephone,"ATC_TelephoneNumbers", "AT_TelephoneNumber");
	addBracketsInString(node, step, mobile,"ATC_MobileNumbers", "AT_MobileNumber");
	addressCheck(node, step, isPostalCodeValid, poBoxPostalCheck);
	if(searchTermCheck != true) {
		errorMessage = searchTermCheck+"\n";
	}
	if(isPostalCodeValid != true) {
		errorMessage += isPostalCodeValid+"\n";
	}
	if(poBoxPostalCheck != true) {
		errorMessage += poBoxPostalCheck+"\n";
	}
	if(isSalesTaxClassCheck != true) {
		errorMessage += isSalesTaxClassCheck+"\n";
	}
	if(telephoneCheck != true) {
		errorMessage += telephoneCheck+"\n";
	}
	if(mobileCheck != true) {
		errorMessage += mobileCheck+"\n";
	}
	if(emailCheck != true) {
		errorMessage += emailCheck+"\n";
	}
	if(unloadingPointCheck != true) {
		errorMessage += unloadingPointCheck+"\n";
	}
	if(telephone != true) {
		errorMessage += telephone+"\n";
	}
	if(mobile != true) {
		errorMessage += mobile+"\n";
	}
	return errorMessage;
}

/**
 * @desc function to check the Default flag on DataContainer level.
 * @link
 * @author Harshit Sharma <Harshit.Sharma-ext@bshg.com>
 * @param {Node} node current object
 * @param {Step} step Step manager
 * @param {String} dataContainerID ID of the Communication data containers ex - ATC_TelephoneNumbers
 * @param {String} attributeID attributes of the datacontainer
 * @returns
 */
function defaultFlagCheck(node, step, dataContainerID, attributeID, tDefaultFlag, flagCheck){
	var dc = node.getDataContainerByTypeID(dataContainerID).getDataContainers();
	if(dc.size() == 1){
		var dcObj = dc.iterator().next().getDataContainerObject();
		var defaultFlag = dcObj.getValue(tDefaultFlag).getID();
		if(defaultFlag == null){
			dcObj.getValue(tDefaultFlag).setLOVValueByID("Y");
		}
	}else if(dc.size() > 1) {
		var count = 0;
		var flag = false;
		var errorMessage = "";
		var attributeName = step.getAttributeHome().getAttributeByID(attributeID).getName();
		var defaultFlagName = step.getAttributeHome().getAttributeByID(tDefaultFlag).getName();
		var itr = dc.iterator();
		while(itr.hasNext()){
			var dcObj = itr.next().getDataContainerObject();
			var defaultFlag = dcObj.getValue(tDefaultFlag).getID();
			if(defaultFlag == "Y" ){				
				count++;
			}
		}
		if((count > 1 ||count == 0) && (flagCheck)){
			errorMessage += "Please add '"+defaultFlagName+"' for only one '"+attributeName+"'.";
		}else if((count > 1 || count == 0) && (!flagCheck)){
			errorMessage += "Please add 'Def Unloading Pnt' for only one 'Unloading Point'.";
		}
		if(errorMessage != ""){
			return errorMessage;
		}
	}
	
	return true;
}

/**
 * @desc function to set the workflow name & request id on datacontainer level .
 * @link
 * @author Harshit Sharma <Harshit.Sharma-ext@bshg.com>
 * @param {Node} node current object
 * @param {Step} step Step manager
 * @param {String} requestObj Request object
 * @param {String} wfDCID ID of the Workflow Name data containers ex - ATC_WorkflowNames
 * @param {String} wfID Workflow id ex - WF_TaxApproval
 * @returns
 */
function setWorkflowNameInDC(node, step, requestObj, wfDCID, wfID){
	var hasDataContainer = isDataContainerHasValue(node, wfDCID);
	if(!hasDataContainer){
		var dcObj = createDataCointainer(node, wfDCID);
		dcObj.getValue("AT_CUSTWorkflowName").setLOVValueByID(wfID);
		dcObj.getValue("AT_CUST_CreationRequest").setSimpleValue(requestObj.getID());
	}else{
		var dcObj = getDataContainerbyAttrValueID(node, step, wfDCID, "AT_CUSTWorkflowName", wfID);
		if(dcObj){
			dcObj.getValue("AT_CUST_CreationRequest").setSimpleValue(requestObj.getID());
		}
	}
}

/**
 * @desc function to partially approve the data container .
 * @link
 * @author Harshit Sharma <Harshit.Sharma-ext@bshg.com>
 * @param {Node} tnode current object
 * @param {String} dataContinerID ID of the data containers ex - ATC_TaxInformation
 * @param {String} partObjectSet hash set variable
 * @returns
 */
function partiallyApproveDataContainer(tnode, dataContinerID, partObjectSet){
	var partObjectsChanged = tnode.getNonApprovedObjects();
	if(partObjectsChanged){
		var partObjectsChangedItr = partObjectsChanged.iterator();
		while(partObjectsChangedItr.hasNext()){
			var item = partObjectsChangedItr.next();
			if(item instanceof com.stibo.core.domain.partobject.datacontainer.DataContainerPartObject){
				var dcID = String(item.getDataContainerTypeID());
				if(dcID.equals(dataContinerID)){
					partObjectSet.add(item);
				}
			}
		}
		if(!partObjectSet.isEmpty()){
			tnode.approve(partObjectSet);
		}else{
			log.info("No Changes in data container");
		}
	}
}

/**
 * @desc function to partially approve the attributes and DC.
 * @link
 * @author Harshit Sharma <Harshit.Sharma-ext@bshg.com>
 * @param {Node} tnode current object
 * @param {Step} step Step manager
 * @returns
 */
function partiallyApproveAttributesAndDC(node, step, groupID, flagCheck){
	var partObjectSet = new java.util.HashSet();
	var group = step.getAttributeGroupHome().getAttributeGroupByID(groupID);
	if(group != null){
		var attArray = group.getAllAttributes().toArray();
		for(var k=0; k<attArray.length;k++){
			var AttrID = attArray[k].getID();
			var valuePartObject = new com.stibo.core.domain.partobject.ValuePartObject(AttrID);
			partObjectSet.add(valuePartObject);
		}
		if(flagCheck == true){
			var custRef = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_RequestToCustomer")).get(0);
			var custNode = custRef.getTarget();
			partiallyApproveDataContainer(custNode, "ATC_TaxInformation", partObjectSet);
		}else{
			if(!partObjectSet.isEmpty()){
				node.approve(partObjectSet);
			}else{
				log.info("No Changes in attributes");
			}
		}
	}
}

/**
 * @desc function to convert string from Small to Capital letter.
 * @link
 * @author Harshit Sharma <Harshit.Sharma-ext@bshg.com>
 * @param {Node} tnode current object
 * @param {Step} step Step manager
 * @param {String} tString string which convert from small to capital
 * @param {String} targetID Object ID
 * @param {String} attID Attribute ID
 * @returns
 */
function convertStringSmalltoCap(node, step, tString, targetID, attID){
	if(tString){
		var upperCaseString = tString.toUpperCase();
		var targetObj = step.getEntityHome().getEntityByID(targetID);
		targetObj.getValue(attID).setSimpleValue(upperCaseString);
	}
}

/**
 * @desc function to check the POBoxPostalCode format.
 * @link
 * @author Harshit Sharma <Harshit.Sharma-ext@bshg.com>
 * @param {Node} tnode current object
 * @param {Step} step Step manager
 * @returns
 */
function poBoxMandatoryCheck(node, step){
	var addressValues = getAddressDetails(node, step, "REF_CustomerToAddress");
	var poBox = addressValues.poBox;
	var poBoxPostCode = addressValues.poBoxPostCode;
	var countryCode = addressValues.countryCode;
	var errorMessage = "";
	if(!poBox && poBoxPostCode) {
		errorMessage += "Please remove the value in the 'PO Box Postal Code', because the value of 'PO Box' is blank.";
	}else if(poBox && !poBoxPostCode){
		errorMessage += "Please enter the value in the 'PO Box Postal Code', because the value of 'PO Box' is not blank.";
	}else{
		var isPOBoxPostalCodeValid = validatePostalCode(node, step, (countryCode+"-POBoxPostalCode"), "LT_RegexCheck", "LT_ErrorMessages", "REF_CustomerToAddress", "AT_POBoxPostalCode");
		if(isPOBoxPostalCodeValid != true) {
			errorMessage += isPOBoxPostalCodeValid;
		}else{
			var targetID = getReferenceTargetID (node, step, "REF_CustomerToAddress");
			convertStringSmalltoCap(node, step, poBoxPostCode, targetID, "AT_POBoxPostalCode");
		}
	}
	if(errorMessage) {
		return errorMessage;
	}
	return true;
}

/**
 * @desc function to check the Sales Tax attribute is blank or nor.
 * @link
 * @author Harshit Sharma <Harshit.Sharma-ext@bshg.com>
 * @param {Node} tnode current object
 * @param {Step} step Step manager
 * @returns
 */
function salesTaxClassificationCheck(node, step){
	var ref = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SalesTax"));
	if(!ref.isEmpty()){
		for(var i=0; i<ref.size(); i++){
			var flag = true;
			var salesTaxObj = ref.get(i).getTarget();
			var salesTaxClass = salesTaxObj.getValue("AT_SalesTaxClassification").getSimpleValue();
			if(salesTaxClass == null){
				flag = false;
				break;
			}
		}
		if(!flag){
			return "'Sales Tax Classification' cannot be left blank. Please select the value under the Sales Tax tab.";
		}
	}
	return true;
}

//---------------------------------------------
function addressCheck(node, step, isPostalCodeValid, poBoxPostalCheck){
	if(isPostalCodeValid == true && poBoxPostalCheck == true){
		var countryCode = getAddressDetails(node, step, "REF_CustomerToAddress").countryCode;
		var grpList = step.getCurrentUser().getGroups();
		var itr = grpList.iterator();
		while(itr.hasNext()){
			var grp = itr.next().getID();
			if("Stibo".equals(grp)){
				var looUpvalue = getLookupValue(step, (grp+"-"+countryCode), "APS_WFLookUpOnCountry");
				if(looUpvalue != null){
					var targetID = getReferenceTargetID (node, step, "REF_CustomerToAddress");
					var targetObj = step.getEntityHome().getEntityByID(targetID);
					if(!targetObj.isInWorkflow("AddressWorkflow")) {
						targetObj.startWorkflowByID(looUpvalue, "Auto Initiation for Address Object");
					}
				}
				break;
			}
		}
	}
}

/*
 * @desc function to check the Contact Mandatory checks.
 * @link
 * @author Giri.Kummari-ext@bshg.com
 * @param {Node} tnode current object
 * @param {Step} step Step manager
 * @returns
 */
function contactCheckMandatoryData(node, step){
	var errorMessage = "";
	var countryCode = getAddressDetails(node, step, "REF_ContactToAddress").countryCode;
	setCountryDialingCode(node, countryCode, "ATC_TelephoneNumbers","AT_CountryDialingCodePrefix");
	setCountryDialingCode(node, countryCode, "ATC_MobileNumbers","AT_CountryDialingCodePrefix");
	var postalCodeandCity = postCodeandCity(node, step);
	var telephoneCheck = defaultFlagCheck(node, step, "ATC_TelephoneNumbers", "AT_TelephoneNumber", "AT_DefaultFlagCheckBox", true);
	var mobileCheck = defaultFlagCheck(node, step, "ATC_MobileNumbers", "AT_MobileNumber", "AT_DefaultFlagCheckBox", true);
	var emailCheck = defaultFlagCheck(node, step, "ATC_EmailAddress", "AT_EmailAddress", "AT_DefaultFlagCheckBox", true);
	var internetaddressCheck = defaultFlagCheck(node, step, "ATC_InternetAddress", "AT_InternetAddress", "AT_DefaultFlagCheckBox", true);
   	var telephone = validateDataContainerAttribute(step, node,"ATC_TelephoneNumbers", "AT_TelephoneNumber", "AT_CountryDialingCodePrefix", "LT_RegexCheck", "LT_ErrorMessages");
   	var mobile = validateDataContainerAttribute(step, node,"ATC_MobileNumbers", "AT_MobileNumber", "AT_CountryDialingCodePrefix", "LT_RegexCheck", "LT_ErrorMessages");
	addBracketsInString(node, step, mobile ,"ATC_MobileNumbers","AT_MobileNumber");
	addBracketsInString(node, step, telephone,"ATC_TelephoneNumbers","AT_TelephoneNumber");
	
	if(telephoneCheck != true) {
		errorMessage += telephoneCheck+"\n";
	}
	if(mobileCheck != true) {
		errorMessage += mobileCheck+"\n";
	}
	if(emailCheck != true) {
		errorMessage += emailCheck+"\n";
	}
	if(internetaddressCheck != true) {
		errorMessage += internetaddressCheck+"\n";
	}
	if(postalCodeandCity != true) {
		errorMessage += postalCodeandCity+"\n";
	}
	if(telephone != true) {
		errorMessage += telephone+"\n";
	}
	if(mobile != true) {
		errorMessage += mobile+"\n";
	}
	
	return errorMessage;
}

/*
 * @desc function to check the dependency between Postcode and City
 * @link
 * @author Giri.Kummari-ext@bshg.com
 * @param {Node} tnode current object
 * @param {Step} step Step manager
 * @returns
 */
function postCodeandCity(node, step){
	var addressValues = getAddressDetails(node, step, "REF_ContactToAddress");
	var city = addressValues.city;
	var postCode = addressValues.postCode;
	var countryCode = addressValues.countryCode;
	var errorMessage = "";
	if(!postCode && city) {
		errorMessage += "Please enter the value in the 'Post Code', because the value of 'City' is not blank.";
	}else if(postCode && !city){
		errorMessage += "Please enter the value in the 'City', because the value of 'Post Code' is not blank.";
	}else{
		var isPostalCodeValid =validatePostalCode(node, step, (countryCode+"-POBoxPostalCode"), "LT_RegexCheck", "LT_ErrorMessages", "REF_ContactToAddress", "AT_PostCode");
		if(isPostalCodeValid != true) {
			errorMessage += isPostalCodeValid;
		}else{
			var targetID =getReferenceTargetID (node, step, "REF_ContactToAddress");
			convertStringSmalltoCap(node, step, postCode, targetID, "AT_PostCode");
		}
	}
		if(errorMessage){
		return errorMessage;
		 }
		return true;		
}

//---------------------------------------------------------------------------

/*
 * @desc function to check the Brackets on the telephone number
 * @link
 * @author Harshit Sharma <Harshit.Sharma-ext@bshg.com>
 * @param {Node} tnode current object
 * @param {Step} step Step manager
 * @returns
 */
function addBracketsInString(node, step, flagCheck,datacontainerID,attrID){
	if(flagCheck == true){
		var dcID = node.getDataContainerByTypeID(datacontainerID).getDataContainers();
		var dc = dcID.iterator();
		while(dc.hasNext()){
			var dataContainerObj = dc.next().getDataContainerObject();
				var attributeValue = dataContainerObj.getValue(attrID).getSimpleValue();
				if(attributeValue != null  && !attributeValue.contains("(0)")){
					var valueWithBrackets = addSymbol(attributeValue,"brackets");
					dataContainerObj.getValue(attrID).setSimpleValue(valueWithBrackets);
				}
		}
	}
}

//-------------------------------------------Start--------------------------------------------------
function displayWhatsChangedInCustomer(node, step) {
	var changeInfo = "";
	var taxChanges = whatsChangedInTaxData(node, step);
	if(taxChanges) {
		changeInfo += taxChanges;
	}
	return changeInfo;
}

function whatsChangedInTaxData(node, step) {
	var changeInfo = "";
	//tax attribute and tax datacontainer
	var unApprovedCustomerObjects = node.getNonApprovedObjects();
	var changedDCIDs = new java.util.HashSet("");
	for (var i = unApprovedCustomerObjects.iterator(); i.hasNext(); ) {
		var unApprovedCustomerObject = i.next();
		if(unApprovedCustomerObject && unApprovedCustomerObject instanceof com.stibo.core.domain.partobject.ValuePartObject){
			var generalAttributeID = unApprovedCustomerObject.getAttributeID();
			var attrList = getAllAttributesFromGroup(step,"ATG_PartialTaxApproveAttrGrp");
			if(attrList.contains(generalAttributeID)) {
				changeInfo += "The field " + "'" + step.getAttributeHome().getAttributeByID(unApprovedCustomerObject.getAttributeID()).getName() + "'" + " is changed. Previous value - " + getAttrValuesFromApprovedWS(node, step, unApprovedCustomerObject.getAttributeID()) + ". New Value - " + getAttributeValue(node, unApprovedCustomerObject.getAttributeID()) + "\n";
			}
		}
		else if(unApprovedCustomerObject && unApprovedCustomerObject instanceof com.stibo.core.domain.partobject.datacontainer.DataContainerPartObject) {
			changedDCIDs.add(unApprovedCustomerObject.getDataContainerTypeID());
		}
	}
	var hashSetItr = changedDCIDs.iterator();
	while (hashSetItr.hasNext()) {
		var changedDCID = hashSetItr.next();
		if("ATC_TaxInformation".equals(changedDCID)) {
			var mainDCRows = getDataContainerRowsInMainWorkspace(node, step, changedDCID);
			var approvedDCRows = getDataContainerRowsInApprovedWS(node, step, changedDCID);
			var dataContainers = node.getDataContainerByTypeID(changedDCID).getDataContainers();
			for (var i = approvedDCRows.iterator(); i.hasNext(); ) {
				var approvedDCRow = i.next();
				if(!mainDCRows.contains(approvedDCRow)) {
					changeInfo += "Tax Number '" + approvedDCRow.getValue("AT_TaxNumber").getSimpleValue() + "' is removed from Tax Number section\n";
				}
			}
			var itr = dataContainers.iterator();
			while (itr.hasNext()){
				var dcObject = itr.next().getDataContainerObject();
				if (!approvedDCRows.contains(dcObject)) {
					changeInfo += "A new entry with Tax Number '" + dcObject.getValue("AT_TaxNumber").getSimpleValue() + "' is added in the Tax Information section\n";
				}
				else {
					var attributes = step.getAttributeGroupHome().getAttributeGroupByID("ATG_TECH_TaxInformationAttributes").getAllAttributes();
					var attributeItr = attributes.iterator();
					while(attributeItr.hasNext()) {
						attributeObject = attributeItr.next();
						attributeID = attributeObject.getID();
						attributeName = attributeObject.getName();
						var mainAttributeValue = dcObject.getValue(attributeID).getSimpleValue();
						var approvedAttributeValue =getAttributeValueFromDCRowInApprovedWS (node, step, changedDCID, attributeID, dcObject);
						if (mainAttributeValue != approvedAttributeValue) {
							if("AT_TaxNumber".equals(attributeID)) {
								changeInfo += "Tax Number is changed from '" + approvedAttributeValue + "' to '" + mainAttributeValue + "'\n";
							}
							else {
								changeInfo += attributeName + " is changed from '" + approvedAttributeValue + "' to '" + mainAttributeValue + "' in the Tax Information section having Tax Number - " + dcObject.getValue("AT_TaxNumber").getSimpleValue() + "\n";
							}
						}
					}
				}
			}
		}
	}
	return changeInfo;
}

function getAllAttributesFromGroup(step,attrGrpID){
	var group = step.getAttributeGroupHome().getAttributeGroupByID(attrGrpID);
	if(group != null){
		var storeAttrIDs = new java.util.HashSet("");
		var attArray = group.getAllAttributes().toArray();
		for(var k=0; k<attArray.length;k++){
			var AttrID = attArray[k].getID();
			storeAttrIDs.add(AttrID);
		}
	}
	return storeAttrIDs;
}




//------------------------------------------End----------------------------------------------------

//---------------------------------------------------------------
function setCommentLog(node, step, reqName, inputComment){
	var currentDateTime = new java.text.SimpleDateFormat("yyyy-MM-dd hh:mm:ss").format(new java.util.Date());
	var existingComments = node.getValue("AT_Comments").getSimpleValue();
	if(inputComment)
		var commentTobeSet = currentDateTime+" | "+reqName+" | "+inputComment;
	else
		var commentTobeSet = currentDateTime+" | "+reqName;
	if(existingComments) {
		var revisedComment = commentTobeSet + "<multisep/>" + existingComments;
		setAttributeValue(node, "AT_Comments", revisedComment);
	}
	else{
		setAttributeValue(node, "AT_Comments", commentTobeSet);
	}
	setAttributeValue(node, "AT_UserComments", null);
}

//----------------------------------------------------------------------
function sendRejectionMailToChangeRequestor(node, step, mailer) {
	var userID = node.getValue("AT_RequestorAssignee").getSimpleValue();
	var requesterUser = step.getUserHome().getUserByID(userID);
	if(requesterUser){
		var userDetails = getUserDetails(step, userID);
		var userEmail = userDetails.userEmail;
		var userName = userDetails.userName;
		var customerObj = getCustomerFromRequest(node, step);
		var subject = "Request "+node.getID()+" for the "+customerObj.getName()+" ("+customerObj.getID()+") has been rejected";
		/*var comments = node.getValue("AT_Comments").getSimpleValue();
		if(comments) {
	   		comments = comments.replace("<multisep/>","<br>");
		}*/
		var userComment = node.getValue("AT_UserComments").getSimpleValue();
		var url = "https://fe0vm04503.de.bosch.com/webui/RetailerPortal#screen=TaskList_CR_Tax&stateflow=WF_TaxApproval&onlyMine=Group&state=TaxRevise&displayMode=361070524.0&cellSelection=1046141202.0x0&acadcdabc.nodeType=entity&acadcdabc.selection="+node.getID()+"&acadcdabc.inv=0&contextID=Global&workspaceID=Main&NodeDetailsOverlay.NodeType=Entity&NodeDetailsOverlay.Selection="+node.getID()+"&selectedTab=627736722.0&bfadaecdbdbbb.inv=0";
	
		var requestDetails = "Request "+node.getID()+" for the vendor " +customerObj.getName()+ " ("+customerObj.getID()+") has been rejected";
		var body = "<html><head>";
		body+=  "Dear "+userName+",<br><br>";
		body+= ""+requestDetails+"<br>";
		body+= "<br><Strong>Rejection reason comment:</Strong><br>"+userComment;
		body+= "<br><br>Please find the below link for further process:";
		body+= "<br><br><a href="+url+">Click here to navigate the webui</a>";
		body+= "<br><br>Thanks & Regards,<br>Customer Master Data Team"; 
		if(userEmail) {	
			sendMail(mailer, userEmail, subject, body);
		}
	}
}

//-------------------------------------------------------------------------------
function getCustomerFromRequest(node, step) {
	var requestReference = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_RequestToCustomer"));
	if (!requestReference.isEmpty()) {
		var customer = requestReference.get(0).getTarget();
		return customer;
	}
	return null;
}

//------------------------------------------------------------

function linkValidCustomerGroup(node, step, custGrpID, searchString){
	var conditions = com.stibo.query.condition.Conditions;
	var cond = null;

	var searchFor = searchString.replace('*','').toLowerCase(); 
	var salesAreaKey = node.getValue("AT_SalesAreaKey").getSimpleValue();
	var custGrpHierarchy = step.getEntityHome().getEntityByID(custGrpID);
	var children = custGrpHierarchy.getChildren();
	for (var i = 0; i < children.size(); i++) {
		var salesObj = children.get(i);
		var salesObjName = salesObj.getName().trim();
		if(salesAreaKey == salesObjName){
			var salesObjChild = salesObj.getChildren();
			for(var j = 0; j < salesObjChild.size(); j++){
				var custGrpNode = salesObjChild.get(j);
				var custGrpName = custGrpNode.getValue("AT_CustomerGroupsName").getSimpleValue();
				var custGrpDesc = custGrpNode.getValue("AT_CustomerGroupDescription").getSimpleValue();
				if((custGrpName != null && custGrpName.trim().toLowerCase().indexOf(searchFor) >= 0) || (custGrpDesc != null && custGrpDesc.trim().toLowerCase().indexOf(searchFor) >= 0)){
					if (!cond)
							cond = conditions.id().eq(custGrpNode.getID());
						else
							cond = cond.or(conditions.id().eq(custGrpNode.getID()));
				}
			}
		}
	}
	return cond;
}


/*
 * @desc Function to auto populate region from entered postal code
 * @link https://issuetracking.bsh-sdd.com/browse/MDMPB-26205
 * @author Pranali Gawande <Pranali.Gawande-ext@bshg.com>
 * @param {Step} step Step manager
 * @param {Node} node Current object
*/
function autoPopulateRegion(node, step, log){
	var addressReferences = node.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("REF_SupplierToAddress"));
	for (var i = 0; i < addressReferences.size(); i++){
		var addressObj = addressReferences.get(i).getTarget();
		var postalCode = addressObj.getValue("AT_PostCode").getSimpleValue();
		if(postalCode){
			var countryCode = addressObj.getValue("AT_Country").getLOVValue().getID();
			var regionCode = getLookupValue(step, postalCode, "LT_PostalCode_RegionCode")
			if(regionCode){
				var regionLOVId = countryCode+"-"+regionCode.substring(3, 5);
			}
			if(regionCode == regionLOVId){
				var lovExits = isLOVValueExist(step, "LOV_Region", regionLOVId);
				if(lovExits){
					addressObj.getValue("AT_Region").setLOVValueByID(regionLOVId);
				}
			}	
		}
	}
	
}
/*===== business library exports - this part will not be imported to STEP =====*/
exports.getAttributeValue = getAttributeValue
exports.setAttributeValue = setAttributeValue
exports.isDataContainerHasValue = isDataContainerHasValue
exports.hasReferenceTarget = hasReferenceTarget
exports.getAttributeObject = getAttributeObject
exports.getReferenceObject = getReferenceObject
exports.sendMail = sendMail
exports.sendMailWithCC = sendMailWithCC
exports.getMidNightCurrentDateAndTime = getMidNightCurrentDateAndTime
exports.addDaysToTextDate = addDaysToTextDate
exports.addDaysToDate = addDaysToDate
exports.setWorkflowAssignee = setWorkflowAssignee
exports.setWorkflowStatusFlag = setWorkflowStatusFlag
exports.getAttributeValuesInDC = getAttributeValuesInDC
exports.getLookUpTableHome = getLookUpTableHome
exports.getLookupValue = getLookupValue
exports.createDataCointainer = createDataCointainer
exports.createDataCointainerByKeyAttribute = createDataCointainerByKeyAttribute
exports.getDataContainerKey = getDataContainerKey
exports.getDataContainerbyAttrValue = getDataContainerbyAttrValue
exports.getDataContainerbyAttrValueID = getDataContainerbyAttrValueID
exports.getDCObjectListFromMainWS = getDCObjectListFromMainWS
exports.deleteAllDataContainerRows = deleteAllDataContainerRows
exports.deleteLocalDataContainerRow = deleteLocalDataContainerRow
exports.getSingleReferenceAttributeValue = getSingleReferenceAttributeValue
exports.getSingleReferenceAttributeValueID = getSingleReferenceAttributeValueID
exports.getReferenceTargetID = getReferenceTargetID
exports.getRefTargetByTargetAttrValue = getRefTargetByTargetAttrValue
exports.getReferenceTargetIDFromApprovedWS = getReferenceTargetIDFromApprovedWS
exports.getAssignedSupplierList = getAssignedSupplierList
exports.approvednode = approvednode
exports.getObjectsByAttributeValueAndObjectType = getObjectsByAttributeValueAndObjectType
exports.getDCValuesFromApprovedWS = getDCValuesFromApprovedWS
exports.getDCObjectFromApprovedWS = getDCObjectFromApprovedWS
exports.getDCObjectListFromApprovedWS = getDCObjectListFromApprovedWS
exports.getAttrValuesFromApprovedWS = getAttrValuesFromApprovedWS
exports.areReferencesAddedOrDeleted = areReferencesAddedOrDeleted
exports.compareMainAndApprovedWsValues = compareMainAndApprovedWsValues
exports.compareChildrenAttributeValues = compareChildrenAttributeValues
exports.compareAttributeValuesForReference = compareAttributeValuesForReference
exports.getChildrenReferenceTargetID = getChildrenReferenceTargetID
exports.compareReferenceTargetID = compareReferenceTargetID
exports.compareReferenceAttributeValues = compareReferenceAttributeValues
exports.areChildrenAdded = areChildrenAdded
exports.areReferenceAdded = areReferenceAdded
exports.initiateItemIntoWorkflow = initiateItemIntoWorkflow
exports.isUserMemberOfUserGroup = isUserMemberOfUserGroup
exports.getDataContainerRowsInMainWorkspace = getDataContainerRowsInMainWorkspace
exports.getDataContainerRowsInApprovedWS = getDataContainerRowsInApprovedWS
exports.getAttributeValueFromDCRowInApprovedWS = getAttributeValueFromDCRowInApprovedWS
exports.isLOVValueExist = isLOVValueExist
exports.compareMainAppDataContainers = compareMainAppDataContainers
exports.compareMainApprovedAttrValues = compareMainApprovedAttrValues
exports.compareMainAppReferenceValues = compareMainAppReferenceValues
exports.createNewCompanyCode = createNewCompanyCode
exports.setMajorRevision = setMajorRevision
exports.revertToLastMajorRevision = revertToLastMajorRevision
exports.getAllTaxValues = getAllTaxValues
exports.syncSupplierReferences = syncSupplierReferences
exports.createReferencesFromSourceObject = createReferencesFromSourceObject
exports.deleteSupplierReferences = deleteSupplierReferences
exports.deleteAllGoldenRefs = deleteAllGoldenRefs
exports.deleteEmptyDataContainerRow = deleteEmptyDataContainerRow
exports.getValueFromPickupValueList = getValueFromPickupValueList
exports.getAddressDetails = getAddressDetails
exports.getUserDetails = getUserDetails
exports.getCountryAttrValue = getCountryAttrValue
exports.createNewRequest = createNewRequest
exports.splitStringByCharLength = splitStringByCharLength
exports.setNameValues = setNameValues
exports.getMailLinks = getMailLinks
exports.sendSubmitMailToRequestor = sendSubmitMailToRequestor
exports.sendApproveMailToRequestor = sendApproveMailToRequestor
exports.sendRejectionMailToRequestor = sendRejectionMailToRequestor
exports.sendClarificationMailToRequestor = sendClarificationMailToRequestor
exports.sendNotificationMailToRequestor = sendNotificationMailToRequestor
exports.sendNotificationMailToLSRejectRequest = sendNotificationMailToLSRejectRequest
exports.sendNotificationMailToLSApproveRequest = sendNotificationMailToLSApproveRequest
exports.sendMailToMDSteward = sendMailToMDSteward
exports.sendDeadlineMailToMDInterns = sendDeadlineMailToMDInterns
exports.sendNotificationtoLS = sendNotificationtoLS
exports.autoCreateCompanyCodesBasedOnPurchOrgMapping = autoCreateCompanyCodesBasedOnPurchOrgMapping
exports.CCPOBusinessCollectionforChinese = CCPOBusinessCollectionforChinese
exports.populateCustomerNoReturnVendor = populateCustomerNoReturnVendor
exports.setScopeValue = setScopeValue
exports.nationalVersionValidation = nationalVersionValidation
exports.sendAdditionalMailForDeletion = sendAdditionalMailForDeletion
exports.sendMailToRequestorAbtCustomerNoStatus = sendMailToRequestorAbtCustomerNoStatus
exports.sendEmailToCountryReprensetativeForPurchOrgCreation = sendEmailToCountryReprensetativeForPurchOrgCreation
exports.validateCommunicationMethod = validateCommunicationMethod
exports.concatAndSetSuppName = concatAndSetSuppName
exports.setUserComments = setUserComments
exports.setInternalDataQualityComments = setInternalDataQualityComments
exports.checkReasonForBlockage = checkReasonForBlockage
exports.checkPriority = checkPriority
exports.checkDescriptionForOther = checkDescriptionForOther
exports.getNextWorkingDay = getNextWorkingDay
exports.setDeadlineForSSC = setDeadlineForSSC
exports.setSSCSortingOrder = setSSCSortingOrder
exports.createSingleValuedEntityReference = createSingleValuedEntityReference
exports.populateCountryValues = populateCountryValues
exports.areReferencesRemovedForPermittedPayee = areReferencesRemovedForPermittedPayee
exports.areReferencesAddedToPermittedPayee = areReferencesAddedToPermittedPayee
exports.isSupplierReplacedForPermittedPayee = isSupplierReplacedForPermittedPayee
exports.isLocalSpecialistApprovalRequired = isLocalSpecialistApprovalRequired
exports.whatsChangedInSupplierChildren = whatsChangedInSupplierChildren
exports.whatsChangedInBankData = whatsChangedInBankData
exports.whatsChangedInSupplierGeneralData = whatsChangedInSupplierGeneralData
exports.displayCCAndPOChanges = displayCCAndPOChanges
exports.displayBankDataChanges = displayBankDataChanges
exports.displaySupplierGeneralDataChanges = displaySupplierGeneralDataChanges
exports.displayWhatsChangedInSupplier = displayWhatsChangedInSupplier
exports.approveNodeAndReferences = approveNodeAndReferences
exports.approveRequestAndSupplier = approveRequestAndSupplier
exports.approveAdditionalSuppliers = approveAdditionalSuppliers
exports.removeReferenceInCreationWF = removeReferenceInCreationWF
exports.removeReferenceInChangeWF = removeReferenceInChangeWF
exports.rejectAdditionalSupplierInCreationRequest = rejectAdditionalSupplierInCreationRequest
exports.rejectAdditionalSupplierInChangeRequest = rejectAdditionalSupplierInChangeRequest
exports.checkSupplierRiskCatagory = checkSupplierRiskCatagory
exports.sendMailToRequesterForAMLCaseCreationWF = sendMailToRequesterForAMLCaseCreationWF
exports.checkSupplierAndBankRiskCatagory = checkSupplierAndBankRiskCatagory
exports.SUADPartnerFunctionValidation = SUADPartnerFunctionValidation
exports.PONotToBeConsideredInEmailAndFaxChanges = PONotToBeConsideredInEmailAndFaxChanges
exports.getAlreadyUsedBankAccounts = getAlreadyUsedBankAccounts
exports.validateBankAccount = validateBankAccount
exports.checkRequesterMandatoryData = checkRequesterMandatoryData
exports.validateCASA = validateCASA
exports.triggerCountrySpecificValidations = triggerCountrySpecificValidations
exports.validatePostalCode = validatePostalCode
exports.validateMobileNumbers = validateMobileNumbers
exports.validateTelephoneNumbers = validateTelephoneNumbers
exports.validateFaxNumbers = validateFaxNumbers
exports.isValidRequestType = isValidRequestType
exports.validateDataContainerAttribute = validateDataContainerAttribute
exports.validateCheckSumDigitFromAttributes = validateCheckSumDigitFromAttributes
exports.setSapPerReference = setSapPerReference
exports.validateCountryAndERS = validateCountryAndERS
exports.checkTelephoneEmailAndFaxChanges = checkTelephoneEmailAndFaxChanges
exports.generalDataChangesforattachment = generalDataChangesforattachment
exports.sendReblockDeadlinePostponeMailToRequestor = sendReblockDeadlinePostponeMailToRequestor
exports.sendReblockMailToRequestor = sendReblockMailToRequestor
exports.setCCPOStatus = setCCPOStatus
exports.setCCPOApproveStatus = setCCPOApproveStatus
exports.checkExceptionsForCCPOAutoApproval = checkExceptionsForCCPOAutoApproval
exports.validateNationalVersionAttr = validateNationalVersionAttr
exports.validatePFOrderingAddressAndVendor = validatePFOrderingAddressAndVendor
exports.validateWHTaxType = validateWHTaxType
exports.checkExemptionFromExemptionTo = checkExemptionFromExemptionTo
exports.isBankDetailsChangedForAttachment = isBankDetailsChangedForAttachment
exports.checkAlternativePayeeChanges = checkAlternativePayeeChanges
exports.incotermCheck = incotermCheck
exports.rohsReachEmailAdressChange = rohsReachEmailAdressChange
exports.sendRoHSREACHEmailChangeNotification = sendRoHSREACHEmailChangeNotification
exports.partnerBankMandatoryValueCheck = partnerBankMandatoryValueCheck
exports.checkPayementTermandDayRangeValue = checkPayementTermandDayRangeValue
exports.sendReblockReminderMailToRequestor = sendReblockReminderMailToRequestor
exports.validateManufacturingPlant = validateManufacturingPlant
exports.validateCNCustomFields = validateCNCustomFields
exports.CheckBusinessLicenseTypeValues = CheckBusinessLicenseTypeValues
exports.autoPopulateContactData = autoPopulateContactData
exports.populateCountryDiallingCodeAndDefaultFlag = populateCountryDiallingCodeAndDefaultFlag
exports.setVatResponseRecord = setVatResponseRecord
exports.setVatResponseFromVS = setVatResponseFromVS
exports.setBankDetailsOnAccount = setBankDetailsOnAccount
exports.mandatoryCheckForDataContainer = mandatoryCheckForDataContainer
exports.checkReferenceMandatoryFields = checkReferenceMandatoryFields
exports.supplierPartnerFunctionValidations = supplierPartnerFunctionValidations
exports.isPartnerPOExtended = isPartnerPOExtended
exports.populateGoodsSupplierAndOrderingAddress = populateGoodsSupplierAndOrderingAddress
exports.validateBankAccountDetails = validateBankAccountDetails
exports.displayErrorMessage = displayErrorMessage
exports.populateFraudCaseOnSupplier = populateFraudCaseOnSupplier
exports.sendFraudDetailsMail = sendFraudDetailsMail
exports.checkPOMandatoryData = checkPOMandatoryData
exports.checkCCMandatoryData = checkCCMandatoryData
exports.validatePurchasingOrgData = validatePurchasingOrgData
exports.validateCompanyCodeData = validateCompanyCodeData
exports.getSupplierFromRequest = getSupplierFromRequest
exports.displayErrorMessageData = displayErrorMessageData
exports.checkRequesterMandatory = checkRequesterMandatory
exports.checkSupplierRefIsApprovedOrNot = checkSupplierRefIsApprovedOrNot
exports.checkPartnerFunctionSupplier = checkPartnerFunctionSupplier
exports.validateBankAccountData = validateBankAccountData
exports.populateLocalSpecialists = populateLocalSpecialists
exports.populateEmailAndFaxChangeLocalSpecialists = populateEmailAndFaxChangeLocalSpecialists
exports.populateSpecificCompanyCodeLocalSpecialists = populateSpecificCompanyCodeLocalSpecialists
exports.populateLocalSpecialistsForDeletionRequest = populateLocalSpecialistsForDeletionRequest
exports.createLocalspecialistDCRow = createLocalspecialistDCRow
exports.isLocalSpecialistActionRequired = isLocalSpecialistActionRequired
exports.triggerLocalSpecialistActions = triggerLocalSpecialistActions
exports.triggerLocalSpecialistNotifications = triggerLocalSpecialistNotifications
exports.sendMailToLocalSpecialists = sendMailToLocalSpecialists
exports.setSSCReviewComments = setSSCReviewComments
exports.validateAttachments = validateAttachments
exports.triggerRequestSubmitValidations = triggerRequestSubmitValidations
exports.triggerChangeRequestSubmitValidations = triggerChangeRequestSubmitValidations
exports.displayRequestErrors = displayRequestErrors
exports.validateAddtionalSupplierData = validateAddtionalSupplierData
exports.setNameValuesOnAdditionalSupplier = setNameValuesOnAdditionalSupplier
exports.populateNumberOfBankDataChangesInLast90Days = populateNumberOfBankDataChangesInLast90Days
exports.getSAPR3Number = getSAPR3Number
exports.checkSAPIDandTriggerForApproval = checkSAPIDandTriggerForApproval
exports.setAdditionalSuppliersSAPID = setAdditionalSuppliersSAPID
exports.allAdditionalSuppliersHaveSAPID = allAdditionalSuppliersHaveSAPID
exports.getReferenceTargetIDs = getReferenceTargetIDs
exports.getReferenceTargetIDsFromApprovedWS = getReferenceTargetIDsFromApprovedWS
exports.getReferenceTargetNames = getReferenceTargetNames
exports.getReferenceTargetNamesFromApprovedWS = getReferenceTargetNamesFromApprovedWS
exports.sortAlphaNum = sortAlphaNum
exports.isEqual = isEqual
exports.validateCCodeForReferencedSupplier = validateCCodeForReferencedSupplier
exports.userHasAlreadyPerformedtheAction = userHasAlreadyPerformedtheAction
exports.ifValuePresentInMultivalueAttribute = ifValuePresentInMultivalueAttribute
exports.sendMailToAccountingUsersOnPaymentTermsChanges = sendMailToAccountingUsersOnPaymentTermsChanges
exports.performActionsIfInternalQualityCheckIsRequired = performActionsIfInternalQualityCheckIsRequired
exports.copyCCPODataWhileBlockingSupplier = copyCCPODataWhileBlockingSupplier
exports.getDifferenceElements = getDifferenceElements
exports.ValidateTaxInformation = ValidateTaxInformation
exports.createCountrySpecificTaxDataContainerByTaxCat = createCountrySpecificTaxDataContainerByTaxCat
exports.getIN12FieldsErrorMessage = getIN12FieldsErrorMessage
exports.populateConsolidatedSupplierCategory = populateConsolidatedSupplierCategory
exports.populateWhatsChangedByRequesterForMDInterns = populateWhatsChangedByRequesterForMDInterns
exports.isLengthValidForName1Name2Name3Name4 = isLengthValidForName1Name2Name3Name4
exports.getRequiredAttributesAntiFraudConditionally = getRequiredAttributesAntiFraudConditionally
exports.getRequiredAttachmentsAntiFraudConditionally = getRequiredAttachmentsAntiFraudConditionally
exports.isBankChangeInvolved = isBankChangeInvolved
exports.isNonBankChangeInvolved = isNonBankChangeInvolved
exports.isAlternativePayeeChangedInCC = isAlternativePayeeChangedInCC
exports.validateMandatoryAttributes = validateMandatoryAttributes
exports.validateMandatoryAttachments = validateMandatoryAttachments
exports.deleteAttrsWhichAreNotRequired = deleteAttrsWhichAreNotRequired
exports.populateReturnVendorFlagOnSupplierLevel = populateReturnVendorFlagOnSupplierLevel
exports.convertSplitValueToHashSet = convertSplitValueToHashSet
exports.mandatoryCheck = mandatoryCheck
exports.setUnloadingPoints = setUnloadingPoints
exports.addSymbol = addSymbol
exports.upsertAcctGrpReferenceForAcctGrpAttr = upsertAcctGrpReferenceForAcctGrpAttr
exports.setSearchTermWithConcatenatedNameAndCity = setSearchTermWithConcatenatedNameAndCity
exports.setCountryDialingCode = setCountryDialingCode
exports.customerCheckTaxInformation = customerCheckTaxInformation
exports.customerCheckMandatoryData = customerCheckMandatoryData
exports.defaultFlagCheck = defaultFlagCheck
exports.setWorkflowNameInDC = setWorkflowNameInDC
exports.partiallyApproveDataContainer = partiallyApproveDataContainer
exports.partiallyApproveAttributesAndDC = partiallyApproveAttributesAndDC
exports.convertStringSmalltoCap = convertStringSmalltoCap
exports.poBoxMandatoryCheck = poBoxMandatoryCheck
exports.salesTaxClassificationCheck = salesTaxClassificationCheck
exports.addressCheck = addressCheck
exports.contactCheckMandatoryData = contactCheckMandatoryData
exports.postCodeandCity = postCodeandCity
exports.addBracketsInString = addBracketsInString
exports.displayWhatsChangedInCustomer = displayWhatsChangedInCustomer
exports.whatsChangedInTaxData = whatsChangedInTaxData
exports.getAllAttributesFromGroup = getAllAttributesFromGroup
exports.setCommentLog = setCommentLog
exports.sendRejectionMailToChangeRequestor = sendRejectionMailToChangeRequestor
exports.getCustomerFromRequest = getCustomerFromRequest
exports.linkValidCustomerGroup = linkValidCustomerGroup
exports.autoPopulateRegion = autoPopulateRegion