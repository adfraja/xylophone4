/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "GetInvitationsSupplierView",
  "type" : "BusinessFunction",
  "setupGroups" : [ "Functions" ],
  "name" : "HTML Function - Get Invitations - Supplier View",
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
  "pluginId" : "JavaScriptBusinessFunctionWithBinds",
  "binds" : [ {
    "contract" : "AttributeBindContract",
    "alias" : "invitationsAttribute",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "PDXInvitations",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation",
  "functionReturnType" : "java.lang.String",
  "functionParameterBinds" : [ {
    "contract" : "NodeBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : ""
  } ]
}
*/
exports.operation0 = function (invitationsAttribute,node) {
var html = '<div style="margin:12px;margin-right:32px;"><table class="sourceTraceabity-mainTable"><tbody>';
html = html + '<tr><td class="sourceTraceabity-header sourceTraceabity-cellBottom"><div class="gwt-Label sourceTraceabity-ellipseable-div" style="margin-right:8px;"">ID</div></td>';
html = html + '<td class="sourceTraceabity-header sourceTraceabity-cellBottom"><div class="gwt-Label sourceTraceabity-ellipseable-div" style="margin-right:8px;">Status</div></td>';
html = html + '<td class="sourceTraceabity-header sourceTraceabity-cellBottom"><div class="gwt-Label sourceTraceabity-ellipseable-div" style="margin-right:8px;">Email</div></td>';
html = html + '<td class="sourceTraceabity-header sourceTraceabity-cellBottom"><div class="gwt-Label sourceTraceabity-ellipseable-div" style="margin-right:8px;">Client ID</div></td>';
html = html + '<td class="sourceTraceabity-header sourceTraceabity-cellBottom"><div class="gwt-Label sourceTraceabity-ellipseable-div" style="margin-right:8px;">Invitation URL</div></td></tr>';

var invitationValues = node.getValue(invitationsAttribute.getID()).getValues();
for (var i = 0; i < invitationValues.size(); i++) {
	var invitationValue = invitationValues.get(i).getSimpleValue();
	var element = JSON.parse(invitationValue);

	var clientID = element.clientID;
	logger.info("Client ID: " + clientID);
	if (!clientID) {
		clientID = "Not linked";
	}
	html = html + '<tr><td class="sourceTraceabity-cellData sourceTraceabity-cellBottom"><div class="gwt-Label sourceTraceabity-ellipseable-div" style="margin-right:8px;">' + element.id + '</div></td>';
	html = html + '<td class="sourceTraceabity-cellData sourceTraceabity-cellBottom"><div class="gwt-Label sourceTraceabity-ellipseable-div" style="margin-right:8px;">' + element.status + '</div></td>';
	html = html + '<td class="sourceTraceabity-cellData sourceTraceabity-cellBottom"><div class="gwt-Label sourceTraceabity-ellipseable-div" style="margin-right:8px;">' + element.email + '</div></td>';
	//html = html + '<td class="sourceTraceabity-cellData sourceTraceabity-cellBottom"><div class="gwt-Label sourceTraceabity-ellipseable-div" style="margin-right:8px;">' + element.clientID + '</div></td>';
	html = html + '<td class="sourceTraceabity-cellData sourceTraceabity-cellBottom"><div class="gwt-Label sourceTraceabity-ellipseable-div" style="margin-right:8px;">' + clientID + '</div></td>';
	html = html + '<td class="sourceTraceabity-cellData sourceTraceabity-cellBottom"><div class="gwt-Label sourceTraceabity-ellipseable-div" style="margin-right:8px;">' + '<a href="' + element.url + '" target="_blank">Link</a></div></td></tr>';
}

html = html + "</tbody></table></div>";
return html;
}