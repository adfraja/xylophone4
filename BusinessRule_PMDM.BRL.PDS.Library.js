/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "PMDM.BRL.PDS.Library",
  "type" : "BusinessLibrary",
  "setupGroups" : [ "PMDM.BusinessRuleLibraries" ],
  "name" : "PDX: Library",
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
function PDSSupplierProcessNotes(node, comment, logger) {
	var dateTimeStamp = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss z").format(new java.util.Date());
	//var multiValue = node.getValue("PMDM.AT.PDS.SupplierProcessNotes");
	var multiValue = node.getValue("PMDM.AT.MessagesToSupplier");
	var values = new java.util.ArrayList(multiValue.getValues());
	var builder = multiValue.replace();
	var sb = new java.lang.StringBuilder(dateTimeStamp).append(" - ").append(comment);

	builder.addValue(sb.toString());
	for (var i = 0; i < values.size(); i++) {
		builder.addValue(values.get(i).getSimpleValue());
	}
	builder.apply();
}
/*===== business library exports - this part will not be imported to STEP =====*/
exports.PDSSupplierProcessNotes = PDSSupplierProcessNotes