$(document).ready(function() {

		var imgBackground = $(".container-fluid img[src*='core/img/plan/']");
		if(typeof(imgBackground.attr("src")) != "undefined"){
			imgBackground.remove();
			var urlImg = imgBackground.attr("src");
		}else{
			alert("commencez par envoyer une image d'arriere plan");
		}

    $("#jqueryLoadingDiv").show();


    setTimeout(function() {



        $("#div_pageContainer").prepend($("#menu"));

       $("#div_mainContainer").css({
            'background-image': 'url("' + urlImg + '")',
            'background-size': 'cover ',
            'background-attachment': 'fixed '

        });

        fullScreen(true);


        cadreParent = $(".cadre_marges").parent().parent();
        cadreParent.before($(".cadre_marges").parent());


        /*$("ul.monmenu").parent().each(function(){
        		console.log($(this));
        		$(this).css({
        			'width' : '100%'
        			});
        		alert($(this).attr("class"));
        		$(this).parent().each(function(){
        			$(this).css({
        			'position' : 'relative',
        			'left' : '0px',
        			'width' : 'auto',
        			'text-align' : 'center'
        			});
        			$(this).addClass("row");
        		});
        });*/

        //Surcharge edition mode
        var oldInitEditOption = initEditOption;

        initEditOption = function(_state) {

            $("div[data-plan_id]").each(function() {
                $(".div_displayObject").append($(this));
            });
            oldInitEditOption(_state);
        }

        //Help for know id 
        $(".div_displayObject").on("click", ".widget-shadow-edit", function() {

            alert("data-plan_id=" + $(this).attr("data-plan_id"));

        });

        //Test if not in edit mode
        if (!$("[data-plan_id]").hasClass("widget-shadow-edit")) {

            $(".cadre_marges").each(function() {


                var div_data_plan_list_id = $(this).find("[data-plan-list_id]");
                if (typeof div_data_plan_list_id.attr("data-plan-list_id") !== "undefined") {
                    planId_list = div_data_plan_list_id.attr("data-plan-list_id").split('|');
                    for (i = 0; i < planId_list.length; i++) {
                        div_planId = $("div[data-plan_id='" + planId_list[i] + "']");
                        div_planId.css({
                            'position': 'relative',
                            'top': '',
                            'left': '',
                        });
                        div_data_plan_list_id.append(div_planId);


                    }


                }

            });

        }

        $("meta[name=viewport]").attr("content", "width=device-width, initial-scale=1.0, maximum-scale=1");
        $(".div_displayObject").css({
            'width': 'auto',
            'height': ($(window).height() - $("#menu").outerHeight() ) + 'px'
        });


		CenterRow();

        $("#jqueryLoadingDiv").hide();

    }, 000);

	$(window).resize(function () {
        $(".div_displayObject").css({
            'height': ($(window).height() - $("#menu").outerHeight() ) + 'px'
        });	
		CenterRow();

	});
	
	

});

function CenterRow(){
        //Padding automatique pour centrage des div si ecran plus haut que le total des div
        var containHeight = 0;
        var containPaddingTop = 0;
        var windowHeight = $(window).height();
        var nbRow = 0;
        $(".div_displayObject").children(".row").each(function() {
            containHeight += $(this).innerHeight();
            containPaddingTop = parseInt($(this).children(".cadre_marges").css("padding-top"));
            nbRow += 1;
        });
		var newPadding = (windowHeight - ($("#menu").innerHeight() - (nbRow * containPaddingTop) + containHeight)) / (nbRow + 1); 
		if(newPadding < 10) { newPadding = 10; }
            $(".div_displayObject").children(".row").children(".cadre_marges").css("padding-top", newPadding  + 'px');
        //Fin padding auto
	
}
