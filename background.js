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

//On view of item in the inventory
if(window.location.pathname ==='/iteminfo.phtml'){
  console.log('Scanning item');
  var list = []
  var items = $('body table:nth-child(2) tbody tr td:nth-child(2)').html().trim().split('<br>')[0].split(':')[1].trim();
  var arr = [];
  arr.push(items);
  findPrice(arr, 'item');
}

//User's inventory
if(window.location.pathname ==='/inventory.phtml'){
  console.log('Scanning inventory items..');
  var list = []
  var items = $('td.content div:nth-child(14) table tbody tr:nth-child(2) td table');
  filterData(items, list);
  list = list[0].trim().split('\n');
  $.each(list, function(index,obj){
    //remove if null
    if(obj != null){
      if(obj == ''){
        list.splice(index, 1);
      }
    }
  })
  findPrice(list, 'inventory');
}

//Shops
if(window.location.pathname ==='/objects.phtml'){
  console.log('Scanning inventory items..');
  var list = []
  var items = $('body table:nth-child(2) tbody tr td:nth-child(2)').html().trim().split('<br>')[0].split(':')[1];
  filterData(items, list);
  findPrice(list, 'shops');
}

//Money tree
if(window.location.pathname ==='/donations.phtml'){
  console.log('Scanning inventory items..');
  var list = []
  var items = $('body table:nth-child(2) tbody tr td:nth-child(2)').html().trim().split('<br>')[0].split(':')[1];
  filterData(items, list);
  findPrice(list, 'donations');
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
              if($('td.content form:nth-child(14) table tr td:nth-child(1) b').eq(a).html()==string){
                //Updating the shop prices
                $('td.content form:nth-child(14) table tbody td:nth-child(7) input').eq(a-1).val(price)
              }
            })
          }else if(path =='item'){
            $('body table:nth-child(6) tbody').append('<td><b>JellyNeo Price:<b></td><td>' + price + ' NP </td>');
          }else if(path =='inventory'){

            $.each($('td.content div:nth-child(14) table tbody tr:nth-child(2) td table td'), function(row){
              if(($('td.content div:nth-child(14) table tbody tr:nth-child(2) td table td').eq(a).html().split('<br>')[1]== string)){
                if($('td.content div:nth-child(14) table tbody tr:nth-child(2) td table td').eq(a).hasClass("price") == false)
                $('td.content div:nth-child(14) table tbody tr:nth-child(2) td table td').eq(a).append('<div class="price"><br><b>' + price + ' NP </b></div>')
              }
            })
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
