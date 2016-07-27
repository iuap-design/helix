describe('IF表达式测试', function() {

	var vm, body, div,iftestDiv;

	before(function() {
		body = document.body
		div = document.createElement("div")
		var vo = {
			val: 1,
			a: "AAAAA",
			b: "BBBBB",
			c: "CCCCC"
		};

		div.innerHTML = document.getElementById("iftest1").value;
		div.id = "view1"
		body.appendChild(div)
		vm = helix.def("view1", vo);
		iftestDiv = document.getElementById("iftestDiv");
	});

	after(function() {
		body.removeChild(div);
	});



	it('val = 1', function() {
		var hasAKey = iftestDiv.innerHTML.indexOf("AAA") != -1;
		var hasBKey = iftestDiv.innerHTML.indexOf("BBB") != -1;
		var hasCKey = iftestDiv.innerHTML.indexOf("CCC") != -1;
		expect(hasAKey).to.be(true);
		expect(hasBKey).to.be(false);
		expect(hasCKey).to.be(false);

	})

	it('val = 2', function() {
		vm.val = 2;
		hasAKey = iftestDiv.innerHTML.indexOf("AAA") != -1;
		hasBKey = iftestDiv.innerHTML.indexOf("BBB") != -1;
		hasCKey = iftestDiv.innerHTML.indexOf("CCC") != -1;
		expect(hasAKey).to.be(false);
		expect(hasBKey).to.be(true);
		expect(hasCKey).to.be(false);
	})

	it('val = 0', function() {
		vm.val = 0;
		hasAKey = iftestDiv.innerHTML.indexOf("AAA") != -1;
		hasBKey = iftestDiv.innerHTML.indexOf("BBB") != -1;
		hasCKey = iftestDiv.innerHTML.indexOf("CCC") != -1;
		expect(hasAKey).to.be(false);
		expect(hasBKey).to.be(false);
		expect(hasCKey).to.be(true);
	})

})