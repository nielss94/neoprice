if (window.location.pathname === '/safetydeposit.phtml') {
  console.log('Scanning Safety Box...');
  var list = [];
  var items = $('tr[bgcolor] td[align=left]:nth-child(2) b');
  filterData(items, list);
  findPrice(list, 'sdb')
}

if (window.location.pathname === '/gallery/index.phtml') {
  console.log('Scanning Gallery...');
  var list = [];
  var items = $('b.textcolor');
  filterData(items, list);
  findPrice(list, 'gallery');
}

if(window.location.pathname === '/market.phtml'){
  console.log('Scanning shop items..');
  var list = []
  var items = $('td.content form:nth-child(14) table tbody  td:nth-child(1) b');
  filterData(items, list);
  debugger
  items.splice(-1,2) //splicing "PIN" and "..."
  items.splice(0,1)
  findPrice(list, 'shop');
}

function findPrice(list, path){
  var i = 0;
  $.each(list, function(a, string) {
      return $.ajax({
        url: "http://items.jellyneo.net/index.php?go=show_items&name=" + string + "&name_type=exact&desc=&cat=0&specialcat=0&status=0&rarity=0&sortby=name&numitems=1"
      }).done(function(res) {
        var price;
        console.info("Trying ... " + string);
        price = +$(res).find('.itemstable td a:last').text().replace(RegExp(" NP"), '').replace(RegExp(","), '');
        console.info('%cITEM: ' + string + ' -- %c' + price + ' NP', 'color:blue;', 'color:red;');

        if(path =='shop'){
            $('td.content form:nth-child(14) table tbody td:nth-child(7) input').eq(i).val(price)
        }
        i++;
        if (i === list.length) {
          return console.info('%c>>> FINISHED LIST', 'color:green;');
        }
      });
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
