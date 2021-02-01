$(function() {
    /* Header Of Home */
    const
    // Navbar
        main_navbar = $(".navbar"),
        // Orders In Home Page
        cards_orders_home = $(".services-section .card"),
        // Cards in Home Page
        cards_teams = $("#teams-page-section .wrap .card"),
        // Buttons In Team Info Page
        filter_button_info_page = $(".filter-teams button"),
        // Filter Input Memebers Page
        filter_members_profile_input = $("#member-profile .filter-memebers #filter-memebers"),
        // Memeber Page
        filter_members_title_items = $("#member-profile .filter-memebers .list-members"),
        // Member Page
        profile_box = $('#member-profile .member-profile .tab-content'),
        // Orders Or Services
        cards_order = $('#orders-page .wrap .card'),
        recent_orders = $('#orders-page .recent-oredrs'),
        orders_button = $('#orders-page .order-btn'),
        // Contact Us Page
        login_form = $('#contact-us .c-part .log-in'),
        signin_form = $('#contact-us .c-part .sign-in');
    /* Navbar */
    // Scroll
    $(window).scroll(makebgnav);
    // Loading Page
    $(window).on("load", function() {
        typeItSelf();
        if (window.location.pathname.includes("team-info")) {
            getFilterInfoFromURL();
        }
        getDataMemebersFromJson();
        searchMembersInput();
        filterMembersUrl();
        makeNumberLetter();
        editBtnOrder();
        getOrdersFromLocal();
        formFunctions();
    });
    // Change bgcolor For Navbar When Scrolling
    function makebgnav() {
        if ($(window).scrollTop() >= main_navbar.innerHeight()) {
            main_navbar.addClass("bg-dark");
        } else {
            main_navbar.removeClass("bg-dark");
        }
    }
    // Init Typing Self Plugin Home Pagge
    function typeItSelf() {
        $('.home .pcip-t-h1').typeIt({
            strings: "pcip",
            autoStart: true,
            speed: 900,
            loop: true,
            cursor: false
        }).tiPause(3000);
    }
    /* Orders Section In Home Page */
    makeHeightEq(cards_orders_home);
    /* Cards In Teams Page */
    makeHeightEq(cards_teams);
    /* Team Information */
    function getFilterInfoFromURL() {
        const url = window.location.search,
            get_filter_key = new URLSearchParams(url);
        let filter_teams = mixitup('.teams-info-sc');
        if (get_filter_key.has("filter")) {
            filter_teams.filter(`.${get_filter_key.get("filter")}`);
            filter_button_info_page.each(function() {
                if (get_filter_key.get("filter") == $(this).data("filter").slice(1)) {
                    $(this).siblings("button").removeClass("active");
                    $(this).addClass("active");
                }
            });
            document.title = `PCIP - ${get_filter_key.get("filter").replace("-",' ').toUpperCase()}`;
            window.history.pushState(null, null, window.location.pathname);
        } else {
            filter_teams.filter('.team-web');
        }
        filter_button_info_page.each(function() {
            $(this).on("click", function() {
                document.title = `PCIP - ${$(this).data("filter").slice(1).replace("-",' ').toUpperCase()}`;
            });
        });
    }
    /* Team Members Profile */
    function searchMembersInput() {
        filter_members_profile_input.on("keyup", function() {
            let filter_members_items = $("#member-profile .filter-memebers .list-members .list-group-item");
            let input_value = $(this).val().toLowerCase();
            filter_members_items.each(function() {
                if ($(this).html().toLowerCase().indexOf(input_value) > -1) {
                    $(this).removeAttr("style");
                } else {
                    $(this).css({
                        height: 0,
                        margin: 0,
                        padding: 0,
                        visibility: "hidden"
                    });
                }
            });
        });
    }

    /* Get Data From json file  */
    function getDataMemebersFromJson() {
        let urlDataMemebers = "http://localhost:3000/members";
        $.get(urlDataMemebers,
            function(data) {
                for (let i = 0; i < data.length; i++) {
                    let id_withname = data[i]['memberName'].toLowerCase().replace(' ', '-');
                    filter_members_title_items.find(`[data-category="${data[i]['memberCategory']}"]`).after(`
                <a class="list-group-item list-group-item-action" data-toggle="list" href="#${id_withname}-${data[i]['id']}" role="tab" aria-controls="${data[i]['memberName']}">${data[i]['memberName']}</a>
                `);
                    let tem = `
                <div class="tab-pane fade" id="${id_withname}-${data[i]['id']}" role="tabpanel" aria-labelledby="${id_withname}-${data[i]['id']}-list">
                                <img src="${data[i]["imgSrc"]}" alt="member" class="img-thumbnail img-fluid rounded-circle border-primary">
                                <div class="member-info">
                                    <span class="member-name">name : <strong>${data[i]["memberName"]}</strong></span>
                                    <span class="member-age">age : <strong>${data[i]["memberAge"]}</strong></span>
                                    <span class="member-college">college : <strong>${data[i]["memberCollege"]}</strong></span>
                                    <span class="member-team">team : <strong>${data[i]["memberTeam"]}</strong></span>
                                    <span class="member-role">role : <strong>${data[i]["memberRole"]}</strong></span>
                                </div>
                                <hr>
                                <h3 class="pt-title">Portfolio</h3>
                                <div class="portfolio">
                                    <div class="row no-gutters">
                                    </div>
                                </div>
                                <hr>
                                <h3 class="sk-title">Skills</h3>
                                <ul class="list-unstyled list-group list-group-horizontal list-skills flex-wrap">

                                </ul>
                            </div>
                `;
                    profile_box.append(tem);
                    createPortfolio(data[i]['memberPortfolio'], $(`#${id_withname}-${data[i]['id']} .portfolio .row`), data[i]['memberSkills'], $(`#${id_withname}-${data[i]['id']} .list-skills`));
                }
            }).always(function() { filter_members_title_items.removeClass("loading"); }).fail(function() { console.log("You Must Create Json File in database to get all members.") });
    }

    function createPortfolio(arrPortfolio, appendElmPortfolio, arrSkills, appendElmSkills) {
        if (arrPortfolio.length > 0) {
            arrPortfolio.forEach((elm) => {
                appendElmPortfolio.append(
                    `
                    <div class="col-lg-3 col-md-4 col-sm-6">
                        <div class="card">
                            <img src="${elm["pImg"]}" class="card-img-top" alt="portfolio img">
                            <div class="card-footer p-1">
                                <a href="${elm["pLink"]}" class="btn btn-primary btn-block text-light">Demo</a>
                            </div>
                        </div>
                    </div>
                    `
                );
            });
        } else {
            appendElmPortfolio.append('<strong class="text-left">No Portfolio</strong>');
        }
        if (arrSkills.length > 0) {
            arrSkills.forEach(ele => {
                appendElmSkills.append(`
                
                <li class="item"><span class="badge bg-primary p-1 rounded-0 text-uppercase">${ele}</span></li>
    
                `);
            });
        } else {
            appendElmSkills.append('<strong>No Skills</strong>')
        }

    }

    function filterMembersUrl() {
        let links = filter_members_title_items.find('a'),
            url = window.location.search,
            object_params = new URLSearchParams(url);
        links.each(function() {
            console.log($(this).attr("href"));
            if (object_params.has('member')) {
                if (object_params.get('member') == $(this).attr("href").slice(1)) {
                    $(this).siblings("a").removeClass("active");
                    $(this).addClass("active");
                    let select_s = profile_box.find(`#${object_params.get('member')}`);
                    select_s.siblings(".tab-pane").removeClass("active show");
                    select_s.addClass("active show");
                }
                window.history.pushState(null, null, window.location.pathname);
            }
        });
    }

    // Add Orders For Recent Order From Form
    orders_button.on('click', function(e) {
        addNewOrder(e);
    });

    function addNewOrder(e) {
        e.preventDefault();
        const whole_form = $("#orders-page form"),
            data_order_card = {
                name: whole_form[0].clientName.value,
                email: whole_form[0].emailClient.value,
                orderName: whole_form[0].orderName.value,
                team: whole_form.find(".form-check-input:checked"),
                details: whole_form[0].detailsOrder.value
            };
        if (data_order_card['orderName'] != "" && data_order_card['team'].length > 0 && data_order_card['details'] != "") {
            setOrderLocal(data_order_card['orderName'], data_order_card['details'], formatDate());
            recent_orders.append(`
            <div class="col-xl-3 col-md-4 col-sm-6">
                <div class="wrap">
                    <div class="card text-center">
                        <div class="card-header">
                            <h5 class="m-0">${data_order_card['orderName']}</h5>
                        </div>
                        <div class="card-body">
                            <small class="text-muted text-left mt-0 mb-2 d-block">${formatDate()}</small>
                            <p class="card-text">${data_order_card['details'].slice(0,19)}..</p>
                        </div>
                        <div class="card-footer border-0">
                            <button class="btn btn-primary edit-btn text-light"><i class="fas fa-edit mr-1"></i>Edit</button>
                            <button class="btn btn-danger delete-btn text-light"><i class="fas fa-trash mr-1"></i>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            `);
            whole_form.prepend(`<div class="alert alert-success alert-dismissible fade show" role="alert">
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                        <span class="sr-only">Close</span>
                                    </button>
                                    <strong class="text-light">Successfull</strong>
                                </div>`);
            whole_form.find(".alert-danger").remove();
            whole_form[0].reset();
        } else {
            whole_form.prepend(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                        <span class="sr-only">Close</span>
                                    </button>
                                    <strong class="text-light">Empty Fields</strong>
                                </div>`);
            whole_form.find(".alert-success").remove();
        }

    }

    // Orders Page
    function makeNumberLetter() {
        let paragraphs = cards_order.find(".card-body .card-text");
        paragraphs.each(function() {
            let slicing = $(this).text().slice(0, 19);
            if ($(this).text().length > 19) {
                $(this).text(slicing + '........');
            }
        });
    }

    function editBtnOrder() {
        const edit_btn = $('#orders-page .edit-btn');
        edit_btn.on('click', function() {
            console.log("Goood")
        });
    }

    function setOrderLocal(orderName, orderDetail, orderDate) {
        let data = [];
        if (localStorage.getItem('recentOrders') == null) {
            data = [];
        } else {
            data = JSON.parse(localStorage.getItem('recentOrders'));
        }
        data.push({ orderName, orderDetail, orderDate });
        localStorage.setItem('recentOrders', JSON.stringify(data));
    }

    function getOrdersFromLocal() {
        let data = [];
        if (localStorage.getItem('recentOrders') == null) {
            data = [];
        } else {
            data = JSON.parse(localStorage.getItem('recentOrders'));
        }
        data.forEach((e) => {
            recent_orders.append(`
                <div class="col-xl-3 col-md-4 col-sm-6">
                    <div class="wrap">
                        <div class="card text-center">
                            <div class="card-header">
                                <h5 class="m-0">${e['orderName']}</h5>
                            </div>
                            <div class="card-body">
                                <small class="text-muted text-left mt-0 mb-2 d-block">${e['orderDate']}</small>
                                <p class="card-text">${e['orderDetail'].slice(0,19)}..</p>
                            </div>
                            <div class="card-footer border-0">
                                <button class="btn btn-primary edit-btn text-light"><i class="fas fa-edit mr-1"></i>Edit</button>
                                <button class="btn btn-danger delete-btn text-light"><i class="fas fa-trash mr-1"></i>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
                `);
        });
    }
    // Contact Us Page
    function formFunctions() {
        const
            sign_btn_lf = login_form.find('.sign-btn'),
            login_btn_sf = signin_form.find('.login-btn');
        sign_btn_lf.on("click", function(p) {
            p.preventDefault();
            login_form.css({
                height: 0,
                margin: 0,
                padding: 0,
                visibility: "hidden",
                overflow: "hidden"
            });
            signin_form.removeAttr("style");
        });
        login_btn_sf.on("click", function(p) {
            p.preventDefault();
            signin_form.css({
                height: 0,
                margin: 0,
                padding: 0,
                visibility: "hidden",
                overflow: "hidden"
            });
            login_form.removeAttr("style");
        });
    }
    /* Basics Functions */
    function makeHeightEq(cards) {
        let max_heigt_services = 0;
        cards.each(function() {
            while (max_heigt_services < $(this).innerHeight()) {
                max_heigt_services = $(this).innerHeight();
            }
        });
        cards.each(function() {
            $(this).css({
                height: max_heigt_services + "px"
            });
        });
    }

    function formatDate() {
        let time_now = new Date(),
            days = time_now.getDay(),
            month = time_now.getMonth(),
            year = time_now.getFullYear(),
            hours = time_now.getHours(),
            minutes = time_now.getMinutes(),
            format = '';
        if (hours < 10) {
            hours = `0${hours}`;
        }
        if (days < 10) {
            days = `0${days}`;
        }
        if (minutes < 10) {
            minutes = `0${minutes}`;
        }
        if (month < 10) {
            month = `0${month}`;
        }
        format = `${days}/${month}/${year}  ${hours}:${minutes}`;
        return format;
    }


    $(document)
        .ajaxStart(function() {
            $('body').prepend(`
            <div class="loading-spinner"><div class="lds-ring"><div></div><div></div><div></div><div></div></div></div>
            `);
        })
        .ajaxStop(function() {
            $('.loading-spinner').remove();
        });

});