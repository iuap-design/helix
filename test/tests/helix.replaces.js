describe('对象绑定', function() {
	var view1, body, div;

	before(function() {
		body = document.body
		div = document.createElement("div")
		div.innerHTML = document.getElementById("objtest1").value;
		div.id = "view1"
		body.appendChild(div)
		var view1Ctrl = function(vm) {
			vm.test1 = "init value";
			vm.obj1 = {
				attr1: "attr1"
			}
			vm.obj1.attr2 = {
				attr1: "attr1"
			}
		}
		view1 = helix.def("view1", view1Ctrl);
	});

	after(function() {
		body.removeChild(div);
	});

	it('一级属性修改', function() {
		 
	});

	it('二级属性修改', function() {
		 
	});

	it('三级属性修改', function() {
		expect(document.getElementById("obj1attr2attr1").innerHTML).to.be("attr1")
		view1.obj1.attr2.attr1 = "test modify";
		expect(view1.obj1.attr2.attr1).to.be("test modify")
		expect(document.getElementById("obj1attr2attr1").innerHTML).to.be("test modify")
	});


});