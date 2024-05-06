/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "PMDM.BRA.SyncExtToInt",
  "type" : "BusinessAction",
  "setupGroups" : [ "PMDM.BusinessRuleActions" ],
  "name" : "Synchronize EXT to INT Hierarchy Node",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "PMDM.PRD.EXT.DataSource", "PMDM.PRD.EXT.Level1", "PMDM.PRD.EXT.Level2", "PMDM.PRD.EXT.Level3" ],
  "allObjectTypesValid" : false,
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
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,logger) {
// Test: EXT.L1-100564
var debug = true;

function log(message) {
	// For debugging purpose. Don't forget to set debug to false when going live.
	if (debug) {
		logger.info("Sync EXT -> INT Hierarchy: " + message);
	}
}

function getLinkedNodeID(nodeID) {
	var prefix = nodeID.substring(0, 4);
	var nodeIDWithoutPrefix = nodeID.substring(4, nodeID.length());
	if ("EXT.".equals(prefix)) {
		var nodeIDLinked = "INT." + nodeIDWithoutPrefix;
		return nodeIDLinked;
	} else if ("INT.".equals(prefix)) {
		var nodeIDLinked = "EXT." + nodeIDWithoutPrefix;
		return nodeIDLinked;
	} else {
		// Unexpected prefix
		return null;
	}
}

function getLinkedObjectTypeID(objectTypeID) {
	var prefix = objectTypeID.substring(0, 13);
	var objectTypeIDWithoutPrefix = objectTypeID.substring(13, objectTypeID.length());
	if ("PMDM.PRD.EXT.".equals(prefix)) {
		var objectTypeIDLinked = "PMDM.PRD.INT." + objectTypeIDWithoutPrefix;
		return objectTypeIDLinked;
	} else if ("PMDM.PRD.INT.".equals(prefix)) {
		var objectTypeIDLinked = "PMDM.PRD.EXT." + objectTypeIDWithoutPrefix;
		return objectTypeIDLinked;
	} else {
		log("Wrong Prefix. Throw message");
		return null;
	}
}

function getOrCreateLinkedNode(node) {
	var currentNodeID = node.getID();
	var linkedNodeID = getLinkedNodeID(currentNodeID);
	log("currentNodeID: " + currentNodeID + ", linkedNodeID: " + linkedNodeID);

	if (linkedNodeID) {
		var linkedNode = manager.getProductHome().getProductByID(linkedNodeID);
		if (!linkedNode) {
			log("No linked node so we have to create a new node");
			var currentNodeObjectTypeID = node.getObjectType().getID();
			var linkedNodeObjectTypeID = getLinkedObjectTypeID(currentNodeObjectTypeID);
			log("... currentNodeObjectTypeID: " + currentNodeObjectTypeID + ", linkedNodeObjectTypeID: " + linkedNodeObjectTypeID);
			var linkedNodeObjectType = manager.getObjectTypeHome().getObjectTypeByID(linkedNodeObjectTypeID);
			var currentParentNodeID = node.getParent().getID();
			var linkedParentNodeID = getLinkedNodeID(currentParentNodeID);
			log("... currentParentNodeID: " + currentParentNodeID + ", linkedParentNodeID: " + linkedParentNodeID);
			linkedParentNode = manager.getProductHome().getProductByID(linkedParentNodeID);
			if (linkedParentNode && linkedNodeObjectType) {
				linkedNode = linkedParentNode.createProduct(linkedNodeID, linkedNodeObjectType);
			}
		}
	}
	return linkedNode;
}

function copyAttributeLinks(source, target) {
	log("copyAttributeLinks");
	var existingAttributeLinkAttributes = new java.util.ArrayList();
	var it1 = target.getAttributeLinks().iterator();
	while (it1.hasNext()) {
		existingAttributeLinkAttributes.add(it1.next().getAttribute().getID());
	}

	var it2 = source.getAttributeLinks().iterator();
	while (it2.hasNext()) {
		var att = it2.next().getAttribute();
		if (!existingAttributeLinkAttributes.contains(att.getID())) {
			try {
				log("... Creating attribute link from " + target.getID() + " to " + att.getID());
				target.createAttributeLink(att);
			} catch (e) {
				logg("... Failed to create attribute link from " + target.getID() + " to " + att.getID() + ": " + e);
				if (e.javaException instanceof java.lang.RuntimeException) {
					throw e;
				}
			}
		}
	}
}

function getTargetAttributeLink(targetAttributeLinks, attributeIdToFind) {
	var result = null;
	var it = targetAttributeLinks.iterator();
	while (it.hasNext()) {
		var link = it.next();
		if (link.getAttribute().getID().equals(attributeIdToFind)) {
			result = link;
			break;
		}
	}
	return result;
}

function copyLovFiltersAndVariantPriority(source, target) {
	log("copyLovFilters");
	var sourceAttributeLinks = source.getAttributeLinks();
	var targetAttributeLinks = target.getAttributeLinks();

	var it2 = sourceAttributeLinks.iterator();
	while (it2.hasNext()) {
		var sourceAttributeLink = it2.next();
		log("... Source: " + source.getID() + ", Attribute: " + sourceAttributeLink.getAttribute().getID());
		var filters = sourceAttributeLink.queryFilterValues();
		log("... Found " + filters.asList(1000).size() + " filter values");

		var targetAttributeLink = getTargetAttributeLink(targetAttributeLinks, sourceAttributeLink.getAttribute().getID());
		if (targetAttributeLink) {
			log("... Found attribute link: " + targetAttributeLink.getAttribute().getID());
			var it3 = filters.asList(1000).iterator();
			while (it3.hasNext()) {
				var lovValue = it3.next();
				targetAttributeLink.addFilterValue(lovValue);
				log("... Added filter value: " + lovValue.getValue());
			}
			var sourceVariantPriority = sourceAttributeLink.getValue("PMDM.AT.ProductVariantPriority").getValue();
			var targetVariantPriority = targetAttributeLink.getValue("PMDM.AT.ProductVariantPriority").getValue();
			if (sourceVariantPriority) {
				log("... Found Product Variant Priority value: " + sourceVariantPriority);
				if (!targetVariantPriority || !targetVariantPriority.equals(sourceVariantPriority)) {
					targetAttributeLink.getValue("PMDM.AT.ProductVariantPriority").setValue(sourceVariantPriority);
					log("... Added Product Variant Priority value: " + sourceVariantPriority);
				}
			} else {
				log("... Found no Product Variant Priority value");
				if (targetVariantPriority) {
					targetAttributeLink.getValue("PMDM.AT.ProductVariantPriority").setValue("");
					log("... Removed Product Variant Priority value");
				}
			}
		}
	}
}

function setNameInAllContexts(sourceObject, targetObject) {
	var allContexts = manager.getContextHome().getContexts();
	var it = allContexts.iterator();
	while (it.hasNext()) {
		var ctx = it.next();
		manager.executeInContext(ctx.getID(), function(otherManager) {
			var sourceObjectFromOtherManager = otherManager.getObjectFromOtherManager(sourceObject);
			var targetObjectFromOtherManager = otherManager.getObjectFromOtherManager(targetObject);
			targetObjectFromOtherManager.setName(sourceObjectFromOtherManager.getName());
		});
	}
}

function approveCrossContext(obj) {
	log("Cross-context approval of " + obj.getID());
	var allContexts = manager.getContextHome().getContexts();
	var contextIterator = allContexts.iterator();
	while (contextIterator.hasNext()) {
		var context = contextIterator.next();
		manager.executeInContext(context.getID(), function(contextManager) {
			var nodeInContext = contextManager.getObjectFromOtherManager(obj);
			log("... Approving node: " + nodeInContext.getTitle() + " in  context " + nodeInContext.getManager().getCurrentContext().getID());
			try {
				nodeInContext.approve();
			} catch (e) {
				log("... Failed to approving node: " + nodeInContext.getTitle() + " in  context " + nodeInContext.getManager().getCurrentContext().getID() + ": " + e);
				if (e.javaException instanceof java.lang.RuntimeException) {
					throw e;
				}
			}
		});
	}
}

var linkedNode = getOrCreateLinkedNode(node);
if (linkedNode) {
	log("linkedNode found: " + linkedNode.getID());
	setNameInAllContexts(node, linkedNode);
	copyAttributeLinks(node, linkedNode);
	copyLovFiltersAndVariantPriority(node, linkedNode);
	approveCrossContext(linkedNode);

} else {
	log("No linked node so do nothing...");
}
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : null
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ValidHierarchiesBusinessCondition",
  "parameters" : [ {
    "id" : "HierarchyRoots",
    "type" : "java.util.List",
    "values" : [ ]
  } ],
  "pluginType" : "Precondition"
}
*/
