$(function () {
  $('.log-in-modal').modal()
  var socket = io.connect('http://localhost:3000')

  socket.on('read:rooms', function (rooms) {
    // modal for login name
    $.tmpl('<li><a href="#">${name}</a></li>', rooms).appendTo($('.dropdown-rooms'))
    var $dropdownRoomsLabel = $('.dropdown-rooms-label').html(rooms[0].name)

    // render rooms
    $.tmpl('<a href="#" class="list-group-item">${name}</a>', rooms)
      .appendTo($('.room-list'))
    $('.room-list a').first().addClass('active')
    $('.room-header').html(rooms[0].name)

    $('.log-in-modal').modal()
    $('.dropdown-rooms li a').on('click', function () {
      $dropdownRoomsLabel.html($(this).html())
    })

    var $userEmail = $('.user-email')

    $('.log-in-modal .btn-enter').on('click', function (evt) {
      evt.preventDefault()
      if (/^.*@gmail.com$/.test($userEmail.val())) {
        socket.emit('add:user', {
          email: $userEmail.val(),
          room: $dropdownRoomsLabel.html()
        })
        $('.log-in-modal').modal('hide')
      } else {
        $userEmail.focus()
      }
    })
  })

  socket.on('add:user', function (user) {
    console.log(user)
  })

  socket.emit('read:rooms')
})