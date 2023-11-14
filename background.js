//Your safety deposit box
if (window.location.pathname === '/safetydeposit.phtml') {
  var search_button_location = $('input[value="Find"]').parent()
  search_button_location.append($(`<input type="button" id="search_prices" style="margin-left: 8px" value="Search JellyNeo Prices">`));

  var onCooldown = false;
  $('#search_prices').click(function () {
    if (onCooldown) {
      if ($('#please_wait').length > 0) return;

      $('#search_prices').parent().append($('<b style="margin-left: 8px" id="please_wait">Wait 1 min...</b>'));

      setTimeout(function () {
        $('#please_wait').remove();
      }, 3000);
      return;
    }

    $('#search_prices').parent().append($('<b style="margin-left: 8px" id="loading_search_text">Searching...</b>'));

    console.log('Scanning Safety Box...');
    $('b[id=item_jellyneo_np]').remove();

    var list = [];
    var items = $('tr[bgcolor] td[align=left]:nth-child(2) b');

    filterData(items, list);
    findPrice(list, 'sdb')

    onCooldown = true;
    setTimeout(function () {
      onCooldown = false;
    }, 60000);
  });
}

//For user shop
if (window.location.pathname === '/market.phtml') {
  console.log('Scanning shop items..');
  var list = []
  var items = $('td.content form table tbody  td:nth-child(1) b');
  filterData(items, list);
  findPrice(list, 'shop');
}

//User's inventory
if (window.location.pathname === '/inventory.phtml') {
  var filterListElement = $('.inv-filtericons');

  filterListElement.append(`<div style="width:20%" class="wizard-button-search button-default__2020 button-blue__2020" id="search_prices"><div class="button-search-white" style="background-image: url('https://images.neopets.com/themes/h5/basic/images/np-icon.svg');
  height: 22px;
  width: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;"></div></div>`);

  var onCooldown = true;
  setTimeout(function () {
    onCooldown = false;
    $('#search_prices').click(function () {
      if (onCooldown) {
        if ($('#please_wait').length > 0) return;

        filterListElement.append('<b style="margin-left: 8px" id="please_wait">Wait 1 min...</b>');
        setTimeout(function () {
          $('#please_wait').remove();
        }, 3000);
        return;
      }
      filterListElement.append('<b style="margin-left: 8px" id="loading_search_text">Searching...</b>');
      console.log('Scanning inventory items..');

      $('b[id=item_jellyneo_np]').remove();

      var list = []
      var items = $('.inv-container .inv-items .inv-display .item-grid .grid-item .item-name');
      filterData(items, list);
      findPrice(list, 'inventory');
      onCooldown = true;

      setTimeout(function () {
        onCooldown = false;
      }, 60000);
    });

  }, 2000);
}

//Shops
if (window.location.pathname === '/objects.phtml') {
  console.log('Scanning inventory items..');
  var list = []
  var items = $('.shop-grid .shop-item .item-name b');
  filterData(items, list);
  findPrice(list, 'shops');
}

var highestPrice = 0
var itemToGet = ''
//Ajac request to jellyneo's database to fetch the prices
function findPrice(list, path) {

  $.each(list, function (a, string) {
    if (string != 'Enter your PIN:' && string != 'PIN' && string != 'Name') {
      return $.ajax({
        url: "https://items.jellyneo.net/index.php?go=show_items&name=" + string + "&name_type=exact&desc=&cat=0&specialcat=0&status=0&rarity=0&sortby=name&numitems=1",
        success: function (res) {
          var price;
          console.info("Trying ... " + string);
          price = +$(res).find('.price-history-link').text().replace(RegExp(" NP"), '').replace(RegExp(","), '');
          console.info('%cITEM: ' + string + ' -- %c' + price + ' NP', 'color:blue;', 'color:red;');

          //Looping through the table again as the order is lost during ajax call

          if (path == 'shops') {
            $('b:contains("' + string + '")').parent().parent().append('<p> <b style="color: #d15517; font-size: 0.8rem"> ' + price + ' NP</b></p>');
          } else if (path == 'inventory') {
            $('#loading_search_text').remove();
            $('p:contains("' + string + '")').parent().append('<p id="item_jellyneo_np"> <b style="color: #d15517; font-size: 0.8rem"> ' + price + ' NP</b></p>');
          } else if (path == 'sdb') {
            $('#loading_search_text').remove();
            $('b:contains("' + string + '")').parent().append('<b id="item_jellyneo_np" style="color: #d15517"><br> ' + price + ' NP</b> </td>');
          }
        },
        error: function (err) {
          console.log(`something went wrong while looking for item ${string}`);
        }
      })
    }
  });
}

function filterData(items, list) {
  $.each(items, function (a, b) {
    var item, root;
    root = $(this);
    item = root.text().replace(/ *\([^)]*\) */g, "");
    if (item) {
      return list.push(item);
    }
  });
}
