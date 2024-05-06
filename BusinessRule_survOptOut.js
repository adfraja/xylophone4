/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "survOptOut",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "survOptOut",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "JhiCommonLibrary",
    "libraryAlias" : "JhiCommonLibrary"
  } ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "SurvivorshipSourcesBindContract",
    "alias" : "sources",
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
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "SurvivorshipUtilBindContract",
    "alias" : "context6",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (sources,node,manager,context6,JhiCommonLibrary) {
function logMsg(msg) {
    var isLog = true;
    var nodeId = '';
    if (isLog) {
        if (node != null) nodeId = node.getID();
        logger.info("survOptOut: " + nodeId + ' ' + msg);
    }
}

var attributeMap = new java.util.HashMap();
attributeMap.put('GdprStatus', 'GdprLastUpdateDate');
attributeMap.put('EmailOptOutFlag', 'EmailOptOutDate');

var iter = sources.iterator();
var isMerge = context6.isMerge();
var srcNode, srcAttr, srcAttrDate;
logMsg('isMerge =' + isMerge + 'attributeMap =' + attributeMap);

var attrItr = attributeMap.keySet().iterator();
logMsg('Starting Iterator');
try {
    if (isMerge) {
        
        while (iter.hasNext()) {
            srcNode = iter.next();
            logMsg('In Merge srcNode= ' + srcNode.getID());
            if (srcNode != null) {
                while (attrItr.hasNext()) { // Iterate though each attribute and its corresponding date.
                    var tmpKey = attrItr.next(); // Id of main attribute
                    var tmpVal = attributeMap.get(tmpKey); // date associated with attribute for comparison.
                    var tgtAttrDate = node.getValue(tmpVal).getSimpleValue();
                    var srcAttrDate = srcNode.getValue(tmpVal).getSimpleValue();
                    logMsg('This is a Merge tmpKey=' + tmpKey + ' tmpVal=' + tmpVal);
                    var tmpKeyAttr = manager.getAttributeHome().getAttributeByID(tmpKey);
                    var tmpValAttr = manager.getAttributeHome().getAttributeByID(tmpVal);
                    var mostRecentValNode;
                    srcAttr = srcNode.getValue(tmpKey).getSimpleValue();
                    srcAttrDate = srcNode.getValue(tmpVal).getSimpleValue();
                    // if both Marge candidates have date populated then use date attribute
                    // else pass null for date attribute
                    if (!JhiCommonLibrary.isNullOrUndefined(tgtAttrDate) && !JhiCommonLibrary.isNullOrUndefined(srcAttrDate)) {
                        mostRecentValNode = context6.getMostRecentNodeAttribute(node, srcNode, tmpKeyAttr, tmpValAttr, false);
                    } else {
                        mostRecentValNode = context6.getMostRecentNodeAttribute(node, srcNode, tmpKeyAttr, null, false);
                    }
                    logMsg('mostRecentValNode ='+mostRecentValNode.getID()+' srcNode='+srcNode.getID());
                    //If most recent value is not from target-survivor node then update from source.
                    if (mostRecentValNode.getID() + '' != node.getID() + '' && (!JhiCommonLibrary.isNullOrUndefined(srcAttr))) {
                        // survive source for main attribute and corresponding date.
                        logMsg('Update From Source in Merge '+tmpKey+' value'+srcAttr);
                        node.getValue(tmpKey).setSimpleValue(srcAttr);
                        if (!JhiCommonLibrary.isNullOrUndefined(srcAttrDate)) {
                        	logMsg('Update From Source in Merge '+tmpVal+' value'+srcAttrDate);
                            node.getValue(tmpVal).setSimpleValue(srcAttrDate);
                        } else {
                            // if date is not populated put today's date.
                            logMsg('Updating from source with Step system date - Merge');
                            var dt = java.time.LocalDate.now();
                            node.getValue(tmpVal).setSimpleValue(dt);
                        }
                    }
                }

            }
        }
    } else {
        //If inbound data has non null value update it. Source is always latest for inbound.
        logMsg('This is NOT a Merge');
        while (iter.hasNext()) {
            srcNode = iter.next();
            if (srcNode != null) {
                while (attrItr.hasNext()) { // Iterate though each attribute and its corresponding date.
                    var tmpKey = attrItr.next(); // Id of main attribute
                    var tmpVal = attributeMap.get(tmpKey); // date associated with attribute for comparison.
                    srcAttr = srcNode.getValue(tmpKey).getSimpleValue();
                    srcAttrDate = srcNode.getValue(tmpVal).getSimpleValue();
                    if (!JhiCommonLibrary.isNullOrUndefined(srcAttr)) {
                        logMsg('Update Golden record');
                        node.getValue(tmpKey).setSimpleValue(srcAttr);
                        // Update attribute date only if there is valid value for main attribute in inbound.
                        if (!JhiCommonLibrary.isNullOrUndefined(srcAttrDate)) {
                            node.getValue(tmpVal).setSimpleValue(srcAttrDate);
                        } else {
                            // if date is not populated put today's date.
                            logMsg('Updating from source with Step system date -- NOT Merge');
                            var dt = java.time.LocalDate.now();
                            node.getValue(tmpVal).setSimpleValue(dt);
                        }
                    }
                }
            }
        }
    }
} catch (ex) {
    logMsg('Error ' + ex);
    logger.severe(ex);
}
}