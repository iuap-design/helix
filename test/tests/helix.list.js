describe('数组绑定测试', function() {
	var vm, body, div;

	before(function() {
		body = document.body
		div = document.createElement("div")
		var view1Ctrl = {
			list1: [{
				name: "韩梅梅",
				age: 11
			}, {
				name: "李磊",
				age: 11
			}, {
				name: "Poly",
				age: 3
			}]
		};
		div.innerHTML = document.getElementById("arraytest1").value;
		div.id = "view1"
		body.appendChild(div)
		vm = helix.def("view1", view1Ctrl);

	});

	after(function() {
		body.removeChild(div);
	});

	it('元素属性绑定', function() {
		var line1 = $("#view1 tbody").find("tr").eq(0);
		expect(line1.find("td").eq(1).find("span").html()).to.be("韩梅梅")
	})

	it('元素属性修改', function() {
		var line1 = $("#view1 tbody").find("tr").eq(0);
		vm.list1[0].name = "李磊";
		expect(line1.find("td").eq(1).find("span").html()).to.be("李磊")
	})

	it('POP', function() {
		vm.list1.pop();
		expect($("#view1 tbody").find("tr").length).to.be(2);
		vm.list1.pop();
		expect($("#view1 tbody").find("tr").length).to.be(1);
	})
	it('PUSH', function() {
		vm.list1.pop();
		expect($("#view1 tbody").find("tr").length).to.be(0);
		vm.list1.push({
			name: "韩梅梅",
			age: 11
		});
		expect($("#view1 tbody").find("tr").length).to.be(1);
		var line1 = $("#view1 tbody").find("tr").eq(0);
		expect(line1.find("td").eq(1).find("span").html()).to.be("韩梅梅")
	})
	it('替换数组', function() {
		vm.list1 = [{
			name: "松岛枫",
			age: 11
		}, {
			name: "饭岛爱",
			age: 11
		}];
		expect($("#view1 tbody").find("tr").length).to.be(2);
		var line1 = $("#view1 tbody").find("tr").eq(0);
		expect(line1.find("td").eq(1).find("span").html()).to.be("松岛枫")
		vm.list1[0].name = "泷泽萝拉";
		expect(line1.find("td").eq(1).find("span").html()).to.be("泷泽萝拉")
	})
	it('倒置数组', function() {
		vm.list1.reverse();
		expect($("#view1 tbody").find("tr").length).to.be(2);
		var line1 = $("#view1 tbody").find("tr").eq(0);
		expect(line1.find("td").eq(1).find("span").html()).to.be("饭岛爱")
		vm.list1[0].name = "松岛枫";
		expect(line1.find("td").eq(1).find("span").html()).to.be("松岛枫")
	})

	it('splice', function() {
		vm.list1= [{
					name: "韩梅梅",
					age: 11
				}, {
					name: "李磊",
					age: 11
				}, {
					name: "Poly",
					age: 3
				}, {
					name: "武藤兰",
					age: 31
				}, {
					name: "松岛枫",
					age: 22
				}, {
					name: "饭岛爱",
					age: 23
				}];
		expect($("#view1 tbody").find("tr").length).to.be(6);
		vm.list1.splice(1,3)
		expect($("#view1 tbody").find("tr").length).to.be(3);
		
		var line2 = $("#view1 tbody").find("tr").eq(1);
		expect(line2.find("td").eq(1).find("span").html()).to.be("松岛枫")
		vm.list1[1].name="泷泽萝拉"
		expect(line2.find("td").eq(1).find("span").html()).to.be("泷泽萝拉")
		
		vm.list1.item(1,{name:"小泽玛利亚",age:34})
		line2 = $("#view1 tbody").find("tr").eq(1);
		expect(line2.find("td").eq(1).find("span").html()).to.be("小泽玛利亚")
		
		var line3 = $("#view1 tbody").find("tr").eq(2);
		vm.list1[2].name = "波多野结衣";
		expect(line3.find("td").eq(1).find("span").html()).to.be("波多野结衣")

	})


});