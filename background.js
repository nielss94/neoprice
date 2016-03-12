//Created by:Spurrya Jaggi

//Your safety deposit box
if (window.location.pathname === '/safetydeposit.phtml') {
  console.log('Scanning Safety Box...');
  var list = [];
  var items = $('tr[bgcolor] td[align=left]:nth-child(2) b');
  filterData(items, list);
  findPrice(list, 'sdb')
}

//For viewing gallery items
if (window.location.pathname === '/gallery/index.phtml') {
  console.log('Scanning Gallery...');
  var list = [];
  var items = $('b.textcolor');
  //filterData(items, list);
  findPrice(list, 'gallery');
}

//For user shop
if(window.location.pathname === '/market.phtml'){
  console.log('Scanning shop items..');
  var list = []
  var items = $('td.content form:nth-child(14) table tbody  td:nth-child(1) b');
  filterData(items, list);
  findPrice(list, 'shop');
}

//Ajac request to jellyneo's database to fetch the prices
function findPrice(list, path){
  $.each(list, function(a, string) {
    if(string != 'Enter your PIN:' && string!= 'PIN' && string !='Name'){
      return $.ajax({
        url: "http://items.jellyneo.net/index.php?go=show_items&name=" + string + "&name_type=exact&desc=&cat=0&specialcat=0&status=0&rarity=0&sortby=name&numitems=1",
        success: function(res){
          var price;
          console.info("Trying ... " + string);
          price = +$(res).find('.itemstable td a:last').text().replace(RegExp(" NP"), '').replace(RegExp(","), '');
          console.info('%cITEM: ' + string + ' -- %c' + price + ' NP', 'color:blue;', 'color:red;');

          //Looping through the table again as the order is lost during ajax call

          if(path =='shop'){
            $.each($('td.content form:nth-child(14) table tr td:nth-child(1) b'), function(row){
              if($('td.content form:nth-child(14) table tr td:nth-child(1) b').eq(a).html() == string){
                //Updating the shop prices
                $('td.content form:nth-child(14) table tbody td:nth-child(7) input').eq(a-1).val(price)
              }
            })
            }
          if (a === list.length) {
            return console.info('%c>>>   FINISHED LIST', 'color:green;');
          }
        }
      })
    }
  });
}

function filterData(items, list){
  $.each(items, function(a, b) {
    var item, root;
    root = $(this);
    item = root.text().replace(/\(.*?\)+/, '');
    if (item) {
      return list.push(item);
    }
  });
}
