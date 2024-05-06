/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "JhiCommonLibrary",
  "type" : "BusinessLibrary",
  "setupGroups" : [ "Libraries" ],
  "name" : "JhiCommonLibrary",
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
function logMsg(message) {
    debug = true;
	try {
		if (debug) {
			logger.info("JhiCommonLibrary: " + message);
		}
	} catch (ex) {
		logger.severe('JhiCommonLibrary:  error while logging'+ex);
	}
}

/**
* Get AttributeGroup Id as Input and return and array of attribute Ids that are children of that attribute group
* @param attrGrpId 
* @returns 
*/
function getAttributeIdList(attrGrpId,manager) {
    var attrNmArray = [];
    var attrGrp1 = manager.getAttributeGroupHome().getAttributeGroupByID(attrGrpId);
    var attrGrp1Array = attrGrp1.getAttributes().toArray();
    if (attrGrp1Array && attrGrp1Array.length > 0) {
        for (var i = 0; i < attrGrp1Array.length; i++) {
            attrNmArray.push(attrGrp1Array[i].getID() + '');
        }
    }
    return attrNmArray;
 }
 
 
 /**
  * Returns true if salesforce is sourcesystem
  * @param node1 
  * @param manager 
  * @returns 
  */
 function isSalesforceSource(node1,manager) {
     return (getCurrentSourcesystemId(node1,manager)=="Salesforce");
 }
 
 /**
  * 
  * @param node1 Returns true if SalesConnect is source system
  * @param manager 
  * @returns 
  */
 function isSalesConnectSource(node1,manager) {
     return (getCurrentSourcesystemId(node1,manager)=="SalesConnect");
 }
 
 /**
 * Get Source Systems.
 * @param node1 
 * @param manager 
 * @returns 
 */
 function getSourcesystemId(node1, manager) {
     var srcSys = [];
     var node1CustSrcSysRefs = node1.queryReferences(manager.getReferenceTypeHome().getReferenceTypeByID('CustomerSourceSystem')).asList(10);
     if (node1CustSrcSysRefs != null && node1CustSrcSysRefs.size() > 0) {
        for (var i = 0; i < node1CustSrcSysRefs.size(); i++) {
            srcSys.push( node1CustSrcSysRefs.get(i).getTarget().getID());
        }
     
        logMsg(srcSys);
     }
     return srcSys;
 }
 
 /**
  * This method is useful to get updates from source system. 
  * If there is only one srcsys then it should return that source system else it will return "Multiple Sources" message.
  * @param node1 
  * @param manager 
  * @returns 
  */
 function getCurrentSourcesystemId(node1, manager) {
     var srcSysId = "Multiple Sources";
     var srcList = getSourcesystemId(node1,manager);
     if (srcList.length == 1) {
         srcSysId = srcList[0];
     } else if (srcList.length == 0) {
         srcSysId = "No Sources Found";
     }
     return srcSysId;
 }
 
 
 /**
  * Copy Attribute value from source to target when not null.
  * @param tgt1 
  * @param src1 
  * @param attrNm 
  */
 function updateAttributeFromSrcToTargetWhenNotNull (tgt1,src1, attrNm) {
     var newVal = src1.getValue(attrNm).getSimpleValue();
     if (newVal != null && newVal.trim().length() > 0) {
         tgt1.getValue(attrNm).setSimpleValue(newVal);
     }
 }
 
 /**
  * Converts java.util.date to timestamp.
  * Ex. InputDate = Mon Feb 21 23:24:19 UTC 2022 Output =  2022-02-21 23:24:19.0
  * @param strDate 
  * @returns 
  */
 function getTimeStampFromDate (strDate) {
     var str = java.sql.Timestamp(strDate.getTime());
     return ''+str;
 }
 
 
 /**
  * Get only the date from the TimeStamp
  * Ex. InputDate = 2022-02-21 23:24:19.0 Output =  2022-02-21
  * @param strDate 
  * @returns 
  */
 function getDateFromTimeStamp(strDate) {
     var date = strDate.split(" ");
     return date[0];
 }
 
 /**
  * Find the record which matches the source system and source record id.
  * @param manager 
  * @param entityList 
  * @param sourceSystemId 
  * @param SourceRecordId 
  * @returns 
  */
 function getRecordByMatchingSourceSystem(manager,entityList, sourceSystemId, SourceRecordId) {
     if (entityList != null ) {
         var refType = manager.getReferenceTypeHome().getReferenceTypeByID('CustomerSourceSystem');
         // For each product find matching source system and source record ID. 
         // There should be only one entity in entityList, since HCM number is not to be duplicated.
         for (var i = 0; i < entityList.size(); i++) {
             var tmp = entityList.get(i);
             var refList = tmp.queryReferences(refType).asList(10);
             for (var k = 0; k < refList.size(); k++) {
                 var ref = refList.get(k);
                 // Check if Source System matches
                 if (ref.getTarget().getID()+'' == sourceSystemId) {
                     var srcRecId = ref.getValue('SourceRecordID').getSimpleValue();
                     if (srcRecId.indexOf(SourceRecordId) > -1) {
                         return tmp;
                     } 
                 }    
             }
         }
     }
 
     return null;
 }
 
 
 /**
  * Gets list of Entities with Matching Attribute values.
  * @param manager 
  * @param attributeId 
  * @param attributeValue 
  * @returns 
  */
 function getEntityByAttribute(manager, attributeId, attributeValue) {
     var home = manager.getHome(com.stibo.core.domain.singleattributequery.SingleAttributeQueryHome);
     var attribute = manager.getAttributeHome().getAttributeByID(attributeId);
     var list = home.querySingleAttribute(new com.stibo.core.domain.singleattributequery.SingleAttributeQueryHome.SingleAttributeQuerySpecification(com.stibo.core.domain.entity.Entity,attribute,attributeValue )).asList(10);
     return list;
 }
 
 /**
  * Get source system Id and source Record Id and return an object.
  * @param srcSystemRecordId 
  * @param srcSystemId 
  * @returns 
  */
 function getObjectBySourceSystemID(manager,srcSystemRecordId, srcSystemId) {
 
     var attribute = manager.getAttributeHome().getAttributeByID("SourceRecordID");
     var h = manager.getHome(com.stibo.query.home.QueryHome);
     var c = com.stibo.query.condition.Conditions;
     var SCTarget = manager.getEntityHome().getEntityByID(srcSystemId);
  
     var source_ref_type = manager.getReferenceTypeHome().getReferenceTypeByID("CustomerSourceSystem");
     var querySpecification = h.queryFor(com.stibo.core.domain.entity.Entity)
        .where(
           c.hasReference(source_ref_type)
           .where(c.targetIs(SCTarget)
              .and(c.valueOf(attribute).eq(srcSystemRecordId))
           )
        );
  
     var res1 = querySpecification.execute().asList(10);
     return res1;
  
  }
 
   /**
   * It is less effiecient to search by source record id. dst_id is same as source record Id.
   * This is useful method if there is going to be just one record for given attribute value.
   * @param {*} manager 
   * @param {*} srcSystemRecordId 
   * @param {*} srcSystemId 
   * @param {*} attributeId 
   * @returns 
   */
 function getEntityByAttributeOrSourceSystemId(manager, srcSystemRecordId, srcSystemId, attributeId, objType) {
     var contactList = getEntityByAttribute(manager, attributeId, srcSystemRecordId);
     var entity = null;
     var FirstName = null;
     //logMsg(contactList);
     if (contactList != null && contactList.size() > 0) {
         
         for (var i = 0; i < contactList.size(); i++) {
               //logMsg('getEntityByAttributeOrSourceSystemId '+objType+' '+contactList.get(i).getObjectType().getID());
             if ('' + contactList.get(i).getObjectType().getID() == objType) {
                 
                 entity = contactList.get(i);
                 FirstName = entity.getValue("ContactFirstName").getSimpleValue();
                 if(FirstName != "/reject/")
                 {
                 break;
                 }
             }
         }
         //logMsg('Found by attribute');
     } else {
 
         contactList = getObjectBySourceSystemID(manager, srcSystemRecordId, srcSystemId);
         //logMsg("I am in Source system id"+ contactList);
         if (contactList != null && contactList.size() > 0) {
               //logMsg('getEntityByAttributeOrSourceSystemId '+objType+' '+contactList.get(i).getObjectType().getID());
             for (var i = 0; i < contactList.size(); i++) {
                 if ('' + contactList.get(i).getObjectType().getID() == objType) {
                     entity = contactList.get(i);
 
                     break;
                     
                 }
             }
         }
     }
     return entity;
 }
 
 /**
  * 
  * @param node 
  * @param msg 
  */
 function updateHistoryLog(node,msg) {
     if (node != null && msg != null ) {
         node.getValue('HistoryLog').addValue(new Date().toISOString()+' '+msg);
     }
 }
 
 /*
  * This was created to enable making email addresses invalid
  * This feature was stopped as it would affect matching - CM-2639
  */
 function getHostname(){
     //get the hostname
     var hostname = java.net.InetAddress.getLocalHost().getHostName()+"";
     //create regex to find the environment
     var regex = /^(jhg-)([a-zA-Z]+)(.*)/g;
     //return whether it is production/dev/qa
     //logMsg("env is: "+ hostname.replace(regex, "$2"));
     return hostname.replace(regex, "$2");
 }
 
 /*
  * This was created to enable making email addresses invalid
  * This feature was stopped as it would affect matching - CM-2639
  */
 function isProduction(){
     //get the env type
     var env = getHostname();
     //if it is production return true otherwise return false
     if (env.toLowerCase() == 'production'){
         return true;
     }
     return false;
 }
 
 function formatAddr(addr) {
     var streetname = "";
                 if (addr.getValue("AddressLine1").getSimpleValue() != null) {
                 streetname = addr.getValue("AddressLine1").getSimpleValue() + "";
                 }
                 if (addr.getValue("AddressLine1").getSimpleValue() != null && addr.getValue("AddressLine2").getSimpleValue() != null) {
                     streetname = streetname + '\n' + addr.getValue("AddressLine2").getSimpleValue();
                 }
                 else if (addr.getValue("AddressLine1").getSimpleValue() == null && addr.getValue("AddressLine2").getSimpleValue() != null){
                     streetname = addr.getValue("AddressLine2").getSimpleValue() + "";
                 }
                 if (addr.getValue("AddressLine3").getSimpleValue() != null) {
                     streetname = streetname + '\n' + addr.getValue("AddressLine3").getSimpleValue();
                 }
                 else if (addr.getValue("AddressLine1").getSimpleValue() == null && addr.getValue("AddressLine2").getSimpleValue() == null && addr.getValue("AddressLine3").getSimpleValue() != null){
                     streetname = addr.getValue("AddressLine3").getSimpleValue() + "";
                 }
                 if (addr.getValue("AddressLine4").getSimpleValue() != null) {
                     streetname = streetname + '\n' + addr.getValue("AddressLine4").getSimpleValue();
                 }
                 else if (addr.getValue("AddressLine1").getSimpleValue() == null && addr.getValue("AddressLine2").getSimpleValue() == null && addr.getValue("AddressLine3").getSimpleValue() == null && addr.getValue("AddressLine4").getSimpleValue() != null){
                     streetname = addr.getValue("AddressLine4").getSimpleValue() + "";
                 }
                 return streetname;
 }
 /**
  * This method return Primary email or null
  * @param node1 
  * @returns Primary Email
  */
 function getPrimaryEmailForContact(node1) {
     var emailValue1 = null;
     var emailDC = node1.getDataContainerByTypeID('ContactEmail');
     if (emailDC != null) {
         var emailDCArray = emailDC.getDataContainers().toArray();
         
         for (var i = 0; i < emailDCArray.length; i++) {
             if ( emailDCArray[i].getDataContainerObject().getValue('EmailType').getSimpleValue()+'' == 'Primary') {
                 emailValue1 = emailDCArray[i].getDataContainerObject().getValue('EmailValue').getSimpleValue()+'';
             }
         }
     }
     
     return emailValue1;
 }
 
 /**
  * Checks for java null as well as null as string.
  * getsimpleValue() returns java string. If we append empty string to it then it becomes 'null' as string.
  * @param {*} str 
  * @returns 
  */
  function isNullOrUndefined (str) {
     var flag = false;
     if (str == null ) {
         //logMsg("String is null");
         flag = true;
     } else {
         //logMsg("String is NOT null");
         str = str.trim();
         if (str == 'null' || str == 'undefined' || str == '') flag = true;
     }
     //logMsg(flag);
     return flag;
 }
 
 /**
  * Create Org Hierarchy Reference or throws an error. Calling code is expected to handle the error
  * @param {*} src 
  * @param {*} tgt 
  * @param {*} lookupTableHome 
  * @param {*} manager 
  * @returns 
  */
 function createOrganizationHierarchyReference(src,tgt,lookupTableHome,manager) {
     var OrgHierarchyRefId = 'OrganizationHierarchy';
     var OrgHierarchyRefType = manager.getReferenceTypeHome().getReferenceTypeByID(OrgHierarchyRefId);
     var srcOrgRecType = src.getValue('OrganizationRecordType').getSimpleValue();
     logMsg('createOrganizationHierarchyReference '+src.getObjectType().getID()+' Target '+tgt.getObjectType().getID());
     var tgtOrgRecType = tgt.getValue('OrganizationRecordType').getSimpleValue();
     var currRefNode = null;
     var validOrgHierarchyList = lookupTableHome.getLookupTableValue('ValidOrgHierarchyLookup',srcOrgRecType);
     //check if reference exists
     var existingOrgReferences = src.queryReferences(OrgHierarchyRefType).asList(1);
     logMsg('createOrganizationHierarchyReference '+src.getID()+' tgt ID '+tgt.getID());
     if (src.getID()+'' == tgt.getID()+'') throw 'Circular Organization Hierachy Reference - Can not create Referenc to Itself source Record Id = '+src.getID()+' target record id ='+ tgt.getID()+'\n';
     logMsg('createOrganizationHierarchyReference Check Valid Hierarchy not defined ');
     if (validOrgHierarchyList == 'Not Defined') throw 'This may be top level Organization - Organization Record type Not Defined Source OrganizationRecordType ='+srcOrgRecType+' Target OrganizationRecordType ='+tgtOrgRecType+'\n';
     logMsg('createOrganizationHierarchyReference Check Incorrect Hierarchy ');
     if (validOrgHierarchyList.indexOf(tgtOrgRecType) < 0) {
     	src.getValue('IsIncorrectOrgHierarchyFromSource').setSimpleValue('Yes');
     	throw 'Incorrect OrganizationRecord Type for Organization Parent Hierarchy constraint violated Source OrganizationRecordType ='+srcOrgRecType+' Target OrganizationRecordType ='+tgtOrgRecType+'\n';
     }
     if (existingOrgReferences.size() > 0) {
        logMsg('createOrganizationHierarchyReference existing references ');
        currRefNode = existingOrgReferences.get(0).getTarget();
         // delete reference if target is different. If target is same as current target return.
        if (currRefNode.getID()+'' == tgt.getID()+'') return existingOrgReferences.get(0);       
        else  {            
             logMsg('createOrganizationHierarchyReference Delete existing Reference ');
             existingOrgReferences.get(0).delete();            
         } 
     }
     //if code reaches here it means code will create a new reference. Delete value for Incorrect Hierarchy.
     logMsg('createOrganizationHierarchyReference Remove value for IsIncorrectOrgHierarchyFromSource '+src.getValue('IsIncorrectOrgHierarchyFromSource').getSimpleValue());
     src.getValue('IsIncorrectOrgHierarchyFromSource').setSimpleValue('');
     return src.createReference(tgt, OrgHierarchyRefId);
 }

 /**
 * This method is used when there is single reference allowed from source.
 * If existing reference points to current target then it is returned.
 * else if existing reference points to different target 
 * then it is deleted and new reference is created  pointing to given target.
 * If there is no existing reference the new reference is created.
 * @param src 
 * @param target 
 * @param refType 
 * @returns reference
 */
function deleteAndCreateReference(src, target, refType) {

    var referenceTypeId = '' + refType.getID();
        
    try {
        var refList = src.queryReferences(refType).asList(1);
        //If reference target is same as current target return existing reference.
        //Else Delete Existing Reference, so that new reference can be created.
        if (refList != null && refList.size() ==1) {
            if ('' + refList.get(0).getTarget().getID() == target.getID() + '') {
            	 logMsg('deleteAndCreateReference - Existing reference returned');
                return refList.get(0);
            } else {
            	 logMsg('deleteAndCreateReference - Deleteing reference');
                refList.get(0).delete();
            }
        }
        if (target != null) {
        	  logMsg('deleteAndCreateReference - Creating new reference');
            return src.createReference(target, referenceTypeId);
        }
    } catch (ex) {
        logMsg("deleteAndCreateReference Error creating reference from " + src + " to " + target);
        logger.severe(ex);
    }
}

/**
 * Javascript padStart did not work inside Step so here is Jhi version of padstart
 * @param sizeOfStr 
 * @param str 
 * @param strToBePadded 
 * @returns 
 */
function padStart(sizeOfStr, str, strToBePadded) {
	var padStr = '';
	if (str.length < sizeOfStr ) {
		for (var k = 0; k < (sizeOfStr-str.length); k++) {
			padStr = padStr+strToBePadded;
		}
	}
	return padStr+str;
}



/**
 * Get entity, if null create new
 * @param parentNode
 * @param id 
 * @param objType 
 * @returns 
 */
function getOrCreateEntityById(parentNode, id, objType, manager){
	var newVal = manager.getEntityHome().getEntityByID(id);
	if(newVal == null){
		newVal = parentNode.createEntity(id, objType);
	}
	return newVal;
}


/*===== business library exports - this part will not be imported to STEP =====*/
exports.logMsg = logMsg
exports.getAttributeIdList = getAttributeIdList
exports.isSalesforceSource = isSalesforceSource
exports.isSalesConnectSource = isSalesConnectSource
exports.getSourcesystemId = getSourcesystemId
exports.getCurrentSourcesystemId = getCurrentSourcesystemId
exports.updateAttributeFromSrcToTargetWhenNotNull = updateAttributeFromSrcToTargetWhenNotNull
exports.getTimeStampFromDate = getTimeStampFromDate
exports.getDateFromTimeStamp = getDateFromTimeStamp
exports.getRecordByMatchingSourceSystem = getRecordByMatchingSourceSystem
exports.getEntityByAttribute = getEntityByAttribute
exports.getObjectBySourceSystemID = getObjectBySourceSystemID
exports.getEntityByAttributeOrSourceSystemId = getEntityByAttributeOrSourceSystemId
exports.updateHistoryLog = updateHistoryLog
exports.getHostname = getHostname
exports.isProduction = isProduction
exports.formatAddr = formatAddr
exports.getPrimaryEmailForContact = getPrimaryEmailForContact
exports.isNullOrUndefined = isNullOrUndefined
exports.createOrganizationHierarchyReference = createOrganizationHierarchyReference
exports.deleteAndCreateReference = deleteAndCreateReference
exports.padStart = padStart
exports.getOrCreateEntityById = getOrCreateEntityById