/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "PMDM.BRA.ApproveExternalAndPackaging",
  "type" : "BusinessAction",
  "setupGroups" : [ "PMDM.BusinessRuleActions" ],
  "name" : "Approve External Source Record and Packaging",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "PMDM.PRD.ExternalSourceRecord" ],
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
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,logger,manager) {
var debug = true;
var msg1 = manager.getEntityHome().getEntityByID("SysMsg_PMDM.BRA.ApproveExternalAnd_msg1").getValue("PMDM.AT.SystemMessage").getSimpleValue(); // 'Parent node has never been approved so "%s" cannot be approved.'

function log(message) {
	if (debug) {
		logger.info("Approve Node and Packaging: " + message);
	}
}

/*function getChild(parent, title, classificationType, byID) {
	title = title.replace(" ", "_");
	log("... ... getChild(" + title + ")");
	var children = parent.getChildren().toArray();
	for (var i = 0; i < children.length; i++) {
		if (byID) {
			if (title.equalsIgnoreCase(children[i].getObjectType().getID())) {
				return children[i];
			}
		} else {
			if (title.equalsIgnoreCase(children[i].getTitle())) {
				return children[i];
			}
		}
	}
	if (byID) {
		return null;
	}
	log("... ... Create new asset classification");
	var objType = manager.getObjectTypeHome().getObjectTypeByID(classificationType);
	var newClassification = parent.createClassification("", objType);
	newClassification.setName(title.toUpperCase());
	newClassification.approve();
	return newClassification;
}

function isBelowAssets(top) {
	if (top == null) {
		return false;
	}
	var parent = top.getParent();
	if (parent != null && "AssetsRoot".equals(top.getParent().getID())) {
		return true;
	}
	return isBelowAssets(parent);
}
*/
function relinkAsset(asset) {
	//var objType = asset.getObjectType().getID();
	//log("... ... classify asset [" + asset.getTitle() + "] objType=[" + objType + "]");
	//var assetRoot = manager.getClassificationHome().getClassificationByID("AssetsRoot");

	// link asset to asset root if not already linked
	//var currentClassifications = asset.getClassifications().toArray();

	//var linkedBelowRoot = false;
	//for (var i = 0; i < currentClassifications.length; i++) {
	//	if (isBelowAssets(currentClassifications[i])) {
	//		log("... ... Asset is already linked to [" + currentClassifications[i].getID() + "] below AssetRoot");
	//		var linkedBelowRoot = true;
	//	}
	//}

	//if (!linkedBelowRoot) {
		// the recategorize asset
	//	var level1 = getChild(assetRoot, objType + "Root", null, true);
	//	if (level1 != null) {
	//		var level2 = getChild(level1, asset.getTitle().substring(0, 1), "AssetLevel1", false);
	//		if (level2 != null) {
	//			var level3 = getChild(level2, asset.getTitle().substring(0, 2), "AssetLevel2", false);
	//			if (level3 != null) {
	//				asset.addClassification(level3);
	//			}
	//		}
	//	}

		// Approve asset
		asset.approve();
	//}
}

function relinkAssets(node) {
	var refTypes = new java.util.HashSet();
	refTypes.add("PMDM.IDRT.PrimaryProductImage");
	refTypes.add("Alternative");
	refTypes.add("Cut_Out");
	refTypes.add("Fabric");
	refTypes.add("Video");

	var assetRefs = node.getAssetReferences().asList();
	for (var i = 0; i < assetRefs.size(); i++) {
		var assetRef = assetRefs.get(i);
		var assetRefType = assetRef.getReferenceType().getID();
		if (refTypes.contains(assetRefType)) {
			//log("... Will now relink asset: " + assetRef.getTarget().getID());
			relinkAsset(assetRef.getTarget());
			//log("... Done relinking asset: " + assetRef.getTarget().getID());
		}
	}
}

function approveNode(nodeToApprove) {
	log("Will now approve: " + nodeToApprove.getID());

	// Check is parent product is approved
	var parent = node.getParent();
	if (parent.getApprovalStatus().name().equals("NotInApproved")) {
		var message = (msg1 + "").replace("%s", node.getName()); // Parent node has never been approved so "%s" cannot be approved.
		throw message;
	}

	relinkAssets(nodeToApprove);

	try {
		nodeToApprove.approve();
	} catch (e) {
		log(e);
		throw (e);
	}
	log("Done approving: " + nodeToApprove.getID());
}

// Starts here

// Approve current object
approveNode(node);

// Approve the packaging string of current object
/*var allPackaging = getAllPackagingFromExternalBusinessFunction.evaluate({
	"node": node
});
//log(allPackaging);
allPackaging.toArray().forEach(
	function (packagingObject) {
		approveNode(packagingObject);
	}
);
*/

}