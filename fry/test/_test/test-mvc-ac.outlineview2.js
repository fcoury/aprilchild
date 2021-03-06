/*
 * AC Fry - JavaScript Framework v1.0
 *
 * ac.OutlineView widget
 *
 * (c)2006 Petr Krontorad, April-Child.com
 * Portions of code based on WHOA Bender Framework, (c)2002-2005 Petr Krontorad, WHOA Group.
 * http://www.april-child.com. All rights reserved.
 * See the license/license.txt for additional details regarding the license.
 * Special thanks to Matt Groening and David X. Cohen for all the robots.
 */


/* Customization, API example

// [1] we define our own model extending default class `ac.OutlineViewWidgetModel`

/*  ---------------------------------------------------------------- 
	ExampleModel < ac.OutlineViewWidgetModel
*/
$class('ExampleModel < ac.OutlineViewWidgetModel');

// [1.A] we need to override the `loadElements` method of the original class, this is where our own data need to be acquired
ExampleModel.prototype.loadElements = function(acElem, callbackOnSuccess, callbackOnError)
{
	// let's create some fake data, normally this would be the place where you call remote server for real data
	var alphabet = 'AFGHI.odvB.xmlCFry DQ.pngPNVMDIaskJavaScriptdrepo OWP.SDFrameworkEJQRSTU v.1.0VW3199803NO XYKLMP343l kfjdaorp.eweri Z012589absc.gif ADd eBiofghijkl.mst uvwxnopq.html';
	
	var cnt = 1;
	
	var newel = function(isCollection)
	{
		var child_elem = $new(ACElement);
		// randomly define whether the object is a collection
		child_elem.isCollection = isCollection ? true : false;
		// creating random label
		child_elem.properties.label = cnt++;//alphabet.substr(Math.floor(Math.random()*(alphabet.length-12)), 2+Math.floor(Math.random()*10));
		// creating size information
		child_elem.properties.size = child_elem.isCollection ? 0 : Math.floor(50000*Math.random());
		// creating version information
		child_elem.properties.version = 1+Math.floor(20*Math.random());
		return child_elem;
	}
	
	var celem = acElem.appendChild(newel());
	
	var celem = acElem.appendChild(newel(true));
	celem.appendChild(newel());
	celem.appendChild(newel());
	celem.appendChild(newel());

	var celem = acElem.appendChild(newel());

	var celem = acElem.appendChild(newel(true));
	celem.appendChild(newel());
	celem.appendChild(newel());
	celem.appendChild(newel());

	var celem = acElem.appendChild(newel(true));
	celem.appendChild(newel());
	celem.appendChild(newel());
	celem.appendChild(newel());

	callbackOnSuccess();	

}

// [2] we define our own controller extending default class `ac.OutlineViewWidgetController`

/*  ---------------------------------------------------------------- 
	ExampleController < ac.OutlineViewWidgetController
*/

$class('ExampleController < ac.OutlineViewWidgetController');

// allowing multiple selection, set to false if you don't want any
ExampleController.prototype.allowMultipleSelection = function()
{
	return true;
}

// allowing renaming of elements, although it's philosophically somewhat similar to move, it differs mainly in a convenience and/or practical way ...
ExampleController.prototype.allowRename = function()
{
	return true;
}

// to support elements operations such as COPY and MOVE, we MUST enable callback in the followings two methods handling clipboard
// we can look to selections (acElemLst) an optionally remove any elements we do not want to include in our operations
ExampleController.prototype.onElementClipboardCut = function(acElemLst, callbackOk)
{
	// we enable it, otherwise there couldn't be any call to callbackOk(). remove the following line to disable it (or do not overide the method in the first place).
	callbackOk();
}

ExampleController.prototype.onElementClipboardCopy = function(acElemLst, isCopy, callbackOk)
{
	// we enable it, otherwise there couldn't be any call to callbackOk(). remove the following line to disable it (or do not overide the method in the first place).
	callbackOk();
}

// returns real value for editing - it may differ from the value used in view rendering
ExampleController.prototype.onGetElementValueForEditing = function(acElem, colId)
{
	return acElem.properties.label;
}

// fired when user cancels renaming of element (closes the editor)
ExampleController.prototype.onElementValueCanceled = function(acElem, colId, value)
{
	console.log('? not changed to ?.'.embed(acElem.id, value));
}

// called to perform actual element rename operation. on success we must call the callbackOk method, otherwise we call the callbackError one.
ExampleController.prototype.onElementRename = function(acElem, label, callbackOk, callbackError)
{
	// this is the place to call for remote operation causing actual rename
	var was_canceled = false;
	// we call the helper function to display alert window
	var win = alertUser('Renaming...', 'Renaming ? to ?<br/>Please wait.'.embed(acElem.properties.label, label), function()
	{
		// canceled
		was_canceled = true;
	});
	// let's simulate remote operation ($rpost( ... ))
	// now sleep for a while, this is where you operation is running and waiting for response
	$runafter(2000, function()
	{
		if ( !was_canceled )
		{
			win.close();
			acElem.properties.label = label;
			callbackOk();
		}
		else
		{
			callbackError();
		}
		ac.widget.focus(this.widget);
	});	
}

// called to filter elements to be rendered. effectively hides elements we don't want to work with. return false for disabling an element
ExampleController.prototype.onElementFilter = function(acElem)
{
	return true; // comment it to allow element filterig eg. displaying folders only
	return acElem.isCollection;
}

// called when the need for change of element label is required, this is enforced automatically in situations as copying elements to the same collection etc.
ExampleController.prototype.onElementDuplicate = function(newElement, oldLabel, newParentElement, duplicitIteration)
{
	newElement.properties.label = 'Copy ?of ?'.embed(1==duplicitIteration?'':'? '.embed(duplicitIteration), oldLabel);
}

// called when actual change in the elements tree is required - moving/copying 
ExampleController.prototype.onElementMoveCopy = function(acElemLst, targetElement, isMove, callbackOk)
{
	var was_canceled = false;
	var labels = [];
	// let's get list of all labels to be displayed in alert window
	$foreach ( acElemLst, function(acElem)
	{
		labels.push(acElem.properties.label);
	});
	// we call the helper function to display alert window
	var win = alertUser('?ing...'.embed(isMove?'Mov':'Copy'), '?ing ? item(s) (?) to ?<br/>Please wait.'.embed(isMove?'Mov':'Copy', labels.length, labels.join(', '), targetElement.properties.label), function()
	{
		// canceled
		was_canceled = true;
	});
	// let's simulate remote operation ($rpost( ... ))
	// now sleep for a while, this is where you operation is running and waiting for response
	$runafter(2000, function()
	{
		if ( !was_canceled )
		{
			win.close();
			callbackOk();			
		}
		ac.widget.focus(this.widget);
	})
}

// [3] we define our own view extending default class `ac.OutlineViewWidgetView`
// view actually affects final rendering of the widget (data of our model)

/*  ---------------------------------------------------------------- 
	ExampleView < ac.OutlineViewWidgetView
*/

$class('ExampleView < ac.OutlineViewWidgetView');

ExampleView.prototype.renderElementInRow = function(acElem, rowData)
{
	// rowdata contains prepared data structure we must fill with our values with any fancy formatting we want...
	with ( acElem.properties )
	{
		rowData['label'] = '&nbsp; ?'.embed(label);
		rowData['size'] = 0 == size ? '--' : $_(size).surroundTag('strong');
		rowData['version'] = version;
	}
}

ExampleView.prototype.renderDetail = function(acElem, node)
{
	node.t('<h3>Detail ?</h3>'.embed(acElem.properties.label));
}

// we can override default loading message using code snippet in `renderLoadingMessage` method of our view
ExampleView.prototype.renderLoadingMessage = function(acElem, node, marginLeft)
{
	// we could simply return null to revert back to original spinning ball (or not to override the method at all..)
	return '<div style="padding-left:?px"><img src="mm/i/theme/apple/loading.gif" width="16" height="16" border="0" style="margin-top:2px;margin-right:5px"/>Loading children of <strong>?</strong>, please wait...</div>'.embed(marginLeft, acElem.properties.label);
}


// [4] let's define a helper function for showing elements operation alerts - used to inform user of copying and such..
function alertUser(title, msg, callbackOnClose)
{
	// let's define window view if not previously defined
	if ( 'undefined' == typeof View )
	{
		$class('View < ac.WindowWidgetView');
	}
	View.prototype.onRenderTitle = function(node, params)
	{
		node.t(title);
	}
	View.prototype.onRenderContent = function(node, params)
	{
		var caller = this;
		node.a($$()).s('padding:8px;').t('?<br/><br/>'.embed(msg)).a($crec('Cancel', function()
		{
			caller.widget.close();
		}));
	}		
	// let's define window controller if not previously defined
	if ( 'undefined' == typeof Controller )
	{
		$class('Controller < ac.WindowWidgetController');
	}
	Controller.prototype.onClose = function()
	{
		callbackOnClose();
		return true;
	}		
	var win = $new
	(
		ac.WindowWidget,
		$new(ac.WindowWidgetModel),
		$new(View, {isModal:true, hasStatus:false, hasCloseButton:false, defaultSize:{width:340,height:100}}),
		$new(Controller)
	);
	// we defined .acw-window-modal-bg.alert CSS class in test.ac.browser.css to overide default modal surround
	win.show(null, 'alert');
	ac.widget.focus(win);
	return win;
}


// each dynamically loaded script must end with the following statements
if ( 'undefined' != typeof fry && 'undefined' != typeof fry.script )
{
	fry.script.register();
}