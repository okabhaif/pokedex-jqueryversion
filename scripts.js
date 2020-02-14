var repository = (function() {
var pokemonRepo= [];
var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
var $modalContainer = $('#modal-container');

function addListItem(pokemonItem) {
  var $pokemonList = $('.pokemonList')
  var $listItem = $('<li></li>');
  ($pokemonList).append($listItem);
  var $button = $('<button class="button--pokemonItem">'+pokemonItem.name +'</button>');
  ($listItem).append($button);


  $button.on('click', function(event) {
  $button.addClass('clicked');
  return showDetails(pokemonItem);
  });
}

function showDetails(item) {
  repository.loadDetails(item).then(function () {
    showModal(item);
  });
}

function add(pokemon) {
  if (typeof pokemon === "object") {
    pokemonRepo.push(pokemon);
 }
}

 function getAll() {
   return pokemonRepo;
 }

 function loadList() {
     return $.ajax(apiUrl, { dataType: 'json' })
      .then(function (json) {
        $(json.results).each(function (i, item) {
          var pokemon = {
          name: item.name,
          detailsUrl: item.url
        };

        add(pokemon);

      });
    })

    .catch(function (e) {
      console.error(e);
    })
  }

  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url)
    .then(function (details) {
      // Now we add the details to the item
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;

      //creating a loop to access the pokemon types from the array
      var types = [];
      details.types.forEach((item, i) => {
        types.push(item.type.name)

      });

      item.types = types;
      return item;
    })
    .catch(function (e) {
      console.error(e);
    });
  }

  function showModal(item) {
    // Clear all existing modal content
    console.log("showing modal", $modalContainer);
    ($modalContainer).empty();

    var $modal = $('<div class="modal"></div>');
    ($modalContainer).append($modal);

    // Add the new modal content
    var $closeButtonElement = $('<button class="modal-close">Close</button>');
    ($modal).append($closeButtonElement);
        ($closeButtonElement).on('click', hideModal);


    var $titleElement = $('<h1>'+item.name+'</h1>');
    ($modal).append($titleElement);

    var $imgElement = $('<img></img>');
    $imgElement.attr('src', item.imageUrl);
    ($modal).append($imgElement);


    var $heightElement =$('<p>Height: '+ item.height + '</p>');
    ($modal).append($heightElement);

    var $typeElement =$('<p>Type<span id="span"> (s) </span>: '+item.types.join(', ')+'</p>');
    ($modal).append($typeElement);
    ($modalContainer).addClass('is-visible');

  }

  function hideModal() {
    ($modalContainer).removeClass('is-visible')
  }

  $(window).on('keydown', function(e) {
    if (e.key === 'Escape') {
      hideModal();
    }
  });

  ($modalContainer).on('click', (e) => {
    // Since this is also triggered when clicking INSIDE the modal container,
    // We only want to close if the user clicks directly on the overlay
    var target = e.target;
    if (target === $modalContainer) {
      hideModal();
    }
  })

 return {
   add: add,
   getAll: getAll,
   addListItem: addListItem,
   loadList: loadList,
   loadDetails: loadDetails,
   showModal : showModal,
   hideModal : hideModal,
 };
})();

var $pokemonList =$('.pokemonList');

repository.loadList().then(function() {
  // Now the data is loaded!
  repository.getAll().forEach(function(pokemon){
    repository.addListItem(pokemon);
  });
});
