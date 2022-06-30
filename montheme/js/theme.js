$(function() {



    var imgBackground = $(".div_backgroundPlan div").filter(function(){
        return this.style.background.indexOf('data/plan/planHeader') != -1;
    });



    if (typeof(imgBackground) != "undefined") {
        var urlImg = imgBackground.css('background').split(" ")[4].replace(/^url\(['"](.+)['"]\)/, '$1');
        imgBackground.remove();
    } else {
        alert("commencez par envoyer une image d'arriere plan");
    }

    $("#jqueryLoadingDiv").show();


    $("head").append('<LINK href="montheme/css/theme.css?v=2022063001" rel="stylesheet" type="text/css">' +
        '<LINK href="https://fonts.googleapis.com/css?family=Ubuntu:300,400" rel="stylesheet" type="text/css" />' +
        '<LINK href="montheme/css/clock.css?v=2017110501" rel="stylesheet" type="text/css">' +
        '<script type="text/javascript" src="montheme/js/clock.js?v=2017110501"></script>' +
        '<LINK href="montheme/3rdparty/malihu-custom-scrollbar/jquery.mCustomScrollbar.min.css" rel="stylesheet" type="text/css">' +
        '<script type="text/javascript" src="montheme/3rdparty/malihu-custom-scrollbar/jquery.mCustomScrollbar.concat.min.js"></script>' +
		'<meta name="theme-color" content="black">');


    $.get("montheme/menu.html", function(data) {



        //Ree old menu if displayPlan() used
        $("#div_pageContainer").children("#menu:eq(0)").remove();


        //Move the menu in the pageContainer
        $("#div_pageContainer").prepend($(data));


        //********************************************//
        //*************GESTION DU MENU ***************//
        //********************************************//
        //On test si la classe "selected" a bien été supprimée du menu (anciennes versions)
        if ($(".monmenu.selected").length != 0) alert("vous devez supprimer la classe 'selected' de vos menu! Celle ci est maintenant mise automatiquement");

        //Focus bouton menu suivant le plan actif
        if (typeof(planHeader_id) != "undefined") {
            $(".monmenu a[onClick*='planHeader_id=" + planHeader_id + ";']").parent().addClass("selected");
        }




        fullScreen(true);


        cadreParent = $(".cadre_marges").parent().parent();
        cadreParent.before($(".cadre_marges").parent());


        //Surcharge edition mode
        /*var oldInitEditOption = initEditOption;

        initEditOption = function(_state) {
			
			$(".row").hide();
            $("div[data-eqlogic_id]").each(function() {
				$(this).attr("style", "position :");
                $(".div_displayObject").append($(this));
            });
			$(".md_cameraZoom").hide(); 
            oldInitEditOption(_state);
        }*/

        //Aide en mode edition pour récupérer l'id
        $(".div_displayObject").on("click", ".editingMode", function() {

            alert("data-plan_id=" + $(this).attr("data-plan_id"));

        });

        //Test if not in edit mode
        if (!$("[data-plan_id]").hasClass("editingMode")) {

            $("[data-plan-list_id]").each(function() {


                var div_data_plan_list_id = $(this);
                if (typeof div_data_plan_list_id.attr("data-plan-list_id") !== "undefined") {
                    planId_list = div_data_plan_list_id.attr("data-plan-list_id").split('|');
                    for (i = 0; i < planId_list.length; i++) {
                        var div_planId = $("div[data-plan_id='" + planId_list[i] + "']");


                        div_planId.attr("style", "top:0px; left:0px; position : relative !important; margin: 4px; padding:2px;  ");
                        div_data_plan_list_id.append(div_planId);
                    }

                }

            });

        }

        $("meta[name=viewport]").attr("content", "width=device-width, initial-scale=1.0, maximum-scale=1");
        $(".div_displayObject").css({
            'width': 'auto',
            'height': ($(window).height() - $("#menu").outerHeight()) + 'px'
        });

        $("body").css({
            'padding-top': '0px',
        });

        $('body').each(function() {
            this.style.setProperty('background-image', 'url(' + urlImg + ')', 'important');
            this.style.setProperty('background-size', 'cover', 'important');
            this.style.setProperty('background-attachment', 'fixed', 'important');
        });

        //$(".mCustomScrollbar").mCustomScrollbar();


        //Changement de l'icone sélectionnée
        updateImgMenu($("#menu .selected img"));



        $("#menu .monmenu:not(.fix):not(.selected)").hover(function() {
            updateImgMenu($(this).find("img:eq(0)"));
        }, function() {
            updateImgMenu($(this).find("img:eq(0)"));
        });


            CenterRow();
            $("#jqueryLoadingDiv").hide();
		
		$(".directDisplay img").click(function(){
			
		
			var id=$(this).attr("data-eqlogic_id");
			var camera = $(".md_cameraZoom[data-eqlogic_id=" + id + "]");
			var cameraParent = camera.parent();
			cadreParent.attr("style", "position:absolute");
			//cameraParent.remove();
			/*cameraParent.attr("style", "position: absolute !important; top:0px; left:0px;");
			cameraParent.attr("test","test");*/
			//camera.undelegate('.zoom', 'click');
			$(".md_cameraZoom[data-eqlogic_id=" + id + "]").dialog({
				open:function(){
					$(this).parent().attr("style", "position:absolute !important; top:0px; left:0px; width:100%;");
					$(this).find("img").click(function(){ $(this).closest('.ui-dialog-content').dialog('close'); });
				}
			});

		});
		setTimeout(CenterRow,1000);



    }) //Fin chargement ajax


	

    $(window).resize(function() {


        $(".div_displayObject").css({
            'height': ($(window).height() - $("#menu").outerHeight()) + 'px'
        });
        CenterRow();

    });


    //Correction fichier plan.js jeedom pour affichage historique car normalement le widget clickable est directement dans un  div_displayObject 
    var editOption = {
        state: false,
        snap: false,
        grid: false,
        gridSize: false,
        highlight: true
    };
    var clickedOpen = false;
    var $pageContainer = $('#div_pageContainer')

    $pageContainer.delegate('.cadre_contenu > .eqLogic-widget .history', 'click', function() {
        if (!editOption.state) {
            $('#md_modal').dialog({
                title: "Historique"
            }).load('index.php?v=d&modal=cmd.history&id=' + $(this).data('cmd_id')).dialog('open');
        }
    });




    //Fonction de mise à jour de l'icone du menu si survollée / active
    function updateImgMenu(imgObject) {
        var imgObjectSrc = imgObject.attr("src");
        if (!imgObjectSrc.includes("_selected")) {
            var imgObjectSrcList = imgObjectSrc.split('.')
            imgObject.attr("src", imgObjectSrcList[0] + '_selected.' + imgObjectSrcList[1]);
        } else {
            imgObject.attr("src", imgObject.attr("src").replace('_selected.', '.'));
        }
    }



    // Centrage automatique vertical
    function CenterRow() {


        $("#div_mainContainer").css({
            'margin-top': $("#menu").outerHeight() + 'px'
        });

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
        if (newPadding < 10) {
            newPadding = 10;
        }
        $(".div_displayObject").children(".row").children(".cadre_marges").css("padding-top", newPadding + 'px');
        $(".div_backgroundPlan").css('height', $(".div_displayObject").css("height"));
        console.log("div_backgroundPlan height:" + $(".div_backgroundPlan").css('height'));
        console.log("div_displayObject height:" + $(".div_displayObject").css('height'));

        //Fin padding auto

    }

}); //Fin document ready