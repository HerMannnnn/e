$(document).ready(function () {
	
	var config = {
		'.chosen-select': {},
		'.chosen-select-deselect': {
			allow_single_deselect: true
		},
		'.chosen-select-no-single': {
			disable_search_threshold: 10
		},
		'.chosen-select-no-results': {
			no_results_text: 'Oops, nothing found!'
		},
		'.chosen-select-width': {
			width: "95%"
		}
	}
	for (var selector in config) {
		$(selector).chosen(config[selector]);
	}
});

function load_region(parent_id,order_id)
{
	$.ajax({
		url: '<?=base_url()?>index.php?c=record&m=load_region&parent_id='+parent_id+'&order_id='+order_id,
		type: 'GET',
		dataType: 'json',
		success: function (data) {
			//console.log(data);
			if(data.code==1)
			{
				var str="";
				var ary=data.data;
				for(var i=0;i<ary.length;i++)
				{
					str+="<option value="+ary[i].regionid+" hassubinfo='true'>"+ary[i].name+"</option>";
				}
				if(order_id==1)
				{

					$("#select_province").append(str);
					//$("#select_province").chosen("destroy");
					$("#select_province").trigger("chosen:updated");
				}
				else if(order_id==2)
				{
					$("#select_city").append(str);
					$("#select_city").trigger("chosen:updated");
				}
				else if(order_id==3)
				{
					$("#select_county").append(str);
					$("#select_county").trigger("chosen:updated");
				}
				else if(order_id==4)
				{
					$("#select_station").append(str);
					$("#select_station").trigger("chosen:updated");

				}
			}
		},
		error:function(data)
		{
			console.log(data);
		}
	});
}

function load_region_next(flag)
{
	var parent_id;
	if(flag==2)
	{
		parent_id=$("#select_province").val();
		$("#select_city").empty();
		$("#select_city").append("<option>请选择市</option>");
		$("#select_city").trigger("chosen:updated");

		$("#select_county").empty();
		$("#select_county").append("<option>请选择县、区</option>");
		$("#select_county").trigger("chosen:updated");

		$("#select_station").empty();
		$("#select_station").append("<option>请选择站点</option>");
		$("#select_station").trigger("chosen:updated");
	}
	else if(flag==3)
	{

		$("#select_county").empty();
		$("#select_county").append("<option>请选择县、区</option>");
		$("#select_county").trigger("chosen:updated");

		$("#select_station").empty();
		$("#select_station").append("<option>请选择站点</option>");
		$("#select_station").trigger("chosen:updated");
		//$("#select_couty").val("默认值").trigger("chosen:updated");
		parent_id=$("#select_city").val();
	}
	else if(flag==4)
	{

		$("#select_station").empty();
		$("#select_station").append("<option>请选择站点</option>");
		$("#select_station").trigger("chosen:updated");
		//$("#select_couty").val("默认值").trigger("chosen:updated");
		parent_id=$("#select_county").val();
		console.log(parent_id,flag);
	}
	else if(flag==5)
	{
		var station_id=$("#select_station").val();
		//realtime_record(123456);
		datatable();
	}

	load_region(parent_id,flag);
}

function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
	//compatibility for firefox and chrome
	var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
	var pc = new myPeerConnection({
			iceServers: []
		}),
		noop = function() {},
		localIPs = {},
		ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
		key;

	function iterateIP(ip) {
		if (!localIPs[ip]) onNewIP(ip);
		localIPs[ip] = true;
	}

	//create a bogus data channel
	pc.createDataChannel("");

	// create offer and set local description
	pc.createOffer().then(function(sdp) {
		sdp.sdp.split('\n').forEach(function(line) {
			if (line.indexOf('candidate') < 0) return;
			line.match(ipRegex).forEach(iterateIP);
		});

		pc.setLocalDescription(sdp, noop, noop);
	}).catch(function(reason) {
		// An error occurred, so handle the failure to connect
	});

	//sten for candidate events
	pc.onicecandidate = function(ice) {
		if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
		ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
	};
}
